import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/reset.css';
import styles from '../css/NoticeRegist.module.css';
import AdminAgreementModal from '../../../components/AdminAgreementModal';
import AdminResultModal from '../../../components/AdminResultModal';

function NoticeRegist(){
    const navigate = useNavigate();
    const [notice, setNotice] = useState({
        categoryNo : 0,
        noticeTitle : "",
        noticeContent : "",
        date : ""
    });
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [agreeMessage, setAgreeMessage] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [isRegist, setIsRegist] = useState(false);

    const handleRegistConfirm = () => {
            if (notice.noticeTitle === "" || notice.noticeContent === "" || notice.categoryNo === 0) {
                setResultMessage("내용을 확인해주세요.");
                setShowResultModal(true);
                return;
            } else {
            setShowAgreementModal(true);
            setAgreeMessage("공지사항을 등록하시겠습니까?");
        }
    };

    useEffect(() => {
        const date = new Date().toISOString().split('T')[0];
        setNotice(prevNotice => ({ ...prevNotice, date: date }));
    }, []);



    const handleRegistNotice = async () => {
        try {
            const response = await fetch(`/admin/notices/regist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notice),
            });
            if (response.ok) {
                setIsRegist(true);
                setResultMessage("공지사항이 등록되었습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
                navigate("/admin/notices/list");
            } else {
                setIsRegist(false);
                setResultMessage("공지사항 등록에 실패했습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            }
        } catch (error) {
            console.log(error.message);
            setIsRegist(false);
            setResultMessage("공지사항 등록에 실패했습니다.");
            setShowResultModal(true);
            setShowAgreementModal(false);
        }
    }

    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <div className={styles.noticeInfo}>
                        <p id={styles.strNotice}>공지사항</p>
                    </div>
                </div>
            </div>
            <div className={styles.categoryArea}>
                        <span className={`${styles.category} ${styles.editCategory} ${notice.categoryNo==1? styles.active : ""}`}  style={{backgroundColor: "#FF8AA3"}} onClick={() => setNotice({...notice, categoryNo: 1})}>안내</span>
                        <span className={`${styles.category} ${styles.editCategory} ${notice.categoryNo==2? styles.active : ""}`}  style={{backgroundColor: "#FEDA00"}} onClick={() => setNotice({...notice, categoryNo: 2})}>소개</span>
                        <span className={`${styles.category} ${styles.editCategory} ${notice.categoryNo==3? styles.active : ""}`}  style={{backgroundColor: "#B3E7FF"}} onClick={() => setNotice({...notice, categoryNo: 3})}>가게</span>
            </div>
            <span className={styles.titleText}>제목 : </span> <input className={styles.titleContext} value={notice.noticeTitle} onChange={(e) => setNotice({...notice, noticeTitle: e.target.value})}/>
            <span className={styles.dateText}>작성 날짜 : </span> <span className={styles.dateContext}>{notice.date}</span>
            <textarea className={styles.content} value={notice.noticeContent} onChange={(e) => setNotice({...notice, noticeContent: e.target.value})}/> 
            <button className={styles.registButton} onClick={handleRegistConfirm}>등록</button>
            {showAgreementModal && (
                <AdminAgreementModal
                    message={agreeMessage}
                    onConfirm={() => {
                        handleRegistNotice();
                        setShowAgreementModal(false);
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <AdminResultModal message={resultMessage} close={() => {
                    setShowResultModal(false);
                    if(isRegist) {
                        navigate("/admin/notices/list");
                    }
                }} />
            )}
        </>
    );
}

export default NoticeRegist;
