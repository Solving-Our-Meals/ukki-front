import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";

function BossLayout(){

    return(
        <>
            <Header/>
            <Outlet/>
            {/* <Footer/> */}
            <FloatingBar/>
        </>
    );
}
export default BossLayout;