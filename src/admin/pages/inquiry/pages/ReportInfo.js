import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/Inquiry.module.css';
import { ReportInfoAPI } from '../api/ReportInfoAPI';
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";

function ReportInfo() {
    const { reportNo } = useParams();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [inquiry, setInquiry] = useState("");
    const [answer, setAnswer] = useState({
        answerTitle: "",
        answerContent: ""
    });
    const [answerMode, setAnswerMode] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [agreeMessage, setAgreeMessage] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [deleteInquiry, setDeleteInquiry] = useState(false);
    const [answerSuccess, setAnswerSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentInquiry = async () => {
            const currentInquiry = await ReportInfoAPI(reportNo);
            if(currentInquiry.answerDate){
                setAnswer({
                    answerTitle: currentInquiry.answerTitle,
                    answerContent: currentInquiry.answerContent
                });
            }
            setInquiry(currentInquiry);
        }
        currentInquiry();
    }, [reportNo, answerMode]);

    const handleShowMore = () => {
        setShowMore(!showMore);
        setShowOverlay(!showOverlay);
    };

    const handleShowMore2 = () => {
        setShowMore2(!showMore2);
        setShowOverlay2(!showOverlay2);
    };

    const handleAnswer = () => {
        if(answerMode) {
            if(answer.answerTitle === "" || answer.answerTitle === null || answer.answerContent === "" || answer.answerContent === null) {
                setResultMessage("답변 제목과 내용을 입력해주세요.");
                setShowResultModal(true);
                return;
            }else if(answer.answerTitle === inquiry.answerTitle && answer.answerContent === inquiry.answerContent){
                setResultMessage("답변 제목과 내용이 동일합니다.");
                setShowResultModal(true);
                return;
            }else{
                setShowAgreementModal(true);
                setAgreeMessage("답변을 등록하시겠습니까?");
            }
        }else{
            setAnswerMode(true);
        }
    };

    const handleCancel = () => {
        setAnswerMode(false);
    }

    if (!inquiry) {
        return <div className={styles.error}>해당 문의를 찾을 수 없습니다.</div>;
    }

    const handleAnswerInquiry = async () => {
        try {
            const response = await fetch(`/admin/inquiries/info/report/${reportNo}`, {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answer),
            });
            if (response.ok) {
                setAnswerSuccess(true);
                setResultMessage("답변이 등록되었습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            } else {
                setAnswerSuccess(false);
                setResultMessage("답변 등록에 실패했습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeleteConfirm = () => {
        setDeleteInquiry(true);
        setShowAgreementModal(true);
        setAgreeMessage("문의를 삭제하시겠습니까?");
    }

    const handleDeleteInquiry = async () => {
        try {
            const response = await fetch(`/admin/inquiries/info/report/${reportNo}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setResultMessage("문의가 삭제되었습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            } else {
                setResultMessage("문의 삭제에 실패했습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={styles.inquiryContainer}>
            {showOverlay && <div className={styles.overlay} onClick={handleShowMore} />}
            {showOverlay2 && <div className={styles.overlay} onClick={handleShowMore2} />}

            <div className={styles.inquiryInfoText}>문의상세정보</div>
            <div className={styles.horizon1}></div>
            
            <div className={styles.inquiryArea}>
                <p className={styles.Title}>
                    문의 제목 : <span className={styles.inquiryTitle}>{inquiry.reportTitle}</span>
                </p>
                <p className={styles.Date}>문의 일자 : <span className={styles.inquiryDate}>{inquiry.reportDate}</span></p>
                <div className={styles.Text}>
                    <p className={showMore ? styles.inquiryTextExpanded : styles.inquiryText}>
                        {inquiry.reportContent}
                    </p>
                    {inquiry.reportContent.length > 322 && (
                        <div className={styles.button1}
                             onClick={handleShowMore}
                             style={{ zIndex: showMore ? 1000 : 1 }}
                        >
                            {showMore ? '줄이기' : '더보기'}
                        </div>
                    )}
                    <div className={styles.main2}>
                        {answerMode ? (
                            <div className={styles.answer}>
                                <p className={styles.AnswerTitle}>답변 제목 : <input type="text" className={styles.inputAnswerTitle} placeholder="답변 제목을 입력해주세요." value={answer.answerTitle} onChange={(e) => setAnswer({ ...answer, answerTitle: e.target.value })} /></p>
                                <div className={styles.Text}>
                                    <textarea className={styles.inputAnswerContent} placeholder="답변 내용을 입력해주세요." value={answer.answerContent} onChange={(e) => setAnswer({ ...answer, answerContent: e.target.value })} />
                                </div>
                            </div>
                        ) : inquiry.answerDate ? (
                            <div className={styles.answer}>
                                <p className={styles.AnswerTitle}>답변 제목 : <span
                                    className={styles.inquiryTitle}>{inquiry.answerTitle}</span></p>
                                <p className={styles.AnswerDate}>답변 일자 : <span
                                    className={styles.inquiryDate}>{inquiry.answerDate}</span></p>
                                <div className={styles.Text}>
                                    <p className={showMore2 ? styles.inquiryTextExpanded2 : styles.inquiryText2}>
                                        {inquiry.answerContent}
                                    </p>
                                    {inquiry.answerContent.length > 322 && (
                                        <div className={styles.button2}
                                             onClick={handleShowMore2}
                                             style={{ zIndex: showMore2 ? 1000 : 1 }}
                                        >
                                            {showMore2 ? '줄이기' : '더보기'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.answer}>
                                <p className={styles.AnswerTitle}>답변 제목 : <span
                                    className={styles.inquiryTitle}>답변 대기중</span></p>
                                <div className={styles.Text}>
                                    <p className={showMore2 ? styles.inquiryTextExpanded2 : styles.inquiryText2}>
                                        답변 대기중
                                    </p>
                                    {inquiry.answerContent.length > 322 && (
                                        <div className={styles.button2}
                                             onClick={handleShowMore2}
                                             style={{ zIndex: showMore2 ? 1000 : 1 }}
                                        >
                                            {showMore2 ? '줄이기' : '더보기'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {answerMode && <button className={styles.cancelButton} onClick={handleCancel}>취소</button>}
            {!answerMode && <button className={styles.delButton} onClick={handleDeleteConfirm}>삭제</button>}
            <button className={styles.answerButton} onClick={handleAnswer} disabled={inquiry.answerDate !== null} style={answerMode? {left: '1403px', width: '115px'} : {}}>{answerMode ? '확인' : '답변하기'}</button>
            {inquiry.state === "처리완료" && <button className={styles.answerButton} onClick={handleAnswer} style={answerMode? {left: '1403px', width: '115px'} : {}}>{answerMode ? '확인' : '수정'}</button>}
            {showAgreementModal && (
                <AdminAgreementModal
                    message={agreeMessage}
                    onConfirm={() => {
                        if(answerMode) {
                            handleAnswerInquiry();
                        }else if(deleteInquiry){
                            handleDeleteInquiry();
                        }
                        setShowAgreementModal(false);
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <AdminResultModal message={resultMessage} close={()=>{
                    if (deleteInquiry){
                        setShowResultModal(false);
                        navigate("/admin/inquiries/list");
                        setDeleteInquiry(false);
                    }else{
                        setShowResultModal(false);
                    }
                    if(answerSuccess){
                        setAnswerMode(false);
                        navigate(`/admin/inquiries/info/report/${reportNo}`);
                    }else{
                        setShowResultModal(false);
                    }
                }}/>
            )}
        </div>
    );
}

export default ReportInfo;