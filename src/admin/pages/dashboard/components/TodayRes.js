import { useState, useEffect } from "react";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TodayReservationGraph(data){

    const filterData = Object.values(data);
    const dataValues = Object.values(filterData[0]);

    const [isAchievement, setIsAchievement] = useState(false);
    
    useEffect(() => 
        { if (dataValues[0] >= 300) { 
            setIsAchievement(true); 
        } else { 
            setIsAchievement(false); 
        } }, [dataValues]);

    const fail = {
        labels: ["현재 예약 수", "남은 목표 수"],
        datasets: [
            {
                data: [dataValues, (300-dataValues)],
                backgroundColor: ['#FEDA00', '#ffffff']
            }
        ]
    };

    const achieve = {
        labels: ["현재 예약 수"],
        datasets: [
            {
                data: [dataValues],
                backgroundColor: ['#51CC16']
            }
        ]
    };

    const Options = {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
        },
    };

    return (
        <>
        <div id='todayResCountInner' className={isAchievement? 'pass':''}>{dataValues}</div>
        <Doughnut data={isAchievement? achieve : fail} options={Options}></Doughnut>
        </>
    );
}