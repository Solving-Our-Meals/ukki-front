import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import noAnswerLogo from '../images/noAnswerLogo.png';
import styles from '../css/specificInquiry.module.css';

function SpecificInquiry(){

    const { inquiryNo } = useParams();
    const [inquiryInfo, setInquiryInfo] = useState({});
    
    useEffect(() => {
        fetch(`/boss/mypage/getSpecificInquiry?inquiryNo=${inquiryNo}`)
        .then(res => res.json())
        .then(data => {
            setInquiryInfo(data);
            console.log(data);
        })
        .catch(error => console.log(error));
    }, [])
    
    return(
        <>
            <div id={styles.inquiryArea}>
                <p id={styles.strInquiry}>문의 상세보기</p>
                <button 
                    type="button" id={styles.updateBtn} style={{display : inquiryInfo.answerDate == null ? "" : "none" }}>수정</button>
                <button type="button" id={styles.deleteBtn}>삭제</button>
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
            </div>
        </>
    );
}

export default SpecificInquiry;