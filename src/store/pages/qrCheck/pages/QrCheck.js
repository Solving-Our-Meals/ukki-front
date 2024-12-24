import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import '../css/QrCheck.css'
import '../../../../common/inquiry/css/reset.css'
import {getQrInfo} from "../api/QrInfoAPI";
import ExistenceQr from "../components/ExistenxeQr";
import NotFoundQr from "../components/NotFoundQr";


function QrCheck(){
    const {qrName} = useParams();
    const [qrInfo, setQrInfo] = useState({})
    const [isExistenceQr, setIsExistenceQr] = useState(false);

    async function fetchQrInfo(qrName){
    const qr = await getQrInfo(qrName);
    if(qr){
        setIsExistenceQr(true);
        setQrInfo(qr);
            
    }
    else{
        setIsExistenceQr(false)
    }
    }
    



    useEffect(()=>{
        fetchQrInfo(qrName);
    },[qrName])

    return(
        
        <>
        {isExistenceQr && <ExistenceQr qrInfo={qrInfo}/>}
        {!isExistenceQr && <NotFoundQr/>}
        </>
    
    )

}

export default QrCheck;