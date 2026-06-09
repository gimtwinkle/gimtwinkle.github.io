import Image from 'next/image';
import Star from '@/asset/images/Star.svg';

export default function SectionTitle({ title }: { title: string }) {
	return (
		<div className="mb-5 mt-5 flex items-center gap-3">
			<Image
				src={Star}
				alt=""
				width={40}
				height={40}
				className="animate-twinkle-spin"
			/>
			<h2 className="text-xl font-black text-black">{title}</h2>
		</div>
	);
}
