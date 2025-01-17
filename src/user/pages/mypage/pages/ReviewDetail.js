import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from "../css/ReviewDetail.module.css";

function ReviewDetail() {
    const { reviewNo } = useParams(); // URL에서 reviewNo를 가져옴
    const [reviewDetail, setReviewDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReviewDetail();
    }, [reviewNo]);

    const fetchReviewDetail = async () => {
        try {
            const response = await fetch(`/user/mypage/review/${reviewNo}`, {
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

    const renderStars = (rating) => {
        let stars = '';
        for (let i = 0; i < rating; i++) {
            stars += '⭐';
        }
        return stars;
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
            {/* 탭 영역 추가 */}
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

            {/* 리뷰 상세 정보 컨테이너 */}
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
                    <div className={styles.storeNameTitle}>가게이름 : <p className={styles.storeName}>{reviewDetail.storeName}</p></div>
                </div>
                <div className={styles.reviewDate}>리뷰 날짜: {reviewDetail.reviewDate}</div>
                <div className={styles.reviewText}>리뷰 내용: {reviewDetail.reviewText}</div>
                <div className={styles.starRating}>별점: {renderStars(reviewDetail.star)}</div>

                {/* 리뷰 사진 표시 */}
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

export default ReviewDetail;
