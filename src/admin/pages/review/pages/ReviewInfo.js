import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReviewInfoAPI } from "../api/ReviewInfoAPI";
import '../css/reset.css'
import styles from '../css/ReviewInfo.module.css'
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";
import { API_BASE_URL } from '../../../../config/api.config';


function ReviewInfo(){

    const {reviewNo} = useParams();
    const [isInfo, setIsInfo] = useState(false);
    const [reviewInfo, setReviewInfo] = useState({});
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [deleteReview, setDeleteReview] = useState(false);
    const navigate = useNavigate();
    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            // stars.push(<span key={i} className={styles.star}>⭐</span>);
            stars.push(<span key={i} className={styles.star}>&#x2B50;</span>);
        }
        return stars;
    };

    const fetchInfo = useCallback(async (no) => {
        try{    
            const reviewInfo = await ReviewInfoAPI(no);
            if (reviewInfo){
                setIsInfo(true)
                setReviewInfo(reviewInfo)
            }else{
                setIsInfo(false)
            }
            }catch(error){
                console.log("오류발생", error)
            }
    },[reviewNo, showResultModal])

    useEffect(()=>{
        fetchInfo(reviewNo)
    },[reviewNo, showResultModal])

    function handleDeleteReview() {
        setAgreeMessage("해당 리뷰를 삭제하시겠습니까?")
        setShowAgreementModal(true);
        setDeleteReview(true);
    }

    function resultMessageHandler(message){
        setResultMessage(message);
    }


    function deleteConfirm(){
        fetch(`${API_BASE_URL}/admin/reviews/info/${reviewNo}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                reviewImg: reviewInfo.reviewImage
            })
        }).then((res) => {
            return res.json();
        }).then((data)=>{
                setShowAgreementModal(false)
                resultMessageHandler("삭제에 성공했습니다.");
                setShowResultModal(true);
                setDeleteReview(true);
            
        }).catch((e)=>{
            console.log(e)
            setShowAgreementModal(false)
            setShowResultModal(true);
            setDeleteReview(false);
            resultMessageHandler("리뷰 정보 삭제 중 오류가 발생했습니다.");
        });
    }
    
    return(
    <>
    {isInfo?
        <>
        <div id={styles.reviewInfoText}>리뷰 상세정보</div>
        <div className={styles.horizon1}></div>
        <div id={styles.reviewInfoId}><p>회원 : </p> {reviewInfo.userId? reviewInfo.userId : "삭제된 회원"} {reviewInfo.userId && <button className={styles.toBtn} onClick={()=>{navigate(`/admin/users/info/${reviewInfo.userNo}`)}}>회원 정보</button>}</div>
        <div id={styles.reviewInfoStoreName}><p>가게이름 : </p> {reviewInfo.storeName? reviewInfo.storeName : "삭제된 가게"} {reviewInfo.storeName && <button className={styles.toBtn} onClick={()=>{navigate(`/admin/stores/info/${reviewInfo.storeNo}`)}}>가게 정보</button>}</div>
        <div id={styles.reviewInfoReport}>신고횟수 : {reviewInfo.reportCount}</div>
        <button id={styles.reviewInfoDeleteBtn} onClick={handleDeleteReview}>삭제</button>

        <div className={styles.reviewArea}>
                        <div className={styles.review} >
                            <img 
                                src={reviewInfo.userProfile === null ? `/store/${reviewInfo.storeNo}/api/userProfile?userProfileName=PROFILE_BASIC` : `/store/${reviewInfo.storeNo}/api/userProfile?userProfileName=${reviewInfo.userProfile}`} 
                                id={styles.userProfile} 
                                alt='프로필 이미지'
                                />
                            <div className={styles.reviewInfoScope}>
                                <span>{reviewInfo.userName}</span>
                                <span className={styles.reviewInfoScopeStars}>{renderStars(reviewInfo.reviewScope)}</span>
                            </div>
                            <div className={styles.reviewInfoDate}>{reviewInfo.reviewDate}</div>
                            <div className={styles.reviewInfoContent}>{reviewInfo.reviewContent}</div>
                            <img src={`/store/${reviewInfo.storeNo}/api/reviewImg?reviewImgName=${reviewInfo.reviewImage}`} id={styles.reviewPhoto} alt='리뷰 사진'/>
                        </div>
        </div>
        </>: 
        <div>해당 리뷰가 존재하지 않습니다.</div>}
        {showAgreementModal && (
                <AdminAgreementModal
                    message={agreeMessage}
                    onConfirm={() => {
                            deleteConfirm();
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <AdminResultModal message={resultMessage} close={()=>{
                    if (deleteReview){
                        setShowResultModal(false);
                        navigate("/admin/reviews/list");
                        setDeleteReview(false);
                    }else{
                        setShowResultModal(false);
                    }
                }}/>
            )}
    </>
    )   

}

export default ReviewInfo;