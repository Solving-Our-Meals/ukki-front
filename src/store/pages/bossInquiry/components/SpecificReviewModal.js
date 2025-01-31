import { useState, useEffect } from 'react';
import styles from '../css/specificReviewModal.module.css';
import basicProfile from '../../../../user/pages/storedetail/images/PROFILE_BASIC.png';
import basicReviewImg from '../../../../user/pages/storedetail/images/BASIC_REVIEW_IMG.png';
import { API_BASE_URL } from '../../../../config/api.config';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';

function SpecificReviewModal({reviewNo, storeNo, isClickToSeeReview, setModalVisible}){

    const [review, setReview] = useState({});
    const [closeModal, setCloseModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
                
        fetch(`${API_BASE_URL}/boss/mypage/getReviewInfo?reviewNo=${reviewNo}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials:"include",
        })
        .then(res => res.json())
        .then(data => {
            setReview(data);
            console.log(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, [reviewNo]);
    
    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            stars.push(<span key={i} className={styles.stars}>&#x2B50;</span>);
        }
        return stars;
    };

    const handleCloseModal = () => {
        isClickToSeeReview(false);
        setModalVisible(false);
    };

    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <>
            <div className={styles.overlay} style={{display : closeModal ? "none" : ""}}></div>
            <div id={styles.totalArea} style={{display : closeModal ? "none" : ""}}>
                <div className={styles.reviewContainer}>
                    <img 
                        src={review.userProfile === null ? basicProfile : `${API_BASE_URL}/store/${storeNo}/api/userProfile?userProfileName=${review.userProfile}`} 
                        id={styles.userProfile} 
                        alt='프로필 이미지'
                    />
                    <div id={styles.userNameAndScope}>
                        <span id={styles.userName}>{review.userName}</span>
                        {renderStars(review.reviewScope)}
                    </div>
                    <button type='button' id={styles.closeModal} onClick={() => handleCloseModal()}>확인</button>
                    <div id={styles.reviewDate}>{review.reviewDate}</div>
                    <div id={styles.reviewContent}>{review.reviewContent}</div>
                    <img src={review.reviewImage === null ? basicReviewImg : `/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                </div> 
            </div>
        </>
    );
}

export default SpecificReviewModal;