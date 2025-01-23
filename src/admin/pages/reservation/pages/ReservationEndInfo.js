import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/reset.css'
import styles from '../css/ReservationInfo.module.css'
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";
import { ReservationEndInfoAPI } from "../api/ReservationEndInfoAPI";

function ReservationEndInfo(){


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
            const resInfo = await ReservationEndInfoAPI(no);
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

    function img(fileUrl) {
        // 방법 1: export=view 파라미터 추가
        return `https://drive.google.com/uc?export=view&id=${fileUrl}`;
        
        // 방법 2: thumbnail 형식 사용
        // return `https://drive.google.com/thumbnail?id=${fileUrl}`;
        
        // 방법 3: 직접 다운로드 링크 사용
        // return `https://drive.google.com/file/d/${fileUrl}/preview`;
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
        {/* <div id={styles.reservationInfoTime}><p>예약시간 : </p> {resInfo.resTime}</div> */}
        <div id={styles.reservationInfoStatus}><p>예약상태 : </p> {resInfo.qrConfirm? "예약확인" : "예약대기중"}</div>
        <div id={styles.qrInfo}> 
            <div className={styles.qrInfoText}>QR 이미지</div> 
            <img 
                src={img("19_KUwY1hGTQUWeIqrJeL_X7iIYC7-UXo")} 
                alt="QR 코드"
                style={{ width: '200px', height: 'auto' }}
                crossOrigin="anonymous"  // CORS 이슈 해결을 위해 추가
                onError={(e) => {
                    console.error('이미지 로딩 실패');
                    // 실패 시 다른 URL 형식 시도
                    if (e.target.src.includes('uc?')) {
                        e.target.src = `https://drive.google.com/thumbnail?id=19_KUwY1hGTQUWeIqrJeL_X7iIYC7-UXo`;
                    }
                }}
            />
            {resInfo.reservationCount}
        </div>
        {/* <div id={styles.statusImage}><div className={`${styles.statusImageText} ${resInfo.qr=="expired"? '' : styles.statusImageTextWait}`}>예약대기중</div><div className={`${styles.statusImageText}`}>예약확인</div><div className={`${styles.statusImageText}`}>노쇼</div></div> */}
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

export default ReservationEndInfo;