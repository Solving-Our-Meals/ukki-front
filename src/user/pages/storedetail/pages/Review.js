// import { useState, useEffect } from 'react';
// import styles from '../css/review.module.css';
// import reviewImg from '../images/reviewBackground.png';
// import CreateReview from '../components/CreateReview';

// function Review(){

//     const [reviews, setReviews] = useState([]);
//     const [reviewContent, setReviewContent] = useState({
//         storeNo : "",
//         reviewCount : 0,
//         reviewList : []
//     });
//     const [isMoreReview, setIsMoreReview] = useState(false);
//     const [hiddenWord, setHiddenWord] = useState(true);

//     useEffect(
//         () => {
//             fetch('/store/review')
//             .then(res => res.json())
//             .then(data => {
//                 console.log('리뷰 정보 : ', data);
//                 setReviewContent(data);
//                 const reviewList = data.reviewList;
//                 setReviews(reviewList);
//             })
//             .catch(error => console.log(error));
//         }, []
//     );

//     const moreReviewHandler = () => {
//         setIsMoreReview(prevState => !prevState);
//         setHiddenWord(prevState => !prevState);
//     }
    
//     return(
//         <div className={styles.reviewStyle}>
//             <div id={styles.strReview}>리뷰</div>
//             <div id={styles.strCountReview}>{`총 ${reviewContent.reviewCount}개의 리뷰가 있습니다.`}</div>
//             <div className={styles.reviewArea}>
//                 <div className={styles.reviewContainer}>
//                     {reviews.map((review, index) => (
//                         <div 
//                             key={index} 
//                             className={styles.review} 
//                             style={{ 
//                                 marginLeft : index % 2 !== 0 ? '35px' : '-35px', 
//                                 display : isMoreReview || index <= 2 ? "" : "none" }}
//                         >
//                             <img src={reviewImg} id={styles.reviewImg} style={{ transform : index % 2 !== 0 ? 'scaleX(-1)' : "" }} alt='리뷰 백그라운드'/>
//                             <img 
//                                 src={review.userProfile === null ? '/store/api/userProfile?userProfileName=PROFILE_BASIC' : `/store/api/userProfile?userProfileName=${review.userProfile}`} 
//                                 id={styles.userProfile} 
//                                 style={{ 
//                                     left : index % 2 !== 0 ? '613px' : "" , 
//                                     top : index % 2 !== 0 ? '53px' : ""
//                                     }}
//                                 alt='프로필 이미지'
//                                 />
//                             <div style={{ left : index % 2 !== 0 ? '744px' : "" , top : index % 2 !== 0 ? '70px' : ""}}>{review.userName}</div>
//                             {/* 예약 시간이 DB에서 데이터가 서로 안맞음. 그래서 리뷰 작성 날짜로 변경할지 DB를 바꿀지 고민 중 */}
//                             {/* <div style={{ left : index % 2 !== 0 ? '747px' : "" , top : index % 2 !== 0 ? '111px' : ""}}>{`예약시간 - ${review.reviewDate}`}</div> */}
//                             <div style={{ left : index % 2 !== 0 ? '747px' : "" , top : index % 2 !== 0 ? '111px' : ""}}>{review.reviewDate}</div>
//                             <div style={{ left : index % 2 !== 0 ? '624px' : "" , top : index % 2 !== 0 ? '176px' : ""}}>{review.reviewContent}</div>
//                             <img src={`/store/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} style={{ left : index % 2 !== 0 ? '43px' : "" , top : index % 2 !== 0 ? '38px' : ""}} alt='리뷰 사진'/>
//                         </div>
//                     ))}
//                 </div>
//                 <div 
//                     id={styles.moreReview} 
//                     onClick={() => moreReviewHandler()}
//                 >
//                     {hiddenWord ? "리뷰 더보기 > " : "리뷰 닫기"} 
//                 </div>
//             </div>
//             <CreateReview/>
//         </div>
//     );
// }

// export default Review;
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

    const moreReviewHandler = () => {
        setIsMoreReview(prevState => !prevState);
        setHiddenWord(prevState => !prevState);
    }
    
    return(
        <div className={styles.reviewStyle}>
            <div id={styles.strReview}>리뷰</div>
            <div id={styles.strCountReview}>{`총 ${reviewContent.reviewCount}개의 리뷰가 있습니다.`}</div>
            <div className={styles.reviewArea}>
                <div className={styles.reviewContainer}>
                    {reviews.map((review, index) => (
                        <div 
                            key={index} 
                            className={ index % 2 !== 0 ? styles.transformReview : styles.review} 
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