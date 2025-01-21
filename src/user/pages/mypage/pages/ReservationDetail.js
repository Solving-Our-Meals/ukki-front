import React, { useState, useEffect } from 'react';
import styles from '../css/ReservationDetail.module.css';
import { useParams, Link } from 'react-router-dom';

function ReservationDetail() {
    const { resNo } = useParams();
    const [reviewDetail, setReviewDetail] = useState(null);
    const [calendarVisible, setCalendarVisible] = useState(false); // 달력 보이기 상태 추가
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

                // 1초 후에 달력 보이게 설정
                setTimeout(() => {
                    setCalendarVisible(true);
                }, 1000);  // 1초 후 달력 표시
            } else {
                setError('리뷰를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!reviewDetail) {
        return <div>해당 리뷰를 찾을 수 없습니다.</div>;
    }

    const reservationDate = new Date(reviewDetail.date);
    const reservationDay = reservationDate.getDate();
    const reservationMonth = reservationDate.getMonth();
    const reservationYear = reservationDate.getFullYear();

    const getReservationStatus = (reservationTime) => {
        const currentTime = new Date();
        const reservationDate = new Date(reservationTime);
        return currentTime < reservationDate ? "예약 중" : "예약 만료";
    };

    const reservationTime = `${reviewDetail.date} ${reviewDetail.time}`;

    const generateCalendarDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];

        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        weekdays.forEach((day, index) => {
            days.push(
                <div key={index} className={styles.calendarWeekDay}>
                    {day}
                </div>
            );
        });

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div
                    key={day}
                    className={`${styles.calendarDay} ${day === reservationDay && month === reservationMonth && year === reservationYear ? styles.today : ''} 
                    ${firstDay + day - 1 === 0 ? styles.sunday : ''} 
                    ${firstDay + day - 1 === 6 ? styles.saturday : ''}`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <>
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

            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    <div className={styles.Title}>예약 정보</div>
                    <div className={styles.reservationUserNameTitle}>
                        예약회원 : <p className={styles.reservationUserName}>{reviewDetail.userName}</p>
                    </div>
                    <div className={styles.store}>
                        <div className={styles.storeNameTitle}>
                            가게이름 : <p className={styles.storeName}>{reviewDetail.storeName}</p>
                        </div>
                        <Link to={`/store/${reviewDetail.storeNo}`} className={styles.storeDetailButton}>
                            <button className={styles.storeDetailBtn}>가게 상세보기</button>
                        </Link>
                    </div>

                    <div className={styles.reservationUserNameTitle}>
                        예약날짜 : <p className={styles.reservationUserName}>{reviewDetail.date}</p>
                    </div>

                    <div className={styles.reservationTime}>
                        예약시간 : <p className={styles.reservationUserName}>{reviewDetail.time}</p>
                    </div>

                    <div className={styles.reservationTime}>
                        예약현황 : <p className={styles.reservationUserName}>{getReservationStatus(reservationTime)} </p>
                    </div>
                </div>
            </div>

            <div
                className={`${styles.calendarContainer} ${calendarVisible ? styles.fadeIn : ''}`}
            >
                <div className={styles.calendarHeader}>
                    <div className={styles.calendarMonth}>{`${reservationYear}년 ${reservationMonth + 1}월`}</div>
                </div>
                <div className={styles.calendarWeekDays}>
                    {generateCalendarDays(reservationYear, reservationMonth)}
                </div>
            </div>
        </>
    );
}

export default ReservationDetail;
