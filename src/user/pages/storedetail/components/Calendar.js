// import { useState, useEffect } from 'react';
// import prevBtn from '../images/prev-or-next-icon.png';
// import nextBtn from '../images/prev-or-next-icon.png';

// function Calendar(){

//     // 1. new Date()를 통해 현재 날짜 useState에 담기
//     const [currentDate] = useState(new Date());

//     const dayList = ["일", "월", "화", "수", "목", "금", "토"];
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
//             if(currentWeek.length === 7 || currentDate.getDay() === 6){
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

//     return (
//         <>
//             <div>
//                 <img src={prevBtn} alt='전 월로 가기' />
//                 <p>{year}년 &ensp;</p>
//                 <p>{month + 1}월</p>
//                 <img src={nextBtn} alt='다음 월로 가기' />
//             </div>
//             <div>
//                 {dayList.map((val) => {
//                     return <span key={val}>{val}</span>
//                 })}
//                 {dates.map((week, weekIndex) => (
//                     <ul key={weekIndex}>
//                         {week.map((date, dateIndex) => (
//                             <li key={dateIndex}>{date.getDate()}</li>
//                         ))}
//                     </ul>
//                 ))}
//             </div>
//         </>
//     );
// }

// export default Calendar;


import React, { useState, useEffect } from 'react';
import styles from '../css/reservation.module.css';
import prevBtn from '../images/prev-or-next-icon.png';
import nextBtn from '../images/prev-or-next-icon.png';
import todayIcon from '../images/todayIcon.png';

// 현재 월, 이전 월, 다음 월 날짜를 계산하는 함수
const getCalendarDates = (year, month) => {

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());

    const endDay = new Date(lastDayOfMonth);
    endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

    const dates = [];
    let currentDate = new Date(startDay);

    while (currentDate <= endDay) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;  // 날짜 배열을 반환
};

function Calendar() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const [day, setDay] = useState(currentDate.getDay());

    useEffect(() => {
        switch(day){
            case 0:
                setDay("일");
                break;
            case 1:
                setDay("월");
                break;
            case 2:
                setDay("화");
                break;
            case 3:
                setDay("수");
                break;
            case 4:
                setDay("목");
                break;
            case 5:
                setDay("금");
                break;
            case 6:
                setDay("토");
                break;
            default : 
                break;
        }
    }, [day]);

    const [selectedTotalDate, setSelectedTotalDate] = useState({
        selectedYear : year,
        selectedMonth : month + 1,
        selectedDate : date,
        selectedDay : day,
    }); 
    
    useEffect(() => {
        setSelectedTotalDate(prevState => ({
            ...prevState,
            selectedDay : day
        }));
    }, [day]);

    const calendarDates = getCalendarDates(year, month);

    // 날짜별(-> 요일별) 예약 가능 시간(30분 단위)
    // 가게 운영 시간 가져오기
    const [operation, setOperation] = useState({
        operation : [],
        operationTime : ""
    });

    useEffect(
        () => {
            fetch('/store/test')  //검색 페이지 만들어지면 pathvariable로 변경하기
            .then(res => res.json())
            .then(data => {
                setOperation(data.operationTime)
                console.log("가게 정보22222 : ",data.operationTime);
            })
            .catch(error => console.log(error));
        }, []
    ); 

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const selectedDateHandler = (selectDate) => {

        let selectedDayStr = ''
        let selectOperTime = ''

        switch(selectDate.getDay()){
            case 0:
                selectedDayStr = "일";
                // selectOperTime = operation.operationTime["sunday"]
                break;
            case 1:
                selectedDayStr = "월";
                break;
            case 2:
                selectedDayStr = "화";
                break;
            case 3:
                selectedDayStr = "수";
                break;
            case 4:
                selectedDayStr = "목";
                break;
            case 5:
                selectedDayStr = "금";
                break;
            case 6:
                selectedDayStr = "토";
                break;
            default : 
                break;    
        }

        setSelectedTotalDate(prevState => ({
            ...prevState,
            selectedYear : selectDate.getFullYear(),
            selectedMonth : selectDate.getMonth() + 1,
            selectedDate : selectDate.getDate(),
            selectedDay : selectedDayStr
        }));

        const day = selectDate.getDay();

        const dayOfWeekMap = {
            0 : "sunday",
            1 : "monday",
            2 : "tuesday", 
            3 : "wednesday", 
            4 : "thursday",
            5 : "friday",
            6 : "saturday"
        };

        const dayOfWeek = dayOfWeekMap[day];

        // 선택한 날짜의 요일
        console.log('선택한 날짜의 요일', dayOfWeek);
        // 선택한 날짜의 운영 시간 -> String 형태 -> 16:00 ~ 02:00
        console.log("선택한 날짜의 운영 시간",operation[dayOfWeek])
        const operTimeOfDay = operation[dayOfWeek];
        // 날짜 문자열 자르기
        const strStartTime = operTimeOfDay.split('~')[0];
        const [strStartHour, strStartMinute] = strStartTime.split(':');
        const strEndTime = operTimeOfDay.split('~')[1];
        const [strEndHour, strEndMinute] = strEndTime.split(':');
        
        
        // 선택한 날짜의 운영 시간 -> Date() 형태 -> Wed Dec 25 2024 16:00:00 GMT+0900 (한국 표준시)
        const startTime = new Date();
        startTime.setHours(parseInt(strStartHour));
        startTime.setMinutes(parseInt(strStartMinute));
        startTime.setSeconds(0);
        const endTime = new Date();
        endTime.setHours(parseInt(strEndHour));
        endTime.setMinutes(parseInt(strEndMinute));
        endTime.setSeconds(0);

        // const startOperTime = startTime.getHours().toString().padStart(2, '0') + ':' + startTime.getMinutes().toString().padStart(2, '0');
        const startOperTime = startTime.getHours() + ':' + startTime.getMinutes();
        const endOperTime = endTime.getHours() + ':' + endTime.getMinutes();
        console.log("startHour",startTime);
        console.log("endTime", endTime);
        console.log(startOperTime);
        console.log(endOperTime);
       
    }


    return (
        <>
            <div className={styles.calendarHeader}>
                <img src={prevBtn} alt='전 월로 가기' onClick={handlePrevMonth} />
                <p>{year}년 &ensp;</p>
                <p>{month + 1}월</p>
                <img src={nextBtn} alt='다음 월로 가기' onClick={handleNextMonth} />
            </div>
            <div className={styles.calendarBody}>
                <div className={styles.dayList}>
                    {dayList.map((day, index) => (
                        <span key={index} className={styles.day}>{day}</span>
                    ))}
                </div>
                <div className={styles.calendarGrid}
                >
                    {calendarDates.map((date, index) => {
                        const isToday = date.toDateString() === today.toDateString();
                        return(
                        <div
                            key={index}
                            className={`${styles.dateCell} ${
                                date.getMonth() === month ? styles.currentMonth : styles.otherMonth
                            }`}
                            onClick={() => selectedDateHandler(date)}
                        >
                            <img src={todayIcon} style={{display : isToday ? "" : "none"}} alt="오늘 날짜 표시 아이콘"/>
                            {date.getDate()}
                        </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.selectedDate}>
                {`${selectedTotalDate.selectedYear}.${selectedTotalDate.selectedMonth}.${selectedTotalDate.selectedDate}(${selectedTotalDate.selectedDay})`}
            </div>
        </>
    );
}

export default Calendar;
