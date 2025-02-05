import MainLogo from './image/character-main.png';
import ImgLogo from './image/img-logo.png';
import TextLogo from './image/text-logo.png';
import TalkBg from './image/talk-bg.png';
import Talk2 from './image/talk-2.png';
import Talk1 from './image/talk-1.png';
import Svg from './image/styleguide.svg';
import SvgLogo from './image/ukki logo.svg';
import JpgLogo from './image/ukki logo.jpg';
import Jpg from './image/styleguide.jpg';
import '../../../common/header/css/reset.css';
import '../info/css/Info.css';
import Footer from '../info/component/Footer';

function downloadFiles(files) {
    files.forEach(file => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function Info() {
    const handleSvgDownload = () => {
        downloadFiles([
            { url: Svg, name: 'styleguide.svg' },
            { url: SvgLogo, name: 'ukki-logo.svg' }
        ]);
    };

    const handleJpgDownload = () => {
        downloadFiles([
            { url: Jpg, name: 'styleguide.jpg' },
            { url: JpgLogo, name: 'ukki-logo.jpg' }
        ]);
    };

    return (
        <>
            <div className='info'>
                <h1>우리들의 끼니 해결 소개</h1>
                <p>&larr;우리들의 끼니 마스코트 캐릭터</p>
                <h4>캐릭터 이름 : </h4>
                <h4>우끼링</h4>
                <h4>캐릭터 나이 : </h4>
                <h4>11살</h4>
                <span>
                    우끼링은 우리들의 끼니에서 키우고 있는 먹보 원숭이입니다.
                    우끼를 만들기 위한 아마존에서 혼밥 맛집 탐사를 하고 돌아오던 때
                    가방에서 바나나껍질과 함께 발견되었어요! 그 후로 저희 곁을 떠나려고 하지 않아서
                    우끼의 혼밥 맛집을 찾아서 추천해주는 혼밥 스카우터 겸 마스코트로 활동중입니다.
                    참고로 머리 위의 바나나는 머리 위에 놓은걸 까먹고 안먹고 있답니다 (ʃƪ ₀ ³₀)❥
                </span>
                <img src={MainLogo} alt="우끼링 마스코트" />
                <div></div>
                <h3>우끼 로고</h3>
                <span>우리들의 끼니 해결 마스코트 캐릭터 우끼링과
                    혼밥이라는 느낌을 주기 위한 칸막이를 넣었고
                    최대한 친근한 느낌을 주려고 했습니다 
                </span>

                <p>&rarr; 스타일 가이드 및 로고 다운로드 하기</p>
                <button onClick={handleSvgDownload}>SVG</button>
                <button onClick={handleJpgDownload}>JPG</button>
                <img src={ImgLogo} alt="이미지 로고" />
                <p>이미지 로고</p>
                <img src={TextLogo} alt="텍스트 로고" />
                <p>텍스트 로고</p>

                <h3>우리들의 끼니 해결의 목적</h3>
                <img src={TalkBg} alt="배경 이미지" />
                <img src={Talk2} alt="대화 이미지 2" />
                <img src={Talk1} alt="대화 이미지 1" />

                <span>
                    요리에 대한 여러 프로그램의 성행으로 맛있는 한 끼에 대한 관심도가 증가한 반면 혼밥을 하는 사람들에게 적합한 사이트가 존재하지 않아
                    혼밥을 위한 사이트를 기획하게 되었습니다. 언제 어디서든 편하게 혼자 식사를 원할 때 혼밥을 할 수 있는 식당 정보를 쉽게 파악하고 예약하며 
                    빠르게 자리를 잡을 수 있는 공간을 제공하여 혼밥에 대한 긍정적인 인식을 확산시킴과 동시에 개인주의형 라이프스타일을 충족시키며
                    <br />
                    <br />
                    혼밥을 더욱 더 자유롭고 편리하게 즐길 수 있는 환경을 제공할 수 있을거라 기대하고 있습니다.
                </span>
                <a href="https://github.com/Solving-Our-Meals/ukki-front" target="_blank" rel="noopener noreferrer">
                    <button>깃허브 가기</button>
                </a>
                <a href="https://www.notion.so/ohgiraffers/11f649136c118176bb0be17e30f6cbb9" target="_blank" rel="noopener noreferrer">
                    <button>기획안 보기</button>
                </a>

            </div>
            <Footer />
        </>
    )
}

export default Info;
