import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../css/reset.css'
import '../css/AdminDashboard.css';
// import WeeklyRes from '../components/WeeklyRes';
import { fetchGraphData1, fetchGraphData2, fetchGraphData3, fetchGraphData4, fetchGraphData5, fetchGraphData6 } from '../api/DashboardAPI';

const WeeklyRes = lazy(() => import('../components/WeeklyRes'));
const TotalStores = lazy(() => import('../components/TotalStores'))
const TodayRes = lazy(() => import('../components/TodayRes'))
const MonthlyStores = lazy(() => import('../components/MonthlyStores'))
const MonthlyNoShow = lazy(() => import('../components/MonthlyNoshow'))
const ProcessingInquiry = lazy(() => import('../components/ProcessingInquiry'))

function AdminDashboard(){

    const [data, setData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data1, data2, data3, data4, data5, data6] = await Promise.all([
                    fetchGraphData1(),
                    fetchGraphData2(),
                    fetchGraphData3(),
                    fetchGraphData4(),
                    fetchGraphData5(),
                    fetchGraphData6()
                ]);
                setData({
                    graph1: data1,
                    graph2: data2,
                    graph3: data3,
                    graph4: data4,
                    graph5: data5,
                    graph6: data6
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>; // 데이터 로딩 중 표시
    }

    const today = new Date(); 
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }; 
    const formattedDate = today.toLocaleDateString('ko-KR', options).replace(/\//g, '-');

    return(
        <>
        <Suspense fallback={<div>Loading graphs...</div>}>
            <div id='weeklyReservationCountText'>이번 주 예약 수</div>
            <div id='weeklyReservationCount'>
                <WeeklyRes data={data.graph1} />
            </div>
            <div id='totalStoreCountText'>현재 제휴가게 수</div>
            <div id='totalStoreCount'>
                <TotalStores data={data.graph2}/>
            </div>
            <div id='todayResCountText'>오늘 예약 수</div>
            <div id='todayDate'>{formattedDate}</div>
            <div id='todayResCount'>
                <TodayRes data={data.graph3}/>
            </div>
            <div id='montlyStoreCountText'>월별 제휴가게 수</div>
            <MonthlyStores data={data.graph4} />
            <div id='montlyNoshowCountText'>이번달 노쇼 비율</div>
            <MonthlyNoShow data={data.graph5}/>
            <div id='processingInquiryText'>처리할 문의 수</div>
            <ProcessingInquiry data={data.graph6}/>
            </Suspense>
            <div id='processingInquiryGuide'>
                <div><div style={{backgroundColor: '#FF5D18'}}></div> 위험</div>
                <div><div style={{backgroundColor: '#EFE03B'}}></div> 주의</div>
                <div><div style={{backgroundColor: '#51CC16'}}></div> 양호</div>
            </div>
        </>
    )
}
export default AdminDashboard;