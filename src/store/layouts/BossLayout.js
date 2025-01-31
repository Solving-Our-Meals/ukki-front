import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import styles from './css/bosslayout.module.css';
import Sidebar from '../pages/bossStore/components/Sidebar';
import BossHeader from '../../common/header/components/BossHeader';
import { API_BASE_URL } from '../../config/api.config';

// UserListAPI 함수 정의
export async function UserListAPI(category, word) {
    try {
        let url = `${API_BASE_URL}/admin/users/list`;
        if (category === 'none' && word) {
            url += `?word=${encodeURIComponent(word)}`;
        } else if (category && word) {
            url += `?category=${encodeURIComponent(category)}&word=${encodeURIComponent(word)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials : "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

function BossLayout() {
    const [storeInfo, setStoreInfo] = useState(null); // 가게 정보
    const [userData, setUserData] = useState(null); // 사용자 정보
    const [error, setError] = useState(null); // 에러 상태 추가
    const [doInquiryModal, setDoInquiryModal] = useState(false);

    // 사용자 리스트를 위한 상태 추가
    const [userList, setUserList] = useState([]); // 사용자 목록
    const [category, setCategory] = useState('none'); // 카테고리
    const [word, setWord] = useState(''); // 검색어

    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                const userRes = await fetch(`${API_BASE_URL}/user/info`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!userRes.ok) {
                    throw new Error('사용자 정보를 가져오지 못했습니다.');
                }
                const fetchedUserData = await userRes.json();
                setUserData(fetchedUserData); // 사용자 정보 저장
                console.log('User Data:', fetchedUserData);

                // 가게 정보 가져오기
                const storeRes = await fetch(`${API_BASE_URL}/boss/mypage/getStoreInfo?userNo=${fetchedUserData.userNo}`);
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

    // 사용자 리스트 API 호출
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const data = await UserListAPI(category, word); // API 호출
                setUserList(data); // 사용자 목록 상태에 저장
                console.log('User List:', data);
            } catch (err) {
                console.error('Error fetching user list:', err);
                setError('사용자 목록을 가져오는데 실패했습니다.');
            }
        };

        fetchUserList(); // 컴포넌트가 렌더링될 때마다 사용자 목록 가져오기
    }, [category, word]); // category나 word가 바뀔 때마다 호출

    useEffect(() => {
        if (doInquiryModal) {
            document.querySelector('html').style.overflowY = 'hidden';
        } else {
            document.querySelector('html').style.overflowY = 'auto';
        }
    }, [doInquiryModal]);

    return (
        <>
            <div className={!doInquiryModal ? styles.layoutStyle : styles.layoutModalStyle}>
                <BossHeader className={styles.header} />
                <Sidebar />

                {/* 에러 상태를 UI에 반영 */}
                {error ? (
                    <div className={styles.errorMessage}>{error}</div>
                ) : (
                    userData && storeInfo ? (
                        <>
                            {/* 가게와 사용자 정보가 준비되면 Outlet 렌더링 */}
                            <Outlet context={{ storeNo: storeInfo?.storeNo, userNo: userData?.userNo }} />

                            {/* 사용자 목록 출력 */}
                            {/* <section>
                                <h2>사용자 목록</h2>
                                <ul>
                                    {userList.map((user, index) => (
                                        <li key={index}>{user.name} - {user.email}</li>
                                    ))}
                                </ul>
                            </section> */}
                        </>
                    ) : (
                        <div>로딩 중...</div> // 데이터가 준비될 때까지 로딩 표시
                    )
                )}
            </div>

            {doInquiryModal && <div className={styles.overlay}></div>}
            <FloatingBar setDoInquiryModal={setDoInquiryModal} />
        </>
    );
}

export default BossLayout;
