import { useState, useEffect } from 'react';
import styles from '../css/specificReview.module.css';

function SpecificReview({reviewNo, storeNo}){

    const [review, setReview] = useState({});

    useEffect(() => {
        if (!reviewNo) {
            console.log('reviewNo가 비어 있습니다.');
            return;  // reviewNo가 없으면 fetch를 보내지 않음
        }
        
        fetch(`/boss/mypage/getReviewInfo?reviewNo=${reviewNo}`)
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
                        src={review.userProfile === null ? `/store/${storeNo}/api/userProfile?userProfileName=PROFILE_BASIC` : `/store/${storeNo}/api/userProfile?userProfileName=${review.userProfile}`} 
                        id={styles.userProfile} 
                        alt='프로필 이미지'
                    />
                    <div>
                        <span id={styles.useName}>{review.userName}</span>
                        {renderStars(review.reviewScope)}
                    </div>
                    <button id={styles.reportBtn}>신고하기</button>
                    <div>{review.reviewDate}</div>
                    <div>{review.reviewContent}</div>
                    <img src={`/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                </div> 
            </div>
        </>
    );
}

export default SpecificReview;