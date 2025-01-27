import { useState, useEffect } from 'react';
import styles from '../css/specificReviewModal.module.css';
import basicProfile from '../../../../user/pages/storedetail/images/PROFILE_BASIC.png';
import basicReviewImg from '../../../../user/pages/storedetail/images/BASIC_REVIEW_IMG.png';
import { API_BASE_URL } from '../../../../config/api.config';

function SpecificReviewModal({reviewNo, storeNo}){

    const [review, setReview] = useState({});

    useEffect(() => {
                
        fetch(`${API_BASE_URL}/boss/mypage/getReviewInfo?reviewNo=${reviewNo}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            setReview(data);
            console.log(data);
        })
        .catch(error => console.log(error));
    }, [reviewNo]);
    
    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            stars.push(<span key={i} className={styles.star}>&#x2B50;</span>);
        }
        return stars;
    };

    return(
        <>
            <div id={styles.totalArea}>
                <div className={styles.reviewContainer}>
                    <img 
                        src={review.userProfile === null ? basicProfile : `${API_BASE_URL}/store/${storeNo}/api/userProfile?userProfileName=${review.userProfile}`} 
                        id={styles.userProfile} 
                        alt='프로필 이미지'
                    />
                    <div>
                        <span id={styles.useName}>{review.userName}</span>
                        {renderStars(review.reviewScope)}
                    </div>
                    <div>{review.reviewDate}</div>
                    <div>{review.reviewContent}</div>
                    <img src={review.reviewImage === null ? basicReviewImg : `/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                </div> 
            </div>
        </>
    );
}

export default SpecificReviewModal;