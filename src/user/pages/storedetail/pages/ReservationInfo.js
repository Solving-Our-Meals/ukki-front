// import { useState, useEffect } from 'react';
import styles from '../css/reservation.module.css';
import Calendar from '../components/Calendar';


function ReservationInfo(){

    return(
        <div className={styles.reservationStyle}>
            <div>예약</div>
            <div>날짜를 선택해주세요.</div>
            <div>
                <Calendar/>
            </div>
        </div>
    );
}

export default ReservationInfo;