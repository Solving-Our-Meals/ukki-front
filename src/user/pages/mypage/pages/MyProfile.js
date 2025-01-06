// import React, { useState, useEffect } from 'react';
// import styles from '../css/MyProfile.module.css'
// import {jwtDecode} from "jwt-decode";
// import Cookies from 'js-cookie'
// import '../css/reset.css';
// import { useNavigate } from 'react-router-dom';

// function MyProfile() {
//     const [userInfo, setUserInfo] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchUserInfo();
//     }, []);

//     const fetchUserInfo = async () => {
//         try {
//             // 서버의 /user/info API 호출
//             const response = await fetch('/user/info', {
//                 method: 'GET',
//                 credentials: 'include',  // 쿠키를 함께 보내기
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setUserInfo(data);
//                 console.log(data);
//             } else if (response.status === 401) {
//                 // 인증 실패 시 로그인 페이지로 리다이렉트
//                 setError('인증이 필요합니다.');
//                 navigate('/login');
//             } else {
//                 setError('유저 정보를 가져오는 데 실패했습니다.');
//             }
//         } catch (error) {
//             setError('에러 발생: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 로딩 중일 때
//     if (loading) {
//         return <div>로딩 중...</div>;
//     }

//     // 에러가 발생했을 때
//     if (error) {
//         return <div>{error}</div>;
//     }

//     // 유저 정보가 없을 때
//     if (!userInfo) {
//         return <div>유저 정보를 찾을 수 없습니다.</div>;
//     }

//     return (
//         <div className={styles.profileMain}>
//             <img className={styles.profileImage} src={userInfo?.profileImage || "/images/mypage/profile/default.png"} alt="Profile"/>
//             <p className={styles.mypageNickname}>{userInfo?.nickname || ''}</p>
//             <hr className={styles.mypageHorizonLine1}/>
//             <div className={styles.mypageTextBox}>나의 도전현황</div>

//             <div>
//                 <p className={styles.allReservationTitle}>총 예약</p>
//                 <p className={styles.allReviewTitle}>리뷰 작성</p>
//                 <p className={styles.allRandomTitle}>랜덤 예약</p>

//             <span className={styles.mypageReservationNo}>{userInfo?.reservationCount || ''}</span>
//             <span className={styles.mypageReviewNo}>{userInfo?.reviewCount || ''}</span>
//             <span className={styles.mypageRandomNo}>{userInfo?.randomCount || ''}</span>
//             </div>

//             <div className={styles.challengerMedal}>
//                 메달영역
//             </div>

//             <hr className={styles.mypageHorizonLine2}/>
//             <hr className={styles.mypageHorizonLine3}/>
//             <p className={styles.mypageProfilePlus}>더보기</p>
//         </div>
//     )

// }

// export default MyProfile;
