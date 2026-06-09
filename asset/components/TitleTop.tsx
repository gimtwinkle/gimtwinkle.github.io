import Cloud from '@/asset/images/Cloud.svg';
import Image from 'next/image';
import '@/asset/styles/style.css';
import Breadcrumb from './BreadCrumb';

export default function TitleTop() {
	return (
		<div className="p-5">
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/', icon: '🏠' },
					{ label: 'About Me', icon: '⭐' },
				]}
			/>
			<div>
				<Image src={Cloud} alt="" />
			</div>

			<div className="relative mb-6 inline-block">
				<div className="relative rounded-2xl border-4 border-black bg-white px-6 py-3 text-xl font-black text-black shadow-[4px_4px_0_#000]">
					Hello! World!
				</div>

				<div className="absolute left-8 top-full h-0 w-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-black" />

				<div className="absolute left-[34px] top-full h-0 w-0 -translate-y-1 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
			</div>

			<h1 className="text-[2rem] font-black tracking-tight text-black leading-normal md:text-5xl lg:text-5xl lg:leading-14 [-webkit-text-stroke:.5px_black] [paint-order:stroke_fill]">
				빠르게 만들고,
				<br />
				오래 쓰이게 다듬는
			</h1>

			<div className="text-[2rem] font-black uppercase text-[#C8FF45] md:text-4xl lg:mt-6 lg:text-4xl [-webkit-text-stroke:2px_black] [paint-order:stroke_fill]">
				UI/UX Developer
			</div>
		</div>
	);
}
