import '../css/QrCheck.css'
import { NavLink } from "react-router-dom";
import successConfirm from '../css/images/successConfirm.png'

function ExistenceQr(){
    
    return(
        <>
        <div className="qrBackground">
            <div className="qrResultMessage" style={{color: '#51CC16'}}>예약 확인이 완료되었습니다!</div>
            <img className="qrResultImg" src={successConfirm}/>
            <NavLink to="/"><button className="fromQrToMain">확인</button></NavLink>
        </div>
        </>
    )
}
export default ExistenceQr