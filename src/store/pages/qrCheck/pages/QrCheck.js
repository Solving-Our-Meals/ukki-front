import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import '../css/QrCheck.css'
import {getQrInfo} from "../api/QrInfoAPI";
import ExistenceQr from "../components/ExistenxeQr";
import NotFoundQr from "../components/NotFoundQr";
import LodingPage from "../../../../admin/components/LoadingPage";


function QrCheck(){
    const {qrName} = useParams();
    const [qrInfo, setQrInfo] = useState({})
    const [isExistenceQr, setIsExistenceQr] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchQrInfo(qrName){
        setIsLoading(true);
    const qr = await getQrInfo(qrName);
    if(qr){
        setIsExistenceQr(true);

        setQrInfo(qr);
        setIsLoading(false);

    }
    else{
        setIsExistenceQr(false)
        setIsLoading(false);
    }
    }
    




    useEffect(()=>{
        fetchQrInfo(qrName);
    },[qrName])


    if(isLoading){
        return <LodingPage/>
    }
    return(
        
        <>
        {isExistenceQr && <ExistenceQr/>}
        {!isExistenceQr && <NotFoundQr/>}
        </>

    
    )

}

export default QrCheck;