import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TimePicker from '../components/BasicTimePicker';
import WeeklyReservationGraph from '../components/WeeklyReservationGraph';
import '../css/BossPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { subDays, addDays } from 'date-fns';
import dayjs from 'dayjs';
import { API_BASE_URL } from '../../../../config/api.config';


function BossPage() {
    const { userNo, storeNo } = useOutletContext();
    const [storeInfo, setStoreInfo] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [resPosNumbers, setResPosNumbers] = useState({});
    const [weeklyReservationCount, setWeeklyReservationCount] = useState([]);
    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState(dayjs().format('HH:mm'));
    const [selectedDate, setSelectedDate] = useState(startDate);

    const getClosest30MinTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const nearestHalfHour = minutes < 30 ? 30 : 60;
        now.setMinutes(nearestHalfHour, 0, 0);  
        return now;
    };
 
    
    const fetchAvailableSlots = async (date, time) => {
        try {
            // 날짜를 'YYYY-MM-DD' 형식으로 포맷 (시간 정보는 제외)
            const formattedDate = dayjs(date).format('YYYY-MM-DD');  // YYYY-MM-DD 형식으로 변환
            const formattedTime = dayjs(time, 'HH:mm').format('HH:mm');  // HH:mm 형식으로 변환
    
            const params = {
                storeNo: storeNo,
                reservationDate: formattedDate,  // 서버가 기대하는 형식으로 날짜 전송
                reservationTime: formattedTime   // 시간도 올바른 형식으로 전송
            };
    
            console.log('Fetching slots with params:', params);
    
            const response = await axios.get(`${API_BASE_URL}/boss/mypage/reservation-status`, {
                params: {
                    storeNo,
                    reservationDate: formattedDate,  // 시간 정보 없는 'YYYY-MM-DD' 형식
                    reservationTime: formattedTime   // 시간도 올바른 형식
                }
            });
    
            const resPosNumber = Number(response.data.resPosNumber);
            const validResPosNumber = isNaN(resPosNumber) ? 5 : resPosNumber;
    
            setResPosNumbers(prev => ({
                ...prev,
                [`${formattedDate} ${formattedTime}`]: validResPosNumber
            }));
        } catch (error) {
            console.error('Error fetching available pos num:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (userNo === undefined || storeNo === undefined) return;

        const savedResPosNumbers = JSON.parse(localStorage.getItem('resPosNumbers'));
        if (savedResPosNumbers) {
            setResPosNumbers(savedResPosNumbers);
        }

        const formattedDate = dayjs().format('YYYY-MM-DD');  // YYYY-MM-DD 형식으로 변환
        const formattedTime = dayjs().format('HH:mm');  // HH:mm 형식으로 변환

        const params = {
            storeNo: storeNo,
            reservationDate: formattedDate,  // 서버가 기대하는 형식으로 날짜 전송
            reservationTime: formattedTime   // 시간도 올바른 형식으로 전송
        };
    
        axios.get(`${API_BASE_URL}/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));
    
            axios.get(`${API_BASE_URL}/boss/mypage/reservation-status`,  {
                params: {
                    storeNo,
                    reservationDate: formattedDate,  // 시간 정보 없는 'YYYY-MM-DD' 형식
                    reservationTime: formattedTime   // 시간도 올바른 형식
                }
            })
            .then(response => {
                setReservations(response.data || []);
            })
            .catch(error => console.error("Error fetching reservations:", error));
            
    
        axios.get(`${API_BASE_URL}/boss/mypage/weekly-reservation-count?storeNo=${storeNo}`)
            .then(response => setWeeklyReservationCount(response.data || []))
            .catch(error => console.error("Error fetching weekly reservation count:", error));
    
        axios.get(`${API_BASE_URL}/boss/mypage/today-reservation-count?storeNo=${storeNo}`)
            .then(response => setTodayReservationCount(response.data || 0))
            .catch(error => console.error("Error fetching today reservation count:", error));
    
        const closestTime = getClosest30MinTime();
        setSelectedDate(startDate);
        setSelectedTime(dayjs(closestTime).format('HH:mm'));
    

        fetchAvailableSlots(startDate, dayjs(closestTime).format('HH:mm'));
    
    }, [userNo, storeNo, startDate]); 


    const fetchReservations = async (date, time) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');  // YYYY-MM-DD 형식으로 변환
            const formattedTime = dayjs(time, 'HH:mm').format('HH:mm');  // HH:mm 형식으로 변환
    
            const params = {
                storeNo: storeNo,
                reservationDate: formattedDate,  // 서버가 기대하는 형식으로 날짜 전송
                reservationTime: formattedTime   // 시간도 올바른 형식으로 전송
            };
            console.log('Fetching reservations with params:', { formattedDate, formattedTime });
    
            const response = await axios.get(`${API_BASE_URL}/boss/mypage/reservations-list`, {
                params: {
                    storeNo,
                    reservationDate: formattedDate,  
                    reservationTime: formattedTime  // time이 null일 경우 빈 문자열로 처리
                }
            });
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations-list:", error);
        }
    };
    
    

    
    
    

    useEffect(() => {
        if (selectedDate && selectedTime) {
            const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm');
            fetchAvailableSlots(selectedDate, formattedTime);
            fetchReservations(dayjs(selectedDate), selectedTime);
        }
    }, [selectedDate, selectedTime, storeNo]);

    useEffect(() => {
        if (Object.keys(resPosNumbers).length > 0) {
            localStorage.setItem('resPosNumbers', JSON.stringify(resPosNumbers));
        }
    }, [resPosNumbers]);

    const handleDateChange = (date) => {
        setStartDate(date);
        setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
        setSelectedTime(dayjs(getClosest30MinTime()).format('HH:mm'));
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    const handleSlotsChange = async (amount) => {
        const currentPosNum = resPosNumbers[`${selectedDate} ${selectedTime}`] ?? 5;
        const newPosNum = Math.max(currentPosNum + amount, 0);
    
 
        setResPosNumbers(prev => ({
            ...prev,
            [`${selectedDate} ${selectedTime}`]: newPosNum
        }));

        try {
            await handleUpdatePosNum(selectedDate, selectedTime, newPosNum);
        } catch (error) {
            console.error("Error updating reservation slots:", error);
        }
    };

    const handleUpdatePosNum = async (selectedDate, selectedTime, newPosNum) => {
        try {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm');
    

            if (isNaN(newPosNum)) {
                newPosNum = 5;
            }
    
            if (newPosNum < 0) {
                newPosNum = 0;
            }
    
            const response = await axios.post(`${API_BASE_URL}/boss/mypage/insertAvailableSlots`, {
                storeNo,
                reservationDate: formattedDate,
                reservationTime: formattedTime,
                resPosNumber: newPosNum
            });
    
            if (response.status === 200) {
                console.log("Reservation slots updated successfully.");
                fetchAvailableSlots(formattedDate, formattedTime);  
            }
        } catch (error) {
            console.error("Error updating reservation slots:", error);
        }
    };

    const filteredReservations = reservations.filter((res) => {
        const reservationDate = res?.reservationDate;
        if (!reservationDate) return false;
        const isSameDate = dayjs(reservationDate).format('YYYY-MM-DD')?res.reservationDate === startDate : true;
        const isSameTime = selectedTime ? res.reservationTime === selectedTime : true;
        return isSameDate && isSameTime;
    });
    

    return (
        <div className="boss-page">
            <div className="content">
                {storeInfo && (
                    <div className="store-info">
                        <h2>{storeInfo.storeName}</h2>
                        <p>{storeInfo.storeAddress}</p>
                    </div>
                )}
                <section className="calendar-section">
                    <h2>날짜 선택</h2>
                    <DatePicker
                        selected={selectedDate ? dayjs(selectedDate).toDate() : null}
                        onChange={handleDateChange}
                        includeDateIntervals={[{ start: subDays(new Date(), 1), end: addDays(new Date(), 7) }]}
                        format="yy-MM-dd"
                        locale={ko}
                        inline
                    />
                </section>

                <section className="time-section">
                    <h2>시간 선택</h2>
                    <TimePicker
                        value={selectedTime}
                        onChange={handleTimeChange}
                        format="HH:mm aa"
                        minutesStep={30}
                        locale={ko}
                    />
                </section>

                <section className="reservation-status">
                    <h2>예약 현황</h2>
                    <p>총 예약인원: {filteredReservations.length}명</p>
                    <ul>
                        {filteredReservations.map((res, index) => {
                            const formattedTime = dayjs(res.reservationTime, 'HH:mm').format('hh:mm');
                            return (
                                <li key={index}>{res.userName} - {formattedTime}</li>
                            );
                        })}
                    </ul>
                </section>

                <section className="reservation-slots">
                    <h2>예약 가능 인원</h2>
                    <div className="slots-controls">
                        <button
                            onClick={() => handleSlotsChange(-1)}
                            disabled={!selectedDate || !selectedTime || resPosNumbers[`${selectedDate} ${selectedTime}`] <= 0}
                        >
                            -
                        </button>
                        <span>{resPosNumbers[`${selectedDate} ${selectedTime}`] ?? 5}</span>
                        <button
                            onClick={() => handleSlotsChange(1)}
                            disabled={!selectedDate || !selectedTime}
                        >
                            +
                        </button>
                    </div>
                </section>

                <WeeklyReservationGraph data={weeklyReservationCount} />

                <section className="today-reservation">
                    <h2>오늘 예약 수</h2>
                    <p>{todayReservationCount}건</p>
                </section>
            </div>
        </div>
    );
}

export default BossPage;