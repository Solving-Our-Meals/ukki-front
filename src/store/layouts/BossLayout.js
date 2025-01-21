import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import styles from './css/bosslayout.module.css';
import Sidebar from '../pages/bossStore/components/Sidebar';

function BossLayout() {
    const [storeInfo, setStoreInfo] = useState(null); // 가게 정보
    const [userData, setUserData] = useState(null); // 사용자 정보
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                const userRes = await fetch('/user/info');
                if (!userRes.ok) {
                    throw new Error('사용자 정보를 가져오지 못했습니다.');
                }
                const fetchedUserData = await userRes.json();
                setUserData(fetchedUserData); // 사용자 정보 저장
                console.log('User Data:', fetchedUserData);

                // 가게 정보 가져오기
                const storeRes = await fetch(`/boss/mypage/getStoreInfo?userNo=${fetchedUserData.userNo}`);
                if (!storeRes.ok) {
                    throw new Error('가게 정보를 가져오지 못했습니다.');
                }

                // 응답이 비어있는 경우 처리
                const storeData = await storeRes.json();
                if (!storeData) {
                    throw new Error('가게 정보가 비어있습니다.');
                }

                console.log('Store Data:', storeData);
                setStoreInfo(storeData); // 가게 정보 저장
            } catch (err) {
                console.error('Error fetching data:', err.message);
                setError(err.message);
            }
        };

        fetchStoreInfo();
    }, []);

    return (
        <>
            <div className={styles.layoutStyle}>
                <Header className={styles.header} />
                <Sidebar/>

                {/* 에러 상태를 UI에 반영 */}

                {error ? (
                    <div className={styles.errorMessage}>{error}</div>
                ) : (
                    // storeNo와 userNo를 Outlet로 전달, 데이터가 준비되면 전달
                    userData && storeInfo ? (
                        <Outlet context={{ storeNo: storeInfo?.storeNo, userNo: userData?.userNo }} />
                    ) : (
                        <div>로딩 중...</div> // 데이터가 준비될 때까지 로딩 표시
                    )
                )}
            </div>
            <FloatingBar />
        </>
    );
}

export default BossLayout;

