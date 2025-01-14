import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import styles from '../css/Inquiry.module.css';

function InquiryDetail({ userInfo }) {
    const { inquiryNo } = useParams();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);

    const [inquiry, setInquiry] = useState(null);


    useEffect(() => {
        if (!userInfo) return;

        const currentInquiry = userInfo.find(item => item.inquiryNo === parseInt(inquiryNo));
        if (currentInquiry) {
            setInquiry(currentInquiry);

            if (currentInquiry.answerDate && currentInquiry.status !== 'read') {
                updateInquiryStatus('read');
            }
        }
    }, [userInfo, inquiryNo]);

    const handleShowMore = () => {
        setShowMore(!showMore);
        setShowOverlay(!showOverlay);
    };

    const handleShowMore2 = () => {
        setShowMore2(!showMore2);
        setShowOverlay2(!showOverlay2);
    };

    const updateInquiryStatus = async (status) => {
        try {
            const response = await fetch(`/user/mypage/inquiry/${inquiryNo}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!inquiry) {
        return <div className={styles.error}>해당 문의를 찾을 수 없습니다.</div>;
    }


    return (
        <div className={styles.inquiryDetailContainer}>
            {showOverlay && <div className={styles.overlay} onClick={handleShowMore} />}
            {showOverlay2 && <div className={styles.overlay} onClick={handleShowMore2} />}

            <div className={styles.allTabs}>
                <Link to="/user/mypage/inquiry">
                    <div className={styles.tab1}>문의 내역</div>
                </Link>
                <Link to="/user/mypage/profile">
                    <div className={styles.tab2}>회원 정보수정</div>
                </Link>
                <div className={styles.line1}>|</div>
                <Link to="/user/mypage/reservation">
                    <div className={styles.tab3}>예약리스트</div>
                </Link>
                <div className={styles.line2}>|</div>
                <Link to="/user/mypage/review">
                    <div className={styles.tab4}>작성리뷰</div>
                </Link>
            </div>
            <div className={styles.main}>
                <p className={styles.Title}>문의 제목 : <span className={styles.inquiryTitle}>{inquiry.title}</span></p>
                <p className={styles.Date}>문의 일자 : <span className={styles.inquiryDate}>{inquiry.inquiryDate}</span></p>
                <div className={styles.Text}>
                    <p className={showMore ? styles.inquiryTextExpanded : styles.inquiryText}>
                        {inquiry.text}
                    </p>
                    {inquiry.text.length > 322 && (
                        <div className={styles.button1}
                             onClick={handleShowMore}
                             style={{ zIndex: showMore ? 1000 : 1 }}
                        >
                            {showMore ? '줄이기' : '더보기'}
                        </div>
                    )}
                </div>
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
                                     style={{ zIndex: showMore2 ? 1000 : 1 }}
                                >
                                    {showMore2 ? '줄이기' : '더보기'}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.notAnswer}>
                        <img src="/images/common/logo.png" alt="문의 관리자 로고" className={styles.logo} />
                        <p>문의를 접수하는중 입니다! 관리자의 답변을 기다려 주세요</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default InquiryDetail;
