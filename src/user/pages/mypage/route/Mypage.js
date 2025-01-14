import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Reservation from "../pages/Reservation";
import Review from "../pages/Review";
import Inquiry from "../pages/Inquiry"
import styles from "../css/Mypage.module.css";
import Header from '../../../../common/header/components/Header';
import MyProfile from "../component/MyProfile";
import InquiryDetail from "../pages/InquiryDetails";

function Mypage() {

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserInfo = async () => {
        try {
            const response = await fetch('/user/mypage/inquiry', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는 데 실패했습니다.');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className={styles.mypage}>
            <Header />
            <div className={styles.contentList}>
                <Routes>
                    <Route path="/" element={<Navigate to="reservation" />} />
                    <Route path="reservation" element={<Reservation />} />
                    <Route path="review" element={<Review />} />
                    <Route path="inquiry" element={<Inquiry />} />
                    <Route path="/inquiry/:inquiryNo" element={<InquiryDetail userInfo={userInfo} />} />
                    <Route path="*" element={<Navigate to="reservation" />} />
                </Routes>
            </div>
            <MyProfile />
        </div>
    );
}

export default Mypage;
