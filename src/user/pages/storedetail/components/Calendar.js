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

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const [day, setDay] = useState(currentDate.getDay());

    const [operArray, setOperArray] = useState([]);  
    const [morningArray, setMorningArray] = useState([]);
    const [afternoonArray, setAfternoonArray] = useState([]);  
    const [isOper, setIsOper] = useState(true);

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

                const today = new Date().getDay();

                const dayOfWeekMap = {
                    0 : "sunday",
                    1 : "monday",
                    2 : "tuesday", 
                    3 : "wednesday", 
                    4 : "thursday",
                    5 : "friday",
                    6 : "saturday"
                };

                const dayOfWeek = dayOfWeekMap[today];

                let morningArr = [];
                let afternoonArr = [];
                
                // 1-1. 브레이크 타임 있을 경우
                if (data.operationTime.breakTime !== null) {
                    // 2-1. 휴무 아닌 날
                    if (data.operationTime[dayOfWeek] !== '휴무') {
                        setIsOper(true);
                        const operTimeOfDay = data.operationTime[dayOfWeek];
                        const operBreakTime = data.operationTime.breakTime;

                        // 날짜 문자열 자르기
                        const strStartTime = operTimeOfDay.split('~')[0];
                        const [strStartHour, strStartMinute] = strStartTime.split(':');
                        const strEndTime = operTimeOfDay.split('~')[1];
                        const [strEndHour, strEndMinute] = strEndTime.split(':');
                        const strStartBreak = operBreakTime.split('~')[0];
                        const [strStartBreakHour, strStartBreakMinute] = strStartBreak.split(':');
                        const strEndBreak = operBreakTime.split('~')[1];
                        const [strEndBreakHour, strEndBreakMinute] = strEndBreak.split(':');

                        // 선택한 날짜의 운영 시간 -> Date() 형태
                        const startTime = new Date();
                        startTime.setHours(parseInt(strStartHour));
                        startTime.setMinutes(parseInt(strStartMinute));
                        const startBreakTime = new Date();
                        startBreakTime.setHours(parseInt(strStartBreakHour));
                        startBreakTime.setMinutes(parseInt(strStartBreakMinute));
                        const endBreakTime = new Date();
                        endBreakTime.setHours(parseInt(strEndBreakHour));
                        endBreakTime.setMinutes(parseInt(strEndBreakMinute));
                        const endTime = new Date();
                        endTime.setHours(parseInt(strEndHour));
                        endTime.setMinutes(parseInt(strEndMinute));

                        console.log('Start Time:', startTime);
                        console.log('Break Start Time:', startBreakTime);
                        console.log('Break End Time:', endBreakTime);
                        console.log('End Time:', endTime);

                        const addTimeSlots = (arr, start, end) => {
                            for (let i = start.getHours(); i <= end.getHours(); i++) {
                                const startMinute = (i === start.getHours()) ? start.getMinutes() : 0;
                                const endMinute = (i === end.getHours()) ? end.getMinutes() : 60;
                                for (let j = startMinute; j < endMinute; j += 30) {
                                    arr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                                if (i === end.getHours() && (end.getMinutes() === 0 || end.getMinutes() === 30)) {
                                    arr.push(i.toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0'));
                                }
                            }
                        };

                        // 운영 시간이 8시 미만일 때 8시부터 시작
                        const effectiveStartTime = new Date(startTime);
                        if (startTime.getHours() < 8) {
                            effectiveStartTime.setHours(8);
                            effectiveStartTime.setMinutes(0);
                        }

                        // 종료 시간이 23시 이후일 때 23시로 조정
                        const effectiveEndTime = new Date(endTime);
                        if (endTime.getHours() >= 23 || endTime.getHours() <= 8) {
                            effectiveEndTime.setHours(23);
                            effectiveEndTime.setMinutes(0);
                        }

                        // 오전 시간 추가 (8시 ~ 11:30)
                        if (effectiveStartTime.getHours() < 12) {
                            const morningEndTime = new Date(Math.min(effectiveEndTime, new Date(effectiveStartTime).setHours(11, 30, 0, 0)));
                            addTimeSlots(morningArr, effectiveStartTime, morningEndTime);
                            morningArr = morningArr.filter(time => {
                                const [hour, minute] = time.split(':').map(Number);
                                const currentTime = new Date();
                                currentTime.setHours(hour);
                                currentTime.setMinutes(minute);
                                return !(currentTime >= startBreakTime && currentTime < endBreakTime);
                            });
                        }

                        // 오후 시간 추가 (12시 ~ 23:00)
                        if (effectiveEndTime.getHours() >= 12) {
                            const afternoonStartTime = new Date(Math.max(effectiveStartTime, new Date(effectiveEndTime).setHours(12, 0, 0, 0)));
                            addTimeSlots(afternoonArr, afternoonStartTime, effectiveEndTime);
                            afternoonArr = afternoonArr.filter(time => {
                                const [hour, minute] = time.split(':').map(Number);
                                const currentTime = new Date();
                                currentTime.setHours(hour);
                                currentTime.setMinutes(minute);
                                return !(currentTime >= startBreakTime && currentTime < endBreakTime);
                            });
                        }

                        console.log('morningArr:', morningArr);
                        console.log('afternoonArr:', afternoonArr);

                        // setMorningArray(morningArr);
                        // setAfternoonArray(afternoonArr);

                    // 2-2. 휴무인 날    
                    } else {
                        setIsOper(false);
                        morningArr.push('00:00');
                        afternoonArr.push('00:00');
                    }
                // 1-2. 브레이크 타임 없을 경우    
                } else {
                    // 2-1. 휴무 아닌 날
                    if(data.operationTime[dayOfWeek] !== '휴무'){
                        setIsOper(true);
                        const operTimeOfDay = data.operationTime[dayOfWeek];

                        // 날짜 문자열 자르기
                        const strStartTime = operTimeOfDay.split('~')[0];
                        const [strStartHour, strStartMinute] = strStartTime.split(':');
                        const strEndTime = operTimeOfDay.split('~')[1];
                        const [strEndHour, strEndMinute] = strEndTime.split(':');
                        
                        // 선택한 날짜의 운영 시간 -> Date() 형태
                        const startTime = new Date();
                        startTime.setHours(parseInt(strStartHour));
                        startTime.setMinutes(parseInt(strStartMinute));
                        const endTime = new Date();
                        endTime.setHours(parseInt(strEndHour));
                        endTime.setMinutes(parseInt(strEndMinute));

                        // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
                        if(startTime.getHours() < 8){
                            console.log('1111');
                            // 4-1. 마감 시간이 23시 이전인 경우
                            if(endTime.getHours() <= 23){
                                for(let i = 8; i < 12; i++){
                                    for (let j = 0; j < 60; j += 30) {
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                } for(let i = 12; i < endTime.getHours(); i++){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                                }
                                if (endTime.getMinutes() === 30) {
                                    afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                                } else {
                                    afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                                }
                            // 4-2. 마감 시간이 23시 이후인 경우    
                            } else {
                                for(let i = 8; i < 12; i++){
                                    for (let j = 0; j < 60; j += 30) {
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                } for(let i = 12; i <= 22; i++){
                                    for(let j = 0; j < 60; j += 30){
                                        afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }  
                                afternoonArr.push('23:00');
                            }
                        // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
                        } else if(8 <= startTime.getHours() && startTime.getHours() < 12){
                            console.log('2222');
                            // 4-1. 마감 시간이 23시 이전인 경우
                            if(endTime.getHours() <= 23){
                                for(let i = startTime.getHours(); i < 12; i++){
                                    if(startTime.getMinutes() === 0){
                                        for(let j = 0; j < 60; j += 30){
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    } else if(startTime.getMinutes() === 30){
                                        for (let j = 30; j < 60; j += 30) {
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                }
                                for(let i = 12; i < endTime.getHours(); i++){
                                    for (let j = 0; j < 60; j += 30) {
                                        afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }
                                if (endTime.getMinutes() === 30) {
                                    afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                                } else {
                                    afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                                }
                            // 4-2. 마감 시간이 23시 이후인 경우    
                            } else {
                                for(let i = startTime.getHours(); i < 12; i++){
                                    if(startTime.getMinutes() === 0){
                                        for(let j = 0; j < 60; j += 30){
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    } else if(startTime.getMinutes() === 30){
                                        for (let j = 30; j < 60; j += 30) {
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                }
                                for(let i = 12; i <= 22; i++){
                                    for(let j = 0; j < 60; j += 30){
                                        afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }  
                                afternoonArr.push('23:00');
                            }
                        // 3-3. 오후 시작    
                        } else if(startTime.getHours() >= 12){
                            console.log('3333');
                            // 4-1. 마감 시간이 23시 이전인 경우 -> 새벽 마감인 경우에도 23 이하이므로 8 초과라는 조건을 더 줌줌
                            if(endTime.getHours() <= 23 && endTime.getHours() > 8){
                                for(let i = startTime.getHours(); i < endTime.getHours(); i++){
                                    if(startTime.getMinutes() === 0){
                                        for(let j = 0; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    } else if(startTime.getMinutes() === 30){
                                        for(let j = 30; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                }
                                if (endTime.getMinutes() === 30) {
                                        afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                                } else {
                                        afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                                }
                            // 4-2. 마감 시간이 23시 이후인 경우 혹은 새벽 마감인 경우
                            } else {
                                for(let i = startTime.getHours(); i <= 22; i++){
                                    if(startTime.getMinutes() === 0){
                                        for(let j = 0; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    } else if(startTime.getMinutes() === 30){
                                        for(let j = 30; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                }
                                afternoonArr.push('23:00');
                            }
                        } 
                        console.log('4444');
                    // 2-2. 휴무인 날    
                    } else {
                        setIsOper(false);
                        // operArr.push('00:00')
                        morningArr.push('00:00');
                        afternoonArr.push('00:00');
                    }          
                }
                setMorningArray(morningArr);
                setAfternoonArray(afternoonArr);
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

    const goToday = () => {
        setSelectedDate(today); 
        setCurrentDate(today);
        selectedDateHandler(today);
        setSelectedTimeIndex(null);
    }

    const selectedDateHandler = (selectDate) => {

        setSelectedDate(selectDate);

        let selectedDayStr = ''

        switch(selectDate.getDay()){
            case 0:
                selectedDayStr = "일";
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
        // 선택한 날짜의 운영 시간 -> String 형태 -> 16:00 ~ 02:00 or 휴무
        console.log("선택한 날짜의 운영 시간",operation[dayOfWeek])

        // 운영 시간 배열에 담기
        // let operArr = [];
        let morningArr = [];
        let afternoonArr = [];

        // 브레이크 타임 있을 경우
        if(operation.breakTime !== null){
            if(operation[dayOfWeek] !== '휴무'){
                setIsOper(true);
                const operTimeOfDay = operation[dayOfWeek];
                const operBreakTime = operation.breakTime;

                // 날짜 문자열 자르기
                const strStartTime = operTimeOfDay.split('~')[0];
                const [strStartHour, strStartMinute] = strStartTime.split(':');
                const strEndTime = operTimeOfDay.split('~')[1];
                const [strEndHour, strEndMinute] = strEndTime.split(':');
                const strStartBreak = operBreakTime.split('~')[0];
                const [strStartBreakHour, strStartBreakMinute] = strStartBreak.split(':');
                const strEndBreak = operBreakTime.split('~')[1];
                const [strEndBreakHour, strEndBreakMinute] = strEndBreak.split(':');
                
                // 선택한 날짜의 운영 시간 -> Date() 형태
                const startTime = new Date();
                startTime.setHours(parseInt(strStartHour));
                startTime.setMinutes(parseInt(strStartMinute));
                const startBreakTime = new Date();
                startBreakTime.setHours(parseInt(strStartBreakHour));
                startBreakTime.setMinutes(parseInt(strStartBreakMinute));
                const endBreakTime = new Date();
                endBreakTime.setHours(parseInt(strEndBreakHour));
                endBreakTime.setMinutes(parseInt(strEndBreakMinute));
                const endTime = new Date();
                endTime.setHours(parseInt(strEndHour));
                endTime.setMinutes(parseInt(strEndMinute));

                const addTimeSlots = (arr, start, end) => {
                    for (let i = start.getHours(); i <= end.getHours(); i++) {
                        const startMinute = (i === start.getHours()) ? start.getMinutes() : 0;
                        const endMinute = (i === end.getHours()) ? end.getMinutes() : 60;
                        for (let j = startMinute; j < endMinute; j += 30) {
                            arr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                        }
                        if (i === end.getHours() && (end.getMinutes() === 0 || end.getMinutes() === 30)) {
                            arr.push(i.toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0'));
                        }
                    }
                };
        
                // 운영 시간이 8시 미만일 때 8시부터 시작
                const effectiveStartTime = new Date(startTime);
                if (startTime.getHours() < 8) {
                    effectiveStartTime.setHours(8);
                    effectiveStartTime.setMinutes(0);
                }
        
                // 종료 시간이 23시 이후일 때 23시로 조정
                const effectiveEndTime = new Date(endTime);
                if (endTime.getHours() >= 23 || endTime.getHours() <= 8) {
                    effectiveEndTime.setHours(23);
                    effectiveEndTime.setMinutes(0);
                }
        
                // 오전 시간 추가 (8시 ~ 11:30)
                if (effectiveStartTime.getHours() < 12) {
                    const morningEndTime = new Date(Math.min(effectiveEndTime, new Date(effectiveStartTime).setHours(11, 30, 0, 0)));
                    addTimeSlots(morningArr, effectiveStartTime, morningEndTime);
                    morningArr = morningArr.filter(time => {
                        const [hour, minute] = time.split(':').map(Number);
                        const currentTime = new Date();
                        currentTime.setHours(hour);
                        currentTime.setMinutes(minute);
                        return !(currentTime >= startBreakTime && currentTime < endBreakTime);
                    });
                }
        
                // 오후 시간 추가 (12시 ~ 23:00)
                if (effectiveEndTime.getHours() >= 12) {
                    const afternoonStartTime = new Date(Math.max(effectiveStartTime, new Date(effectiveEndTime).setHours(12, 0, 0, 0)));
                    addTimeSlots(afternoonArr, afternoonStartTime, effectiveEndTime);
                    afternoonArr = afternoonArr.filter(time => {
                        const [hour, minute] = time.split(':').map(Number);
                        const currentTime = new Date();
                        currentTime.setHours(hour);
                        currentTime.setMinutes(minute);
                        return !(currentTime >= startBreakTime && currentTime < endBreakTime);
                    });
                }
        
                console.log('morningArr:', morningArr);
                console.log('afternoonArr:', afternoonArr);
        
                // setMorningArray(morningArr);
                // setAfternoonArray(afternoonArr);
        
            // 2-2. 휴무인 날    
            } else {
                setIsOper(false);
                morningArr.push('00:00');
                afternoonArr.push('00:00');
            }
        } else {
            // 브레이크 타임 없을 경우
            if( operation[dayOfWeek] !== '휴무'){
                setIsOper(true);
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
                const endTime = new Date();
                endTime.setHours(parseInt(strEndHour));
                endTime.setMinutes(parseInt(strEndMinute));

                // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
                if(startTime.getHours() < 8){
                    console.log('1111');
                    // 4-1. 마감 시간이 23시 이전인 경우
                    if(endTime.getHours() <= 23){
                        for(let i = 8; i < 12; i++){
                            for (let j = 0; j < 60; j += 30) {
                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                        } for(let i = 12; i < endTime.getHours(); i++){
                        for(let j = 0; j < 60; j += 30){
                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                        }
                        }
                        if (endTime.getMinutes() === 30) {
                            afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                        } else {
                            afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                        }
                    // 4-2. 마감 시간이 23시 이후인 경우    
                    } else {
                        for(let i = 8; i < 12; i++){
                            for (let j = 0; j < 60; j += 30) {
                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                        } for(let i = 12; i <= 22; i++){
                            for(let j = 0; j < 60; j += 30){
                                afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                        }  
                        afternoonArr.push('23:00');
                    }
                // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
                } else if(8 <= startTime.getHours() && startTime.getHours() < 12){
                    console.log('2222');
                    // 4-1. 마감 시간이 23시 이전인 경우
                    if(endTime.getHours() <= 23){
                        for(let i = startTime.getHours(); i < 12; i++){
                            if(startTime.getMinutes() === 0){
                                for(let j = 0; j < 60; j += 30){
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } else if(startTime.getMinutes() === 30){
                                for (let j = 30; j < 60; j += 30) {
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                        }
                        for(let i = 12; i < endTime.getHours(); i++){
                            for (let j = 0; j < 60; j += 30) {
                                afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                        }
                        if (endTime.getMinutes() === 30) {
                            afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                        } else {
                            afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                        }
                    // 4-2. 마감 시간이 23시 이후인 경우    
                    } else {
                        for(let i = startTime.getHours(); i < 12; i++){
                            if(startTime.getMinutes() === 0){
                                for(let j = 0; j < 60; j += 30){
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } else if(startTime.getMinutes() === 30){
                                for (let j = 30; j < 60; j += 30) {
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                        }
                        for(let i = 12; i <= 22; i++){
                            for(let j = 0; j < 60; j += 30){
                                afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                        }  
                        afternoonArr.push('23:00');
                    }
                // 3-3. 오후 시작    
                } else if(startTime.getHours() >= 12){
                    console.log('3333');
                    // 4-1. 마감 시간이 23시 이전인 경우 -> 새벽 마감인 경우에도 23 이하이므로 8 초과라는 조건을 더 줌줌
                    if(endTime.getHours() <= 23 && endTime.getHours() > 8){
                        for(let i = startTime.getHours(); i < endTime.getHours(); i++){
                            if(startTime.getMinutes() === 0){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } else if(startTime.getMinutes() === 30){
                                for(let j = 30; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                        }
                        if (endTime.getMinutes() === 30) {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                        } else {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                        }
                    // 4-2. 마감 시간이 23시 이후인 경우 혹은 새벽 마감인 경우
                    } else {
                        for(let i = startTime.getHours(); i <= 22; i++){
                            if(startTime.getMinutes() === 0){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } else if(startTime.getMinutes() === 30){
                                for(let j = 30; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                        }
                        afternoonArr.push('23:00');
                    }
                } 
                console.log('4444');
            // 2-2. 휴무인 날    
            } else {
                setIsOper(false);
                // operArr.push('00:00')
                morningArr.push('00:00');
                afternoonArr.push('00:00');
            }          
        }
        setMorningArray(morningArr);
        setAfternoonArray(afternoonArr);

    }

    const selectTime = (index) => {
        if(selectedTimeIndex === index){
            setSelectedTimeIndex(null);
        } else {
            setSelectedTimeIndex(index);
        }
    }

    return (
        <>
            <div id={styles.goToday} onClick={() => {goToday()}}><u>Today</u></div>
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
                <div className={styles.calendarGrid}>
                    {calendarDates.map((date, index) => {
                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                        return(
                        <div
                            key={index}
                            className={`${styles.dateCell} ${
                                date.getMonth() === month ? styles.currentMonth : styles.otherMonth
                            }`}
                            onClick={() => { selectedDateHandler(date); }}
                        >
                            <img 
                                src={todayIcon} 
                                style={{display : (isToday && !selectedDate) || isSelected ? "" : "none"}} 
                                alt="오늘 날짜 표시 아이콘"
                            />
                            {date.getDate()}
                        </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.selectArea}>
                <div className={styles.selectedDate}>
                    {`${selectedTotalDate.selectedYear}.${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}.${selectedTotalDate.selectedDate.toString().padStart(2,'0')}(${selectedTotalDate.selectedDay})`}
                </div>
                <div className={styles.instructionTime}>시간을 선택해주세요.</div>
                <div className={styles.morningArray}>
                    <div id={styles.strMoring}>오전</div>
                    {morningArray.map((morningArr, index) => (
                        <div 
                            key={index} 
                            className={styles.morningArr} 
                            style={{backgroundColor : isOper ? (selectedTimeIndex === index ? '#FF8AA3' : '#FEDA00') : '#FFF3A7', 
                                    color : isOper ? '' : '#BDBEBF', 
                                    cursor : isOper ? '' : 'default'
                            }}
                            onClick={() => {selectTime(index)}}
                        >
                        {morningArr}
                        </div>
                    ))}
                </div>
                <div className={styles.afternoonArray}>
                    <div id={styles.strAfternoon}>오후</div>
                    {afternoonArray.map((afternoonArr, index) => (
                        <div 
                            key={index} 
                            className={styles.afternoonArr} 
                            style={{backgroundColor : isOper ? (selectedTimeIndex === index ? '#FF8AA3' : '#FEDA00') : '#FFF3A7', 
                                    color : isOper ? '' : '#BDBEBF', 
                                    cursor : isOper ? '' : 'default'
                            }}
                            onClick={() => {selectTime(index)}}
                        >
                        {afternoonArr}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Calendar;
