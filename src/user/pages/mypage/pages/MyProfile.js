import React, { useState, useEffect } from 'react';
import styles from '../css/MyProfile.module.css'
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie'

function MyProfile() {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // JWT 토큰 디코딩하여 유저 아이디 추출
            const decodedToken = jwtDecode(token);
            const userNo = decodedToken.userNo; // JWT 토큰 안에서 유저 ID가 포함되어 있다고 가정

            // 유저 아이디를 이용해서 서버로 API 요청
            fetchUserInfo(userNo);
        }
    }, []);

    const fetchUserInfo = async (userNo) => {
        try {
            const response = await fetch(`/user/${userNo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`, // Authorization 헤더에 토큰을 포함
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            } else {
                console.error('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <div className={styles.profileMain}>
            <div className={styles.profileImage}/>
            {/*<img src={userInfo.profileImage} alt="Profile"/>*/}
            <h2>{userInfo.nickname}</h2>
        </div>
    )

}

export default MyProfile;