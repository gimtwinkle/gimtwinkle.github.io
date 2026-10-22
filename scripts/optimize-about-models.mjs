import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';

// Keep source GLBs untouched. Rebuild the static, single-mesh furniture assets.
const sourceDirectory = path.resolve('public/models/about');
const outputDirectory = path.resolve('public/models/about-optimized');
const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const componentBytes = { 5123: 2, 5125: 4, 5126: 4 };
await MeshoptSimplifier.ready;
await fs.mkdir(outputDirectory, { recursive: true });
const report = [];

for (const name of (await fs.readdir(sourceDirectory)).filter((name) => name.endsWith('.glb')).sort()) {
    const original = await fs.readFile(path.join(sourceDirectory, name));
    assert.equal(original.readUInt32LE(0), 0x46546c67);
    const jsonLength = original.readUInt32LE(12);
    const document = JSON.parse(original.subarray(20, 20 + jsonLength).toString());
    const binary = original.subarray(28 + jsonLength);
    assert.equal(document.meshes.length, 1);
    assert.equal(document.meshes[0].primitives.length, 1);
    assert(!document.animations && !document.skins && !document.extensionsRequired);
    const primitive = document.meshes[0].primitives[0];
    assert(!primitive.targets && (primitive.mode === undefined || primitive.mode === 4));
    const accessors = document.accessors;
    const views = document.bufferViews;
    const bytesFor = (accessor) => {
        const view = views[accessor.bufferView];
        assert(!accessor.sparse && !view.byteStride);
        const offset = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
        return binary.subarray(offset, offset + accessor.count * componentBytes[accessor.componentType] * components[accessor.type]);
    };
    const positionsAccessor = accessors[primitive.attributes.POSITION];
    const sourceVertexCount = positionsAccessor.count;
    assert.equal(positionsAccessor.componentType, 5126);
    const positionsBytes = bytesFor(positionsAccessor);
    const positions = new Float32Array(positionsBytes.buffer, positionsBytes.byteOffset, positionsAccessor.count * 3);
    const indexAccessor = accessors[primitive.indices];
    const indexBytes = bytesFor(indexAccessor);
    const IndexArray = indexAccessor.componentType === 5123 ? Uint16Array : Uint32Array;
    let indices = Uint32Array.from(new IndexArray(indexBytes.buffer, indexBytes.byteOffset, indexAccessor.count));
    const originalTriangles = indices.length / 3;
    let error = 0;
    if (originalTriangles > 100_000) {
        // Preserve borders and limit deviation to 0.1% of model extent.
        [indices, error] = MeshoptSimplifier.simplify(indices, positions, 3, 60_000 * 3, 0.001, ['LockBorder']);
    }
    const [remap, vertexCount] = MeshoptSimplifier.compactMesh(indices);
    const chunks = [];
    let byteOffset = 0;
    document.bufferViews = [];
    const append = (bytes, target) => {
        const padding = (4 - byteOffset % 4) % 4;
        if (padding) { chunks.push(Buffer.alloc(padding)); byteOffset += padding; }
        const index = document.bufferViews.length;
        document.bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, ...(target ? { target } : {}) });
        chunks.push(bytes);
        byteOffset += bytes.length;
        return index;
    };
    for (const accessorIndex of Object.values(primitive.attributes)) {
        const accessor = accessors[accessorIndex];
        assert.equal(accessor.count, sourceVertexCount);
        const source = bytesFor(accessor);
        const stride = components[accessor.type] * componentBytes[accessor.componentType];
        const compact = Buffer.alloc(vertexCount * stride);
        for (let index = 0; index < remap.length; index++) {
            if (remap[index] !== 0xffffffff) source.copy(compact, remap[index] * stride, index * stride, (index + 1) * stride);
        }
        accessor.bufferView = append(compact, 34962);
        accessor.count = vertexCount;
        delete accessor.byteOffset;
    }
    const compactIndices = vertexCount <= 65535 ? Uint16Array.from(indices) : indices;
    indexAccessor.bufferView = append(Buffer.from(compactIndices.buffer, compactIndices.byteOffset, compactIndices.byteLength), 34963);
    indexAccessor.componentType = vertexCount <= 65535 ? 5123 : 5125;
    indexAccessor.count = indices.length;
    delete indexAccessor.byteOffset;
    const baseColorImages = new Set(document.materials.flatMap((material) => {
        const index = material.pbrMetallicRoughness?.baseColorTexture?.index;
        return index === undefined ? [] : [document.textures[index].source];
    }));
    for (const [index, image] of document.images.entries()) {
        const view = views[image.bufferView];
        const source = binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
        const metadata = await sharp(source).metadata();
        const pipeline = sharp(source).resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true });
        const jpeg = baseColorImages.has(index) && !metadata.hasAlpha;
        const optimized = await (jpeg ? pipeline.jpeg({ quality: 90, chromaSubsampling: '4:4:4' }) : pipeline.png({ compressionLevel: 9 })).toBuffer();
        image.bufferView = append(optimized);
        image.mimeType = jpeg ? 'image/jpeg' : 'image/png';
    }
    const binaryPadding = (4 - byteOffset % 4) % 4;
    chunks.push(Buffer.alloc(binaryPadding));
    const outputBinary = Buffer.concat(chunks);
    document.buffers = [{ byteLength: outputBinary.length }];
    const json = Buffer.from(JSON.stringify(document));
    const paddedJson = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
    const header = Buffer.alloc(20);
    header.writeUInt32LE(0x46546c67, 0);
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(28 + paddedJson.length + outputBinary.length, 8);
    header.writeUInt32LE(paddedJson.length, 12);
    header.writeUInt32LE(0x4e4f534a, 16);
    const binaryHeader = Buffer.alloc(8);
    binaryHeader.writeUInt32LE(outputBinary.length, 0);
    binaryHeader.writeUInt32LE(0x004e4942, 4);
    const output = Buffer.concat([header, paddedJson, binaryHeader, outputBinary]);
    assert.equal(output.length, output.readUInt32LE(8));
    assert(output.length < original.length);
    await fs.writeFile(path.join(outputDirectory, name), output);
    const result = { name, beforeBytes: original.length, afterBytes: output.length, beforeTriangles: originalTriangles, afterTriangles: indices.length / 3, error };
    report.push(result);
    console.log(JSON.stringify(result));
}
await fs.writeFile(path.join(outputDirectory, 'optimization-report.json'), JSON.stringify(report, null, 2) + '\n');
