import { useState, useEffect } from 'react';
import styles from '../css/review.module.css';
import reviewImg from '../images/reviewBackground.png';

function Review(){

    const today = `${new Date().getFullYear()}.${new Date().getMonth()}.${new Date().getDate()} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;

    const [countReview, setCountReview] = useState(0);
    const [reviewContent, setReviewContent] = useState({
        userProfile : "프로필 사진",
        nickname : "닉네임",
        content : "리뷰 내용",
        reservationDate : today,
        photo : "리뷰 사진" 
    });

    useEffect(
        () => {
            fetch('/store/review')
            .then(res => res.json())
            .then(data => {
                setReviewContent(data);
                console.log('리뷰 정보 : ', data);
            })
            .catch(error => console.log(error));
        }, []
    );


    return(
        <div className={styles.reviewStyle}>
            <div id={styles.strReview}>리뷰</div>
            <div id={styles.strCountReview}>{`총 ${countReview}개의 리뷰가 있습니다.`}</div>
            <button type='button' id={styles.btnWriteReview}>리뷰 작성하기기</button>
            <div className={styles.reviewArea}>
                <div className={styles.reviewContainer}>
                    <img src={reviewImg} id={styles.reviewImg} alt='리뷰 백그라운드'/>
                    <div>{reviewContent.userProfile}</div>
                    <div>{reviewContent.nickname}</div>
                    <div>{`예약시간 - ${reviewContent.reservationDate}`}</div>
                    <div>{reviewContent.content}</div>
                    <div>{reviewContent.photo}</div>
                </div>
            </div>
        </div>
    );
}

export default Review;