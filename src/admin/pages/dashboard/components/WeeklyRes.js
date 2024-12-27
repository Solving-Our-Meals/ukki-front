import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, elements } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

function WeeklyRes(data) {
    const filterData = Object.values(data);
    const labels = Object.keys(filterData[0]);
    const dataValues = Object.values(filterData[0]);
    const maxValue = Math.max(...dataValues)
    console.log(Math.floor(maxValue/50+1)*50)
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '예약 수',
                data: dataValues,
                borderColor: '#FEDA00',
                backgroundColor: '#FF8AA3',
                fill: true,
                pointBorderColor:'#FF8AA3',
                pointBackgroundColor: '#FFFFFF',
                pointBorderWidth: 3,
                pointHoverBorderWidth: 10
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        responsiveAnimationDuration: 1000,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
        },
        scales: {
            x: {
            },
            y: {
                min: 0,
                max: Math.floor(maxValue/50+1)*50,
                ticks:{
                    maxTicksLimit: 6,
                }
                
            },
        },
    };

    return <Line data={chartData} options={options} />;
}


export default WeeklyRes;
