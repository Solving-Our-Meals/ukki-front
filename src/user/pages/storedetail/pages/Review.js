import { useState, useEffect } from 'react';
import styles from '../css/review.module.css';
import { useParams } from 'react-router-dom';
import CreateReview from '../components/CreateReview';

function Review(){

    const { storeNo } = useParams();

    const [reviews, setReviews] = useState([]);
    const [reviewContent, setReviewContent] = useState({
        storeNo : "",
        reviewCount : 0,
        reviewList : []
    });
    const [isMoreReview, setIsMoreReview] = useState(false);
    const [hiddenWord, setHiddenWord] = useState(true);
    const [sortOption, setSortOption] = useState('latest');
    const [currentUserName, setCurrentUserName] = useState("");
    const [realDeleteReview, setRealDeleteReview] = useState(false);
    const [isCompleteDeleteReview, setIsCompleteDeleteReview] = useState(false);
    const [completeOrFailDeleteMessage, setCompleteOrFailDeleteMessage] = useState("");


    useEffect(() => {
        // Promise.all을 사용하여 두 fetch를 동기화
        Promise.all([
            fetch('/user/info').then(res => res.json()),
            fetch(`/store/${storeNo}/review`).then(res => res.json())
        ])
        .then(([userData, reviewData]) => {
            console.log('현재 유저!!!!!:', userData.nickname);  // 현재 유저 이름 확인
            console.log('리뷰 데이터:', reviewData);      // 리뷰 데이터 확인
            
            setCurrentUserName(userData.nickname);
            setReviewContent(reviewData);
            setReviews(reviewData.reviewList);
        })
        .catch(error => console.log(error));
    }, []);

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
        fetch(`/store/${storeNo}/review`)
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
        fetch(`/store/${storeNo}/reviewscope`)
        .then(res => res.json())
        .then(data => {
            console.log('리뷰 정보 : ', data);
            setReviewContent(data);
            const reviewList = data.reviewList;
            setReviews(reviewList);
        })
        .catch(error => console.log(error));
    }

    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            stars.push(<span key={i} className={styles.star}>⭐</span>);
        }
        return stars;
    };

    // 리뷰 삭제
    const deleteReview = (reviewNo) => {
        //    ---------------
        fetch(`/store/${storeNo}/deletereview?reviewNo=${reviewNo}`,{
            method : "DELETE",         
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                setIsCompleteDeleteReview(true);
                setCompleteOrFailDeleteMessage("해당 리뷰가 삭제되었습니다.");
            } else {
                setIsCompleteDeleteReview(true);
                setCompleteOrFailDeleteMessage("리뷰 삭제를 실패했습니다.");
            }
        })
        .catch(error => console.log(error));
    };

    const completeHandler = () => {
        setIsCompleteDeleteReview(false);
        window.location.reload();
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
                            className={styles.review} 
                            style={{ 
                                display : isMoreReview || index <= 2 ? "" : "none" }}
                        >
                            <img 
                                src={review.userProfile === null ? `/store/${storeNo}/api/userProfile?userProfileName=PROFILE_BASIC` : `/store/${storeNo}/api/userProfile?userProfileName=${review.userProfile}`} 
                                id={styles.userProfile} 
                                alt='프로필 이미지'
                                />
                            <div>
                                <span>{review.userName}</span>
                                {/* 
                                    Array(review.reviewScope) : review.reviewScope의 길이만큼의 배열을 생성한다.
                                    .fill() : 배열을 비어있는 값으로 채운다.
                                    .map((_, i) => ...) : 첫 번째 매개변수 _는 요소 값(여기서는 사용하지 않음)을 나타내며, 두 번째 매개변수 i는 인덱스를 나타냄.

                                */}
                                {/* {Array(review.reviewScope).fill().map((_, i) => (
                                    <img key={i} src={starFilled} alt='별점'/>
                                ))} */}
                                {renderStars(review.reviewScope)}
                            </div>
                            <div>{review.reviewDate}</div>
                            <button 
                                type="button" 
                                style={{display : review.userName === currentUserName ? "" : "none"}}
                                id={styles.deleteReview} 
                                onClick={() => setRealDeleteReview(true)}
                            >
                                리뷰 삭제
                            </button>
                            <div>{review.reviewContent}</div>
                            <img src={`/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                            {/* -------------------------------------------------------- */}
                            <div id={styles.finalCheck} style={{display : realDeleteReview ? "" : "none"}}>
                                <p id={styles.reallyDeleteReview}>리뷰를 삭제하시겠습니까?</p>
                                <p id={styles.notice}>해당 리뷰가 게시물에서 완전히 삭제됩니다.</p>
                                <button type='button' id={styles.cancleDeleteReview} onClick={() => setRealDeleteReview(false)}>취소</button>
                                <button type='submit' id={styles.confirmDeleteReview} onClick={() => deleteReview(review.reviewNo)}>확인</button>
                            </div>
                            <div id={styles.completeDeleteReview} style={{display : isCompleteDeleteReview ? "" : "none"}}>
                                <p id={styles.completedDeletteMessage}>{completeOrFailDeleteMessage}</p>
                                <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>        
                            </div>
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