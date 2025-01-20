import React, { useState, useEffect } from 'react';
import styles from '../css/Review.module.css';
import '../css/reset.css';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ReservationDetail() {
    const { resNo } = useParams();  // URL에서 resNo를 가져옵니다.
    const [reviewDetail, setReviewDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservationDetail();
    }, [resNo]);

    const fetchReservationDetail = async () => {
        try {
            const response = await fetch(`/user/mypage/reservation/${resNo}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setReviewDetail(data);
            } else {
                setError('리뷰를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reviewDetail) {
        return <div>해당 리뷰를 찾을 수 없습니다.</div>;
    }

    return (
        <>
            {/* 탭 영역 */}
            <div className={styles.allTabs}>
                <Link to="/user/mypage/review">
                    <div className={styles.tab1}>작성된 리뷰</div>
                </Link>
                <Link to="/user/mypage/reservation">
                    <div className={styles.tab2}>예약리스트</div>
                </Link>
                <div className={styles.line1}>|</div>
                <Link to="/user/mypage/inquiry">
                    <div className={styles.tab3}>문의 내역</div>
                </Link>
                <div className={styles.line2}>|</div>
                <Link to="/user/mypage/profile">
                    <div className={styles.tab4}>회원 정보수정</div>
                </Link>
            </div>

            {/* 리뷰 상세 정보 */}
            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    {/* 프로필 사진 */}
                    <div className={styles.profileContainer}>
                        <img
                            src={reviewDetail.userProfile
                                ? `/images/profiles/${reviewDetail.userProfile}`
                                : '/images/mypage/profile/default.png'}
                            alt="프로필 이미지"
                            className={styles.userProfile}
                        />
                    </div>
                    <div className={styles.storeNameTitle}>가게이름 : <p
                        className={styles.storeName}>{reviewDetail.storeName}</p>
                        <Link to={`/store/${reviewDetail.storeNo}`} className={styles.storeDetailButton}>
                            <button className={styles.storeDetailBtn}>가게 상세보기</button>
                        </Link>
                    </div>
                </div>
                <div className={styles.reviewMain}>
                    <div className={styles.reviewName}>{reviewDetail.userName}</div>
                </div>
                <div className={styles.reviewDate}>{reviewDetail.reviewDate}</div>

                <div className={styles.reviewText}>{reviewDetail.reviewText}</div>

                {/* 리뷰 사진 */}
                {reviewDetail.reviewPicture && (
                    <div className={styles.reviewImageContainer}>
                        <img
                            src={`/images/reviews/${reviewDetail.reviewPicture}`}
                            alt="리뷰 이미지"
                            className={styles.reviewImage}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default ReservationDetail;
