import { useParams, NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import '../css/QrConfirm.css'
import '../../../../common/inquiry/css/reset.css'

function QrConfirm(){
    const qrName = useParams();
    const [message, setMessage] = useState("");

    useEffect(()=>{
        console.log(qrName)
        let url = '/qr/'+qrName.qrName+'/confirm'
            fetch(url, {
                method: "PUT",
                headers: {},
            }).then(res => {
               return res.json();
            }).then(data=>{
                setMessage(data.message)
            })
    },[qrName])

    return(
        <>
        <div className="qrBackground">
            <div className="qrResultMessage">{message}</div>
            <img className="qrResultImg" src="/images/qrcheck/successConfirm.png"/>
            <NavLink to="/"><button className="fromQrToMain">확인</button></NavLink>
        </div>
        </>
    )

}
export default QrConfirm