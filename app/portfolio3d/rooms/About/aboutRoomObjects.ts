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
		url: '/models/about/bed.glb',
		position: [-1.5, 0, -1],
		rotation: [0, 0, 0],
		scale: 0.82,
	},
	{
		name: 'rowbookcase',
		url: '/models/about/rowbookcase.glb',
		position: [-1.5, 0, -0.1],
		rotation: [0, 0, 0],
		scale: 0.4,
	},
	{
		name: 'travel',
		url: '/models/about/travel.glb',
		position: [-1.8, 0, 1.2],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.7,
	},
	{
		name: 'rowtable',
		url: '/models/about/rowtable.glb',
		position: [-0.1, 0, -0.1],
		rotation: [-0.2, 0.9, 0],
		scale: 0.5,
	},
	{
		name: 'bedside',
		url: '/models/about/bedside.glb',
		position: [-0.55, 0, -1.7],
		rotation: [0, 0.05, 0],
		scale: 0.5,
	},
	{
		name: 'desk',
		url: '/models/about/desk.glb',
		position: [1.15, 0, -1],
		rotation: [0, 0, 0],
		scale: 0.78,
	},
	{
		name: 'window',
		url: '/models/about/window.glb',
		position: [-1, 1, -1.5],
		rotation: [0, 0, 0],
		scale: 0.8,
	},
	{
		name: 'board',
		url: '/models/about/board.glb',
		position: [1.15, 1.2, -1.23],
		rotation: [0, 0, 0],
		scale: 0.68,
	},
	{
		name: 'bookshleve',
		url: '/models/about/bookshleve.glb',
		position: [-2, 1.2, -1.23],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.4,
	},
	{
		name: 'bookcase',
		url: '/models/about/bookcase.glb',
		position: [2, 0, 0],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.8,
	},
	{
		name: 'robot',
		url: '/models/about/robot.glb',
		position: [2, 1.5, 0],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.2,
	},
	{
		name: 'beanbag',
		url: '/models/about/beanbag.glb',
		position: [2, 0, 1],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.4,
	},
];
