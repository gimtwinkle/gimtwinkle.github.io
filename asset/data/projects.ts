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

import type { StaticImageData } from 'next/image';
import { projectCatalog } from './projectCatalog';

const images: Record<string, { src: StaticImageData; companyLogo?: StaticImageData }> = {
    '프리다이빙 선생님 조공 사이트': { src: hapchihapchiImg },
    '우리WON뱅킹 APP': { src: wonImg, companyLogo: wooriLogo },
    '리액트 블로그': { src: reactblogImg },
    '전자랜드': { src: etlandImg, companyLogo: etlandLogo },
    'Shopby Admin': { src: shopbyAdminImg, companyLogo: nhnLogo },
    'Shopby': { src: shopbyImg, companyLogo: nhnLogo },
    'NHN Commerce': { src: godoImg, companyLogo: nhnLogo },
    'JavaScript Chrome App': { src: javascriptImg },
    '신한카드': { src: ebppImg, companyLogo: shcardLogo },
};

export const projects = projectCatalog.map((project) => ({
    ...project,
    ...images[project.title],
}));
