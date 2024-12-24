import { useEffect, useState } from 'react';
import '../css/reset.css';
import '../css/StoreInquiryInfo.css';
import '../css/StoreInquiryInfoMiddle.css';
import '../css/StoreInquiryInfoSmall.css';
import StoreUpdateReport from './StoreUpdateReport';
import AgreementModal from './AgreementModal';
import { getReoprtDTO } from '../api/reportInfoAPI';
import waitAnswer from '../img/waitAnswer.png';
import ResultSmallModal from './ResultSmallModal';

function StoreReportInfo({ reportNo, setIsReport, fetchList }){
    const [reportDTO, setReportDTO] = useState({});
    const [isAnswer, setIsAnswer] = useState(false);
    const [isContentOverflow, setIsContentOverflow] = useState(false);
    const [isAnswerContentOverflow, setIsAnswerContentOverflow] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [isAnswerContentExpanded, setIsAnswerContentExpanded] = useState(false);
    const [enterUpdate, setEnterUpdate] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');

    async function fetchInfo(reportNo) {
        const reportInfo = await getReoprtDTO(reportNo);
        if (reportInfo.reportContent.length > 300) {
            setIsContentOverflow(true);
        }
        if (reportInfo.answerDate) {
            setIsAnswer(true);
            if (reportInfo.answerContent.length > 300) {
                setIsAnswerContentOverflow(true);
            }
        }
        setReportDTO(reportInfo);
    }

    function handlerBack() {
        setIsReport(false);
        fetchList();
    }

    function handleToggleContent() {
        setIsContentExpanded(!isContentExpanded);
    }

    function handleToggleAnswerContent() {
        setIsAnswerContentExpanded(!isAnswerContentExpanded);
    }

    function handleDeleteInquiry() {
        setShowAgreementModal(true);
    }

    useEffect(() => {
        fetchInfo(reportNo);
    }, [reportNo]);

    function resultMessageHandler(message){
        setResultMessage(message);
    }


    if (enterUpdate) {
        return <StoreUpdateReport setEnterUpdate={setEnterUpdate} reportDTO={reportDTO} />;
    }

    return (
        <>
            <div id='inquiryInfoModal' className={(showResultModal || showAgreementModal)? 'underModal':''} >
                <div id="inquiryInfoText">신고 상세</div>
                <button id='backToInquiryListBtn' onClick={handlerBack}>이전</button>
                <button id='deleteInquiryBtn' onClick={handleDeleteInquiry}>삭제</button>
                <div id="inquiryInfoTitleText">신고 제목 : </div>
                <div id='inquiryInfoTitle'>{reportDTO.reportTitle}</div>
                <div id='inquiryInfoDate'>신고 일자 : <p>{reportDTO.reportDate}</p></div>
                <div id='inquiryInfoContent' className={isContentExpanded ? 'expanded' : ''}>
                    {reportDTO.reportContent}
                </div>
                {isContentOverflow && <button id='inquiryOverFlowBtn' className={isContentExpanded ? 'activeBtn' : ''} onClick={handleToggleContent}> {!isContentExpanded ? '더보기' : '줄이기'} </button>}
                {isAnswer && <div id='answerAreaIsAnswer'>
                    <div id='isAnswerTitleText'>답변 제목 : </div>
                    <div id='isAnswerTitle'>{reportDTO.answerTitle}</div>
                    <div id='isAnswerDate'>문의 일자 : <p>{reportDTO.answerDate}</p></div>
                    <div id='isAnswerContent' className={isAnswerContentExpanded ? 'expanded' : ''}>
                    {reportDTO.answerContent}</div>
                    {isAnswerContentOverflow && <button id='answerOverFlowBtn' className={isAnswerContentExpanded ? 'activeBtn' : ''} onClick={handleToggleAnswerContent}> {!isAnswerContentExpanded ? '더보기' : '줄이기'} </button>}
                </div>}

                {!isAnswer && <div id='answerAreaNoAnswer'>
                    <img id='noAnswerImg' src={waitAnswer} alt='로고' />
                    <div id="noAnswerContent">문의를 접수하는중 입니다! &nbsp; &nbsp; 관리자의 답변을 기다려 주세요</div>
                    <button id='noAnswerUpdateBtn' onClick={() => { setEnterUpdate(!enterUpdate); }}>수정</button>
                </div>}
            </div>
            {showAgreementModal && (
                <AgreementModal
                    message="해당 신고를 삭제하시겠습니까?"
                    onConfirm={() => {
                        // DELETE 요청 로직
                        fetch(`/reports/list/${reportNo}`, {
                            method: 'DELETE',
                        }).then((res) => {
                            if (res.ok) {
                                resultMessageHandler('신고가 성공적으로 삭제되었습니다.')
                                setShowResultModal(true);
                            } else {
                                resultMessageHandler('신고 삭제에 실패했습니다.')
                                setShowResultModal(true);
                            }
                        });
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <ResultSmallModal message={resultMessage} close={()=>{
                    setShowResultModal(false)
                    setIsReport(false);
                    fetchList();
                }}/>
            )}
        </>
    );

}
export default StoreReportInfo;