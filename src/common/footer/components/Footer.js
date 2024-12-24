import styles from '../css/footer.module.css';
import footer_logo from '../images/footer-logo.png';
import '../css/reset.module.css';


function Footer(){

    return(
        <div className={styles.footerStyle}>
            <img src={footer_logo} alt='혼밥하는 우끼' id={styles.honbab_ukki}/>
            <p id={styles.first}>이용약관 <br/>
               사이트맵 <br/>
               문의하기</p>
            <p id={styles.second}>사이트 소개 <br/>
               가게 제휴 문의 <br/>
               개인정보처리방침</p>
            <p id={styles.third}>(주)S.O.M | 서울특별시 남한구 한국로 1211-11 <br/>
               대표자 : 조형석 | 사업자등록번호 : 031-21-14856 | 통신판매업신고번호 : 제 하남03121호 <br/>
               광고문의 : 02-0285-8297 | 이메일 : lesles0906@gmail.com | 호스팅사업자 : (주)케이스</p>
            <div className={styles.pinkArea}>
                <p>COPYRIGHT© 2024 S.O.M. ALL RIGHT RESERVED.</p>
            </div>
        </div>
    );
}



export default Footer;