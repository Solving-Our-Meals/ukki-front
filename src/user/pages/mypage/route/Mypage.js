import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Review from "../pages/Reservation"
// import Inquiry from "../pages/Inquiry"
// import Profile from "../pages/Profile"

function Mypage() {
    return (

    <Routes>
        <Route>
            <Route path="user/mypage/review" element={<Review />} />
            {/*<Route path="user/mypage/inquiry" element={<Inquiry />}/>*/}
            {/*<Route path="user/mypage/profile" element={<Profile />}/>*/}
        </Route>
    </Routes>
    );
}

export default Mypage;