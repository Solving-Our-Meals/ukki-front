import { useEffect, useState } from 'react';
import '../css/reset.css';
import '../css/doinquiry.css';
import AgreementModal from './AgreementModal';
import ResultSmallModal from './ResultSmallModal';

function StoreUpdateReport({ setEnterUpdate, reportDTO }) {
    const [reportTitle, setReportTitle] = useState(reportDTO.reportTitle);
    const [reportContent, setReportContent] = useState(reportDTO.reportContent);
    const [isWrite, setIsWrite] = useState([false, false]);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [checkContent, setCheckContent] = useState(false);

    function handleTitleChange(e) {
        setReportTitle(e.target.value);
        setCheckContent(false);
        if (e.target.value === '' || e.target.value === null || e.target.value.length < 1) {
            isWrite[0] = false;
        } else {
            isWrite[0] = true;
        }
        setIsWrite([...isWrite]);
    }

    function handleContentChange(e) {
        setReportContent(e.target.value);
        setCheckContent(false);

        if (e.target.value === '' || e.target.value === null || e.target.value.length < 1) {
            isWrite[1] = false;
        } else {
            isWrite[1] = true;
        }
        setIsWrite([...isWrite]);
    }

    function handleCancle() {
        setEnterUpdate(false);
    }

    function submit(e) {
        e.preventDefault();
        reportDTO.reportTitle = reportTitle;
        reportDTO.reportContent = reportContent;

        const formData = new FormData();
        const json = JSON.stringify(reportDTO);
        const blob = new Blob([json], { type: 'application/json' });
        formData.append("data", blob);
        let isPass = isWrite.some(Boolean);
        if (isPass) {
            setCheckContent(false)
            let url = '/inquiries/list/' + reportDTO.reportNo;
            fetch(url, {
                method: "PUT",
                headers: {},
                body: formData
            }).then(res => {
                if (res.ok) {
                    setResultMessage('신고가 수정되었습니다.')
                    setShowResultModal(true)
                }else{
                    setResultMessage('신고 수정에 실패했습니다.')
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
            <div id='doInquiryModal'>
                <div id='doInquiryText'>신고수정</div>
                <div id='doInquiryTitleText'>신고 제목: </div>
                <div id='inquiryDateAtUpdate'>신고 일자 : <p>{reportDTO.reportDate}</p></div>
                <form>
                    <input id='inputDoTitle' type='text' value={reportTitle} onChange={handleTitleChange} className={checkContent && !isWrite[0] ? 'error' : ''}  required />
                    <textarea id='inputDoContent' value={reportContent} onChange={handleContentChange} className={checkContent && !isWrite[1] ? 'error' : ''} required />
                    <button type="button" id='inquiryDoCancleBtn' onClick={handleCancle}>취소</button>
                    <button id='doInquiryBtn' type='button' onClick={()=>setShowAgreementModal(true)}>확인</button>
                </form>
                {checkContent && !isWrite[0] && <div id='checkTitle'>내용을 확인해주세요</div>}
                {checkContent && !isWrite[1] && <div id='checkContent'>내용을 확인해주세요</div>}
            </div>
            {showAgreementModal && (
                <AgreementModal 
                    message='해당 신고를 수정하시겠습니까?'
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

export default StoreUpdateReport;
