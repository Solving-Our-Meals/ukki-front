import { useEffect, useState, useRef } from 'react';
import '../css/reset.css';
import '../css/doinquiry.css';
import AgreementModal from './AgreementModal';
import ResultSmallModal from './ResultSmallModal';

function StoreUpdateInquiry({ setEnterUpdate, inquiryDTO }) {
    const [inquiryTitle, setInquiryTitle] = useState(inquiryDTO.inquiryTitle);
    const [inquiryContent, setInquiryContent] = useState(inquiryDTO.inquiryContent);
    const [inquiryFile, setInquiryFile] = useState(null);
    const [isWrite, setIsWrite] = useState([false, false]);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [checkContent, setCheckContent] = useState(false);
    const fileInputRef = useRef(null);

    function handleTitleChange(e) {
        setInquiryTitle(e.target.value);
        setCheckContent(false);
        if (e.target.value === '' || e.target.value === null || e.target.value.length < 1) {
            isWrite[0] = false;
        } else {
            isWrite[0] = true;
        }
        setIsWrite([...isWrite]);
    }

    function handleContentChange(e) {
        setInquiryContent(e.target.value);
        setCheckContent(false);

        if (e.target.value === '' || e.target.value === null || e.target.value.length < 1) {
            isWrite[1] = false;
        } else {
            isWrite[1] = true;
        }
        setIsWrite([...isWrite]);
    }

    function handleFileChange(e) {
        setInquiryFile(e.target.files[0]);
    }

    function handleFileButtonClick() {
        fileInputRef.current.click();
    }

    function handleCancle() {
        setEnterUpdate(false);
    }

    function submit(e) {
        e.preventDefault();
        inquiryDTO.inquiryTitle = inquiryTitle;
        inquiryDTO.inquiryContent = inquiryContent;

        const formData = new FormData();
        const json = JSON.stringify(inquiryDTO);
        const blob = new Blob([json], { type: 'application/json' });
        formData.append("data", blob);
        if (inquiryFile) {
            formData.append("file", inquiryFile);
        }

        let isPass = isWrite.some(Boolean);
        if (isPass) {
            setCheckContent(false)
            let url = '/inquiries/list/' + inquiryDTO.inquiryNo;
            fetch(url, {
                method: "PUT",
                headers: {},
                body: formData
            }).then(res => {
                if (res.ok) {
                    setResultMessage('문의가 수정되었습니다.')
                    setShowResultModal(true)
                }else{
                    setResultMessage('문의 수정에 실패했습니다.')
                    setShowResultModal(true)
                }
            });
        }else{
            setCheckContent(true);
        }
    }

    useEffect(() => {
        console.log("Component mounted");
    }, []);

    return (
        <>
            <div id='doInquiryModal' className={(showResultModal || showAgreementModal)? 'underModal':''}>
                <div id='doInquiryText'>문의수정</div>
                <div id='doInquiryTitleText'>문의 제목: </div>
                <div id='inquiryDateAtUpdate'>문의 일자 : <p>{inquiryDTO.inquiryDate}</p></div>
                <form>
                    <input id='inputDoTitle' type='text' value={inquiryTitle} onChange={handleTitleChange} className={checkContent && !isWrite[0] ? 'error' : ''}  required />
                    <textarea id='inputDoContent' value={inquiryContent} onChange={handleContentChange} className={checkContent && !isWrite[1] ? 'error' : ''} required />
                    <input
                        type="file"
                        id="inquiryFile"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" id="inquiryDoFileBtn" onClick={handleFileButtonClick}>
                        첨부파일
                    </button>
                    <button type="button" id='inquiryDoCancleBtn' onClick={handleCancle}>취소</button>
                    <button id='doInquiryBtn' type='button' onClick={()=>setShowAgreementModal(true)}>확인</button>
                </form>
                {checkContent && !isWrite[0] && <div id='checkTitle'>내용을 확인해주세요</div>}
                {checkContent && !isWrite[1] && <div id='checkContent'>내용을 확인해주세요</div>}
            </div>
            {showAgreementModal && (
                <AgreementModal 
                    message='해당 문의를 수정하시겠습니까?'
                    onConfirm={(e) => {
                        submit(e);
                        setShowAgreementModal(false);
                    }}
                    onCancel={()=>setShowAgreementModal(false)}
                    />
            )}
            {showResultModal && (
                <ResultSmallModal
                    message={resultMessage}
                    close={()=>{
                        setShowResultModal(false)
                        setEnterUpdate(false)
                    }}/>
            )}
        </>
    );
}

export default StoreUpdateInquiry;
