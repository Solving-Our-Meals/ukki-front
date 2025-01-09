import React, { useState, useEffect } from 'react';
import styles from '../css/Reservation.module.css'
import '../css/reset.css';
import { Link } from 'react-router-dom';

function Reservation () {
    return (
        <div className={styles.mypageReservation}>
            <Link to="/user/mypage/reservation"><div className={styles.tab1}>예약리스트</div></Link>
            <Link to="/user/mypage/review"><div className={styles.tab2}>작성된 리뷰</div></Link>
            <div className={styles.line1}>|</div>
            <Link to="/user/mypage/inquiry"><div className={styles.tab3}>문의 내역</div></Link>
            <div className={styles.line2}>|</div>
            <Link to="/user/mypage/profile"><div className={styles.tab4}>회원 정보수정</div></Link>
        </div>
    );
}

export default Reservation;

