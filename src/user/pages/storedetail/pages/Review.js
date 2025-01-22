import { useState, useEffect, useRef } from 'react';
import styles from '../css/review.module.css';
import { useParams } from 'react-router-dom';
import CreateReview from '../components/CreateReview';
import Footer from '../components/Footer';
import basicReviewImg from '../images/BASIC_REVIEW_IMG.png';

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
    // 선택된 리뷰 번호
    const [selectedReviewNo, setSelectedReviewNo] = useState(null);
    const [selectedUserNo, setSelectedUserNo] = useState(null);
    // Footer를 참고하기 위한 ref
    const footerRef = useRef(null);

    const addNewReview = (newReview) => {
        setReviews(prevReviews => [...prevReviews, newReview]);
        setReviewContent(prevContent => ({
            ...prevContent,
            reviewCount: prevContent.reviewCount + 1, // 리뷰 수 업데이트
        }));
    };
    
    useEffect(() => {
        // Promise.all을 사용하여 두 fetch를 동기화
        Promise.all([
            fetch('/user/info').then(res => res.json()).catch(() => ({ nickname: "" })), // 로그인 안 되어 있으면 기본 값 반환
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
        
        if (option === 'highRating') {
            reviewScope();
        } else if(option === 'lowRating'){
            reviewSecondScope();
        } else {
            reviewLatest();
        }
    };

    const moreReviewHandler = () => {
        setIsMoreReview(prevState => !prevState);
        setHiddenWord(prevState => !prevState);
        adjustFooterPosition(); // Footer 위치 조정 호출
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

    const reviewSecondScope = () => {
        fetch(`/store/${storeNo}/reviewSecondScope`)
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
            // stars.push(<span key={i} className={styles.star}>⭐</span>);
            stars.push(<span key={i} className={styles.star}>&#x2B50;</span>);
        }
        return stars;
    };

    // 리뷰 삭제
    const deleteReview = (reviewNo, userNo) => {
        fetch(`/store/${storeNo}/deletereview?reviewNo=${reviewNo}&userNo=${userNo}`,{
            method : "DELETE",         
        })
        .then((res) => {
            if(res.ok){
                // 삭제 후 상태 없데이트
                setReviews(prevReviews => prevReviews.filter(review => review.reviewNo !== reviewNo));
                setRealDeleteReview(false)
                setIsCompleteDeleteReview(true);
                setCompleteOrFailDeleteMessage("해당 리뷰가 삭제되었습니다.");
            } else {
                setRealDeleteReview(false)
                setIsCompleteDeleteReview(true);
                setCompleteOrFailDeleteMessage("리뷰 삭제를 실패했습니다.");
            }
        })
        .catch(error => console.log(error));
    };

    const completeHandler = () => {
        setIsCompleteDeleteReview(false);
    }

    const fncReflashMethod = () => {
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
    }

    // Footer의 위치를 조정하는 함수
    const adjustFooterPosition = () => {
        if(footerRef.current){
            const reviewArea = document.getElementById(styles.reviewArea);
            if(reviewArea){
                const footerHeight = footerRef.current.offsetHeight;
                const reviewAreaBottom = reviewArea.getBoundingClientRect().bottom;
                const footerTop = reviewAreaBottom + window.scrollY;

                footerRef.current.style.top = `${footerTop}px`;
            } else {
                console.warn("reviewArea가 존재하지 않습니다.")
            }
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트되거나 리뷰가 업데이트 될 때 Footer 위치 조정
        adjustFooterPosition();
        window.addEventListener('resize', adjustFooterPosition); // 창 크기 조정 시 Footer 위치 조정

        return() => {
            window.removeEventListener('resize', adjustFooterPosition) // 이벤트 리스너 정리                
        }
        
    }, [reviews, moreReviewHandler])
    
    return(
        <div className={styles.reviewStyle}>
            <div id={styles.strReview}>리뷰</div>
            <div id={styles.strCountReview}>{`총 ${reviewContent.reviewCount}개의 리뷰가 있습니다.`}</div>
            <select id={styles.reviewSort} value={sortOption} onChange={(e) => handleSort(e)}>
                <option value="latest">최신순</option>
                <option value="highRating">별점 높은 순</option>
                <option value="lowRating">별점 낮은 순</option>
            </select>
            <div className={styles.reviewArea} id={styles.reviewArea}>
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
                                {renderStars(review.reviewScope)}
                            </div>
                            <div>{review.reviewDate}</div>
                            <button 
                                type="button" 
                                style={{display : review.userName === currentUserName ? "" : "none"}}
                                id={styles.deleteReview} 
                                onClick={() => {
                                    setRealDeleteReview(true);
                                    setSelectedReviewNo(review.reviewNo);
                                    setSelectedUserNo(review.userNo);
                                }}
                            >
                                리뷰 삭제
                            </button>
                            <div>{review.reviewContent}</div>
                            <img 
                                src={review.reviewImage === null ? basicReviewImg : `/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} 
                                id={styles.reviewPhoto} 
                                alt='리뷰 사진'
                            />
                        </div>
                    ))}
                </div>
                <div 
                    id={styles.moreReview} 
                    style = {{ 
                        display : reviews.length <= 4 && reviews.length >= 1 ? "none" : "", 
                        cursor :  reviews.length < 1 ? 'default' : "pointer"
                    }}
                    onClick={() => moreReviewHandler()}
                >
                    { reviews.length < 1 ? "리뷰가 없습니다." : hiddenWord ? "리뷰 더보기 > " : "리뷰 닫기"} 
                </div>
            </div>
            {realDeleteReview && (
                <div 
                    id={styles.modalOverlay}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div 
                        id={styles.finalCheck}
                        style={{
                            backgroundColor: '#FFFFFF',
                            padding: '20px',
                            borderRadius: '30px',
                            position: 'relative'
                        }}
                    >
                        <p id={styles.reallyDeleteReview}>리뷰를 삭제하시겠습니까?</p>
                        <p id={styles.notice}>해당 리뷰가 게시물에서 완전히 삭제됩니다.</p>
                        <button type='button' id={styles.cancleDeleteReview} onClick={() => setRealDeleteReview(false)}>취소</button>
                        <button type='submit' id={styles.confirmDeleteReview} onClick={() => deleteReview(selectedReviewNo, selectedUserNo)}>확인</button>
                    </div>
                </div>
            )}

            {isCompleteDeleteReview && (
                <div 
                    id={styles.modalOverlay}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div 
                        id={styles.completeDeleteReview}
                        style={{
                            backgroundColor: '#FFFFFF',
                            padding: '20px',
                            borderRadius: '30px',
                            position: 'relative'
                        }}
                    >
                        <p id={styles.completedDeletteMessage}>{completeOrFailDeleteMessage}</p>
                        <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>
                    </div>
                </div>
            )}
            <CreateReview addNewReview={addNewReview} reflashMethod={fncReflashMethod}/>
            <Footer ref={footerRef}/>
        </div>
    );
}

export default Review;