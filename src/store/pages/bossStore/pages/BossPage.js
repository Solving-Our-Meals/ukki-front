import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TimePicker from '../components/BasicTimePicker'
import WeeklyReservationGraph from '../components/WeeklyReservationGraph';
import '../css/BossPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';  // 올바른 경로
import { subDays, addDays } from 'date-fns';  // subDays와 addDays 임포트
import dayjs from 'dayjs';

function BossPage() {
    const { userNo, storeNo } = useOutletContext();
    const [storeInfo, setStoreInfo] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [availableSlots, setAvailableSlots] = useState(5); // 기본값 5
    const [weeklyReservationCount, setWeeklyReservationCount] = useState([]);
    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(''); // 선택된 시간 상태
    const [availablePosNum, setAvailablePosNum] = useState(0); // 예약 가능한 자리 수 상태 추가

    useEffect(() => {
        if (userNo === undefined || storeNo === undefined) {
            console.log("userNo 또는 storeNo 값이 아직 전달되지 않았습니다.");
            return;
        }

        // 로컬 스토리지에서 예약 가능 인원 값 가져오기
        const storedSlots = localStorage.getItem(`availableSlots_${storeNo}`);
        if (storedSlots) {
            setAvailableSlots(Number(storedSlots));  // 로컬 스토리지에서 값을 가져와 상태 설정
        }

        // store 정보 가져오기
        axios.get(`/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));

        // 예약 현황 가져오기
        axios.get(`/boss/mypage/reservation-status?storeNo=${storeNo}`)
            .then(response => setReservations(response.data || []))
            .catch(error => console.error("Error fetching reservations:", error));

        // 예약 가능 인원 가져오기 (새로고침 후에 백엔드에서 실제 값 가져오기)
        axios.get(`/boss/mypage/getAvailableSlots?storeNo=${storeNo}`)
            .then(response => {
                const fetchedSlots = response.data.availableSlots;
                setAvailableSlots(fetchedSlots || 5);  // 만약 값이 없으면 기본값 5로 설정
            })
            .catch(error => console.error("Error fetching available slots:", error));

        // 주간 예약 수 가져오기
        axios.get(`/boss/mypage/weekly-reservation-count?storeNo=${storeNo}`)
            .then(response => setWeeklyReservationCount(response.data || []))
            .catch(error => console.error("Error fetching weekly reservation count:", error));

        // 오늘 예약 수 가져오기
        axios.get(`/boss/mypage/today-reservation-count?storeNo=${storeNo}`)
            .then(response => setTodayReservationCount(response.data || 0))
            .catch(error => console.error("Error fetching today reservation count:", error));
    }, [userNo, storeNo]);

    const handleAvailableSlotsChange = async (change) => {
        try {
            const newSlots = availableSlots + change;

            // 백엔드에서 슬롯 수 업데이트
            await axios.post('/boss/mypage/updateAvailableSlots', null, {
                params: { storeNo, newSlots }
            });

            // 업데이트된 슬롯 수를 로컬 스토리지에 저장
            localStorage.setItem(`availableSlots_${storeNo}`, newSlots);

            // 상태 업데이트
            setAvailableSlots(newSlots);

        } catch (error) {
            console.error("Error updating available slots:", error);
        }
    };

    const handleDateChange = (date) => {
        setStartDate(date);
        setSelectedTime('');  // 날짜 변경 시 시간 초기화
        fetchReservations(date, selectedTime);  // 날짜가 변경되면 예약을 다시 불러옴
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        fetchReservations(startDate, time);  // 시간 변경 시 예약을 다시 불러옴
    };

    const fetchReservations = async (date, time) => {
        try {
            const response = await axios.get('/boss/mypage/reservations-list', {
                params: {
                    storeNo,
                    date: date.toISOString().split('T')[0],
                    time: time || null,  // 시간이 없으면 null로 전달
                }
            });
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations-list:", error);
        }
    };

    // 예약 가능한 자리 수 가져오기
    const handleUpdatePosNum = async (selectedDate, selectedTime, newPosNum) => {
        try {
            // 예약 가능한 인원 수 업데이트를 위한 POST 요청
            const response = await axios.post('/boss/mypage/updateReservationPosNum', {
                storeNo,
                reservationDate: selectedDate,
                reservationTime: selectedTime,
                newPosNumber: newPosNum
            });
    
            if (response.status === 200) {
                console.log("예약 가능한 인원 수가 성공적으로 업데이트되었습니다.");
                // 상태 갱신
                handleGetAvailablePosNum(selectedDate, selectedTime);
            }
        } catch (error) {
            console.error("Error updating reservation pos num:", error);
        }
    };
    
    const handleGetAvailablePosNum = async (selectedDate, selectedTime) => {
        try {
            const response = await axios.get(`/boss/mypage/store/${storeNo}/reservation`, {
                params: {
                    reservationDate: selectedDate,
                    reservationTime: selectedTime,
                },
            });
            setAvailablePosNum(response.data); // 상태 업데이트
        } catch (error) {
            console.error("Error fetching available pos num:", error);
        }
    };

    // 필터링된 예약 목록을 반환하는 함수
    const filteredReservations = reservations.filter((res) => {
        const reservationDate = new Date(res.reservationDate);
        const reservationTime = res.reservationTime;

        const isSameDate = reservationDate.toISOString().split('T')[0] === startDate.toISOString().split('T')[0];
        const isSameTime = selectedTime ? reservationTime === selectedTime : true;

        return isSameDate && isSameTime;
    });

    return (
        <div className="boss-page">
            {/* <Sidebar /> */}
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
                        selected={startDate}
                        onChange={handleDateChange}
                        includeDateIntervals={[{ start: subDays(new Date(), 1), end: addDays(new Date(), 7) }]}
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
        const formattedTime = dayjs(res.reservationTime, 'HH:mm:ss').format('hh:mm A');
        return (
            <li key={index}>{res.userName} - {formattedTime}</li>
        );
    })}
</ul>
                </section>

                <section className="reservation-slots">
                    <h2>예약 가능 인원</h2>
                    <div className="slots-controls">
                    <button onClick={() => { handleAvailableSlotsChange(-1); handleUpdatePosNum(); }}>-</button>

                        <span>{availableSlots}</span>
                        <button onClick={() => { handleAvailableSlotsChange(1); handleUpdatePosNum(); }}>+</button>

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
