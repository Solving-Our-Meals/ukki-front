import { useState, useEffect } from 'react';
import styles from '../css/specificReview.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

function SpecificReview({reviewNo, storeNo}){

    const [review, setReview] = useState({});
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [reportedReviewNo, setReportedReviewNo] = useState("");
    const [isReportComplete, setIsReportComplete] = useState(false);

    useEffect(() => {
        if (!reviewNo) {
            console.log('reviewNo가 비어 있습니다.');
            return;  // reviewNo가 없으면 fetch를 보내지 않음
        }
        
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

    const reportHandler = () => {
        setShowReportModal(true);
    }

    const reportCancleHandler = () => {
        setReportTitle("");
        setReportContent("");
        setShowReportModal(false);
    };

    const submitHandler = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const data = { 
            reportTitle: reportTitle, 
            reportContent: reportContent, 
            reviewNo: reviewNo, 
            reportDate: formattedDate // 날짜 추가 
            };

        fetch(`${API_BASE_URL}/boss/mypage/reviewReport?storeNo=${storeNo}`, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        .then((res) => {
            if (res.ok) {
                setReportTitle("");
                setReportContent("");
                setShowReportModal(false);
                setIsReportComplete(true);
            } else {
                console.error("Failed to submit review", res.statusText);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    const completeHandler = () => {
        setIsReportComplete(false);
    }

    return(
        <>
            <div id={styles.totalArea}>
                <div className={styles.reviewContainer}>
                    <img 
                        src={review.userProfile === null ? `${API_BASE_URL}/store/${storeNo}/api/userProfile?userProfileName=PROFILE_BASIC` : `${API_BASE_URL}/store/${storeNo}/api/userProfile?userProfileName=${review.userProfile}`} 
                        id={styles.userProfile} 
                        alt='프로필 이미지'
                    />
                    <div>
                        <span id={styles.useName}>{review.userName}</span>
                        {renderStars(review.reviewScope)}
                    </div>
                    <button 
                        id={styles.reportBtn}
                        onClick={() => reportHandler()}
                    >
                        신고하기
                    </button>
                    <div>{review.reviewDate}</div>
                    <div>{review.reviewContent}</div>
                    <img src={`${API_BASE_URL}/store/${storeNo}/api/reviewImg?reviewImgName=${review.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                </div> 
            </div>
            <div className={styles.overlay} style={{display : showReportModal || isReportComplete ? "" : "none"}}></div>
            <div 
                id={styles.reportModal}
                style={{display : showReportModal ? "" : "none"}}
            >
                <span id={styles.strReport}>신고하기</span>
                <span id={styles.strReportTitle}>신고 제목 : </span>
                <input 
                    type='text' 
                    name='reportTitle'
                    placeholder='제목을 입력하세요.' 
                    value={reportTitle}
                    className={styles.inputTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                />
                <textarea
                    id={styles.inputReportContent}
                    name='reportContent'
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder='신고 내용을 입력하세요.'
                />
                <button type='button' id={styles.reportCancle} onClick={(e) => reportCancleHandler(e)}>취소</button>
                <button 
                    type='submit' 
                    id={styles.reportConfirm} 
                    onClick={() => submitHandler()}
                >
                    확인
                </button>
            </div>
            <div id={styles.completeReportModal} style={{display : isReportComplete ? "" : "none"}}>
                <p id={styles.completedReportMessage}>신고가 접수되었습니다.</p>
                <p id={styles.completedReportNotice}>문의내역에서 확인하실 수 있습니다.</p>
                <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>        
            </div>
        </>
    );
}

export default SpecificReview;