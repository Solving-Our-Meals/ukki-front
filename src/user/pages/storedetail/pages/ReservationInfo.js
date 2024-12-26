// import { useState, useEffect } from 'react';
// import styles from '../css/reservation.module.css';
// import Calendar from '../components/Calendar';


// function ReservationInfo(){

//     const [currentDate] = useState(new Date());
//     const year = currentDate.getFullYear(); // Date.getFullYear() : 년도 반환
//     const month = currentDate.getMonth();  // Date.getMonth() : 현재 월을 반환 -> 0 : 1월, 11 : 12월
//     const date = currentDate.getDate();
//     const [day, setDay] = useState(currentDate.getDay());
    
//         useEffect(() => {
//             if(day === 0){
//                 setDay("일");
//             } else if(day === 1){
//                 setDay("월")
//             }else if(day === 2){
//                 setDay("화")
//             }else if(day === 3){
//                 setDay("수")
//             }else if(day === 4){
//                 setDay("목")
//             }else if(day === 5){
//                 setDay("금")
//             }else if(day === 6){
//                 setDay("토")
//             }
//         },[day])

//     return(
//         <div className={styles.reservationStyle}>
//             <div>예약</div>
//             <div>날짜를 선택해주세요.</div>
//             <div>
//                 <Calendar/>
//             </div>
//             {/* 오늘 날짜 말고 선택한 날짜로 변경되어야 함. */}
//             <div>{`${year}.${month}.${date}(${day})`}</div> 
//             <div>시간을 선택해주세요.</div>
//             <div>오전</div>
//             <div>오후</div>
//         </div>
//     );
// }

// export default ReservationInfo;

import { useState, useEffect } from 'react';
import styles from '../css/reservation.module.css';
import Calendar from '../components/Calendar';

function ReservationInfo() {
    
    return (
        <div className={styles.reservationStyle}>
            <div className={styles.reservationTitle}>예약</div>
            <div className={styles.instructionDate}>날짜를 선택해주세요.</div>
            <div className={styles.calendarContainer}>
                <Calendar />
            </div>
            <div className={styles.instructionTime}>시간을 선택해주세요.</div>
            <div className={styles.morning}>오전</div>
            <div className={styles.afternoon}>오후</div>
        </div>
    );
}

export default ReservationInfo;
