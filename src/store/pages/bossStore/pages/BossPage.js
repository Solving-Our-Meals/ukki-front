// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../../../common/header/css/reset.css'
// import ReservationInfo from '../../../../user/pages/storedetail/pages/ReservationInfo';



// function BossPage() {
//     const [storeNo, setStoreNo] = useState(5); // 가게 ID (예: 5)
//     const [selectedDate, setSelectedDate] = useState('2025-01-17'); // 선택된 날짜
//     const [totalReservations, setTotalReservations] = useState(0);
//     const [todayReservations, setTodayReservations] = useState(0);
//     const [weeklyReservations, setWeeklyReservations] = useState([]);
//     const [availableSlots, setAvailableSlots] = useState(0);
//     const [reservations, setReservations] = useState([]);
//     const [loading, setLoading] = useState(true); // 로딩 상태
    
//     const storeNoNumber = Number(storeNo);

//     // 예약 데이터를 가져오는 함수
//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             setLoading(true);
//             try {
//                 console.log('Fetching data for storeNo:', storeNo, 'and selectedDate:', selectedDate);  // 데이터 요청 전 로그
//                 const reservationStatusResponse = await axios.get('/boss/mypage/reservation-status', { params: { storeNo } });
//                 const todayReservationCountResponse = await axios.get('/boss/mypage/today-reservation-count', { params: { storeNo } });
//                 const weeklyReservationCountResponse = await axios.get('/boss/mypage/weekly-reservation-count', { params: { storeNo } });
//                 const availableSlotsResponse = await axios.get('/boss/mypage/available-slots', { params: { storeNo, reservationDate: selectedDate } });
                
//                 console.log('Reservation Status:', reservationStatusResponse.data);  // 데이터 응답 확인
                
//                 setTotalReservations(reservationStatusResponse.data.totalReservations);
//                 setReservations(reservationStatusResponse.data.reservationList || []);
//                 setTodayReservations(todayReservationCountResponse.data);
//                 setWeeklyReservations(weeklyReservationCountResponse.data.weeklyReservations || []);
//                 setAvailableSlots(availableSlotsResponse.data.availableSlots);
//             } catch (error) {
//                 console.error('Error fetching dashboard data:', error);
//                 if (error.response) {
//                     console.error('Response error:', error.response);  // 서버에서 반환된 오류
//                 } else if (error.request) {
//                     console.error('Request error:', error.request);  // 요청이 전송되지 않은 경우
//                 }
//                 alert('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchDashboardData();
//     }, [storeNo, selectedDate]);
    
    

//     // 날짜 변경 핸들러
//     const handleDateChange = (newDate) => {
//         setSelectedDate(newDate);
//     };
    

//     const handleAvailableSlotsChange = (increment) => {
//         setAvailableSlots((prev) => Math.max(0, prev + increment));
//     };

//     // selectedDateHandler에서 breakTime을 찾는 방법
//     const selectedDateHandler = (date) => {
//         console.log("Selected Date:", date);  // 현재 선택된 날짜 확인
//         const selectedReservation = reservations.find(res => res.date === date);
    
//         if (selectedReservation) {
//             console.log("Found Reservation:", selectedReservation);  // 해당 예약 정보 확인
//             if (selectedReservation.breakTime) {
//                 console.log("breakTime:", selectedReservation.breakTime); // breakTime 존재 확인
//             } else {
//                 console.error("breakTime is not available for the selected reservation");
//             }
//         } else {
//             console.error("No reservation found for the selected date");
//         }
//     };
    
    
    
    

//     return (
//         <div className="dashboard">
//             <header className="dashboard-header">
//                 <h1>최근 공지</h1>
//             </header>
//             <div className="dashboard-content">
//                 {loading ? (
//                     <div className="loading">
//                         <img src="/images/loading.gif" alt="로딩 중" />
//                     </div>
//                 ) : (
//                     <>
//                         <section className="reservation-status">
//                             <h2>예약 현황</h2>
//                             <p>총 예약인원: {totalReservations}명</p>
//                             <input
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => {
//                                     handleDateChange(e.target.value);
//                                     selectedDateHandler(e.target.value);  // Call the handler to check breakTime
//                                 }}
//                                 className="date-picker"
//                             />

//                             <ul className="reservation-list">
//                                 {reservations.length > 0 ? (
//                                     reservations.map((res, index) => (
//                                         <li key={index}>
//                                             <span>{res.nickname}</span>
//                                             <span>{res.time}</span>
//                                         </li>
//                                     ))
//                                 ) : (
//                                     <li>예약이 없습니다.</li>
//                                 )}
//                             </ul>
//                         </section>

//                         {/* 캘린더 컴포넌트 추가 */}

                        
//                         <ReservationInfo selectedDate={selectedDate} onDateChange={handleDateChange} />
                        
//                         <section className="available-slots">
//                             <h2>예약 가능 인원</h2>
//                             <p>{selectedDate}</p>
//                             <div className="slots-controls">
//                                 <button onClick={() => handleAvailableSlotsChange(-1)}>-</button>
//                                 <span>{availableSlots}</span>
//                                 <button onClick={() => handleAvailableSlotsChange(1)}>+</button>
//                             </div>
//                             <div className="buttons">
//                                 <button className="cancel-button">취소</button>
//                                 <button className="confirm-button">확인</button>
//                             </div>
//                         </section>

//                         <section className="weekly-reservations">
//                             <h2>이번 주 예약 수</h2>
//                             <div className="weekly-chart">
//                                 {weeklyReservations.length ? (
//                                     weeklyReservations.map((count, index) => (
//                                         <div key={index} className="chart-bar">
//                                             <span>{count}</span>
//                                             <div style={{ height: `${count}px` }}></div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>이번 주 예약 수가 없습니다.</p>
//                                 )}
//                             </div>

//                         </section>

//                         <section className="today-reservations">
//                             <h2>오늘 예약 수</h2>
//                             <p>{selectedDate}</p>
//                             <div className="reservation-count">{todayReservations}</div>
//                         </section>
                        
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default BossPage;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../common/header/css/reset.css';
import ReservationInfo from '../../../../user/pages/storedetail/pages/ReservationInfo';

function BossPage() {
    const [storeNo, setStoreNo] = useState(5);
    const [selectedDate, setSelectedDate] = useState('2025-01-17');
    const [storeInfo, setStoreInfo] = useState({});
    const [totalReservations, setTotalReservations] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [availableSlots, setAvailableSlots] = useState(0);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const storeInfoResponse = await axios.get('/boss/store/info', { params: { storeNo } });
                setStoreInfo(storeInfoResponse.data);

                const reservationStatusResponse = await axios.get('/boss/mypage/reservation-status', { params: { storeNo } });
                setTotalReservations(reservationStatusResponse.data.totalReservations);
                setReservations(reservationStatusResponse.data.reservationList || []);
                
                const availableSlotsResponse = await axios.get('/boss/mypage/available-slots', { params: { storeNo, reservationDate: selectedDate } });
                setAvailableSlots(availableSlotsResponse.data.availableSlots);
                
                const inquiriesResponse = await axios.get('/boss/mypage/inquiries', { params: { storeNo } });
                setInquiries(inquiriesResponse.data.inquiries);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [storeNo, selectedDate]);

    const handleAvailableSlotsChange = (increment) => {
        setAvailableSlots(prev => Math.max(0, prev + increment));
    };

    const handleReviewReport = async (reviewId) => {
        try {
            await axios.post('/boss/report/review', { reviewId });
            alert('리뷰가 신고되었습니다.');
        } catch (error) {
            console.error('Error reporting review:', error);
        }
    };

    const handleInquiryDelete = async (inquiryId) => {
        try {
            await axios.delete('/boss/mypage/inquiries', { data: { inquiryId } });
            alert('문의가 삭제되었습니다.');
            // 최신 문의를 다시 불러옵니다.
            const updatedInquiries = await axios.get('/boss/mypage/inquiries', { params: { storeNo } });
            setInquiries(updatedInquiries.data.inquiries);
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>가게 관리</h1>
            </header>
            <div className="dashboard-content">
                {loading ? (
                    <div className="loading">
                        <img src="/images/loading.gif" alt="로딩 중" />
                    </div>
                ) : (
                    <>
                        <section className="store-info">
                            <h2>가게 정보</h2>
                            <p>가게 이름: {storeInfo.name}</p>
                            <p>주소: {storeInfo.address}</p>
                        </section>

                        <section className="reservation-status">
                            <h2>예약 현황</h2>
                            <p>총 예약인원: {totalReservations}명</p>
                            <ul>
                                {reservations.map((res, index) => (
                                    <li key={index}>{res.nickname} - {res.time}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="available-slots">
                            <h2>예약 가능 인원</h2>
                            <div className="slots-controls">
                                <button onClick={() => handleAvailableSlotsChange(-1)}>-</button>
                                <span>{availableSlots}</span>
                                <button onClick={() => handleAvailableSlotsChange(1)}>+</button>
                            </div>
                        </section>

                        <section className="inquiries">
                            <h2>문의 내역</h2>
                            <ul>
                                {inquiries.map((inq, index) => (
                                    <li key={index}>
                                        {inq.question}
                                        <button onClick={() => handleInquiryDelete(inq.id)}>삭제</button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default BossPage;
