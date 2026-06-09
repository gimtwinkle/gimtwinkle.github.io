import TypingBox from '@/asset/components/TypingBox';
import aboutImg from '@/asset/images/aboutme.png';
import aboutImg_m from '@/asset/images/aboutme_m.png';
import Image from '@/node_modules/next/image';

export default function Page() {
	return (
		<>
			<section className="mx-auto py-16">
				<TypingBox
					msgText={`이 이미지는 요즘 유행하는 AI 프롬프트로 생성한 RPG 캐릭터 이미지입니다. 현재 사이트의 콘셉트도 이 이미지에서 영감을 받았어요.
				요즘 제가 가장 많이 생각하는 것들, 관심사, 일하는 방식, 성격이 꽤 잘 담겨 있어서 이 이미지로 저를 소개해도 좋겠다고 생각했습니다.
				프롬프트도 공유합니다. AI를 쓰고 있다면 한 번 해보세요!
				
				"based on everything you know about me, make me an RPG game character with stats, skills, inventory, and current quests. funny and emotional tone in Korean"`}
				/>

				{/* 아래에 이미지 */}
			</section>

			<Image src={aboutImg_m} alt="" className="w-full md:hidden mt-10" />
			<Image src={aboutImg} alt="" className="hidden w-full md:block  mt-10" />
		</>
	);
}
