import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker({ value, onChange }) {
  // 현재 시간을 기준으로 다음 30분 간격을 계산
  const getNextTimeSlot = () => {
    const now = dayjs();
    const minutes = now.minute();
    
    // 30분 간격으로 맞추기
    let nextSlotMinutes = minutes < 30 ? 30 : 0;
    let nextHour = minutes < 30 ? now.hour() : now.hour() + 1;
    
    return now.hour(nextHour).minute(nextSlotMinutes).second(0);
  };

  const nextTimeSlot = getNextTimeSlot();  // 현재 시간에 맞는 가장 가까운 30분 간격

  // 선택된 시간이 변경되면 호출되는 함수
  const handleTimeChange = (newTime) => {
    if (newTime) {
      onChange(dayjs(newTime).format('HH:mm'));  // 24시간제로 변환하여 전달
    }
  };

  // value가 문자열일 경우 Dayjs 객체로 변환
  const parsedValue = value ? dayjs(value, 'HH:mm') : nextTimeSlot;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        minutesStep={30}  // 30분 간격으로 설정
        value={nextTimeSlot}  // 문자열을 Dayjs 객체로 변환한 값 사용
        onChange={handleTimeChange}  // onChange에서 time을 'HH:mm' 형식으로 전달
        ampm={false}  // 24시간제로 설정 (AM/PM 제거)
      />
    </LocalizationProvider>
  );
}
