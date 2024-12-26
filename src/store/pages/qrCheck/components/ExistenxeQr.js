import { useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import '../css/QrCheck.css'
import '../../../../common/inquiry/css/reset.css'
import { NavLink } from "react-router-dom";

function ExistenceQr(qrInfo){
    const {qrName} = useParams();
    const navigate = useNavigate();
    const [isInputFocus, setIsInputFocus] = useState(false);
    const [defaultPage, setDefaultPage] = useState(true);
    const [inputStoreNo, setInputStoreNo] = useState(null);

    function handlerInputStoreNo(e){
        console.log(e.target.value)
        setInputStoreNo(e.target.value)
    }

    function handlerConfirmStoreNo(){
        console.log(qrInfo)
        console.log(qrInfo.qrInfo.storeNo)
        if(qrInfo.qrInfo.storeNo == inputStoreNo){
            let url = `/qr/`+qrName+`/confirm` 
            navigate(url);
        }else{
            setDefaultPage(false)
        }
    }

    function handlerInputFocus(){
        setIsInputFocus(true)
        setDefaultPage(true)
    }
    function handlerInputFocusOut(){
        setIsInputFocus(false)
    }

    return(
    <>
        <div id='qrCheckBackground'>
            <div id='inputStoreNoText'>가게 번호 입력</div>
            <input id='inputStoreNoAtQr' type='password' placeholder="가게 번호를 입력해주세요." value={inputStoreNo} onChange={handlerInputStoreNo} onFocus={handlerInputFocus} onBlur={handlerInputFocusOut}/>
            {defaultPage && <>
                            <div className='checkStoreNo'><NavLink to="/auth/login">가게번호 확인하기</NavLink></div>
                            <button className='confirmStoreNoBtn' onClick={handlerConfirmStoreNo}>확인</button>
                            <img src='/images/qrcheck/qrCheckDefaultImg.png' id="qrCheckDefaultImg" alt='defaultImg' className={isInputFocus? "qrCheckDefaultImg hidden" : "qrCheckDefaultImg"}/>
            </>}
            {!defaultPage && <>
                        <div id="qrFailMessage">가게 번호가 잘못 입력되었습니다</div>
                        <button className='confirmStoreNoBtn'>확인</button>
                        <div className='checkStoreNoFail'><NavLink to="/auth/login">가게번호 확인하기</NavLink></div>
                        <img src='/images/qrcheck/missMatch.png' id="qrCheckFailImg" alt='defaultImg' className="image-visible"/>
                        </>}
        </div>
    </>
    )
}
export default ExistenceQr