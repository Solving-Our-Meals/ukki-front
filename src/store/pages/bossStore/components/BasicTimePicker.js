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

    // 30분 간격으로 나눈 나머지를 계산하여, 그 다음 30분으로 설정
    const nextSlotMinutes = minutes < 30 ? 30 : 60;
    const nextSlot = now.minute(nextSlotMinutes).second(0);  // 분과 초를 0으로 설정

    return nextSlot;
  };

  
  const nextTimeSlot = getNextTimeSlot();  // 현재 시간에 맞는 가장 가까운 30분 간격

  // 선택된 시간이 변경되면 호출되는 함수
const handleTimeChange = (newTime) => {
    // "HH:mm" 포맷으로 변환하여 `selectedTime`에 저장
    const formattedTime = dayjs(newTime, 'HH:mm').isValid() ? dayjs(newTime, 'HH:mm').format('HH:mm') : "";
    onChange(formattedTime);
};


  // value가 문자열일 경우 Dayjs 객체로 변환
  const parsedValue = value ? dayjs(value, 'HH:mm') : nextTimeSlot;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="시간 선택"
        minutesStep={30}  // 30분 간격으로 설정
        value={parsedValue}  // 문자열을 Dayjs 객체로 변환한 값 사용
        onChange={handleTimeChange}  // onChange에서 time을 'HH:mm' 형식으로 전달
        renderInput={(params) => <input {...params} />}
      />
    </LocalizationProvider>
  );
}
