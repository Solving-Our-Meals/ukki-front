// BossPage.js
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TimePicker from 'react-time-picker'
import WeeklyReservationGraph from '../components/WeeklyReservationGraph';
import '../css/BossPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';  // 올바른 경로
import { subDays, addDays } from 'date-fns';  // subDays와 addDays 임포트



function BossPage() {
    const { userNo, storeNo } = useOutletContext();
    const [storeInfo, setStoreInfo] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [availableSlots, setAvailableSlots] = useState(5); // 기본값 5
    const [weeklyReservationCount, setWeeklyReservationCount] = useState([]);
    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date());

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
 
    return (
        <div className="boss-page">
            <Sidebar />
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
                        onChange={(date) => setStartDate(date)}
                        includeDateIntervals={[
                            {
                                start: subDays(new Date(), 0),
                                end: addDays(new Date(), 7)
                            },
                        ]}
                        locale={ko}
                        selectsRange
                        inline
                    />
                </section>
                <section className="time-section">
                    <h2>시간 선택</h2>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                         locale={ko}
                    />
                </section>

                <section className="reservation-status">
                    <h2>예약 현황</h2>
                    <p>총 예약인원: {reservations.length}명</p>
                    <ul>
                        {reservations.map((res, index) => (
                            <li key={index}>{res.nickname} - {res.time}</li>
                        ))}
                    </ul>
                </section>
                <section className="reservation-slots">
                    <h2>예약 가능 인원</h2>
                    <div className="slots-controls">
                        <button onClick={() => handleAvailableSlotsChange(-1)}>-</button>
                        <span>{availableSlots}</span>
                        <button onClick={() => handleAvailableSlotsChange(1)}>+</button>
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
