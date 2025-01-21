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
    const [availableSlots, setAvailableSlots] = useState(5); // 기본값 5
    const [weeklyReservationCount, setWeeklyReservationCount] = useState([]);
    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(''); // 선택된 시간 상태
    const [selectedDate, setSelectedDate] = useState(''); // 선택된 날짜 상태
    const [availablePosNum, setAvailablePosNum] = useState(0); // 예약 가능한 자리 수 상태 추가

    // 현재 시간에 가장 가까운 30분 단위 시간 계산 함수
    const getClosest30MinTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const nearestHalfHour = minutes < 30 ? 30 : 60;
        now.setMinutes(nearestHalfHour, 0, 0);  // 30분 단위로 맞추기
        return now;
    };

    useEffect(() => {
        if (userNo === undefined || storeNo === undefined) {
            console.log("userNo 또는 storeNo 값이 아직 전달되지 않았습니다.");
            return;
        }

        // store 정보 가져오기
        axios.get(`/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));

        // 예약 현황 가져오기
        axios.get(`/boss/mypage/reservation-status?storeNo=${storeNo}`)
            .then(response => {
                setReservations(response.data || []);  // response.data가 undefined일 경우 빈 배열로 설정
            })
            .catch(error => console.error("Error fetching reservations:", error));

        // 예약 가능 인원 가져오기
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

        // 날짜 및 시간 초기화
        const closestTime = getClosest30MinTime();
        setSelectedDate(startDate);
        setSelectedTime(dayjs(closestTime).format('HH:mm'));  // 현재 시간 기준으로 가장 가까운 30분 단위 시간 설정

    }, [userNo, storeNo]);

    const handleDateChange = (date) => {
        setStartDate(date);  // 날짜가 변경될 때
        setSelectedDate(date);  // selectedDate도 함께 업데이트
        setSelectedTime(dayjs(getClosest30MinTime()).format('HH:mm'));  // 날짜 변경 시 가장 가까운 30분 단위 시간으로 초기화
        fetchReservations(date, '');  // 날짜가 변경되면 예약을 다시 불러옴
    };

    const handleTimeChange = (newTime) => {
        console.log("Selected time:", newTime);  // 콘솔로 확인
        setSelectedTime(newTime);  // selectedTime 업데이트
        fetchReservations(startDate, newTime);  // 예약 정보를 새 시간으로 갱신
    };



    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);

    const fetchReservations = async (date, time) => {
        try {
            const response = await axios.get('/boss/mypage/reservations-list', {
                params: {
                    storeNo,  // storeNo 파라미터 전달
                    reservationDate: date.toISOString().split('T')[0],  // reservationDate 포맷 맞추기 (YYYY-MM-DD)
                    reservationTime: time || "",  // 시간이 있을 경우만 전달, 없으면 빈 문자열로 전달
                }
            });
            setReservations(response.data);  // 예약 데이터 업데이트
        } catch (error) {
            console.error("Error fetching reservations-list:", error);
        }
    };

    // 예약 가능한 자리 수 가져오기
    const handleUpdatePosNum = async (selectedDate, selectedTime, newPosNum) => {
        try {
            if (selectedDate && selectedTime) {
                // 서버에 요청을 보낼 때, 날짜와 시간을 올바른 형식으로 변환
                const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
                const formattedTime = dayjs(selectedTime, 'HH:mm').format('HH:mm'); // HH:mm 형식

                const response = await axios.post('/boss/mypage/updateAvailableSlots', null, {
                    params: {
                        storeNo,
                        reservationDate: formattedDate,
                        reservationTime: formattedTime,
                        resPosNumber: newPosNum,
                    },
                });

                if (response.status === 200) {
                    console.log("예약 가능한 인원 수가 성공적으로 업데이트되었습니다.");
                    handleGetAvailablePosNum(formattedDate, formattedTime); // 업데이트 후 예약 가능한 자리 수 확인
                }
            } else {
                console.error("날짜와 시간이 모두 필요합니다.");
            }
        } catch (error) {
            console.error("예약 가능한 인원 수 업데이트 중 오류가 발생했습니다:", error);
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

    // 예약 가능한 슬롯 수 변경 함수
    const handleAvailableSlotsChange = (amount) => {
        setAvailableSlots(prevSlots => prevSlots + amount);  // 슬롯 수 증가 또는 감소
    };

    // 필터링된 예약 목록을 반환하는 함수
    const filteredReservations = (reservations || []).filter((res) => {
        const reservationDate = new Date(res.reservationDate);
        const reservationTime = res.reservationTime;

        const isSameDate = reservationDate.toISOString().split('T')[0] === startDate.toISOString().split('T')[0];
        const isSameTime = selectedTime ? reservationTime === selectedTime : true;

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

                        locale={ko}
                        inline
                    />
                </section>

                <section className="time-section">
                    <h2>시간 선택</h2>
                    <TimePicker
                        value={selectedTime}  // selectedTime을 그대로 사용
                        onChange={handleTimeChange}  // onChange에서 selectedTime을 업데이트
                        format="HH:mm aa"  // 시간 포맷 지정
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
                        <button onClick={() => { handleAvailableSlotsChange(-1); handleUpdatePosNum(); }} disabled={!selectedDate || !selectedTime}>-</button>
                        <span>{availableSlots}</span>
                        <button onClick={() => { handleAvailableSlotsChange(1); handleUpdatePosNum(); }} disabled={!selectedDate || !selectedTime}>+</button>
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
