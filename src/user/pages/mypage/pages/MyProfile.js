import React, { useState, useEffect } from 'react';
import styles from '../css/MyProfile.module.css'
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie'

function MyProfile() {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userNo = decodedToken.userNo;

            fetchUserInfo(userNo);
        }
    }, []);

    const fetchUserInfo = async (userNo) => {
        try {
            const response = await fetch(`/user/${userNo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
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