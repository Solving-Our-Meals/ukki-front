import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ProcessingInquiry({ data }) {

    const [color, setColor] = useState("");

    useEffect(()=>{
        if(data['processing']<=30){
            setColor("#51CC16")
        }else if(data['processing']<=60 && data['processing']>30){
            setColor("#EFE03B")
        }else{
            setColor("#FF5D18")
        }
    },[])

    const datas = {
        datasets: [
            {
                label: '처리할 문의 수',
                data: data,
                backgroundColor: color,
                borderWidth: 0,
                barThickness: 200,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
                beginAtZero: true,
                min: 0,
                max: 100,
            },
        },
    };

    return (
        <>
            <div id='processingInquiryCount'>
                <Bar data={datas} options={options} />
                <div className='line1'></div>
                <div className='line2'></div>
                <div className='count'>{data['processing']}건</div>
            </div>
        </>
    );
}
