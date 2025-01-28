// function test(){
//     useEffect(
//         () => {

//             let morningArr = [];
//             let afternoonArr = [];
//             // let operArr = [];

//             // 1-1. 브레이크 타임 있을 경우
//             if(data.operationTime.breakTime !== null){
//                 // 2-1. 휴무 아닌 날
//                 if(data.operationTime[dayOfWeek] !== '휴무'){
//                     setIsOper(true);
//                     const operTimeOfDay = data.operationTime[dayOfWeek];
//                     const operBreakTime = data.operationTime.breakTime;

//                     // 날짜 문자열 자르기
//                     const strStartTime = operTimeOfDay.split('~')[0];
//                     const [strStartHour, strStartMinute] = strStartTime.split(':');
//                     const strEndTime = operTimeOfDay.split('~')[1];
//                     const [strEndHour, strEndMinute] = strEndTime.split(':');
//                     const strStartBreak = operBreakTime.split('~')[0];
//                     const [strStartBreakHour, strStartBreakMinute] = strStartBreak.split(':');
//                     const strEndBreak = operBreakTime.split('~')[1];
//                     const [strEndBreakHour, strEndBreakMinute] = strEndBreak.split(':');
                    
//                     // 선택한 날짜의 운영 시간 -> Date() 형태
//                     const startTime = new Date();
//                     startTime.setHours(parseInt(strStartHour));
//                     startTime.setMinutes(parseInt(strStartMinute));
//                     const startBreakTime = new Date();
//                     startBreakTime.setHours(parseInt(strStartBreakHour));
//                     startBreakTime.setMinutes(parseInt(strStartBreakMinute));
//                     const endBreakTime = new Date();
//                     endBreakTime.setHours(parseInt(strEndBreakHour));
//                     endBreakTime.setMinutes(parseInt(strEndBreakMinute));
//                     const endTime = new Date();
//                     endTime.setHours(parseInt(strEndHour));
//                     endTime.setMinutes(parseInt(strEndMinute));

//                     // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
//                     if(startTime.getHours() < 8){
//                         // 브레이크 타임이 오전부터 시작하는 경우
//                         if(startBreakTimebreakTime.getHours() > startTime.getHours() && startBreakTime.getHours() < 12 ){
//                             // 브레이크 타임이 오전에 끝나는 경우 
//                             if(endBreakTime.getHours() < 12){
//                                 // 장사가 23시 이전에 끝나는 경우
//                                 if(endTime.getHours() < 23){
//                                     for(let i = 8; i < startBreakTime.getHours(); i++){
//                                         for(let j = 0; j < 60; j += 30){
//                                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                         }
//                                     }
//                                     if(startBreakTime.getMinutes() === 0){
//                                         morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
//                                     } else if(startBreakTime.getMinutes() === 30){
//                                         morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
//                                     }
//                                     for(let i = endBreakTime.getHours(); i < 12; i++){
//                                         if(endBreakTime.getMinutes() === 0){
//                                             for(let j = 0; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         } else if(endBreakTime.getMinutes() === 30){
//                                             for(let j = 30; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         }
//                                     }
//                                     for(let  i = 12; i < endTime.getHours(); i++){
//                                         for(let j = 0; j < 60; j += 30){
//                                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                         }
//                                     }
//                                     if(endTime.getMinutes() === 0){
//                                         afternoonArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
//                                     } else if(endTime.getMinutes() === 30){
//                                         afternoonArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
//                                     }
//                                 // 장사가 23시 이후에 끝나는 경우우    
//                                 } else if(endTime.getHours() >= 23){
//                                     for(let i = 8; i < startBreakTime.getHours(); i++){
//                                         for(let j = 0; j < 60; j += 30){
//                                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                         }
//                                     }
//                                     if(startBreakTime.getMinutes() === 0){
//                                         morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
//                                     } else if(startBreakTime.getMinutes() === 30){
//                                         morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
//                                     }
//                                     for(let i = endBreakTime.getHours(); i < 12; i++){
//                                         if(endBreakTime.getMinutes() === 0){
//                                             for(let j = 0; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         } else if(endBreakTime.getMinutes() === 30){
//                                             for(let j = 30; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         }
//                                     }
//                                     for(let i = 12; i <= 22; i++){
//                                         for(let j = 0; j < 60; j += 30){
//                                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                         }
//                                     }
//                                     afternoonArr.push('23:00');
//                                 }
//                             // 브레이크 타임이 오전에 시작해서 오후에 끝나는 경우    
//                             } else if (endBreakTime.getHours() >= 12){
//                                 if(endTime.getHours() < 23){
//                                     for(let i = 8; i < startBreakTime.getHours(); i++){
//                                         if(startBreakTime.getMinutes() === 0){
//                                             for(let j = 0; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         } else if(startBreakTime.getMinutes() === 30){
//                                             for(let j = 30; j < 60; j += 30){
//                                                 morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                             }
//                                         }
//                                     }

//                                 } else if(endTime.getHours() >= 23){

//                                 }
//                             }
//                         } else if(startBreakTime.getHours() >= 12){

//                         } 

//                     // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
//                     } else if(8 <= startTime.getHours() < 12){
                       

//                     // 3-3. 오후 시작    
//                     } else if(startTime.getHours() > 12){
                       

//                     }
//                 // 2-2. 휴무인 날    
//                 } else {
//                     setIsOper(false);
//                     // operArr.push('00:00');
//                     setMorningArray('00:00');
//                     setAfternoonArray('00:00');
//                 }          
//             // 1-2. 브레이크 타임 없을 경우    
//             } else {
//                 // 2-1. 휴무 아닌 날
//                 if(data.operationTime[dayOfWeek] !== '휴무'){
//                     setIsOper(true);
//                     const operTimeOfDay = data.operationTime[dayOfWeek];

//                     // 날짜 문자열 자르기
//                     const strStartTime = operTimeOfDay.split('~')[0];
//                     const [strStartHour, strStartMinute] = strStartTime.split(':');
//                     const strEndTime = operTimeOfDay.split('~')[1];
//                     const [strEndHour, strEndMinute] = strEndTime.split(':');
                    
//                     // 선택한 날짜의 운영 시간 -> Date() 형태
//                     const startTime = new Date();
//                     startTime.setHours(parseInt(strStartHour));
//                     startTime.setMinutes(parseInt(strStartMinute));
//                     const endTime = new Date();
//                     endTime.setHours(parseInt(strEndHour));
//                     endTime.setMinutes(parseInt(strEndMinute));

//                     // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
//                     if(startTime.getHours() < 8){
//                         // 4-1. 마감 시간이 23시 이전인 경우
//                         if(endTime.getHours() <= 23){
//                             for(let i = 8; i < 12; i++){
//                                 for (let j = 0; j < 60; j += 30) {
//                                     morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             } for(let i = 12; i < endTime.getHours(); i++){
//                             for(let j = 0; j < 60; j += 30){
//                                 afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                             }
//                             }
//                             if (endTime.getMinutes() === 30) {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                             } else {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                             }
//                         // 4-2. 마감 시간이 23시 이후인 경우    
//                         } else {
//                             for(let i = 8; i < 12; i++){
//                                 for (let j = 0; j < 60; j += 30) {
//                                     morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             } for(let i = 12; i <= 22; i++){
//                                 for(let j = 0; j < 60; j += 30){
//                                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             }  
//                             afternoonArr.push('23:00');
//                         }
//                     // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
//                     } else if(8 <= startTime.getHours() < 12){
//                         // 4-1. 마감 시간이 23시 이전인 경우
//                         if(endTime.getHours() <= 23){
//                             for(let i = startTime.getHours(); i < 12; i++){
//                                 if(startTime.getMinutes() === 0){
//                                     for(let j = 0; j < 60; j += 30){
//                                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 } else if(startTime.getMinutes() === 30){
//                                     for (let j = 30; j < 60; j += 30) {
//                                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 }
//                             }
//                             for(let i = 12; i < endTime.getHours(); i++){
//                                 for (let j = 0; j < 60; j += 30) {
//                                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             }
//                             if (endTime.getMinutes() === 30) {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                             } else {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                             }
//                         // 4-2. 마감 시간이 23시 이후인 경우    
//                         } else {
//                             for(let i = startTime.getHours(); i < 12; i++){
//                                 if(startTime.getMinutes() === 0){
//                                     for(let j = 0; j < 60; j += 30){
//                                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 } else if(startTime.getMinutes() === 30){
//                                     for (let j = 30; j < 60; j += 30) {
//                                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 }
//                             }
//                             for(let i = 12; i <= 22; i++){
//                                 for(let j = 0; j < 60; j += 30){
//                                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             }  
//                             afternoonArr.push('23:00');
//                         }
//                     // 3-3. 오후 시작    
//                     } else if(startTime.getHours() >= 12){
//                         // 4-1. 마감 시간이 23시 이전인 경우
//                         if(endTime.getHours() <= 23){
//                         for(let i = startTime.getHours(); i < endTime.getHours(); i++){
//                             if(startTime.getMinutes() === 0){
//                                 for(let j = 0; j < 60; j += 30){
//                                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             } else if(startTime.getMinutes() === 30){
//                                 for(let j = 30; j < 60; j += 30){
//                                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                 }
//                             }
//                         }
//                         if (endTime.getMinutes() === 30) {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                         } else {
//                                 afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                         }
//                         // 4-2. 마감 시간이 23시 이후인 경우    
//                         } else {
//                             for(let i = startTime.getHours(); i <= 22; i++){
//                                 if(startTime.getMinutes() === 0){
//                                     for(let j = 0; j < 60; j += 30){
//                                         afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 } else if(startTime.getMinutes() === 30){
//                                     for(let j = 30; j < 60; j += 30){
//                                         afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                                     }
//                                 }
//                             }
//                             afternoonArr.push('23:00');
//                         }
//                     } 
//                 // 2-2. 휴무인 날    
//                 } else {
//                     setIsOper(false);
//                     // operArr.push('00:00')
//                     setMorningArray('00:00');
//                     setAfternoonArray('00:00');
//                 }          
//             }
//             setMorningArray(morningArr);
//             setAfternoonArray(afternoonArr);
//         }
//     )
// }

// if (data.operationTime.breakTime !== null) {
//     // 2-1. 휴무 아닌 날
//     if (data.operationTime[dayOfWeek] !== '휴무') {
//         setIsOper(true);
//         const operTimeOfDay = data.operationTime[dayOfWeek];
//         const operBreakTime = data.operationTime.breakTime;
//
//         // 날짜 문자열 자르기
//         const strStartTime = operTimeOfDay.split('~')[0];
//         const [strStartHour, strStartMinute] = strStartTime.split(':');
//         const strEndTime = operTimeOfDay.split('~')[1];
//         const [strEndHour, strEndMinute] = strEndTime.split(':');
//         const strStartBreak = operBreakTime.split('~')[0];
//         const [strStartBreakHour, strStartBreakMinute] = strStartBreak.split(':');
//         const strEndBreak = operBreakTime.split('~')[1];
//         const [strEndBreakHour, strEndBreakMinute] = strEndBreak.split(':');
//
//         // 선택한 날짜의 운영 시간 -> Date() 형태
//         const startTime = new Date();
//         startTime.setHours(parseInt(strStartHour));
//         startTime.setMinutes(parseInt(strStartMinute));
//         const startBreakTime = new Date();
//         startBreakTime.setHours(parseInt(strStartBreakHour));
//         startBreakTime.setMinutes(parseInt(strStartBreakMinute));
//         const endBreakTime = new Date();
//         endBreakTime.setHours(parseInt(strEndBreakHour));
//         endBreakTime.setMinutes(parseInt(strEndBreakMinute));
//         const endTime = new Date();
//         endTime.setHours(parseInt(strEndHour));
//         endTime.setMinutes(parseInt(strEndMinute));
//
//         console.log('Start Time:', startTime);
//         console.log('Break Start Time:', startBreakTime);
//         console.log('Break End Time:', endBreakTime);
//         console.log('End Time:', endTime);
//
//         const addTimeSlots = (arr, start, end) => {
//             for (let i = start.getHours(); i <= end.getHours(); i++) {
//                 const startMinute = (i === start.getHours()) ? start.getMinutes() : 0;
//                 const endMinute = (i === end.getHours()) ? end.getMinutes() : 60;
//                 for (let j = startMinute; j < endMinute; j += 30) {
//                     arr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                 }
//                 if (i === end.getHours() && (end.getMinutes() === 0 || end.getMinutes() === 30)) {
//                     arr.push(i.toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0'));
//                 }
//             }
//         };
//
//         // 운영 시간이 8시 미만일 때 8시부터 시작
//         const effectiveStartTime = new Date(startTime);
//         if (startTime.getHours() < 8) {
//             effectiveStartTime.setHours(8);
//             effectiveStartTime.setMinutes(0);
//         }
//
//         // 종료 시간이 23시 이후일 때 23시로 조정
//         const effectiveEndTime = new Date(endTime);
//         if (endTime.getHours() >= 23 || endTime.getHours() <= 8) {
//             effectiveEndTime.setHours(23);
//             effectiveEndTime.setMinutes(0);
//         }
//
//         // 오전 시간 추가 (8시 ~ 11:30)
//         if (effectiveStartTime.getHours() < 12) {
//             const morningEndTime = new Date(Math.min(effectiveEndTime, new Date(effectiveStartTime).setHours(11, 30, 0, 0)));
//             addTimeSlots(morningArr, effectiveStartTime, morningEndTime);
//             morningArr = morningArr.filter(time => {
//                 const [hour, minute] = time.split(':').map(Number);
//                 const currentTime = new Date();
//                 currentTime.setHours(hour);
//                 currentTime.setMinutes(minute);
//                 return !(currentTime >= startBreakTime && currentTime < endBreakTime);
//             });
//         }
//
//         // 오후 시간 추가 (12시 ~ 23:00)
//         if (effectiveEndTime.getHours() >= 12) {
//             const afternoonStartTime = new Date(Math.max(effectiveStartTime, new Date(effectiveEndTime).setHours(12, 0, 0, 0)));
//             addTimeSlots(afternoonArr, afternoonStartTime, effectiveEndTime);
//             afternoonArr = afternoonArr.filter(time => {
//                 const [hour, minute] = time.split(':').map(Number);
//                 const currentTime = new Date();
//                 currentTime.setHours(hour);
//                 currentTime.setMinutes(minute);
//                 return !(currentTime >= startBreakTime && currentTime < endBreakTime);
//             });
//         }
//
//         console.log('morningArr:', morningArr);
//         console.log('afternoonArr:', afternoonArr);
//
//         // setMorningArray(morningArr);
//         // setAfternoonArray(afternoonArr);
//
//     // 2-2. 휴무인 날
//     } else {
//         setIsOper(false);
//         morningArr.push('00:00');
//         afternoonArr.push('00:00');
//     }
// // 1-2. 브레이크 타임 없을 경우
// } else {
//     // 2-1. 휴무 아닌 날
//     if(data.operationTime[dayOfWeek] !== '휴무'){
//         setIsOper(true);
//         const operTimeOfDay = data.operationTime[dayOfWeek];
//
//         // 날짜 문자열 자르기
//         const strStartTime = operTimeOfDay.split('~')[0];
//         const [strStartHour, strStartMinute] = strStartTime.split(':');
//         const strEndTime = operTimeOfDay.split('~')[1];
//         const [strEndHour, strEndMinute] = strEndTime.split(':');
//
//         // 선택한 날짜의 운영 시간 -> Date() 형태
//         const startTime = new Date();
//         startTime.setHours(parseInt(strStartHour));
//         startTime.setMinutes(parseInt(strStartMinute));
//         const endTime = new Date();
//         endTime.setHours(parseInt(strEndHour));
//         endTime.setMinutes(parseInt(strEndMinute));
//
//         // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
//         if(startTime.getHours() < 8){
//             console.log('1111');
//             // 4-1. 마감 시간이 23시 이전인 경우
//             if(endTime.getHours() <= 23){
//                 for(let i = 8; i < 12; i++){
//                     for (let j = 0; j < 60; j += 30) {
//                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                     }
//                 } for(let i = 12; i < endTime.getHours(); i++){
//                 for(let j = 0; j < 60; j += 30){
//                     afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                 }
//                 }
//                 if (endTime.getMinutes() === 30) {
//                     afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                 } else {
//                     afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                 }
//             // 4-2. 마감 시간이 23시 이후인 경우
//             } else {
//                 for(let i = 8; i < 12; i++){
//                     for (let j = 0; j < 60; j += 30) {
//                         morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                     }
//                 } for(let i = 12; i <= 22; i++){
//                     for(let j = 0; j < 60; j += 30){
//                         afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                     }
//                 }
//                 afternoonArr.push('23:00');
//             }
//         // 3-2.오전 시작 : 장사 시작 시간이 8시 초과
//         } else if(8 <= startTime.getHours() && startTime.getHours() < 12){
//             console.log('2222');
//             // 4-1. 마감 시간이 23시 이전인 경우
//             if(endTime.getHours() <= 23){
//                 for(let i = startTime.getHours(); i < 12; i++){
//                     if(startTime.getMinutes() === 0){
//                         for(let j = 0; j < 60; j += 30){
//                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     } else if(startTime.getMinutes() === 30){
//                         for (let j = 30; j < 60; j += 30) {
//                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     }
//                 }
//                 for(let i = 12; i < endTime.getHours(); i++){
//                     for (let j = 0; j < 60; j += 30) {
//                         afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                     }
//                 }
//                 if (endTime.getMinutes() === 30) {
//                     afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                 } else {
//                     afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                 }
//             // 4-2. 마감 시간이 23시 이후인 경우
//             } else {
//                 for(let i = startTime.getHours(); i < 12; i++){
//                     if(startTime.getMinutes() === 0){
//                         for(let j = 0; j < 60; j += 30){
//                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     } else if(startTime.getMinutes() === 30){
//                         for (let j = 30; j < 60; j += 30) {
//                             morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     }
//                 }
//                 for(let i = 12; i <= 22; i++){
//                     for(let j = 0; j < 60; j += 30){
//                         afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                     }
//                 }
//                 afternoonArr.push('23:00');
//             }
//         // 3-3. 오후 시작
//         } else if(startTime.getHours() >= 12){
//             console.log('3333');
//             // 4-1. 마감 시간이 23시 이전인 경우 -> 새벽 마감인 경우에도 23 이하이므로 8 초과라는 조건을 더 줌줌
//             if(endTime.getHours() <= 23 && endTime.getHours() > 8){
//                 for(let i = startTime.getHours(); i < endTime.getHours(); i++){
//                     if(startTime.getMinutes() === 0){
//                         for(let j = 0; j < 60; j += 30){
//                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     } else if(startTime.getMinutes() === 30){
//                         for(let j = 30; j < 60; j += 30){
//                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     }
//                 }
//                 if (endTime.getMinutes() === 30) {
//                         afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
//                 } else {
//                         afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
//                 }
//             // 4-2. 마감 시간이 23시 이후인 경우 혹은 새벽 마감인 경우
//             } else {
//                 for(let i = startTime.getHours(); i <= 22; i++){
//                     if(startTime.getMinutes() === 0){
//                         for(let j = 0; j < 60; j += 30){
//                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     } else if(startTime.getMinutes() === 30){
//                         for(let j = 30; j < 60; j += 30){
//                             afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
//                         }
//                     }
//                 }
//                 afternoonArr.push('23:00');
//             }
//         }
//         console.log('4444');
//     // 2-2. 휴무인 날
//     } else {
//         setIsOper(false);
//         // operArr.push('00:00')
//         morningArr.push('00:00');
//         afternoonArr.push('00:00');
//     }
// }
// setMorningArray(morningArr);
// setAfternoonArray(afternoonArr);
// })