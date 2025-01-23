import React, { forwardRef } from 'react';
import styles from '../css/reservation.module.css';
import Calendar from '../components/Calendar';

const ReservationInfo = forwardRef((props, ref) => {

    return (
        <div ref={ref} className={styles.reservationStyle}>
            <div className={styles.reservationTitle}>예약</div>
            <div className={styles.instructionDate}>날짜를 선택해주세요.</div>
            <div className={styles.calendarContainer}>
                <Calendar/>
            </div>
            <hr id={styles.hr}></hr>
        </div>
    );
});

export default ReservationInfo;
