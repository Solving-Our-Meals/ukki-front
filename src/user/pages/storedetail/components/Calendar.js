import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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

    const { storeNo } = useParams();

    const [userInfo, setUserInfo] = useState(null);
    const [isUser, setIsUser] = useState(false);

    const [storeInfo, setStoreInfo] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMorningTimeIndex, setSelectedMorningTimeIndex] = useState(null);
    const [selectedAfternoonTimeIndex, setSelectedAfternoonTimeIndex] = useState(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const [day, setDay] = useState(currentDate.getDay());

    // const [operArray, setOperArray] = useState([]);  
    const [morningArray, setMorningArray] = useState([]);
    const [afternoonArray, setAfternoonArray] = useState([]);  
    const [isOper, setIsOper] = useState(true);

    const [resPosNumber, setResPosNumber] = useState({});
    const [cantReservation, setCantReservation] = useState(false);
    const [operTimeArray, setOperTimeArray] = useState([]);
    const [allTimeArray, setAllTimeArray] = useState([]);

    // 새로운 state 추가
    const [disabledTimes, setDisabledTimes] = useState([]);

    // useEffect(
    //     () => {
    //         fetch('/user/info')
    //         .then(res => res.json())
    //         .then(data => {
    //             setUserInfo(data);
    //             console.log('유저정보', data);
    //             // if(data !== null){
    //             //     setIsUser(true);
    //             // }   
    //             setIsUser(true); 
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             setIsUser(false);
    //         });
    //     }, []
    // )

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/user/info', {
                    method: 'GET'
                });
                const data = await response.json();
                setUserInfo(data);
                console.log('유저정보', data);
                setIsUser(true); 
            } catch (error) {
                console.error(error);
                setIsUser(false);
            }
        };
    
        fetchUserInfo();
    }, []);
    
    

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

    useEffect(() => {
        let morningArr = [];
        let afternoonArr = [];

        fetch(`/store/${storeNo}/getInfo`)
            .then(res => res.json())
            .then(data => {
                setOperation(data.operationTime);
                setStoreInfo(data);
                console.log('storeInfo : ', data)
                console.log('data.operationTime : ' , data.operationTime)

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
                    // 2-2. 휴무인 날    
                    } else {
                        setIsOper(false);
                        morningArr.push('휴무');
                        afternoonArr.push('휴무');
                        afternoonArr.push('휴무');
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
                    // 2-2. 휴무인 날    
                    } else {
                        setIsOper(false);
                        morningArr.push('휴무');
                        afternoonArr.push('휴무');
                        afternoonArr.push('휴무');
                    }          
                }
                setMorningArray(morningArr);
                setAfternoonArray(afternoonArr);

                const combinedTimeArray = [...morningArr, ...afternoonArr];
                setAllTimeArray(combinedTimeArray);

                const returnData = {
                    allTimeArray : combinedTimeArray
                };

                // 첫 번째 fetch의 data를 리턴하여 다음 then으로 전달
                return returnData;
            })
            .then(returnData => {
                // 두 번째 fetch 실행
                const today = new Date();
                const day = today.getDay();

                let todayFormat = today.getFullYear() +
                '-' + ( (today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1))+
                '-' + ( (today.getDate()) < 9 ? "0" + (today.getDate()) : (today.getDate()));
                
                return fetch(`/store/${storeNo}/resPosNumber?storeNo=${storeNo}&day=${day}&date=${todayFormat}`)
                .then(res => res.json())
                .then(data => {
                    console.log('예약가능인원 : ', data);
                    const operTimeArray = data;
                    setResPosNumber(data);
                    setOperTimeArray(operTimeArray);
                    console.log('ssssssss', returnData.allTimeArray);
                    

                    const disabledTimesList = [];

                    // for( let i = 0; i < operTimeArray.length; i++){
                    //     if(operTimeArray[i].operTime === allTimeArray[i]){
                    //         if(operTimeArray[i].resPosNum === 0){
                    //             disabledTimesList.push(returnData.allTimeArray[i]);
                    //             console.log('왜 안되냐고 : ', returnData.allTimeArray[i]);
                    //         }
                    //     }
                    // }

                    operTimeArray.forEach(slot => {
                        if (slot.resPosNum <= 0) {
                            // allTimeArray에서 해당 시간이 존재하는지 확인
                            if (returnData.allTimeArray.includes(slot.operTime)) {
                                disabledTimesList.push(slot.operTime);
                                console.log('비활성화될 시간:', slot.operTime);
                            }
                        }
                    });
                    setDisabledTimes(disabledTimesList);

                    // 디버깅을 위한 로그
                    console.log('operTimeArray:', operTimeArray);
                    console.log('allTimeArray:', returnData.allTimeArray);
                    console.log('disabledTimesList:', disabledTimesList);
                })
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }, []);

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
        setSelectedMorningTimeIndex(null);
        setSelectedAfternoonTimeIndex(null);
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
        //console.log('선택한 날짜의 요일', dayOfWeek);
        // 선택한 날짜의 운영 시간 -> String 형태 -> 16:00 ~ 02:00 or 휴무
        //console.log("선택한 날짜의 운영 시간",operation[dayOfWeek])

        // 운영 시간 배열에 담기
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
        
            // 2-2. 휴무인 날    
            } else {
                setIsOper(false);
                morningArr.push('휴무');
                afternoonArr.push('휴무');
                afternoonArr.push('휴무');
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
            // 2-2. 휴무인 날    
            } else {
                setIsOper(false);
                morningArr.push('휴무');
                afternoonArr.push('휴무');
                afternoonArr.push('휴무');
            }          
        }
        setMorningArray(morningArr);
        setAfternoonArray(afternoonArr);

         // 3. 선택한 날짜 포맷팅 (YYYY-MM-DD)
        const selectedDateFormat = `${selectDate.getFullYear()}-${
                (selectDate.getMonth()+1).toString().padStart(2, '0')}-${
                selectDate.getDate().toString().padStart(2, '0')}`;

        // 4. 예약 가능 인원 조회
        fetch(`/store/${storeNo}/resPosNumber?storeNo=${storeNo}&day=${day}&date=${selectedDateFormat}`)
            .then(res => res.json())
            .then(data => {
                console.log('선택한 날짜의 예약가능인원:', data);
                const operTimeArray = data;
                setOperTimeArray(operTimeArray);

                const disabledTimesList = [];

                // 5. 예약 불가능한 시간 체크
                operTimeArray.forEach(slot => {
                    if (slot.resPosNum <= 0) {
                        const timeStr = slot.operTime;
                        // 방금 생성한 morningArr, afternoonArr 배열에서 체크
                        if (morningArr.includes(timeStr) || afternoonArr.includes(timeStr)) {
                            disabledTimesList.push(timeStr);
                            console.log('예약 불가능 시간:', timeStr);
                        }
                    }
                });

                setDisabledTimes(disabledTimesList);

                // 디버깅용 로그
                console.log({
                    selectedDate: selectedDateFormat,
                    operationTimes: operTimeArray,
                    morningTimes: morningArr,
                    afternoonTimes: afternoonArr,
                    disabledTimes: disabledTimesList
                });
            })
            .catch(error => {
                console.error('예약 가능 인원 조회 실패:', error);
            });
    }

    // 시간 클릭 시 예약 페이지로 정보 넘기기
    const navigate = useNavigate();

    const [firstModalActive, setFirstModalActive] = useState(false);

    const selectedMorningTime = (index) => {
        setSelectedAfternoonTimeIndex(null);
        if(selectedMorningTimeIndex === index){
            setSelectedMorningTimeIndex(null);
        } else {
            setSelectedMorningTimeIndex(index);
        }

        console.log('morningArray[index] : ', morningArray[index], 'typeof(morningArray[index]) : ', typeof(morningArray[index]));
        
        // 선택한 시간과 현재 시간 비교
        const [hours, minutes] = morningArray[index].split(':').map(Number);
        const selectedTime = new Date(
            selectedTotalDate.selectedYear,
            selectedTotalDate.selectedMonth -1,
            selectedTotalDate.selectedDate,
            hours,
            minutes,
            0
        );
        const currentTime = new Date();

        // 선택한 시간이 현재 시간보다 미래일 때만 예약 페이지로 넘어가기
        if(selectedTime > currentTime){
            navigate('/reservation',{
                state:{
                    date1 :`${selectedTotalDate.selectedYear}년 ${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}월 ${selectedTotalDate.selectedDate.toString().padStart(2,'0')}일`,
                    date2 : `${selectedTotalDate.selectedYear}-${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}-${selectedTotalDate.selectedDate.toString().padStart(2,'0')}`,
                    time : morningArray[index],
                    storeName : storeInfo.storeName,
                    storeNo : storeInfo.storeNo,
                    storeAddress : storeInfo.storeAddress,
                    latitude : storeInfo.latitude,
                    longitude : storeInfo.longitude
                },
            });
        } else {
            setFirstModalActive(true); // 현재 시간 이전의 시간을 선택했을 때 모달 표시시
        }


        // navigate('/reservation',{
        //     state:{
        //         date1 :`${selectedTotalDate.selectedYear}년 ${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}월 ${selectedTotalDate.selectedDate.toString().padStart(2,'0')}일`,
        //         date2 : `${selectedTotalDate.selectedYear}-${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}-${selectedTotalDate.selectedDate.toString().padStart(2,'0')}`,
        //         time : morningArray[index],
        //         storeName : storeInfo.storeName,
        //         storeNo : storeInfo.storeNo,
        //         latitude : storeInfo.latitude,
        //         longitude : storeInfo.longitude
        //     },
        // });
    };

    const selectedAfternoonTime = (index) => {

        setSelectedMorningTimeIndex(null);
        if(selectedAfternoonTimeIndex === index){
            setSelectedAfternoonTimeIndex(null);
        } else {
            setSelectedAfternoonTimeIndex(index);
        }

        // 선택한 시간과 현재 시간 비교
        const [hours, minutes] = afternoonArray[index].split(':').map(Number);
        const selectedTime = new Date(
            selectedTotalDate.selectedYear,
            selectedTotalDate.selectedMonth -1,
            selectedTotalDate.selectedDate,
            hours,
            minutes,
            0
        );
        const currentTime = new Date();

        // 선택한 시간이 현재 시간보다 미래일 때만 예약 페이지로 넘어가기
        if(selectedTime > currentTime){
            navigate('/reservation',{
                state:{
                    date1 :`${selectedTotalDate.selectedYear}년 ${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}월 ${selectedTotalDate.selectedDate.toString().padStart(2,'0')}일`,
                    date2 : `${selectedTotalDate.selectedYear}-${selectedTotalDate.selectedMonth.toString().padStart(2, '0')}-${selectedTotalDate.selectedDate.toString().padStart(2,'0')}`,
                    time : afternoonArray[index],
                    storeName : storeInfo.storeName,
                    storeNo : storeInfo.storeNo,
                    storeAddress : storeInfo.storeAddress,
                    latitude : storeInfo.latitude,
                    longitude : storeInfo.longitude
                },
            });
        } else {
            setFirstModalActive(true); // 현재 시간 이전의 시간을 선택했을 때 모달 표시시
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

                        // 오늘 날짜를 비교하기 위해 시간 값을 0으로 설정
                        const todayWithoutTime = new Date(today).setHours(0, 0, 0, 0);
                        const dateWithoutTime = new Date(date).setHours(0, 0, 0, 0);
                        const nextWeekWithoutTime = new Date(today);
                        nextWeekWithoutTime.setDate(today.getDate() + 7);

                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                        const isPastDate = dateWithoutTime < todayWithoutTime; // 오늘 이전 날짜 확인
                        const isBeyondNextWeek = dateWithoutTime > nextWeekWithoutTime;  // 다음 주 이후 날짜 확인

                        const isWithinOneWeek = !isPastDate && !isBeyondNextWeek;

                        return(
                            <div
                                key={index}
                                className={`${styles.dateCell} ${
                                    date.getMonth() === month ? styles.currentMonth : styles.otherMonth
                                }`}
                                style={{
                                    pointerEvents : isWithinOneWeek ? 'auto' : 'none', // 오늘 이전 날짜는 클릭 불가
                                    cursor : isWithinOneWeek ? 'pointer' : 'default', // 커서 변경
                                    color : isWithinOneWeek ? '' : '#BDBEBF'
                                }}
                                onClick={isWithinOneWeek ? () => { selectedDateHandler(date) } : undefined}
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
                    <div id={styles.strMoring} style={{display : morningArray.length == 0 ? "none" : "" }}>오전</div>
                    {morningArray.map((timeObj, index) => {
                         // 현재 날짜와 시간을 얻는다
                         const now = new Date();
                         const [currentHours, currentMinutes] = [now.getHours(), now.getMinutes()];
                         const todayWithoutTime = new Date(now).setHours(0, 0, 0, 0);
                         const selectedDateWithoutTime = new Date(selectedTotalDate.selectedYear, selectedTotalDate.selectedMonth - 1, selectedTotalDate.selectedDate).setHours(0, 0, 0, 0);
 
                         // morningArr의 시간을 분리하여 비교
                         const [morningHours, morningMinutes] = timeObj.split(":").map(Number);
 
                         // 비교를 위한 Date 객체 생성
                         const currentDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHours, currentMinutes);
                         const morningDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), morningHours, morningMinutes);
 
                         // 클릭 가능 여부 결정
                         const isToday = todayWithoutTime === selectedDateWithoutTime;
                         const isNotPast = (morningDateTime > currentDateTime) || !isToday;

                        //  const isUserInfoLoaded = userInfo && Object.keys(userInfo).length > 0;
 
                         // 클릭 이벤트 핸들러
                         const handleClick = () => {
                             if (isNotPast) {
                                 selectedMorningTime(index);
                             }
                         };

                         return (
                            <div 
                                key={index} 
                                className={styles.morningArr} 
                                style={{
                                    backgroundColor: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser
                                        ? (selectedMorningTimeIndex === index ? '#FF8AA3' : '#FEDA00')
                                        : '#FFF3A7', 
                                    color: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? '#000000' : '#BDBEBF', 
                                    cursor: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? 'pointer' : 'default',
                                    pointerEvents: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? 'auto' : 'none'
                                }}
                                onClick={() => {
                                    if (!disabledTimes.includes(timeObj)) {
                                        selectedMorningTime(index);
                                    }
                                    handleClick(index)
                                }}
                            >
                                {timeObj}
                            </div>
                         );
                    })}
                </div>
                <div className={styles.afternoonArray}>
                    <div id={styles.strAfternoon} style={{display : afternoonArray.length == 0 ? "none" : "" }}>오후</div>
                    {afternoonArray.map((timeObj, index) => {

                        // 현재 날짜와 시간을 얻는다
                        const now = new Date();
                        const [currentHours, currentMinutes] = [now.getHours(), now.getMinutes()];
                        const todayWithoutTime = new Date(now).setHours(0, 0, 0, 0);
                        const selectedDateWithoutTime = new Date(selectedTotalDate.selectedYear, selectedTotalDate.selectedMonth - 1, selectedTotalDate.selectedDate).setHours(0, 0, 0, 0);

                        // morningArr의 시간을 분리하여 비교
                        const [morningHours, morningMinutes] = timeObj.split(":").map(Number);

                        // 비교를 위한 Date 객체 생성
                        const currentDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHours, currentMinutes);
                        const morningDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), morningHours, morningMinutes);

                        // 클릭 가능 여부 결정
                        const isToday = todayWithoutTime === selectedDateWithoutTime;
                        const isNotPast = (morningDateTime > currentDateTime) || !isToday;

                        // const isUserInfoLoaded = userInfo && Object.keys(userInfo).length > 0;

                        // 클릭 이벤트 핸들러
                        const handleClick = () => {
                            if (isNotPast && morningArray[index]) {
                                selectedMorningTime(index);
                            }
                        }

                        // 마지막 인덱스 건너뛰기
                        if(index === afternoonArray.length - 1) {
                            return null;}

                        // 마지막 인덱스가 아닐 경우 반환
                        return(
                            <div 
                                key={index} 
                                className={styles.afternoonArr} 
                                style={{
                                    backgroundColor: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser
                                        ? (selectedAfternoonTimeIndex === index ? '#FF8AA3' : '#FEDA00')
                                        : '#FFF3A7',
                                    color: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? '#000000' : '#BDBEBF',
                                    cursor: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? 'pointer' : 'default',
                                    pointerEvents: !disabledTimes.includes(timeObj) && isOper && isNotPast && isUser ? 'auto' : 'none'
                                }}
                                onClick={() => {
                                    if (!disabledTimes.includes(timeObj)) {
                                        selectedAfternoonTime(index);
                                    }
                                    handleClick(index)
                                }}
                            >
                                {timeObj}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.modalOverlay} style={{display : firstModalActive ? "" : "none"}}/>
            <div id={styles.timeConfirm} style={{display : firstModalActive ? "" : "none"}}>
                <p id={styles.chooseOtherTime}>예약 가능한 시간이 아닙니다. <br/> 시간을 다시 선택해주세요.</p>
                <button 
                    type='button' 
                    id={styles.chooseAgainTime} 
                    onClick={() => {
                        setFirstModalActive(false);
                        window.location.reload();
                    }}
                >
                    확인
                </button>
            </div>
        </>
    );
}

export default Calendar;
