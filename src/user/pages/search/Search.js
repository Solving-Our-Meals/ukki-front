
import '../../../common/header/css/reset.css';
import style from './css/search.module.css';
import search from '../main/image/Search.png';
import banner from './image/banner.png';
import one from './image/image.png';
import two from './image/image-1.png';
import three from './image/image-2.png';
import ghdqh from './image/image3.png';
import rkrp from '../main/image/name-bg.png';
function Search() {

    return (
        <><div id={style.search}>
            <div className={style.input}>
                <div>
                    <input className={style.dlsvnt} type="search" defaultValue="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;검색어를 입력하세요" />
                    <img src={search} />
                </div>
                <p>최근 검색어</p>
                <div className={style.boxs}>
                    <span>피자</span>
                    <span>치킨</span>
                    <span>파스타</span>
                    <span>족발</span>
                    <span>떡볶이</span>
                    <span>그릭요거트</span>
                </div>
                <p>실시간 인기 검색어</p>
                <div className={style.dlsrl}></div>
            </div>
            <div className={style.banner}>
                <p>우끼 광고 및 제휴 문의</p>
                <span>배너 광고와 가게 제휴등의 문의는 문의하기로 부탁드립니다!</span>
                <img src={banner} />
            </div>
            <div className={style.today}>
                <h3>오늘은 여기 어때요?</h3>
                <span>ⓘ 광고</span>
                <img src={one} />
                <span>내가 싫어하는거 총집합</span>
                <p>(32)</p>
                <img src={two} />
                <span>나 제육볶음 진짜 잘함</span>
                <img src={three} />
                <p>(48)</p>
                <span>떡튀순인가 김떡순인가</span>
                <p>(25)</p>
            </div>
            <div className={style.rhkdrh}>
                <img src={ghdqh} />
                <img src={rkrp} />
                <h3>광고 가게 이름</h3>
                <p>광고 가게 위치</p>
                <span>가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명<br />
                    가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명</span>
            </div>
        </div>
        </>
    )
}

export default Search;