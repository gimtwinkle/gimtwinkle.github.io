'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Card from '@/asset/components/Card';

import reactblogImg from '@/asset/images/jojosonbitna.png';
import javascriptImg from '@/asset/images/javascript_chrome.png';
import etlandImg from '@/asset/images/etland.png';
import shopbyImg from '@/asset/images/shopby.png';
import godoImg from '@/asset/images/godo.png';
import ebppImg from '@/asset/images/ebpp.png';
import shopbyAdminImg from '@/asset/images/shopbyAdmin.jpg';
import wonImg from '@/asset/images/won.png';
import aboutmeThmubnail from '@/asset/images/aboutme_thumb.png';
import wooriLogo from '@/asset/images/woorilogo.png';
import etlandLogo from '@/asset/images/etlandlogo.png';
import nhnLogo from '@/asset/images/nhnlogo.png';
import shcardLogo from '@/asset/images/shcard_logo01.png';
import SectionTitle from '@/asset/components/SectionTitle';

const projects = [
	{
		projectType: 'WORK',
		title: '우리WON뱅킹 APP',
		company: '우리은행',
		companyLogo: wooriLogo,
		src: wonImg,
		desc: '우리은행 우리WON뱅킹 앱의 UI/UX 개선 및 신규 기능 개발 및 접근성 업무',
		href: 'https://svc.wooribank.com/svc/Dream?withyou=SFCNT0001',
		techStack: ['React', 'TypeScript', 'Storybook', 'Styled', 'GitHub'],
	},
	{
		projectType: 'SIDE',
		title: '리액트 블로그',
		company: 'Personal Project',
		src: reactblogImg,
		desc: 'React 기반으로 제작한 개인 블로그 프로젝트',
		href: 'https://react-newwons.vercel.app/',
		techStack: ['React', 'TypeScript', 'Storybook', 'Styled', 'GitHub'],
	},
	{
		projectType: 'WORK',
		title: '전자랜드',
		company: '전자랜드',
		companyLogo: etlandLogo,
		src: etlandImg,
		desc: '전자랜드 쇼핑몰 UI 운영 및 유지보수를 담당',
		href: 'https://www.etlandmall.co.kr/',
		techStack: ['jQuery', 'SVN', 'JSP', 'CSS', 'HTML'],
	},
	{
		projectType: 'WORK',
		title: 'Shopby Admin',
		company: 'NHN Commerce',
		companyLogo: nhnLogo,
		src: shopbyAdminImg,
		desc: 'Shopby 관리자 서비스 UI 개발 및 운영을 담당',
		href: 'https://shopby.jp/',
		techStack: ['React', 'Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
	{
		projectType: 'WORK',
		title: 'Shopby',
		company: 'NHN Commerce',
		companyLogo: nhnLogo,
		src: shopbyImg,
		desc: 'Shopby 일본 서비스 사이트 UI 개발 및 운영을 담당',
		href: 'https://shopby.jp/',
		techStack: ['Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
	{
		projectType: 'WORK',
		title: 'NHN Commerce',
		company: 'NHN Commerce',
		companyLogo: nhnLogo,
		src: godoImg,
		desc: '고도몰 서비스 사이트 UI 개발 및 운영을 담당',
		href: '/legacy/portfolio2021/List2021.html',
		techStack: ['Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
	{
		projectType: 'SIDE',
		title: 'JavaScript Chrome App',
		company: 'Personal Project',
		src: javascriptImg,
		desc: 'Vanilla JavaScript로 제작한 Chrome App 프로젝트',
		href: '/legacy/vanilajs/vanilaJS.html',
		techStack: ['JavaScript', 'HTML', 'CSS', 'GitHub'],
	},
	{
		projectType: 'WORK',
		title: '신한카드',
		company: '신한카드',
		companyLogo: shcardLogo,
		src: ebppImg,
		desc: '신한카드 사이트 UI 개발 및 운영, 전자고지서 구축을 담당',
		href: '/legacy/portfolio2019/List2019.html',
		techStack: ['Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
];

export default function Page() {
	return (
		<main className="title">
			<section>
				<SectionTitle title="Project" />

				{/* Mobile Project Swiper */}
				<div className="block md:hidden -ml-4">
					<div className="px-4">
						<Swiper
							slidesPerView={1.12}
							spaceBetween={12}
							className="!overflow-visible !py-4"
						>
							{projects.map((project) => (
								<SwiperSlide
									key={project.title}
									className="!h-auto !overflow-visible"
								>
									<Card {...project} className="h-full" />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>

				<div className="hidden flex-wrap gap-8 md:flex">
					{projects.map((project) => (
						<Card key={project.title} {...project} />
					))}
				</div>
			</section>

			<section className="max-w-6xl py-20">
				<div className="flex flex-col gap-10 min-[720px]:flex-row min-[720px]:items-center">
					<div className="w-full max-w-[395px] flex-shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
						<Image
							src={aboutmeThmubnail}
							alt="About Me"
							width={400}
							height={600}
							className="object-cover"
						/>
					</div>

					<div className="flex-1">
						<SectionTitle title="ABOUT ME" />

						<div className="text-slate-700 leading-6">
							<p className="mb-5">
								사용자의 경험을 가장 먼저 생각하며,
								<br />
								함께 일하는 팀을 성장하게 만드는 프론트엔드 개발자입니다.
							</p>

							<p>
								새로운 기술을 배우는 것을 좋아하고,
								<br />
								배운 것을 바로 프로젝트에 적용하며 성장하고 있습니다.
							</p>
						</div>

						<a
							href="/AboutMe"
							className="mt-8 inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-6 py-3 font-bold text-emerald-600 transition hover:bg-emerald-50"
						>
							더 알아보기 →
						</a>
					</div>
				</div>
			</section>

			<section>
				<div className="rounded-3xl border-4 border-black bg-white/80 p-6 shadow-[6px_6px_0_#000] flex justify-between">
					<div>
						<p className="text-xs font-black tracking-[0.3em] text-slate-500">
							HIDDEN STAGE
						</p>

						<h2 className="mt-2 text-2xl font-black text-slate-900">
							🗝️ BookMark
						</h2>

						<p className="mt-2 text-sm font-bold leading-6 text-slate-500">
							자주 구경가는 강같은 레퍼런스들의 모음.
						</p>
					</div>
					<a
						href="/BookMark"
						className="mt-5 inline-flex rounded-2xl border-2 border-black bg-yellow-200 px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0_#000] transition hover:-translate-y-1"
					>
						Enter →
					</a>
				</div>
			</section>
		</main>
	);
}
