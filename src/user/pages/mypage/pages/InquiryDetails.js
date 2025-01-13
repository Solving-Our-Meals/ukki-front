import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import styles from '../css/Inquiry.module.css';

function InquiryDetail({ userInfo }) {
    const { inquiryNo } = useParams();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);


    if (!userInfo) {
        return <div className={styles.loading}>정보를 불러오는 중...</div>;
    }

    const inquiry = userInfo.find(item => item.inquiryNo === parseInt(inquiryNo));

    if (!inquiry) {
        return <div className={styles.error}>해당 문의를 찾을 수 없습니다.</div>;
    }

    const handleShowMore = () => {
        setShowMore(!showMore);
    }
    const handleShowMore2 = () => {
        setShowMore2(!showMore2);
    }

    return (
        <div className={styles.inquiryDetailContainer}>
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
                <p className={styles.Text}>
                    <p className={showMore ? styles.inquiryTextExpanded : styles.inquiryText}>
                        {inquiry.text}
                    </p>
                    {inquiry.text.length > 100 && (
                        <div className={styles.button1} onClick={handleShowMore}>
                            {showMore ? '줄이기' : '더보기'}
                        </div>
                    )}
                </p>
            </div>
            <div className={styles.main2}>
                {inquiry.inquiryDate ? (
                    <div className={styles.answer}>
                        <p className={styles.AnswerTitle}>답변 제목 : <span
                            className={styles.inquiryTitle}>{inquiry.answerTitle}</span></p>
                        <p className={styles.AnswerDate}>답변 일자 : <span
                            className={styles.inquiryDate}>{inquiry.inquiryDate}</span></p>
                        <p className={styles.Text}>
                            <p className={showMore2 ? styles.inquiryTextExpanded2 : styles.inquiryText2}>
                                {inquiry.answerContent}
                            </p>
                            {inquiry.answerContent.length > 100 && (
                                <div className={styles.button2} onClick={handleShowMore2}>
                                    {showMore2 ? '줄이기' : '더보기'}
                                </div>
                            )}
                        </p>
                    </div>
                ) : (
                    <p className={styles.inquiryItem}>
                        <strong>답변:</strong> 답변이 아직 제공되지 않았습니다.
                    </p>
                )}
            </div>

        </div>
    );
}

export default InquiryDetail;
