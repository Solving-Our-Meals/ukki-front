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
    const [resPosNumbers, setResPosNumbers] = useState({}); // 각 날짜, 시간에 대한 예약 가능한 자리 수 관리
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




    // useEffect에서 데이터 로딩 시 예약 가능한 인원 수 불러오기
    useEffect(() => {
        if (userNo === undefined || storeNo === undefined) {
            return;
        }

        axios.get(`${API_BASE_URL}/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));

        // 예약 상태를 불러와서 화면에 표시
        axios.get(`${API_BASE_URL}/boss/mypage/reservation-status?storeNo=${storeNo}`)
            .then(response => {
                setReservations(response.data || []);
            })
            .catch(error => console.error("Error fetching reservations:", error));

        // 주간 예약 수 가져오기
        axios.get(`${API_BASE_URL}/boss/mypage/weekly-reservation-count?storeNo=${storeNo}`)
            .then(response => setWeeklyReservationCount(response.data || []))
            .catch(error => console.error("Error fetching weekly reservation count:", error));

        // 오늘 예약 수 가져오기
        axios.get(`${API_BASE_URL}/boss/mypage/today-reservation-count?storeNo=${storeNo}`)
            .then(response => setTodayReservationCount(response.data || 0))
            .catch(error => console.error("Error fetching today reservation count:", error));

        // 기본 시간 설정
        const closestTime = getClosest30MinTime();
        setSelectedDate(startDate);
        setSelectedTime(dayjs(closestTime).format('HH:mm'));

        // 날짜와 시간에 맞는 예약 가능 인원 수를 가져옵니다.
        fetchAvailableSlots(startDate, dayjs(closestTime).format('HH:mm'));
    }, [userNo, storeNo, startDate]);

    useEffect(() => {
        if (selectedDate && selectedTime) {
            fetchAvailableSlots(selectedDate, selectedTime); // 상태 변경 후 API 호출
        }
    }, [selectedDate, selectedTime]); // `resPosNumbers`는 의존성 배열에서 제거


    const handleDateChange = (date) => {
        setStartDate(date);
        setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
        setSelectedTime(dayjs(getClosest30MinTime()).format('HH:mm'));
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };


    const handleSlotsChange = (amount) => {
        const currentPosNum = resPosNumbers[`${selectedDate} ${selectedTime}`] ?? 5;
        const newPosNum = Math.max(currentPosNum + amount, 0);

        // 상태 업데이트 후 서버에 반영
        setResPosNumbers(prev => {
            const updatedPosNumbers = {
                ...prev,
                [`${selectedDate} ${selectedTime}`]: newPosNum
            };

            // 서버에 업데이트
            handleUpdatePosNum(selectedDate, selectedTime, newPosNum);

            return updatedPosNumbers;
        });
    };


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

            const response = await axios.get(`${API_BASE_URL}/boss/mypage/reservation-status`, { params });

            // 응답 처리
            if (!response || !response.data || response.data.length === 0) {
                console.error('No reservation data found');
                return;
            }

            const availableSlot = response.data.find(res =>
                res && res.reservationDate === formattedDate && res.reservationTime === formattedTime
            );

            const resPosNumber = availableSlot ? availableSlot.resPosNumber : 5;

            setResPosNumbers(prev => ({
                ...prev,
                [`${formattedDate} ${formattedTime}`]: resPosNumber
            }));

            // 상태가 업데이트된 후 추가적으로 로직을 처리할 수 있음
        } catch (error) {
            console.error('Error fetching available pos num:', error.response?.data || error);
        }
    };

    const handleUpdatePosNum = async (selectedDate, selectedTime, newPosNum) => {
        try {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm');
    
            if (isNaN(newPosNum)) {
                newPosNum = 5; // 기본값 5
            }
    
            if (newPosNum < 0) {
                newPosNum = 0; // 최소값 0
            }
    
            const response = await axios.post(`${API_BASE_URL}/boss/mypage/updateAvailableSlots`, {
                storeNo: storeNo,  // storeNo는 변수로 전달
                reservationDate: formattedDate,
                reservationTime: formattedTime,
                resPosNumber: newPosNum
            });
    
            if (response.status === 200) {
                console.log("예약 가능한 인원 수가 성공적으로 업데이트되었습니다.");
                fetchAvailableSlots(formattedDate, formattedTime); // 서버에서 최신 예약 가능 인원 가져오기
            } else {
                alert("예약 가능 인원 수를 업데이트하는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("예약 가능한 인원 수 업데이트 중 오류가 발생했습니다:", error.response?.data || error);
            alert("서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };
    




    const filteredReservations = (reservations || []).filter((res) => {
        if (!res || res.resPosNumber === null || !res.reservationDate || !res.reservationTime) {
            return false;
        }

        const reservationDate = dayjs(res.reservationDate).format('YYYY-MM-DD');
        const isSameDate = reservationDate === startDate;
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
                        <span>{resPosNumbers[`${selectedDate} ${selectedTime}`] ?? '로딩중'}</span>
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
