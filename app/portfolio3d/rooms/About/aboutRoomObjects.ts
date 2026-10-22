export type AboutRoomObject = {
	name: string;
	url: string;
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number | [number, number, number];
};

export const aboutRoomObjects: AboutRoomObject[] = [
	{
		name: 'bed',
		url: '/models/about-optimized/bed.glb',
		position: [-1.5, 0, -1],
		rotation: [0, 0, 0],
		scale: 0.82,
	},
	{
		name: 'rowbookcase',
		url: '/models/about-optimized/rowbookcase.glb',
		position: [-1.5, 0, -0.1],
		rotation: [0, 0, 0],
		scale: 0.4,
	},
	{
		name: 'travel',
		url: '/models/about-optimized/travel.glb',
		position: [-1.7, 0, 0.52],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.7,
	},
	{
		name: 'rowtable',
		url: '/models/about-optimized/rowtable.glb',
		position: [0, 0, 0],
		rotation: [0, Math.atan2(0.9, 0.35), 0],
		scale: 0.5,
	},
	{
		name: 'bedside',
		url: '/models/about-optimized/bedside.glb',
		position: [-0.55, 0, -1.7],
		rotation: [0, 0.05, 0],
		scale: 0.5,
	},
	{
		name: 'desk',
		url: '/models/about-optimized/desk.glb',
		position: [1.15, 0, -1],
		rotation: [0, 0, 0],
		scale: 0.78,
	},
	{
		name: 'window',
		url: '/models/about-optimized/window.glb',
		position: [-1, 1, -1.5],
		rotation: [0, 0, 0],
		scale: 0.8,
	},
	{
		name: 'board',
		url: '/models/about-optimized/board.glb',
		position: [1.15, 1.2, -1.23],
		rotation: [0, 0, 0],
		scale: 0.68,
	},
	{
		name: 'bookshleve',
		url: '/models/about-optimized/bookshleve.glb',
		position: [-2, 1.2, -1.23],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.4,
	},
	{
		name: 'bookcase',
		url: '/models/about-optimized/bookcase.glb',
		position: [2, 0, 0],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.8,
	},
	{
		name: 'robot',
		url: '/models/about-optimized/robot.glb',
		position: [2, 1.5, 0],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.2,
	},
	{
		name: 'beanbag',
		url: '/models/about-optimized/beanbag.glb',
		position: [0.9, 0, 0.35],
		rotation: [0, Math.atan2(-0.9, -0.35), 0],
		scale: 0.4,
	},
];
