import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReservationTodayInfoAPI } from "../api/ReservationTodayInfoAPI";
import '../css/reset.css'
import styles from '../css/ReservationInfo.module.css'
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";
import { API_BASE_URL } from "../../../../config/api.config";
import LodingPage from "../../../components/LoadingPage";
function ReservationTodayInfo(){

    const {reservationNo} = useParams();
    const [isInfo, setIsInfo] = useState(false);
    const [resInfo, setResInfo] = useState({});
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [deleteRes, setDeleteRes] = useState(false);
    const [qrImage, setQrImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchInfo = useCallback(async (no) => {
        try{
            const resInfo = await ReservationTodayInfoAPI(no);
            if (resInfo){
                setIsInfo(true)
                setResInfo(resInfo)
                fetchQrImage(resInfo.qr)
            }else{
                setIsInfo(false)
            }
            }catch(error){
                console.log("오류발생", error)
            }
        })

    const fetchQrImage = useCallback(async (no) => {
        const qrUrl = `${API_BASE_URL}/image?fileId=${no}`
        setQrImage(qrUrl);
    }, [])

    useEffect(()=>{
        fetchInfo(reservationNo)
        setIsLoading(false);
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
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    // 캘린더 날짜 생성
    const generateCalendarDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜
        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 번째 날의 요일
        const days = [];
        console.log(resInfo.resDate.split('-')[2])

        // 빈 공간 추가 (첫 번째 날 이전)
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        // 날짜 추가
        for (let day = 1; day <= daysInMonth; day++) {
            console.log(day)
            console.log(resInfo.resDate.split('-')[2])
            days.push(
                <div key={day} className={`${styles.calendarDay} ${day === parseInt(resInfo.resDate.split('-')[2]) ? styles.today : ''}`}>
                    {day}
                </div>
            );
        }

        return days;
    };

    if (isLoading) {
        return <LodingPage />;
    }

    return(
    <>
    <div className={`${styles.reservationInfo} ${isLoading || showAgreementModal || showResultModal ? styles.background : ''}`}>
    {isInfo?
        <>
        <div id={styles.reservationInfoText}>예약 상세정보</div>
        <div className={styles.horizon1}></div>
        <div id={styles.reservationInfoContentText}>예약정보</div>
        <div id={styles.reservationInfoId}><p>예약회원 : </p></div><div className={`${styles.userId} ${resInfo.userId && resInfo.userId.length > 9 ? styles.longUserName : ''}`}> {resInfo.userId? resInfo.userId : "삭제된 회원"}</div> {resInfo.userId && <button id={styles.toUserInfo} onClick={()=>{navigate(`admin/users/info/${resInfo.userNo}`)}}>회원 정보</button>}
        <div id={styles.reservationInfoStoreName}><p>가게이름 : </p></div><div className={`${styles.storeName} ${resInfo.storeName && resInfo.storeName.length > 9 ? styles.longUserName : ''}`}>{resInfo.storeName? resInfo.storeName : "삭제된 가게"}</div> {resInfo.storeName && <button id={styles.toStoreInfo} onClick={()=>{navigate(`/admin/stores/info/${resInfo.storeNo}`)}}>가게 정보</button>}
        <button id={styles.reservationInfoDeleteBtn} onClick={handleDeleteRes}>삭제</button>
        <div id={styles.reservationInfoDate}><p>예약시간 : </p> {resInfo.resTime}</div>
        <div id={styles.reservationInfoStatus}><p>예약상태 : </p> {resInfo.qrConfirm? "예약확인" : "예약대기중"}</div>
        <div id={styles.qrInfo}> <div className={styles.qrInfoText}>QR 이미지</div> {qrImage && <img src={`${API_BASE_URL}/image?fileId=${resInfo.qr}`} alt="QR 이미지" />} {resInfo.reservationCount}</div>
        <div id={styles.statusWait} className={`${styles.statusImageText} ${resInfo.qr=="expired"? '' : styles.statusImageTextWait}`}>예약대기중</div>
        <div id={styles.statusConfirm} className={`${styles.statusImageText}`}>예약확인</div>
        <div id={styles.statusNoShow} className={`${styles.statusImageText}`}>노쇼</div>
        <div id={styles.statusLink}><div></div></div>
        <div id={styles.calendar}>
            <div id={styles.calendarHeader}>{resInfo.resDate.split('-')[0]}년 {resInfo.resDate.split('-')[1]}월</div>
            <div id={styles.calendarBody}>
                    <div className={styles.calendarWeekText}>
                        <div>일</div>
                        <div>월</div>
                        <div>화</div>
                        <div>수</div>
                        <div>목</div>
                        <div>금</div>
                        <div>토</div>
                    </div>
                    <div className={styles.calendarDays}>
                        {generateCalendarDays(
                            parseInt(resInfo.resDate.split('-')[0]), // 년도
                            parseInt(resInfo.resDate.split('-')[1]) - 1 // 월 (0부터 시작)
                        )}
                    </div>
            </div>
            </div>
        </> : 
        <div>해당 예약이 존재하지 않습니다.</div>}
        </div>
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