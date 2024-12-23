import { useEffect, useState } from 'react';
import '../css/reset.css';
import '../css/StoreInquiryInfo.css';
import '../css/StoreInquiryInfoMiddle.css';
import '../css/StoreInquiryInfoSmall.css';
import StoreUpdateInquiry from './StoreUpdateInquiry';
import AgreementModal from './AgreementModal';
import { getInquiryDTO } from '../api/inquiryInfoAPI';
import waitAnswer from '../img/waitAnswer.png';
import ResultSmallModal from './ResultSmallModal';

function StoreInquiryInfo({ inquiryNo, setIsInquiry, fetchList }) {
    const [inquiryDTO, setInquiryDTO] = useState({});
    const [isAnswer, setIsAnswer] = useState(false);
    const [isContentOverflow, setIsContentOverflow] = useState(false);
    const [isAnswerContentOverflow, setIsAnswerContentOverflow] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [isAnswerContentExpanded, setIsAnswerContentExpanded] = useState(false);
    const [enterUpdate, setEnterUpdate] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');

    async function fetchInfo(inquiryNo) {
        const inquiryInfo = await getInquiryDTO(inquiryNo);
        if (inquiryInfo.inquiryContent.length > 300) {
            setIsContentOverflow(true);
        }
        if (inquiryInfo.answerDate) {
            setIsAnswer(true);
            if (inquiryInfo.answerContent.length > 300) {
                setIsAnswerContentOverflow(true);
            }
        }
        setInquiryDTO(inquiryInfo);
    }

    function handlerBack() {
        setIsInquiry(false);
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
        fetchInfo(inquiryNo);
    }, [inquiryNo]);

    function resultMessageHandler(message){
        setResultMessage(message);
    }


    if (enterUpdate) {
        return <StoreUpdateInquiry setEnterUpdate={setEnterUpdate} inquiryDTO={inquiryDTO} />;
    }

    return (
        <>
            <div id='inquiryInfoModal'>
                <div id="inquiryInfoText">문의 상세</div>
                <button id='backToInquiryListBtn' onClick={handlerBack}>이전</button>
                <button id='deleteInquiryBtn' onClick={handleDeleteInquiry}>삭제</button>
                <div id="inquiryInfoTitleText">문의 제목 : </div>
                <div id='inquiryInfoTitle'>{inquiryDTO.inquiryTitle}</div>
                <div id='inquiryInfoDate'>문의 일자 : <p>{inquiryDTO.inquiryDate}</p></div>
                <div id='inquiryInfoContent' className={isContentExpanded ? 'expanded' : ''}>
                    {inquiryDTO.inquiryContent}
                </div>
                {isContentOverflow && <button id='inquiryOverFlowBtn' className={isContentExpanded ? 'activeBtn' : ''} onClick={handleToggleContent}> {!isContentExpanded ? '더보기' : '줄이기'} </button>}
                {inquiryDTO.file && <div id='inquiryInfoFile'>첨부파일</div>}
                {isAnswer && <div id='answerAreaIsAnswer'>
                    <div id='isAnswerTitleText'>답변 제목 : </div>
                    <div id='isAnswerTitle'>{inquiryDTO.answerTitle}</div>
                    <div id='isAnswerDate'>문의 일자 : <p>{inquiryDTO.answerDate}</p></div>
                    <div id='isAnswerContent' className={isAnswerContentExpanded ? 'expanded' : ''}>
                    {inquiryDTO.answerContent}</div>
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
                    message="해당 문의를 삭제하시겠습니까?"
                    onConfirm={() => {
                        // DELETE 요청 로직
                        fetch(`/inquiries/list/${inquiryNo}`, {
                            method: 'DELETE',
                        }).then((res) => {
                            if (res.ok) {
                                resultMessageHandler('문의가 성공적으로 삭제되었습니다.')
                                setShowResultModal(true);
                            } else {
                                resultMessageHandler('문의 삭제에 실패했습니다.')
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
                    setIsInquiry(false);
                    fetchList();
                }}/>
            )}
        </>
    );
}

export default StoreInquiryInfo;
