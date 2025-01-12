import React, { useState } from 'react';
import styles from './css/PopupCalendar.module.css'; // CSS 모듈 import
import { useNavigate } from 'react-router-dom';

function PopupCalendar({ selectedDate, setSelectedDate }) {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const days = daysInMonth(month, year);
        const firstDay = new Date(year, month, 1).getDay();

        const calendar = [];
        for (let i = 0; i < firstDay; i++) {
            calendar.push(<div className={styles.empty} key={`empty-${i}`}></div>);
        }
        for (let day = 1; day <= days; day++) {
            calendar.push(
                <div
                    className={`${styles.day} ${selectedDate === day ? styles.selected : ''}`}
                    key={day}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }
        return calendar;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const toggleCalendar = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };

    // 월을 두 자리로 포맷팅하는 함수
    const formatMonth = (month) => {
        return (month + 1).toString().padStart(2, '0'); // 0을 채워서 두 자리로 변환
    };

    const formatDate = (date) => {
        return date.toString().padStart(2, '0'); // 0을 채워서 두 자리로 변환
    };

    function handleDateClick(date) {
        setSelectedDate(`${currentDate.getFullYear()}-${formatMonth(currentDate.getMonth())}-${formatDate(date)}`);
        setIsCalendarVisible(false);
        navigate(`/admin/reservations/list?category=none&word=${currentDate.getFullYear()}-${formatMonth(currentDate.getMonth())}-${formatDate(date)}`);
    }

    return (
        <div className={styles.popupCalendar}>
            <input
                className={styles.popupCalendarInput}
                type="text"
                readOnly
                value={selectedDate ? `${selectedDate}` : '날짜 선택'}
                onClick={toggleCalendar}
            />
            {isCalendarVisible && (
                <div className={styles.calendar}>
                    <div className={styles.header}>
                        <button onClick={handlePrevMonth}>◀</button>
                        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                        <button onClick={handleNextMonth}>▶</button>
                    </div>
                    <div className={styles.days}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div className={styles.dayName} key={day}>{day}</div>
                        ))}
                        {generateCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupCalendar;