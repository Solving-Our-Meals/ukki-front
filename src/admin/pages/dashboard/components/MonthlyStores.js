import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function MonthlyStores({ data }) {

  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [viewMinusArrow, setViewMinusArrow] = useState(true);
  const [viewPlusArrow, setViewPlusArrow] = useState(true);

  const safeData = data || [];
  
  const groupbyYearData = {}
  for(let item of safeData){
    if(!groupbyYearData[item.year]){
        groupbyYearData[item.year] = [];
    }
    groupbyYearData[item.year].push(item);
  }
  console.log(groupbyYearData);
  useEffect(()=>{
    viewMinusArrowHandler(selectedYear-1);
    viewPlusArrowHandler(selectedYear+1);
  },[selectedYear])

  const selectedYearData = groupbyYearData[selectedYear] || [];
  const maxValue = Math.max(...selectedYearData.map(item => item.registStore || 0), 0);

  function viewMinusArrowHandler(year){
    if(!Object.keys(groupbyYearData).find(e => e === year.toString())){
        setViewMinusArrow(false);
    }else{
        setViewMinusArrow(true);
    }
  }
  function viewPlusArrowHandler(year){
    if(!Object.keys(groupbyYearData).find(e => e === year.toString())){
        setViewPlusArrow(false);
    }else{
        setViewPlusArrow(true);
    }
  }

  const chartData = selectedYearData.map(item => {
    const label = item.month + '월';
    return {
      labels: label,
      data: item.registStore || 0
    }
  });

  const chartConfig = {
    labels: chartData.map(item => item.labels),
    datasets: [
      {
        label: '등록된 가게 수',
        data: chartData.map(item => item.data),
        backgroundColor: '#FF8AA3',
        borderWidth: 0,
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
      y: {
        beginAtZero: true,
        title: {
          display: false,
        },
        min: 0,
        max: Math.floor(maxValue/5+1)*5,
        ticks:{
            maxTicksLimit: 6,
        }
      },
      x: {
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <div id='montlyStoreYear'>
          {viewMinusArrow? <button value={selectedYear} onClick={() => setSelectedYear(selectedYear-1)} className='monthlyYearBtn'>◀</button>: <div>&nbsp;&nbsp;</div>}
          <pre>{selectedYear}</pre>
          {viewPlusArrow? <button value={selectedYear} onClick={() => setSelectedYear(selectedYear+1)} className='monthlyYearBtn'>▶</button>: <div>&nbsp;&nbsp;</div>}
      </div>
    <div id='montlyStoreCount'>
      <Bar data={chartConfig} options={options} />
    </div>
    </>
  );
}
