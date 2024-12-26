import "./css/AdminLayout.css"
import AdminHeader from "../components/AdminHeader";
import AdminNavBar from "../components/AdminNavBar";
import { Outlet } from "react-router-dom";

function AdminLayout(){

    return(
        <>
        <div id="adminBackground">
            <AdminHeader/>
            <AdminNavBar/>
        <div id="renderingArea">
            <Outlet/>
        </div>
        </div>
        </>
    )

}
export default AdminLayout;