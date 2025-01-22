import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Reservation from "../pages/Reservation";
import Review from "../pages/Review";
import Inquiry from "../pages/Inquiry"
import styles from "../css/Mypage.module.css";
import Header from '../../../../common/header/components/Header';
import MyProfile from "../component/MyProfile";
import InquiryDetail from "../pages/InquiryDetails";
import ProfileInfo from "../pages/ProfileInfo";
import ReviewDetail from "../pages/ReviewDetail";
import ReservationDetail from "../pages/ReservationDetail";
import Loading from '../../../../common/inquiry/img/loadingInquiryList.gif';

function Mypage() {

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reservationDeleted, setReservationDeleted] = useState(false);
    const [reviewDeleted, setReviewDeleted] = useState(false);

    const getUserInfo = async () => {
        try {
            const response = await fetch('/user/mypage/inquiry', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            if (data && Object.keys(data).length === 0) {
                setUserInfo(null);
            } else {
                setUserInfo(data);
            }
        } catch (error) {
            setError(error.message);
            setUserInfo([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReservationDelete = () => {
        setReservationDeleted((prev) => !prev); // 예약 삭제 상태 변경
    };

    const handleReviewDelete = () => {
        setReviewDeleted(prev => !prev); // 리뷰 삭제 후 상태 변경
    };

    useEffect(() => {
        getUserInfo();
    }, [reservationDeleted, reviewDeleted]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중"/>
            </div>
        )
    }

    return (
        <div className={styles.mypage}>
            <Header />
            <div className={styles.contentList}>
                <Routes>
                    <Route path="/" element={<Navigate to="reservation" />} />
                    <Route
                        path="reservation"
                        element={<Reservation onDelete={handleReservationDelete} />}
                    />
                    <Route path="reservation/:resNo" element={<ReservationDetail />} />
                    <Route
                        path="review"
                        element={<Review onDelete={handleReviewDelete} />}
                    />
                    <Route path="/review/:reviewNo" element={<ReviewDetail />} />
                    <Route path="inquiry" element={<Inquiry />} />
                    <Route path="/inquiry/:inquiryNo" element={<InquiryDetail userInfo={userInfo} />} />
                    <Route path="profile" element={<ProfileInfo />} />
                    <Route path="*" element={<Navigate to="reservation" />} />
                </Routes>
            </div>
            <MyProfile key={reservationDeleted} />
        </div>
    );
}

export default Mypage;
