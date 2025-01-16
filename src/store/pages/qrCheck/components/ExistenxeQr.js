import '../css/QrCheck.css'
import { NavLink } from "react-router-dom";

function ExistenceQr(){
    
    return(
        <>
        <div className="qrBackground">
            <div className="qrResultMessage" style={{color: '#51CC16'}}>예약 확인이 완료되었습니다!</div>
            <img className="qrResultImg" src="/images/qrcheck/successConfirm.png"/>
            <NavLink to="/"><button className="fromQrToMain">확인</button></NavLink>
        </div>
        </>
    )
}
export default ExistenceQr