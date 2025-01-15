import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/Inquiry.module.css';
import { InquiryInfoAPI } from '../api/InquiryInfoAPI';

function InquiryInfo() {
    const { inquiryNo } = useParams();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);

    const [inquiry, setInquiry] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const currentInquiry = async () => {
            const currentInquiry = await InquiryInfoAPI(inquiryNo);
            setInquiry(currentInquiry);
        }
        currentInquiry();
    }, [inquiryNo]);

    const handleShowMore = () => {
        setShowMore(!showMore);
        setShowOverlay(!showOverlay);
    };

    const handleShowMore2 = () => {
        setShowMore2(!showMore2);
        setShowOverlay2(!showOverlay2);
    };

    if (!inquiry) {
        return <div className={styles.error}>해당 문의를 찾을 수 없습니다.</div>;
    }


    const handleDeleteInquiry = async () => {
        try {
            const response = await fetch(`/user/mypage/inquiry/${inquiryNo}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.href = '/user/mypage/inquiry';
            } else {
                throw new Error('문의 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <div className={styles.inquiryContainer}>
            {showOverlay && <div className={styles.overlay} onClick={handleShowMore}/>}
            {showOverlay2 && <div className={styles.overlay} onClick={handleShowMore2}/>}

            <div className={styles.inquiryInfoText}>문의상세정보</div>
            <div className={styles.horizon1}></div>
            <button className={styles.answerButton} disabled={inquiry.answerDate !== null}>답변하기</button>
            <button className={styles.delButton} onClick={handleDeleteInquiry}>삭제</button>
        <div className={styles.inquiryInfoContainer}>
                    <p className={styles.Title}>
                        문의 제목 : <span className={styles.inquiryTitle}>{inquiry.inquiryTitle}</span>
                    </p>
                <p className={styles.Date}>문의 일자 : <span className={styles.inquiryDate}>{inquiry.inquiryDate}</span></p>
                <div className={styles.Text}>
                <p className={showMore ? styles.inquiryTextExpanded : styles.inquiryText}>
                            {inquiry.inquiryContent}
                        </p>
                    {inquiry.inquiryContent.length > 322 && (
                        <div className={styles.button1}
                             onClick={handleShowMore}
                             style={{zIndex: showMore ? 1000 : 1}}
                        >
                            {showMore ? '줄이기' : '더보기'}
                        </div>
                    )}
            </div>
            <div className={styles.main2}>
                {inquiry.answerDate ? (
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
                                     style={{zIndex: showMore2 ? 1000 : 1}}
                                >
                                    {showMore2 ? '줄이기' : '더보기'}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.notAnswer}>
                        <img src="/images/common/logo.png" alt="문의 관리자 로고" className={styles.logo}/>
                        <p>문의를 접수하는중 입니다! 관리자의 답변을 기다려 주세요</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

export default InquiryInfo;
