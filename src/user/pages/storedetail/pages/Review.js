import { useState, useEffect } from 'react';
import styles from '../css/review.module.css';
import reviewImg from '../images/reviewBackground.png';
import CreateReview from '../components/CreateReview';

function Review(){

    const [reviews, setReviews] = useState([]);
    const [reviewContent, setReviewContent] = useState({
        storeNo : "",
        reviewCount : 0,
        reviewList : []
    });
    const [isMoreReview, setIsMoreReview] = useState(false);
    const [hiddenWord, setHiddenWord] = useState(true);
    const [sortOption, setSortOption] = useState('latest');

    useEffect(
        () => {
            fetch('/store/review')
            .then(res => res.json())
            .then(data => {
                console.log('리뷰 정보 : ', data);
                setReviewContent(data);
                const reviewList = data.reviewList;
                setReviews(reviewList);
            })
            .catch(error => console.log(error));
        }, []
    );

    const handleSort = (e) => {
        const option = e.target.value; 
        setSortOption(option);
        
        if (option === 'rating') {
            reviewScope();
        } else {
            reviewLatest();
        }
    };

    const moreReviewHandler = () => {
        setIsMoreReview(prevState => !prevState);
        setHiddenWord(prevState => !prevState);
    }

    const reviewLatest = () => {
        fetch('/store/review')
        .then(res => res.json())
        .then(data => {
            console.log('리뷰 정보 : ', data);
            setReviewContent(data);
            const reviewList = data.reviewList;
            setReviews(reviewList);
        })
        .catch(error => console.log(error));
    }

    const reviewScope = () => {
        fetch('/store/reviewscope')
        .then(res => res.json())
        .then(data => {
            console.log('리뷰 정보 : ', data);
            setReviewContent(data);
            const reviewList = data.reviewList;
            setReviews(reviewList);
        })
        .catch(error => console.log(error));
    }
    
    return(
        <div className={styles.reviewStyle}>
            <div id={styles.strReview}>리뷰</div>
            <div id={styles.strCountReview}>{`총 ${reviewContent.reviewCount}개의 리뷰가 있습니다.`}</div>
            <select id={styles.reviewSort} value={sortOption} onChange={(e) => handleSort(e)}>
                <option value="latest">최신순</option>
                <option value="rating">별점순</option>
            </select>
            <div className={styles.reviewArea}>
                <div className={styles.reviewContainer}>
                    {reviews.map((review, index) => (
                        <div 
                            key={index} 
                            className={index % 2 !== 0 ? styles.transformReview : styles.review} 
                            style={{ 
                                display : isMoreReview || index <= 2 ? "" : "none" }}
                        >
                            <img src={reviewImg} id={styles.reviewImg} style={{ transform : index % 2 !== 0 ? 'scaleX(-1)' : "" }} alt='리뷰 백그라운드'/>
                            <img 
                                src={review.userProfile === null ? '/store/api/userProfile?userProfileName=PROFILE_BASIC' : `/store/api/userProfile?userProfileName=${review.userProfile}`} 
                                id={styles.userProfile} 
                                alt='프로필 이미지'
                                />
                            <div>{review.userName}</div>
                            <div>{review.reviewDate}</div>
                            <div>{review.reviewContent}</div>
                            <img src={`/store/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                        </div>
                    ))}
                </div>
                <div 
                    id={styles.moreReview} 
                    onClick={() => moreReviewHandler()}
                >
                    {hiddenWord ? "리뷰 더보기 > " : "리뷰 닫기"} 
                </div>
            </div>
            <CreateReview/>
        </div>
    );
}

export default Review;