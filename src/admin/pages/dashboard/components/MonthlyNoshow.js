import { useState } from "react";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MonthlyNoshow(data){

    const filterData = Object.values(data);
    const dataValues = Object.values(filterData[0]);
    console.log(dataValues);

    const datas = {
        labels: ['월간 확인 예약', '월간 노쇼'],
        datasets: [
            {
                data: [dataValues[0]-dataValues[1], dataValues[1]],
                backgroundColor: ['#FEDA00', '#FF5D18'],
                borderWidth: 0,
            }
        ]
    };

    const Options = {
        maintainAspectRatio: false,
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
        <div id="montlyNoshowContent">{`총 ${dataValues[0]}건 중 `}<p>{dataValues[1]}</p>건</div>
        <div id='montlyNoshowCount'>
        <Pie data={datas} options={Options}></Pie>
        </div>
        </>
    );
}