import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/reservationInfo.module.css';
import KakaoMap from '../components/KakaoMap';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';

function ReservationInfo(){

    const [userInfo, setUserInfo] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { setGlobalError } = useError();

    const reservationInfo = { ...location.state };

    console.log('reservationInfo', reservationInfo);

    useEffect(
        () => {
            fetch(`${API_BASE_URL}/user/info`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                credentials : "include",
            })
            .then(response => {
                if (!response.ok) {
                    const error = new Error(`HTTP error! status: ${response.status}`);
                    error.status = response.status;
                    throw error;
                }
                return response.json();
            })
            .then(data => {
                setUserInfo(data);
                console.log('유저정보', data);
            })
            .catch(error => {
                console.error(error);
                setGlobalError(error.message, error.status);

                // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                if (error.status === 404) {
                    navigate('/404');
                } else if (error.status === 403) {
                    navigate('/403');
                } else {
                    navigate('/500');
                }
            });
        }, [setGlobalError]
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