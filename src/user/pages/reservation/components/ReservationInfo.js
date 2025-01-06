import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/reservationInfo.module.css';
import KakaoMap from '../components/KakaoMap';

function ReservationInfo(){

    const [userInfo, setUserInfo] = useState({});
    const location = useLocation();

    const reservationInfo = { ...location.state };

    useEffect(
        () => {
            fetch('user/info')
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
                console.log('유저정보', data);
            })
            .then(error => console.log(error));
        }, []
    )

    return(
        <div className={styles.reservationInfo}>
            <div id={styles.orderer}>
                <p>주문자 정보</p>
                <p>{`닉네임 : ${userInfo.nickname}`}</p>
            </div>
            <div id={styles.reservationConfirm}>
                <p>예약 정보 확인</p>
                <p>{`예약 가게 : ${reservationInfo.storeName}`}</p>
                <p>{`예약 날짜 : ${reservationInfo.date1}`}</p>
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