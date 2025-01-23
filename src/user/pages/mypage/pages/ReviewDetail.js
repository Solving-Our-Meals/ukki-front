import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from "../css/ReviewDetail.module.css";
import DefaultProfile from "../images/mypage/default.png";
import Loading from '../../../../common/inquiry/img/loadingInquiryList.gif';
import {API_BASE_URL} from '../../../../config/api.config';

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
            const response = await fetch(`${API_BASE_URL}/user/mypage/review/${reviewNo}`, {
                method: 'GET',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                },
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
                <img src={Loading} alt="로딩 중"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중"/>
            </div>
        );
    }

    if (!reviewDetail) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중"/>
            </div>
        );
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
                                : DefaultProfile}
                            alt="프로필 이미지"
                            className={styles.userProfile}
                        />
                    </div>
                    <div className={styles.storeNameTitle}>가게이름 : <p
                        className={styles.storeName}>{reviewDetail.storeName}</p><Link to={`/store/${reviewDetail.storeNo}`} className={styles.storeDetailButton}>
                        <button className={styles.storeDetailBtn}>가게 상세보기</button>
                    </Link></div>
                </div>
                <div className={styles.reviewMain}>
                <div className={styles.reviewName}>{reviewDetail.userName}</div>
                <div className={styles.starRating}>{renderStars(reviewDetail.star)}</div>
                </div>
                <div className={styles.reviewDate}>{reviewDetail.reviewDate}</div>

                <div className={styles.reviewText}>{reviewDetail.reviewText}</div>

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
