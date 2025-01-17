import '../css/QrCheck.css'
import { NavLink } from "react-router-dom";

function NotFoundQr(){

    return(
        <>
        <div className="qrBackground">
            <div className="qrResultMessage" style={{color: '#FF5D18'}}>해당 QR을 찾을 수 없습니다.</div>
            <img className="qrResultImg" src="/images/qrcheck/missMatch.png"/>
            <NavLink to="/"><button className="fromQrToMain">확인</button></NavLink>
        </div>
        </>
    )

}
export default NotFoundQr;