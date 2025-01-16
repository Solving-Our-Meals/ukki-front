import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Inquiry.module.css';
import '../css/reset.css';

function Info() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);  // 로딩 상태 추가

    const navigate = useNavigate();

    // 유저 정보 가져오는 함수
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/user/mypage/profile-info', {
                method: 'GET',
                credentials: 'include',  // 쿠키 인증 사용
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);  // 유저 정보 상태에 저장
            } else if (response.status === 401) {
                setError('인증이 필요합니다.');
                navigate('/auth/login');  // 로그인 페이지로 리다이렉션
            } else {
                setError('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);  // 로딩 끝났으므로 상태 업데이트
        }
    };

    // 컴포넌트 마운트 시 유저 정보 가져오기
    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : (
                <div>
                    {error && <div className={styles.error}>{error}</div>}

                    {userInfo && (
                        <div>
                            <h2>회원 정보</h2>
                            <p>이름: {userInfo.name}</p>
                            <p>이메일: {userInfo.email}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Info;
