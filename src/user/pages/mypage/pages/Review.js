import React, { useState, useEffect } from 'react';
import styles from '../css/Review.module.css';
import '../css/reset.css';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../../../../store/pages/bossNotice/images/searchBtn.png';
import Loading from '../../../../common/inquiry/img/loadingInquiryList.gif';

function Review() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // 삭제용 모달
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState({
        reviewNo : "",
        storeNo : "",
        userNo : "",
    });

    // 삭제 후 상태 표시 모달
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);

    useEffect(() => {
        const savedPage = sessionStorage.getItem('currentReview');
        if (savedPage) {
            setCurrentPage(Number(savedPage));
        }
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async (query = '') => {
        try {
            const response = await fetch(`/user/mypage/review${query}`, {
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
        const query = searchQuery ? `?search=${searchQuery}` : '';
        setLoading(true);
        fetchUserInfo(query);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteClick = (reviewNo, storeNo, userNo) => {
        setSelectedReview({ reviewNo, storeNo, userNo });
        setShowModal(true);
    };

    const deleteReview = async () => {
        const { reviewNo, storeNo, userNo } = selectedReview;

        try {
            const response = await fetch(`/store/${storeNo}/deletereview?reviewNo=${reviewNo}&userNo=${userNo}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ reviewNo, storeNo, userNo }), // body에 추가되는 데이터도 여전히 포함
            });
            console.log(response);

            if (response.ok) {
                setUserInfo(prevState => prevState.filter(review => review.reviewNo !== reviewNo));
                setShowModal(false);
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 2000);
            } else {
                setError('리뷰 삭제에 실패했습니다.');
                setShowModal(false);
                setShowFailModal(true);
                setTimeout(() => setShowFailModal(false), 2000);
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
            setShowModal(false);
        }
    };


    const cancelDelete = () => {
        setShowModal(false);
    };


    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중"/>
            </div>
        )
    }

    if (!userInfo || userInfo.length === 0) {
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
                        <div className={styles.headerItem}>리뷰 작성 날짜</div>
                        <div className={styles.headerItem}>리뷰 내용</div>
                        <div className={styles.headerItem}>별점</div>
                    </div>

                    {/* 리뷰 항목이 없을 경우 */}
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

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem('currentReview', pageNumber);
    }

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

    console.log(userInfo)

    const truncateReview = (reviewText) => {
        if (reviewText.length > 15) {
            return reviewText.slice(0, 15) + ' ···';
        }
        return reviewText;
    };

    const renderStars = (rating) => {
        let stars = '';
        for (let i = 0; i < rating; i++) {
            stars += '⭐';
        }
        return stars;
    };

    const handleReviewClick = (reviewNo) => {
        navigate(`/user/mypage/review/${reviewNo}`)
    };



    const ConfirmModal = ({ reviewNo, onConfirm, onCancel }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>정말 삭제하시겠습니까?</h3>
                    <h3 className={styles.modalSubText}>삭제한 리뷰는 복구가 불가합니다.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton1} onClick={() => onConfirm(reviewNo)}>예</button>
                        <button className={styles.modalButton2} onClick={onCancel}>아니오</button>
                    </div>
                </div>
            </div>
        );
    };

    const SuccessModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText2}>삭제가 완료되었습니다!</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
    };

    const FailModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText2}>삭제에 실패했습니다!</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
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
                {/* 검색창 */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="가게명으로 검색"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <img src={Search} className={styles.searchButton} onClick={handleSearch}/>
                </div>

                {/* 상단 제목 */}
                <div className={styles.headerRow}>
                    <div className={styles.headerItem}>가게명</div>
                    <div className={styles.headerItem}>리뷰 작성 날짜</div>
                    <div className={styles.headerItem}>리뷰 내용</div>
                    <div className={styles.headerItem}>별점</div>
                </div>

                {/* 리뷰 항목 */}
                {currentItems.length > 0 ? (
                    currentItems.map((review, index) => (
                        <div
                            key={index}
                            className={styles.reservationItem}
                            onClick={() => handleReviewClick(review.reviewNo)}
                        >
                            <div className={styles.headerItem}>{review.storeName}</div>
                            <div className={styles.headerItem}>
                                {review.reviewDate}
                            </div>
                            <div className={styles.headerItem}>
                                {truncateReview(review.reviewText)}
                            </div>
                            <div className={styles.headerItem}>
                                {renderStars(review.star)}
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(review.reviewNo, review.storeNo, review.userNo);
                                }}
                            >
                              리뷰 삭제
                            </button>
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

            {/* 삭제 확인 모달 */}
            {showModal && (
                <ConfirmModal
                    reviewNo={selectedReview}
                    onConfirm={deleteReview}
                    onCancel={cancelDelete}
                />
            )}

            {/* 삭제 완료 모달 */}
            {showSuccessModal && (
                <SuccessModal onClose={() => setShowSuccessModal(false)}/>
            )}

            {showFailModal && (
                <FailModal onClose={() => setShowFailModal(false)}/>
            )}


        </div>
    );
}

export default Review;
