import React, { useState, useEffect } from 'react';
import styles from '../css/ReservationDetail.module.css';
import '../css/reset.css';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ReservationDetail() {
    const { resNo } = useParams();  // URL에서 resNo를 가져옵니다.
    const [reviewDetail, setReviewDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservationDetail();
    }, [resNo]);

    const fetchReservationDetail = async () => {
        try {
            const response = await fetch(`/user/mypage/reservation/${resNo}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setReviewDetail(data);
            } else {
                setError('리뷰를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reviewDetail) {
        return <div>해당 리뷰를 찾을 수 없습니다.</div>;
    }

    const getReservationStatus = (reservationTime) => {
        const currentTime = new Date();
        const reservationDate = new Date(reservationTime);
        return currentTime < reservationDate ? "예약 중" : "예약 만료";
    };

    const reservationTime = `${reviewDetail.date} ${reviewDetail.time}`;

    console.log(reviewDetail)

    return (
        <>
            {/* 탭 영역 */}
            <div className={styles.allTabs}>
                <Link to="/user/mypage/reservation">
                    <div className={styles.tab1}>예약리스트</div>
                </Link>
                <Link to="/user/mypage/review">
                    <div className={styles.tab2}>작성된 리뷰</div>
                </Link>
                <div className={styles.line1}>|</div>
                <Link to="/user/mypage/inquiry">
                    <div className={styles.tab3}>문의 내역</div>
                </Link>
                <div className={styles.line2}>|</div>
                <Link to="/user/mypage/profile">
                    <div className={styles.tab4}>회원 정보수정</div>
                </Link>
            </div>

            {/* QR 이미지 추가 */}
            <div className={styles.qrInfo}>
                <div className={styles.qrInfoText}>QR 이미지</div>
                <img className={styles.qrImage} src={`/${reviewDetail.qr}/api/qrImage`} alt="QR 코드" />
            </div>

            {/* 리뷰 상세 정보 */}
            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    <div className={styles.Title}>예약 정보</div>
                    <div className={styles.reservationUserNameTitle}>예약회원 : <p
                        className={styles.reservationUserName}>{reviewDetail.userName}</p></div>
                    <div className={styles.store}>
                        <div className={styles.storeNameTitle}>가게이름 : <p
                            className={styles.storeName}>{reviewDetail.storeName}</p></div>
                        <Link to={`/store/${reviewDetail.storeNo}`} className={styles.storeDetailButton}>
                            <button className={styles.storeDetailBtn}><p className={styles.pT}>가게 상세보기</p></button>
                        </Link>
                    </div>

                    <div className={styles.reservationUserNameTitle}>예약날짜 : <p
                        className={styles.reservationUserName}>{reviewDetail.date}</p></div>

                    <div className={styles.reservationTime}>예약시간 : <p
                        className={styles.reservationUserName}>{reviewDetail.time}</p></div>

                    <div className={styles.reservationTime}>예약현황 : <p
                        className={styles.reservationUserName}>{getReservationStatus(reservationTime)} </p></div>


                </div>
            </div>
        </>
    );
}

export default ReservationDetail;
