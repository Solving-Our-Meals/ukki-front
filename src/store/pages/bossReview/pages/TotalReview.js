import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from '../css/totalReview.module.css';
import SpecificReview from '../components/SpecificReview';
import { API_BASE_URL } from '../../../../config/api.config';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';

function TotalReview(){

    const {storeNo} = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [recentReview, setRecentReview] = useState({});
    const [totalReviewInfo, setTotalReviewInfo] = useState({});
    const [reviewList, setReviewList] = useState([]);
    const [selectedReviewNo, setSelectedReviewNo] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;

    useEffect(() => {
        // storeNo가 정의되어 있을 때만 fetch 요청을 보냄
        if (storeNo !== undefined && storeNo !== null) {
            Promise.all([
                fetch(`${API_BASE_URL}/boss/mypage/recentReview?storeNo=${storeNo}`,{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).then(res => res.json()),
                fetch(`${API_BASE_URL}/boss/mypage/reviewList?storeNo=${storeNo}`,{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).then(res => res.json())
            ])
            .then(([recentReviewData, reviewListData]) => {
                setRecentReview(recentReviewData);
                setTotalReviewInfo(reviewListData);
                setReviewList(reviewListData.reviewList);
                setIsLoading(false);
            })
            .catch(error => {
                console.log('Error:', error);
                setIsLoading(false);
            });
        }
    }, [storeNo]); // storeNo가 바뀔 때마다 다시 실행
    
    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }

    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            stars.push(<span 
                            key={i} 
                            id={styles.reviewScope}
                       >
                        &#x2B50;
                       </span>);
        }
        return stars;
    };

    // 페이지 변경 시 리뷰를 잘라서 보여줌
    const currentReviews = reviewList.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

    const handlePrevClick = () => {
        if (currentPage > 0) {
            // setCurrentPage(currentPage - 1);
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    
    const handleNextClick = () => {
        if ((currentPage + 1) * reviewsPerPage < reviewList.length) {
            // setCurrentPage(currentPage + 1);
            setCurrentPage(prevPage => prevPage + 1);
        }
    };    

    const showSpecificReview = (reviewNo) => {
        setSelectedReviewNo(reviewNo)
    }
    
    return (
        <>
            <div id={styles.totalArea}>
                <div 
                    id={styles.recentReview}
                    onClick={() => showSpecificReview(recentReview.reviewNo)}
                    style={{cursor : 'pointer'}}
                >
                    <span id={styles.strRecentReview}>최근 리뷰</span>
                    {renderStars(recentReview.reviewScope)}
                    <span id={styles.recentReviewContent} onClick={() => showSpecificReview(recentReview.revieNo)}>{recentReview.reviewContent}</span>
                </div>
                <span id={styles.reviewCount}>총 {totalReviewInfo.reviewCount}개의 리뷰가 있습니다.</span>
                <button 
                    id={styles.prevBtn} 
                    onClick={handlePrevClick}
                    style={{ display : currentPage === 0 ? "none" : ""}}
                >
                    〈
                </button>
                <div id={styles.reviewContainer}>
                    {currentReviews.map((review, index) => (
                        <div
                            key={index}
                            className={styles.review}
                            onClick={() => {showSpecificReview(review.reviewNo)}}
                        >
                            <span id={styles.userName}>{review.userName}</span>
                            <div id={styles.stars}>
                                {renderStars(review.reviewScope)}
                            </div>
                            <span id={styles.reviewContent}>{review.reviewContent}</span>
                        </div>
                    ))}
                </div>
                <button 
                    id={styles.nextBtn} 
                    onClick={handleNextClick}
                    style={{ display: ((currentPage + 1) * reviewsPerPage < reviewList.length) ? "" : "none" }}
                >
                    〉
                </button>
            </div>
            <hr
                style={{ 
                    position : 'absolute',
                    width : '1600px',
                    left : '260px',
                    top : '475px',
                    border : '2px dashed #D9D9D9'
                }}
            />
            {selectedReviewNo ? (
                <SpecificReview reviewNo={selectedReviewNo} storeNo={storeNo} />
            ) : (
                <span id={styles.strNoSelectedReview}>선택된 리뷰가 없습니다.</span> // selectedReviewNo가 없으면 메시지 표시
            )}
        </>
    );
}

export default TotalReview;