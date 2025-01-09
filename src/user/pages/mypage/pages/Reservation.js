import React, { useState, useEffect } from 'react';
import styles from '../css/Reservation.module.css'
import '../css/reset.css';
import {Link, useNavigate} from 'react-router-dom';

function Reservation () {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/user/info', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            } else if (response.status === 401) {
                setError('인증이 필요합니다.');
                navigate('/auth/login');
            } else {
                setError('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>로딩창 넣을곳</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>유저 정보를 찾을 수 없습니다.</div>;
    }





    return (
        <div className={styles.mypageReservation}>
            <Link to="/user/mypage/reservation">
                <div className={styles.tab1}>예약리스트</div>
            </Link>
            <Link to="/user/mypage/review">
                <div className={styles.tab2}>작성된 리뷰</div>
            </Link>
            <div className={styles.line1}>|</div>
            <Link to="/user/mypage/inquiry">
                <div className={styles.tab3}>문의 내역</div>
            </Link>
            <div className={styles.line2}>|</div>
            <Link to="/user/mypage/profile">
                <div className={styles.tab4}>회원 정보수정</div>
            </Link>

            <div className={styles.mypageReservationMain}>

            </div>
        </div>
    );
}

export default Reservation;

