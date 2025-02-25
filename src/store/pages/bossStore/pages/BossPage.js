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
    const [weeklyReservationCount, setWeeklyReservationCount] = useState(null);

    const [todayReservationCount, setTodayReservationCount] = useState(0);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    const getClosest30MinTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const nearestHalfHour = minutes < 30 ? 30 : 60;
        now.setMinutes(nearestHalfHour, 0, 0);
        return now;
    };

    const fetchAvailableSlots = async (date, time) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');

            const formattedTime = time && dayjs(time, 'HH:mm').isValid() ? dayjs(time, 'HH:mm').format('HH:mm') : "";  // time이 null일 경우 빈 문자열로 처리

            console.log(formattedTime);

            const params = {
                storeNo: storeNo,
                reservationDate: formattedDate,
                reservationTime: formattedTime
            };

            console.log('Fetching slots with params:', params);

            const response = await axios.get(`${API_BASE_URL}/boss/mypage/reservation-status`, { params });

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

        axios.get(`${API_BASE_URL}/boss/mypage/getStoreInfo?userNo=${userNo}`)
            .then(response => setStoreInfo(response.data))
            .catch(error => console.error("Error fetching store info:", error));

        axios.get(`${API_BASE_URL}/boss/mypage/reservation-status?storeNo=${storeNo}`)
            .then(response => {
                setReservations(response.data || []);
            })
            .catch(error => console.error("Error fetching reservations:", error));

        const closestTime = getClosest30MinTime();
        setSelectedDate(startDate);
        setSelectedTime(dayjs(closestTime).format('HH:mm'));

        axios.get(`${API_BASE_URL}/boss/mypage/weekly-reservation-count?storeNo=${storeNo}`)
            .then((response) => {
                console.log(response.data);
                setWeeklyReservationCount(response.data)
            })
            .catch(error => console.error("Error fetching weekly reservation count:", error));

        fetchAvailableSlots(startDate, dayjs(closestTime).format('HH:mm'));
    }, [userNo, storeNo, startDate]);



    const fetchReservations = async (date, time) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedTime = time ? dayjs(time, 'HH:mm').format('HH:mm') : "";  // time이 null일 경우 빈 문자열로 처리

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
        // "HH:mm" 포맷으로 변환하여 `selectedTime`에 저장
        const formattedTime = dayjs(newTime, 'HH:mm').isValid() ? dayjs(newTime, 'HH:mm').format('HH:mm') : "";
        setSelectedTime(formattedTime);
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
        let reservationDate = res?.reservationDate;

        // 예약 날짜가 문자열인 경우, Date로 변환
        if (typeof reservationDate === 'string') {
            reservationDate = new Date(reservationDate);
        }

        if (!(reservationDate instanceof Date) || isNaN(reservationDate)) return false;

        // 날짜가 일치하는지 비교
        const isSameDate = reservationDate.toISOString().split('T')[0] === startDate;

        // 시간만 비교: reservationTime에서 HH:mm 부분만 추출해서 비교
        const formattedReservationTime = dayjs(res.reservationTime, 'HH:mm:ss').format('HH:mm');
        const isSameTime = selectedTime ? formattedReservationTime === selectedTime : true;

        console.log('Filtered Reservation:', res, 'isSameDate:', isSameDate, 'isSameTime:', isSameTime);

        return isSameDate ;
    });


    if (!weeklyReservationCount) {
        return (<div>로딩중</div>)

    }


    return (
        <div className="boss-page">
            <div className="content">
                {storeInfo && (
                    <div className="store-info">
                        <h2>{storeInfo.storeName}</h2>
                        <p>{storeInfo.storeAddress}</p>
                    </div>
                )}

                <section className="reservation-status">
                    <h2>예약 현황</h2>
                    <p>총 예약인원: <span>{filteredReservations.length}</span>명</p>
                    <ul>
                        {filteredReservations.map((res, index) => {
                            const formattedTime = dayjs(res.reservationTime, 'HH:mm:ss').format('hh:mm');
                            return (
                                <li key={index}>
                                    {res.userName} - {formattedTime}
                                </li>
                            );
                        })}
                    </ul>
                </section>
                <section className="calendar-section">
                    <h2>날짜 선택</h2>
                    <DatePicker
                        className="my-custom-datepicker"
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
                        format="HH:mm"
                        minutesStep={30}
                        locale={ko}
                    />
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

                <div className="weekly-Reservations">
                    <h2>이번주 예약 그래프</h2>
                    <WeeklyReservationGraph data={weeklyReservationCount} />
                </div>

                <section className="today-reservation">
                    <h2>오늘 남은 예약 수</h2>
                    <p>{todayReservationCount}건</p>
                </section>
            </div>
        </div>
    );
}

export default BossPage;