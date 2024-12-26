import '../css/AdminDashboard.css';
import WeeklyRes from "../components/WeeklyRes";

function AdminDashboard(){
    return(
        <>
        <div>대시보드다!</div>
        <div id='weeklyReservatonCount'>
            <WeeklyRes/>
        </div>
        </>
    )
}
export default AdminDashboard;