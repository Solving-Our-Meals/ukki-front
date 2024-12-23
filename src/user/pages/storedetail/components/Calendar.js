// import { useState, useEffect } from 'react';
// import prevBtn from '../images/prev-or-next-icon.png';
// import nextBtn from '../images/prev-or-next-icon.png';

// function Calendar(){

//     // 1. new Date()를 통해 현재 날짜 useState에 담기
//     const [currentDate] = useState(new Date());

//     const year = currentDate.getFullYear(); // Date.getFullYear() : 년도 반환
//     const month = currentDate.getMonth();  // Date.getMonth() : 현재 월을 반환 -> 0 : 1월, 11 : 12월

//     // 2. 달력에 표시될 첫 날과 마지막 날 찾기
//     // 2-1. 해당 연도, 해당 월, 1일 생성
//     const firstDayOfMonth = new Date(year, month, 1);
//     // 2-2. 달력 시작 날짜를 현재 달의 첫 주의 일요일로 설정
//     const startDay = new Date(firstDayOfMonth);
//     // getDay : 일요일을 나타내는 0부터 토요일을 나타내는 6까지의 숫자 중 하나를 반환
//     // firstDayOfMonth.getDay() : 현재 달의 첫 날짜의 요일을 숫자로 반환
//     // 즉 해당 코드는 현재 달의 첫 날짜가 속한 주의 일요일 날짜, 즉 달력에 표시될 첫 날을 나타냄.
//     startDay.setDate(1 - firstDayOfMonth.getDay());
//     // 2-3. 현재 달의 마지막 날 생성(일(day) 부분이 0인 경우 지정된 달의 마지막 날을 나타냄.)
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     // 2-4. 달력 끝 날짜를 현재 달의 마지막 주의 토요일로 설정
//     const endDay = new Date(lastDayOfMonth);
//     // 달력의 마지막 날짜를 현재 달의 마지막 주의 토요일로 설정정
//     endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

//     // 3. 주 단위로 배열에 날짜 넣기
//     // 3-1. startDay부터 endDay까지의 날짜를 주 단위로 그룹화하는 함수
//     const groupDatesByWeek = (startDay, endDay) => {
//         const weeks = [];  // 최종적으로 주 단위로 그룹화된 날짜 배열들을 저장할 배열
//         let currentWeek = [];  // 현재 처리 중인 주를 나타내는 배열
//         let currentDate = new Date(startDay); // 반복 처리를 위한 현재 날짜 변수를 시작 날짜로 초기화

//         // 시작날짜부터 마지막 날짜까지 반복
//         while(currentDate <= endDay){
//             currentWeek.push(new Date(currentDate)); // 현재 날짜 현재 주에 추가
//             // 현재 주가 7일을 모두 채웠거나 현재 날짜(요일)가 토요일인 경우
//             if(currentWeek.length === 7 || currentDate.getDay === 6){
//                 weeks.push(currentWeek); // 완성된 주를 weeks 배열에 추가
//                 currentWeek = []; // 새로운 주를 시작하기 위해 currentWeek 재초기화
//             }
//             currentDate.setDate(currentDate.getDate() + 1);  // 현재 날짜를 다음 날로 변경경
//         }

//         // 마지막 주 처리(만약 남았다면)
//         if(currentWeek.length > 0){
//             weeks.push(currentWeek); // 남아있는 날짜가 있다면 마지막 주로 weeks에 추가
//         }

//         return weeks; // 주 단위로 그룹화된 날짜 배열들을 반환
//     };
    
//     console.log("달력 함수",groupDatesByWeek(startDay, endDay));

//     const dates = groupDatesByWeek(startDay, endDay);

//     return(
//         <>
//             <img src={prevBtn} alt='전 월로 가기'/>
//             {year}년 &ensp;
//             {month}월
//             <img src={nextBtn} alt='다음 월로 가기'/>
//             <div>
//                 {dates.map((week, weekIndex) => {
//                     <ul key={weekIndex}>
//                         {week.map((date, dateIndex) => {
//                             <li key={dateIndex}>{date.toDateString()}</li>
//                         })}
//                     </ul>
//                 })}
//             </div>
//         </>
//     );
// }

// export default Calendar;

import { useState } from 'react';
import prevBtn from '../images/prev-or-next-icon.png';
import nextBtn from '../images/prev-or-next-icon.png';

function Calendar() {
    const [currentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const endDay = new Date(lastDayOfMonth);
    endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

    const groupDatesByWeek = (startDay, endDay) => {
        const weeks = [];
        let currentWeek = [];
        let currentDate = new Date(startDay);

        while (currentDate <= endDay) {
            currentWeek.push(new Date(currentDate));
            if (currentWeek.length === 7 || currentDate.getDay() === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const dates = groupDatesByWeek(startDay, endDay);

    return (
        <>
            <img src={prevBtn} alt='전 월로 가기' />
            {year}년 &ensp;
            {month + 1}월
            <img src={nextBtn} alt='다음 월로 가기' />
            <div>
                달력
                {dates.map((week, weekIndex) => (
                    <ul key={weekIndex}>
                        {week.map((date, dateIndex) => (
                            <span key={dateIndex}>{date.getDate()}</span>
                        ))}
                    </ul>
                ))}
            </div>
        </>
    );
}

export default Calendar;
