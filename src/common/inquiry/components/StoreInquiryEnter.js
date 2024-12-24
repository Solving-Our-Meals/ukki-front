import {useEffect, useState} from 'react'
import '../css/reset.css';
import '../css/storeInquiryEnter.css'
import StoreDoInquiry from './StoreDoInquiry';
import StoreInquiryList from './StoreInquiryList';

function InquiryEnter(){
    const [inquiryList, setInquiryList] = useState(false);
    const [storeDoInquiry, setStoreDoInquiry] = useState(false);
    const [isLittleInquiryModal, setIsLittleInquiryModal] = useState(true);

    useEffect(()=>{},[])

    function handlerEnterDoInquiry(){
        setStoreDoInquiry(true);
        setIsLittleInquiryModal(false)
    }

    function handlerCancleInquiryEnter(){
        setIsLittleInquiryModal(false)
    }

    function handlerEnterInquiryList(){
        setInquiryList(true);
        setIsLittleInquiryModal(false)
    }

    return(
        <>
            {isLittleInquiryModal &&
            <div id='littleInquiryModal'>
                <div id='inquiryEnterText'>문의</div>
                <button id='cancleEnterInquiryBtn' onClick={handlerCancleInquiryEnter}>확인</button>
                <button id='enterInquiryListBtn' onClick={handlerEnterInquiryList}>문의내역</button>
                <button id='enterDoInquiryBtn' onClick={handlerEnterDoInquiry}>문의하기</button>
            </div>
            }
            {storeDoInquiry && <StoreDoInquiry setStoreDoInquiry={setStoreDoInquiry} setIsLittleInquiryModal={setIsLittleInquiryModal}/>}
            {inquiryList && <StoreInquiryList setInquiryList={setInquiryList} setIsLittleInquiryModal={setIsLittleInquiryModal}/>}
        </>
    )
}

export default InquiryEnter;