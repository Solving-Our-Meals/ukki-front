import { useLocation } from 'react-router-dom';
import styles from '../css/reservationInfo.module.css';
import KakaoMap from '../components/KakaoMap';

function ReservationInfo(){

    const location = useLocation();

    const reservationInfo = { ...location.state };

    return(
        <div className={styles.reservationInfo}>
            <div id={styles.orderer}>
                <p>주문자 정보</p>
                <p>닉네임 :</p>
            </div>
            <div id={styles.reservationConfirm}>
                <p>예약 정보 확인</p>
                <p>{`예약 가게 : ${reservationInfo.storeName}`}</p>
                <p>{`예약 날짜 : ${reservationInfo.date}`}</p>
                <p>{`예약 시간 : ${reservationInfo.time}`}</p>
            </div>
            <div id={styles.storeLocation}>
                <p>식당 위치</p>
                <KakaoMap/>
            </div>
        </div>
    );
}

export default ReservationInfo;