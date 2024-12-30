function test(){
    useEffect(
        () => {

            let morningArr = [];
            let afternoonArr = [];
            // let operArr = [];

            // 1-1. 브레이크 타임 있을 경우
            if(data.operationTime.breakTime !== null){
                // 2-1. 휴무 아닌 날
                if(data.operationTime[dayOfWeek] !== '휴무'){
                    setIsOper(true);
                    const operTimeOfDay = data.operationTime[dayOfWeek];
                    const operBreakTime = data.operationTime.breakTime;

                    // 날짜 문자열 자르기
                    const strStartTime = operTimeOfDay.split('~')[0];
                    const [strStartHour, strStartMinute] = strStartTime.split(':');
                    const strEndTime = operTimeOfDay.split('~')[1];
                    const [strEndHour, strEndMinute] = strEndTime.split(':');
                    const strStartBreak = operBreakTime.split('~')[0];
                    const [strStartBreakHour, strStartBreakMinute] = strStartBreak.split(':');
                    const strEndBreak = operBreakTime.split('~')[1];
                    const [strEndBreakHour, strEndBreakMinute] = strEndBreak.split(':');
                    
                    // 선택한 날짜의 운영 시간 -> Date() 형태
                    const startTime = new Date();
                    startTime.setHours(parseInt(strStartHour));
                    startTime.setMinutes(parseInt(strStartMinute));
                    const startBreakTime = new Date();
                    startBreakTime.setHours(parseInt(strStartBreakHour));
                    startBreakTime.setMinutes(parseInt(strStartBreakMinute));
                    const endBreakTime = new Date();
                    endBreakTime.setHours(parseInt(strEndBreakHour));
                    endBreakTime.setMinutes(parseInt(strEndBreakMinute));
                    const endTime = new Date();
                    endTime.setHours(parseInt(strEndHour));
                    endTime.setMinutes(parseInt(strEndMinute));

                    // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
                    if(startTime.getHours() < 8){
                        // 브레이크 타임이 오전부터 시작하는 경우
                        if(startBreakTimebreakTime.getHours() > startTime.getHours() && startBreakTime.getHours() < 12 ){
                            // 브레이크 타임이 오전에 끝나는 경우 
                            if(endBreakTime.getHours() < 12){
                                // 장사가 23시 이전에 끝나는 경우
                                if(endTime.getHours() < 23){
                                    for(let i = 8; i < startBreakTime.getHours(); i++){
                                        for(let j = 0; j < 60; j += 30){
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                    if(startBreakTime.getMinutes() === 0){
                                        morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
                                    } else if(startBreakTime.getMinutes() === 30){
                                        morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
                                    }
                                    for(let i = endBreakTime.getHours(); i < 12; i++){
                                        if(endBreakTime.getMinutes() === 0){
                                            for(let j = 0; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        } else if(endBreakTime.getMinutes() === 30){
                                            for(let j = 30; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        }
                                    }
                                    for(let  i = 12; i < endTime.getHours(); i++){
                                        for(let j = 0; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                    if(endTime.getMinutes() === 0){
                                        afternoonArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
                                    } else if(endTime.getMinutes() === 30){
                                        afternoonArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
                                    }
                                // 장사가 23시 이후에 끝나는 경우우    
                                } else if(endTime.getHours() >= 23){
                                    for(let i = 8; i < startBreakTime.getHours(); i++){
                                        for(let j = 0; j < 60; j += 30){
                                            morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                    if(startBreakTime.getMinutes() === 0){
                                        morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':00');
                                    } else if(startBreakTime.getMinutes() === 30){
                                        morningArr.push(startBreakTime.getHours().toString().padStart(2, '0') + ':30');
                                    }
                                    for(let i = endBreakTime.getHours(); i < 12; i++){
                                        if(endBreakTime.getMinutes() === 0){
                                            for(let j = 0; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        } else if(endBreakTime.getMinutes() === 30){
                                            for(let j = 30; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        }
                                    }
                                    for(let i = 12; i <= 22; i++){
                                        for(let j = 0; j < 60; j += 30){
                                            afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                        }
                                    }
                                    afternoonArr.push('23:00');
                                }
                            // 브레이크 타임이 오전에 시작해서 오후에 끝나는 경우    
                            } else if (endBreakTime.getHours() >= 12){
                                if(endTime.getHours() < 23){
                                    for(let i = 8; i < startBreakTime.getHours(); i++){
                                        if(startBreakTime.getMinutes() === 0){
                                            for(let j = 0; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        } else if(startBreakTime.getMinutes() === 30){
                                            for(let j = 30; j < 60; j += 30){
                                                morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                            }
                                        }
                                    }

                                } else if(endTime.getHours() >= 23){

                                }
                            }
                        } else if(startBreakTime.getHours() >= 12){

                        } 

                    // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
                    } else if(8 <= startTime.getHours() < 12){
                       

                    // 3-3. 오후 시작    
                    } else if(startTime.getHours() > 12){
                       

                    }
                // 2-2. 휴무인 날    
                } else {
                    setIsOper(false);
                    // operArr.push('00:00');
                    setMorningArray('00:00');
                    setAfternoonArray('00:00');
                }          
            // 1-2. 브레이크 타임 없을 경우    
            } else {
                // 2-1. 휴무 아닌 날
                if(data.operationTime[dayOfWeek] !== '휴무'){
                    setIsOper(true);
                    const operTimeOfDay = data.operationTime[dayOfWeek];

                    // 날짜 문자열 자르기
                    const strStartTime = operTimeOfDay.split('~')[0];
                    const [strStartHour, strStartMinute] = strStartTime.split(':');
                    const strEndTime = operTimeOfDay.split('~')[1];
                    const [strEndHour, strEndMinute] = strEndTime.split(':');
                    
                    // 선택한 날짜의 운영 시간 -> Date() 형태
                    const startTime = new Date();
                    startTime.setHours(parseInt(strStartHour));
                    startTime.setMinutes(parseInt(strStartMinute));
                    const endTime = new Date();
                    endTime.setHours(parseInt(strEndHour));
                    endTime.setMinutes(parseInt(strEndMinute));

                    // 3-1. 오전 시작 : 장사 시작 시간이 8시 미만일 경우
                    if(startTime.getHours() < 8){
                        // 4-1. 마감 시간이 23시 이전인 경우
                        if(endTime.getHours() <= 23){
                            for(let i = 8; i < 12; i++){
                                for (let j = 0; j < 60; j += 30) {
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } for(let i = 12; i < endTime.getHours(); i++){
                            for(let j = 0; j < 60; j += 30){
                                afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                            }
                            }
                            if (endTime.getMinutes() === 30) {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                            } else {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                            }
                        // 4-2. 마감 시간이 23시 이후인 경우    
                        } else {
                            for(let i = 8; i < 12; i++){
                                for (let j = 0; j < 60; j += 30) {
                                    morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } for(let i = 12; i <= 22; i++){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }  
                            afternoonArr.push('23:00');
                        }
                    // 3-2.오전 시작 : 장사 시작 시간이 8시 초과   
                    } else if(8 <= startTime.getHours() < 12){
                        // 4-1. 마감 시간이 23시 이전인 경우
                        if(endTime.getHours() <= 23){
                            for(let i = startTime.getHours(); i < 12; i++){
                                if(startTime.getMinutes() === 0){
                                    for(let j = 0; j < 60; j += 30){
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                } else if(startTime.getMinutes() === 30){
                                    for (let j = 30; j < 60; j += 30) {
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }
                            }
                            for(let i = 12; i < endTime.getHours(); i++){
                                for (let j = 0; j < 60; j += 30) {
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                            if (endTime.getMinutes() === 30) {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                            } else {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                            }
                        // 4-2. 마감 시간이 23시 이후인 경우    
                        } else {
                            for(let i = startTime.getHours(); i < 12; i++){
                                if(startTime.getMinutes() === 0){
                                    for(let j = 0; j < 60; j += 30){
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                } else if(startTime.getMinutes() === 30){
                                    for (let j = 30; j < 60; j += 30) {
                                        morningArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }
                            }
                            for(let i = 12; i <= 22; i++){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }  
                            afternoonArr.push('23:00');
                        }
                    // 3-3. 오후 시작    
                    } else if(startTime.getHours() >= 12){
                        // 4-1. 마감 시간이 23시 이전인 경우
                        if(endTime.getHours() <= 23){
                        for(let i = startTime.getHours(); i < endTime.getHours(); i++){
                            if(startTime.getMinutes() === 0){
                                for(let j = 0; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            } else if(startTime.getMinutes() === 30){
                                for(let j = 30; j < 60; j += 30){
                                    afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                }
                            }
                        }
                        if (endTime.getMinutes() === 30) {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':30');
                        } else {
                                afternoonArr.push(endTime.getHours().toString().padStart(2, '0') + ':00');
                        }
                        // 4-2. 마감 시간이 23시 이후인 경우    
                        } else {
                            for(let i = startTime.getHours(); i <= 22; i++){
                                if(startTime.getMinutes() === 0){
                                    for(let j = 0; j < 60; j += 30){
                                        afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                } else if(startTime.getMinutes() === 30){
                                    for(let j = 30; j < 60; j += 30){
                                        afternoonArr.push(i.toString().padStart(2, '0') + ':' + j.toString().padStart(2, '0'));
                                    }
                                }
                            }
                            afternoonArr.push('23:00');
                        }
                    } 
                // 2-2. 휴무인 날    
                } else {
                    setIsOper(false);
                    // operArr.push('00:00')
                    setMorningArray('00:00');
                    setAfternoonArray('00:00');
                }          
            }
            setMorningArray(morningArr);
            setAfternoonArray(afternoonArr);
        }
    )
}