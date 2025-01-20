import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker() {
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="Basic time picker"
        minutesStep={30} // 30분 간격으로 설정
        value={nextTimeSlot} // 계산된 시간으로 기본값 설정
        onChange={(newValue) => console.log(newValue)}
        renderInput={(params) => <input {...params} />}
      />
    </LocalizationProvider>
  );
}
