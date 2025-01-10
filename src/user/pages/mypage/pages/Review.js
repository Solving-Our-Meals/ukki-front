import React, { useState, useEffect } from 'react';
import styles from '../css/Reservation.module.css';
import '../css/reset.css';
import { Link, useNavigate } from 'react-router-dom';

function Reservation() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/user/reservation', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            } else if (response.status === 401) {
                setError('인증이 필요합니다.');
                navigate('/auth/login');
            } else {
                setError('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>로딩창 넣을곳</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>유저 정보를 찾을 수 없습니다.</div>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userInfo.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getReservationStatus = (reservationTime) => {
        const currentTime = new Date();
        const reservationDate = new Date(reservationTime);
        return currentTime < reservationDate ? "예약 중" : "예약 만료";
    };

    return (
        <div className={styles.mypageReservation}>
            <div className={styles.allTabs}>
                <Link to="/user/mypage/review">
                    <div className={styles.tab1}>작성된 리뷰</div>
                </Link>
                <Link to="/user/mypage/reservation">
                    <div className={styles.tab2}>예약리스트</div>
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

            <div className={styles.mypageReservationMain}>
                {/* 상단 제목 */}
                <div className={styles.headerRow}>
                    <div className={styles.headerItem}>가게명</div>
                    <div className={styles.headerItem}>예약 날짜 및 시간</div>
                    <div className={styles.headerItem}>예약 현황</div>
                    <div className={styles.headerItem}>QR 코드</div>
                </div>

                {/* 예약 항목 */}
                {currentItems.length > 0 ? (
                    currentItems.map((reservation, index) => (
                        <div key={index} className={styles.reservationItem}>
                            <div className={styles.headerItem}>{reservation.storeName}</div>
                            <div className={styles.headerItem}>
                                {reservation.date} {reservation.time}
                            </div>
                            <div className={styles.headerItem}>
                                {getReservationStatus(`${reservation.date} ${reservation.time}`)}
                            </div>
                            <div className={styles.headerItem}>{reservation.qr}</div>
                        </div>
                    ))
                ) : (
                    // 비었을 때
                    <div className={styles.reservationItem}>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                    </div>
                )}

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div
                        className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={() => paginate(currentPage - 1)}
                    >
                        ◀
                    </div>
                    <span>{currentPage} / {totalPages}</span>
                    <div
                        className={`${styles.paginationButton} ${currentPage === totalPages || totalPages === 0 ? styles.disabled : ''}`}
                        onClick={() => paginate(currentPage + 1)}
                    >
                        ▶
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
