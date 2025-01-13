import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReservationTodayInfoAPI } from "../api/ReservationTodayInfoAPI";
import '../css/reset.css'
import styles from '../css/ReservationInfo.module.css'
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";


function ReservationTodayInfo(){

    const {reservationNo} = useParams();
    const [isInfo, setIsInfo] = useState(false);
    const [resInfo, setResInfo] = useState({});
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [deleteRes, setDeleteRes] = useState(false);
    const navigate = useNavigate();

    const fetchInfo = useCallback(async (no) => {
        try{
            const resInfo = await ReservationTodayInfoAPI(no);
            if (resInfo){
                setIsInfo(true)
                setResInfo(resInfo)
            }else{
                setIsInfo(false)
            }
            }catch(error){
                console.log("오류발생", error)
            }
        })

    useEffect(()=>{
        fetchInfo(reservationNo)
    },[reservationNo, showResultModal])

    function handleDeleteRes() {
        setAgreeMessage("해당 예약을 삭제하시겠습니까?")
        setShowAgreementModal(true);
        setDeleteRes(true);
    }

    function resultMessageHandler(message){
        setResultMessage(message);
    }


    function deleteConfirm(){
        fetch(`/admin/reservations/info/today/${reservationNo}`, {
            method: 'DELETE',
        }).then((res) => {
            return res.json();
        }).then((data)=>{
                setShowAgreementModal(false)
                resultMessageHandler("삭제에 성공했습니다.");
                setShowResultModal(true);
                setDeleteRes(true);
            
        }).catch((e)=>{
            console.log(e)
            setShowAgreementModal(false)
            setShowResultModal(true);
            setDeleteRes(false);
            resultMessageHandler("예약 정보 삭제 중 오류가 발생했습니다.");
        });
    }
    
    return(
    <>
    {isInfo?
        <>
        <div id={styles.reservationInfoText}>예약 상세정보</div>
        <div className={styles.horizon1}></div>
        <div id={styles.reservationInfoContentText}>예약정보</div>
        <div id={styles.reservationInfoId}><p>예약회원 : </p> {resInfo.userId? resInfo.userId : "삭제된 회원"} {resInfo.userId && <button id={styles.toUserInfo} onClick={()=>{navigate(`admin/users/info/${resInfo.userNo}`)}}>회원 정보</button>}</div>
        <div id={styles.reservationInfoStoreName}><p>가게이름 : </p> {resInfo.storeName? resInfo.storeName : "삭제된 가게"} {resInfo.storeName && <button id={styles.toStoreInfo} onClick={()=>{navigate(`/admin/stores/info/${resInfo.storeNo}`)}}>가게 정보</button>}</div>
        <button id={styles.reservationInfoDeleteBtn} onClick={handleDeleteRes}>삭제</button>
        <div id={styles.reservationInfoDate}><p>예약일 : </p> {resInfo.resDate}</div>
        <div id={styles.reservationInfoTime}><p>예약시간 : </p> {resInfo.resTime}</div>
        <div id={styles.reservationInfoStatus}><p>예약상태 : </p> {resInfo.qrConfirm? "예약확인" : "노쇼"}</div>
        <div id={styles.qrInfo}><p> qr이미지 넣을까 고민중 </p> {resInfo.reservationCount}</div>
        </> : 
        <div>해당 예약이 존재하지 않습니다.</div>}
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
                    if (deleteRes){
                        setShowResultModal(false);
                        navigate("/admin/reservations/list");
                        setDeleteRes(false);
                    }else{
                        setShowResultModal(false);
                    }
                }}/>
            )}
    </>
    )   

}

export default ReservationTodayInfo;