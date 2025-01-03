import React, { useState, useEffect } from 'react';
import styles from '../css/MyProfile.module.css'
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie'
import '../css/reset.css';

function MyProfile() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = Cookies.get('authToken');
        console.log('Token:', token);
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub;

                fetchUserInfo(userId);
            } catch (err) {
                setError('유효하지 않은 토큰입니다.');
                setLoading(false);
            }
        } else {
            setError('토큰이 존재하지 않습니다.');
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        const token = Cookies.get('authToken');
        try {
            const response = await fetch(`/user/${userId}`, {
                method: 'GET',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // }, -> 쿠키로 보낼거라서 없어도 됩니다 ! 다른 팀원 분들 참고해주세요.
                credentials: 'include', // 얘를 쓰면 쿠키로 보낼 수 있습니다.
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                console.log(data)
            } else {
                console.error('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <div className={styles.profileMain}>
            <img className={styles.profileImage} src={userInfo?.profileImage || "/images/mypage/profile/default.png"} alt="Profile"/>
            <p className={styles.mypageNickname}>{userInfo?.nickname || ''}</p>
            <hr className={styles.mypageHorizonLine1}/>
            <div className={styles.mypageTextBox}>나의 도전현황</div>

            <div>
                <p className={styles.allReservationTitle}>총 예약</p>
                <p className={styles.allReviewTitle}>리뷰 작성</p>
                <p className={styles.allRandomTitle}>랜덤 예약</p>

            <span className={styles.mypageReservationNo}>{userInfo?.reservationCount || ''}</span>
            <span className={styles.mypageReviewNo}>{userInfo?.reviewCount || ''}</span>
            <span className={styles.mypageRandomNo}>{userInfo?.randomCount || ''}</span>
            </div>

            <div className={styles.challengerMedal}>
                메달영역
            </div>

            <hr className={styles.mypageHorizonLine2}/>
            <hr className={styles.mypageHorizonLine3}/>
            <p className={styles.mypageProfilePlus}>더보기</p>
        </div>
    )

}

export default MyProfile;
