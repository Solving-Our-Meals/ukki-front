import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import noAnswerLogo from '../images/noAnswerLogo.png';
import styles from '../css/specificInquiry.module.css';

function SpecificInquiry(){

    const navigate = useNavigate();
    const { inquiryNo } = useParams();
    const [searchParams] = useSearchParams(); 
    const categoryNo = searchParams.get('categoryNo');
    const [inquiryInfo, setInquiryInfo] = useState({});
    const [realDeleteInquiry, setRealDeleteInquiry] = useState(false);
    const [isCompleteDeleteInquiry, setIsCompleteDeleteInquiry] = useState(false);
    const [completeOrFailDeleteMessage, setCompleteOrFailDeleteMessage] = useState("");
    
    useEffect(() => {
        fetch(`/boss/mypage/getSpecificInquiry?inquiryNo=${inquiryNo}&categoryNo=${categoryNo}`)
        .then(res => res.json())
        .then(data => {
            setInquiryInfo(data);
            console.log(data);
        })
        .catch(error => console.log(error));
    }, [])

    // const updateInquiry = (inquiryNo) => {
    //     fetch(`/boss/mypage/updateInquiry?inquiryNo=${inquiryNo}`)
    //     .then(res => res.json())
    //     .catch(error => console.log(error));
    // }

    const completeHandler = () => {
        setIsCompleteDeleteInquiry(false);
    }

    const deleteInquiry = (inquiryNo, categoryNo, reviewNo) => {
        fetch(`/boss/mypage/deleteInquiry?inquiryNo=${inquiryNo}&categoryNo=${categoryNo}&reviewNo=${reviewNo}`, {
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json',
            },
        })
        .then(res => {
            if(res.ok){
                // 삭제 후 상태 없데이트
                setRealDeleteInquiry(false)
                setIsCompleteDeleteInquiry(true);
                setCompleteOrFailDeleteMessage("해당 리뷰가 삭제되었습니다.");
                navigate('/boss/inquiry');
            } else {
                setRealDeleteInquiry(false)
                setIsCompleteDeleteInquiry(true);
                setCompleteOrFailDeleteMessage("리뷰 삭제를 실패했습니다.");
            }
        })
        .then(data => console.log('문의 내역 삭제 성공', data))
        .catch(error => console.log(error));
    }
    
    return(
        <>
            <div id={styles.inquiryArea}>
                <p id={styles.strInquiry}>문의 상세보기</p>
                <button 
                    type="button" 
                    id={styles.updateBtn} 
                    style={{display : inquiryInfo.answerDate == null ? "" : "none" }}
                    // onClick={() => updateInquiry(inquiryInfo.inquiryNo)}
                >
                    수정
                </button>
                <button 
                    type="button" 
                    id={styles.deleteBtn}
                    onClick={() => setRealDeleteInquiry(true)}
                >
                    삭제
                </button>
                <span>제목 : </span> <span>{inquiryInfo.inquiryTitle}</span>
                <span>문의 일자 : </span> <span>{inquiryInfo.inquiryDate}</span>
                <div id={styles.inquiryContent}>
                    <span id={styles.inquiryContent}>{inquiryInfo.inquiryContent}</span>
                    <div id={styles.file} style={{display : inquiryInfo.file === null ? "none" : ""}}>
                        <a
                            href={'파일 경로'}
                            download={inquiryInfo.file} // 파일 다운로드 가능하게 하는 속성
                            target='_blank' // 새 탭에서 열 수 있도록 설정(파일을 열 수 있을 경우)
                        >
                            {inquiryInfo.file}
                        </a>
                    </div>
                </div>
                <div id={styles.noAnswerArea} style={{display : inquiryInfo.answerDate == null ? "" : "none" }}>
                    <img src={noAnswerLogo} id={styles.noAnswerLogo} alt="우끼 로고"/>
                    <span id={styles.precessingMessage}>문의를 접수하는 중 입니다! 관리자의 답변을 기다려 주세요.</span>
                </div>
                <div id={styles.answerArea} style={{display : inquiryInfo.answerDate == null ? "none" : "" }}>
                    <span>제목 : </span><span>{inquiryInfo.answerTitle}</span>
                    <span>답변 일자 : </span><span>{inquiryInfo.answerDate}</span>
                    <div id={styles.answerContent}>
                        <span id={styles.answerContent}>{inquiryInfo.answerContent}</span>
                    </div>
                </div>
                {realDeleteInquiry && (
                    <div 
                        id={styles.modalOverlay}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                    >
                        <div 
                            id={styles.finalCheck}
                            style={{
                                backgroundColor: '#FFFFFF',
                                padding: '20px',
                                borderRadius: '30px',
                                position: 'relative'
                            }}
                        >
                            <p id={styles.reallyDeleteInquiry}>해당 문의를 삭제하시겠습니까?</p>
                            <p id={styles.inquiry}>문의 정보가 삭제되며 해당 문의 사항은 접수 최소됩니다.</p>
                            <button type='button' id={styles.cancleDeleteInquiry} onClick={() => setRealDeleteInquiry(false)}>취소</button>
                            <button type='submit' id={styles.confirmDeleteInquiry} onClick={() => deleteInquiry(inquiryInfo.inquiryNo, inquiryInfo.categoryNo, inquiryInfo.reviewNo)}>확인</button>
                        </div>
                    </div>
                )}
    
                {isCompleteDeleteInquiry && (
                    <div 
                        id={styles.modalOverlay}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                    >
                        <div 
                            id={styles.completeDeleteInquiry}
                            style={{
                                backgroundColor: '#FFFFFF',
                                padding: '20px',
                                borderRadius: '30px',
                                position: 'relative'
                            }}
                        >
                            <p id={styles.completedDeletteMessage}>{completeOrFailDeleteMessage}</p>
                            <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SpecificInquiry;