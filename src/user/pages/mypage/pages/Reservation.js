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
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async (query = '') => {
        try {
            const response = await fetch(`/user/mypage/reservation${query}`, {
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

    const handleSearch = () => {
        const query = searchQuery ? `?search=${searchQuery}` : ''; // 검색어가 있으면 쿼리 추가
        setLoading(true);
        fetchUserInfo(query);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
            </div>
        )
    }

    if (!userInfo || userInfo.length === 0) {
        return (
            <div className={styles.mypageReservation}>
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

                <div className={styles.mypageReservationMain}>
                    {/* 상단 제목 */}
                    <div className={styles.headerRow}>
                        <div className={styles.headerItem}>가게명</div>
                        <div className={styles.headerItem}>예약 날짜 및 시간</div>
                        <div className={styles.headerItem}>예약 현황</div>
                        <div className={styles.headerItem}>QR 코드</div>
                    </div>

                    {/* 예약 항목이 없을 경우 */}
                    <div className={styles.reservationItem}>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                        <div className={styles.headerItem}>-</div>
                    </div>

                </div>
            </div>
        );
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

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const currentRangeStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const currentRangeEnd = Math.min(currentRangeStart + 4, totalPages);

    const pageNumbersToDisplay = pageNumbers.slice(currentRangeStart - 1, currentRangeEnd);

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleReviewClick = (resNo) => {
        navigate(`/user/mypage/reservation/${resNo}`)
    };
    console.log(userInfo)

    return (
        <div className={styles.mypageReservation}>
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

            <div className={styles.mypageReservationMain}>
                {/* 검색창 */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="가게명으로 검색"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>검색</button>
                </div>

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
                        <div key={index}
                             className={styles.reservationItem}
                             onClick={() => handleReviewClick(reservation.resNo)}
                        >
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
                        className={`${styles.paginationButton} ${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={handlePrevClick}
                    >
                        ◀
                    </div>

                    {pageNumbersToDisplay.map(number => (
                        <div
                            key={number}
                            className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
                            onClick={() => paginate(number)}
                        >
                            {number}
                        </div>
                    ))}

                    <div
                        className={`${styles.paginationButton} ${styles.arrow} ${currentPage === totalPages || totalPages === 0 ? styles.disabled : ''}`}
                        onClick={handleNextClick}
                    >
                        ▶
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Reservation;
