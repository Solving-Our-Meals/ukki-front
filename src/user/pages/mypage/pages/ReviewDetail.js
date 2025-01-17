import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from "../css/Review.module.css";

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

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
            </div>
        )
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reviewDetail) {
        return <div>해당 리뷰를 찾을 수 없습니다.</div>;
    }

    console.log(reviewDetail)

    return (
        <div>
            <h2>리뷰 상세</h2>
            <p>가게명: {reviewDetail.storeName}</p>
            <p>리뷰 날짜: {reviewDetail.reviewDate}</p>
            <p>리뷰 내용: {reviewDetail.reviewText}</p>
            <p>별점: {renderStars(reviewDetail.star)}</p>
        </div>
    );
}

const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '⭐';
    }
    return stars;
};

export default ReviewDetail;
