import reactblogImg from '@/asset/images/jojosonbitna.png';
import javascriptImg from '@/asset/images/javascript_chrome.png';
import etlandImg from '@/asset/images/etland.png';
import shopbyImg from '@/asset/images/shopby.png';
import godoImg from '@/asset/images/godo.png';
import ebppImg from '@/asset/images/ebpp.png';
import shopbyAdminImg from '@/asset/images/shopbyAdmin.jpg';
import wonImg from '@/asset/images/won.png';
import wooriLogo from '@/asset/images/woorilogo.png';
import etlandLogo from '@/asset/images/etlandlogo.png';
import nhnLogo from '@/asset/images/nhnlogo.png';
import shcardLogo from '@/asset/images/shcard_logo01.png';
import hapchihapchiImg from '@/asset/images/hapchihapchi.png';

export const projects = [
	{
		projectType: 'SIDE',
		title: '프리다이빙 선생님 조공 사이트',
		company: 'Personal Project',
		date: '최근',
		src: hapchihapchiImg,
		desc: '[진행중] 선생님이 학생별 스케줄 관리가 힘들다고 하셔서 조공바치고 과제를 쉽게 넘어가려는 프로젝트',
		href: 'https://hapchihapchiimok.vercel.app/',
		techStack: [
			'React',
			'TypeScript',
			'nextjs',
			'TailWind',
			'vercel',
			'supabase',
			'Github',
		],
	},
	{
		projectType: 'WORK',
		title: '우리WON뱅킹 APP',
		company: '우리은행',
		companyLogo: wooriLogo,
		src: wonImg,
		date: '2024~현재',
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
		date: '2024',
		href: 'https://react-newwons.vercel.app/',
		techStack: [
			'React',
			'TypeScript',
			'Storybook',
			'Styled',
			'fireBase',
			'GitHub',
			'vercel',
		],
	},
	{
		projectType: 'WORK',
		title: '전자랜드',
		company: '전자랜드',
		companyLogo: etlandLogo,
		src: etlandImg,
		date: '2023',
		desc: '전자랜드 쇼핑몰 UI 운영 및 유지보수를 담당',
		href: 'https://www.etlandmall.co.kr/',
		techStack: ['jQuery', 'SVN', 'JSP', 'CSS', 'HTML'],
	},
	{
		projectType: 'WORK',
		title: 'Shopby Admin',
		company: 'NHN Commerce',
		companyLogo: nhnLogo,
		date: '2019~2023',
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
		date: '2019~2023',
		desc: 'Shopby 일본 서비스 사이트 UI 개발 및 운영을 담당',
		href: 'https://shopby.jp/',
		techStack: ['Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
	{
		projectType: 'WORK',
		title: 'NHN Commerce',
		company: 'NHN Commerce',
		date: '2019~2023',
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
		date: '2022',
		src: javascriptImg,
		desc: 'Vanilla JavaScript로 제작한 Chrome App 프로젝트',
		href: '/legacy/vanilajs/vanilaJS.html',
		techStack: ['JavaScript', 'HTML', 'CSS', 'GitHub'],
	},
	{
		projectType: 'WORK',
		title: '신한카드',
		company: '신한카드',
		date: '2014~2019',
		companyLogo: shcardLogo,
		src: ebppImg,
		desc: '신한카드 사이트 UI 개발 및 운영, 전자고지서 구축을 담당',
		href: '/legacy/portfolio2019/List2019.html',
		techStack: ['Vue', 'GitHub', 'SCSS', 'JavaScript'],
	},
] as const;
