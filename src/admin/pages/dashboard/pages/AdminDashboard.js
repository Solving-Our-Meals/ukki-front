import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../../../../common/reset/reset.css'
import '../css/AdminDashboard.css';
// import WeeklyRes from '../components/WeeklyRes';
import { fetchGraphData1 } from '../api/DashboardAPI';

const WeeklyRes = lazy(() => import('../components/WeeklyRes'));


function AdminDashboard(){

    const [data, setData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data1, data2, data3, data4, data5, data6] = await Promise.all([
                    fetchGraphData1(),
                    // fetchGraphData2(),
                    // fetchGraphData3(),
                    // fetchGraphData4(),
                    // fetchGraphData5(),
                    // fetchGraphData6()
                ]);
                setData({
                    graph1: data1,
                    // graph2: data2,
                    // graph3: data3,
                    // graph4: data4,
                    // graph5: data5,
                    // graph6: data6
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

    return(
        <>
        <div id='weeklyReservationCountText'>이번 주 예약 수</div>
        <Suspense fallback={<div>Loading graphs...</div>}>
            <div id='weeklyReservationCount'>
                <WeeklyRes data={data.graph1} />
            </div>
                
                {/* <MonthlyRes data={data.graph2} />
                <YearlyRes data={data.graph3} />
                <WeeklyRes data={data.graph4} />
                <MonthlyRes data={data.graph5} />
                <YearlyRes data={data.graph6} /> */}
            </Suspense>
        </>
    )
}
export default AdminDashboard;