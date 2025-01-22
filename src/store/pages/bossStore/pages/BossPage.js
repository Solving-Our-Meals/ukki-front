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

function BossPage() {
    const { userNo, storeNo } = useOutletContext();
    const [storeInfo, setStoreInfo] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [resPosNumbers, setResPosNumbers] = useState(''); // 각 날짜, 시간에 대한 예약 가능한 자리 수 관리
    const [weeklyReservationCount, setWeeklyReservationCount] = useState([]);
    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    const getClosest30MinTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const nearestHalfHour = minutes < 30 ? 30 : 60;
        now.setMinutes(nearestHalfHour, 0, 0);  // 30분 단위로 맞추기
        return now;
    };

    // 예약 가능 인원 수를 디비에서 가져오는 함수
   // 예약 가능 인원 수를 디비에서 가져오는 함수
   const fetchAvailableSlots = async (date, time) => {
    try {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const formattedTime = dayjs(time, 'HH:mm').format('HH:mm');

        const params = {
            storeNo: storeNo,
            reservationDate: formattedDate,
            reservationTime: formattedTime
        };

        console.log('Formatted date:', formattedDate);
        console.log('Formatted time:', formattedTime);
        console.log('Fetching slots with params:', params);

        const response = await axios.get('/boss/mypage/reservation-status', { params });

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



    
    // useEffect에서 데이터 로딩 시 예약 가능한 인원 수 불러오기
    useEffect(() => {
        if (userNo === undefined || storeNo === undefined) {
            return;
        }
    
        axios.get(`/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));
    
        axios.get(`/boss/mypage/reservation-status?storeNo=${storeNo}`)
            .then(response => {
                setReservations(response.data || []);
            })
            .catch(error => console.error("Error fetching reservations:", error));
    
        axios.get(`/boss/mypage/weekly-reservation-count?storeNo=${storeNo}`)
            .then(response => setWeeklyReservationCount(response.data || []))
            .catch(error => console.error("Error fetching weekly reservation count:", error));
    
        axios.get(`/boss/mypage/today-reservation-count?storeNo=${storeNo}`)
            .then(response => setTodayReservationCount(response.data || 0))
            .catch(error => console.error("Error fetching today reservation count:", error));
    
        const closestTime = getClosest30MinTime();
        setSelectedDate(startDate);
        setSelectedTime(dayjs(closestTime).format('HH:mm'));
    
        // 날짜와 시간에 맞는 예약 가능 인원 수를 가져옵니다.
        fetchAvailableSlots(startDate, dayjs(closestTime).format('HH:mm'));
    
    }, [userNo, storeNo, startDate]);

    // 선택된 날짜와 시간에 맞는 예약 가능 인원 수를 가져오는 useEffect
    useEffect(() => {
        if (selectedDate && selectedTime) {
            const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm');
            fetchAvailableSlots(selectedDate, formattedTime);
        }
    }, [selectedDate, selectedTime, storeNo]);


    const handleDateChange = (date) => {
        setStartDate(date);
        setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
        setSelectedTime(dayjs(getClosest30MinTime()).format('HH:mm'));
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    const handleResPosNumberChange = (amount) => {
        setResPosNumbers(prev => {
            const currentPosNum = prev[`${selectedDate} ${selectedTime}`] ?? 5; // 기본값 5
            const newPosNum = Math.max(currentPosNum + amount, 0); // 0보다 작은 값으로는 설정되지 않도록
            return { ...prev, [`${selectedDate} ${selectedTime}`]: newPosNum };
        });
    };

    const handleSlotsChange = (amount) => {
        const currentPosNum = resPosNumbers[`${selectedDate} ${selectedTime}`] ?? 5; // 기본값 5
        const newPosNum = Math.max(currentPosNum + amount, 0); // 0보다 작은 값으로는 설정되지 않도록
    
        // 새로운 예약 가능 인원 수를 상태에 반영
        setResPosNumbers(prev => ({
            ...prev,
            [`${selectedDate} ${selectedTime}`]: newPosNum
        }));
    
        // 상태 업데이트 후에 서버에 반영
        handleUpdatePosNum(selectedDate, selectedTime, newPosNum);
    };
    
    const handleUpdatePosNum = async (selectedDate, selectedTime, newPosNum) => {
        try {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm');
    
            // NaN 체크: NaN이면 5로 설정
            if (isNaN(newPosNum)) {
                newPosNum = 5; // 기본값 5
            }
    
            // 0보다 작은 값으로는 설정되지 않도록 처리
            if (newPosNum < 0) {
                newPosNum = 0; // 최소값은 0
            }
    
            const response = await axios.post('/boss/mypage/insertAvailableSlots', {
                storeNo,
                reservationDate: formattedDate,
                reservationTime: formattedTime,
                resPosNumber: newPosNum
            });
    
            if (response.status === 200) {
                console.log("예약 가능한 인원 수가 성공적으로 반영되었습니다.");
                fetchAvailableSlots(formattedDate, formattedTime);  // 예약 가능한 자리 수를 다시 가져오기
            }
        } catch (error) {
            console.error("예약 가능한 인원 수 업데이트 중 오류가 발생했습니다:", error.response?.data || error);
        }
    };
    

    const filteredReservations = (reservations || []).filter((res) => {
        const reservationDate = res?.reservationDate;
        if (!reservationDate) {
            return false;
        }
        const isSameDate = reservationDate.toISOString().split('T')[0] === startDate.toISOString().split('T')[0];
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
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={handleDateChange}
                        includeDateIntervals={[{ start: subDays(new Date(), 1), end: addDays(new Date(), 7) }]}
                        format="YY-MM-DD"
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
