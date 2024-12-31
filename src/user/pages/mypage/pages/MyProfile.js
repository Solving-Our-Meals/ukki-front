import React, { useState, useEffect } from 'react';
import styles from '../css/MyProfile.module.css'
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie'

function MyProfile() {
    const [userInfo, setUserInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = Cookies.get('authToken');
        console.log('Token:', token);
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userNo = decodedToken.userNo;
                console.log(decodedToken)

                fetchUserInfo(userNo);
            } catch (err) {
                setError('유효하지 않은 토큰입니다.');
                setLoading(false);
            }
        } else {
            setError('토큰이 존재하지 않습니다.');
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (userNo) => {
        const token = Cookies.get('authToken');
        try {
            const response = await fetch(`/user/${userNo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
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