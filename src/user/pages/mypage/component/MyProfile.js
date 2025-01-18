import React, { useState, useEffect } from 'react';
import styles from '../css/MyProfile.module.css'
import '../css/reset.css';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(null);

    const [profileImage, setProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);

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

    // 로딩
    if (loading) {
        return (
        <div className={styles.loadingContainer}>
            <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
        </div>
        )
    }

    if (error) {
        return (
            <div className={styles.loadingContainer}>
                <img src="/images/mypage/profile/notInfo.png" alt="없는 정보"/>
            </div>
        )
    }

    if (!userInfo) {
        return <div>유저 정보를 찾을 수 없습니다.</div>;
    }

    const rvc = userInfo.reservationCount;
    const rc = userInfo.reviewCount;
    const rdc = userInfo.randomCount;

    const hasAchievedBadge = rvc >= 10;
    const hasAchievedBadge2 = rc >= 10;
    const hasAchievedBadge3 = rvc >= 25;
    const hasAchievedBadge4 = rdc >=3;
    const hasAchievedBadge5 = rc >= 20;
    const hasAchievedBadge6 = rvc >= 50 && rc >= 30 && rdc >= 7;

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);  // 선택한 이미지를 미리보기로 표시
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            alert('업로드할 이미지가 없습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        try {
            const response = await fetch('/user/mypage/profile-image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok) {
                // 서버에서 성공적으로 이미지를 업데이트하면 새로운 프로필 이미지를 가져와서 상태 업데이트
                setUserInfo(result);
                setProfileImage(result.profileImage);
            } else {
                alert('이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            alert('이미지 업로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.profileMain}>
            <img className={styles.profileImage} src={userInfo?.profileImage || "/images/mypage/profile/default.png"}
                 alt="Profile"/>
                <img src="/images/mypage/profile/pencil.gif" alt="업로드 아이콘" className={styles.uploadButton} onClick={handleImageUpload}/>
            <p className={styles.mypageNickname}>{userInfo?.nickname || ''}</p>
            <hr className={styles.mypageHorizonLine1}/>
            <div className={styles.mypageTextBox}>나의 도전현황</div>

            <div className={styles.allNumber}>
                <div>
                    <p className={styles.allReservationTitle}>총 예약</p>
                    <p className={styles.allReviewTitle}>리뷰 작성</p>
                    <p className={styles.allRandomTitle}>랜덤 예약</p>
                </div>

                <div>
                    <span className={styles.mypageReservationNo}>{userInfo?.reservationCount || '0'}</span>
                    <span className={styles.mypageReviewNo}>{userInfo?.reviewCount || '0'}</span>
                    <span className={styles.mypageRandomNo}>{userInfo?.randomCount || '0'}</span>
                </div>
            </div>

            <hr className={styles.mypageHorizonLine2}/>
            <div className={styles.challengerMedal}>
                {/* 1번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge1.png"
                    alt="메달"
                    className={`${styles.medalImage} ${!hasAchievedBadge ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge1')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge1' && (
                    <div className={`${styles.tooltip} ${!hasAchievedBadge ? styles.tooltipGrayscale : ''}`}>
                        총 예약수 10번 이상
                    </div>
                )}

                {/* 2번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge2.png"
                    alt="메달"
                    className={`${styles.medalImage2} ${!hasAchievedBadge2 ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge2')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge2' && (
                    <div
                        className={`${styles.tooltip2} ${!hasAchievedBadge2 ? styles.tooltipGrayscale : ''}`}
                    >
                        총 리뷰수 10번 이상
                    </div>
                )}

                {/* 3번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge3.png"
                    alt="메달"
                    className={`${styles.medalImage3} ${!hasAchievedBadge3 ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge3')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge3' && (
                    <div
                        className={`${styles.tooltip3} ${!hasAchievedBadge3 ? styles.tooltipGrayscale : ''}`}
                    >
                        총 예약수 25번 이상
                    </div>
                )}

                {/* 4번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge4.png"
                    alt="메달"
                    className={`${styles.medalImage4} ${!hasAchievedBadge4 ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge4')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge4' && (
                    <div
                        className={`${styles.tooltip4} ${!hasAchievedBadge4 ? styles.tooltipGrayscale : ''}`}
                    >
                        총 랜덤 예약 3번 이상
                    </div>
                )}

                {/* 5번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge5.png"
                    alt="메달"
                    className={`${styles.medalImage5} ${!hasAchievedBadge5 ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge5')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge5' && (
                    <div
                        className={`${styles.tooltip5} ${!hasAchievedBadge5 ? styles.tooltipGrayscale : ''}`}
                    >
                        총 리뷰 수 20번 이상
                    </div>
                )}

                {/* 6번 뱃지에 대한 부분*/}
                <img
                    src="/images/badge/badge6.png"
                    alt="메달"
                    className={`${styles.medalImage6} ${!hasAchievedBadge6 ? styles.grayscale : ''}`}
                    onMouseEnter={() => setShowTooltip('badge6')}
                    onMouseLeave={() => setShowTooltip(null)}
                />
                {showTooltip === 'badge6' && (
                    <div
                        className={`${styles.tooltip6} ${!hasAchievedBadge6 ? styles.tooltipGrayscale : ''}`}
                    >
                        총 예약 수 50번 이상 <br/>
                        총 리뷰 수 30번 이상 <br/>
                        총 랜덤 예약 7번 이상
                    </div>
                )}
            </div>

            <hr className={styles.mypageHorizonLine3}/>
        </div>
    )

}

export default MyProfile;