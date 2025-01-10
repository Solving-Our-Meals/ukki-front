import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Reservation from "../pages/Reservation";
import Review from "../pages/Review";
import Inquiry from "../pages/Inquiry"
import styles from "../css/Mypage.module.css";
import Header from '../../../../common/header/components/Header';
import MyProfile from "../component/MyProfile";

function Mypage() {
    return (
        <div className={styles.mypage}>
            <Header />
            <div className={styles.contentList}>
                <Routes>
                    <Route path="/" element={<Navigate to="reservation" />} />
                    <Route path="reservation" element={<Reservation />} />
                    <Route path="review" element={<Review />} />
                    <Route path="Inquiry" element={<Inquiry />} />
                    <Route path="*" element={<Navigate to="reservation" />} />
                </Routes>
            </div>
            <MyProfile />
        </div>
    );
}

export default Mypage;
