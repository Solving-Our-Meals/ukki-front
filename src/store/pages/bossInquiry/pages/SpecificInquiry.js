import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import noAnswerLogo from '../images/noAnswerLogo.png';
import styles from '../css/specificInquiry.module.css';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';
import SpecificReviewModal from '../components/SpecificReviewModal';

function SpecificInquiry(){

    const navigate = useNavigate();
    const { setGlobalError } = useError();
    const { inquiryNo } = useParams();
    const [searchParams] = useSearchParams(); 
    const categoryNo = searchParams.get('categoryNo');
    const [inquiryInfo, setInquiryInfo] = useState({});
    const [realDeleteInquiry, setRealDeleteInquiry] = useState(false);
    const [realUpdateInquiry, setRealUpdateInquiry] = useState(false);
    const [isCompleteDeleteInquiry, setIsCompleteDeleteInquiry] = useState(false);
    const [isCompleteUpdateInquiry, setIsCompleteUpdateInquiry] = useState(false);
    const [completeOrFailDeleteMessage, setCompleteOrFailDeleteMessage] = useState("");
    const [completeOrFailUpdateMessage, setCompleteOrFailUpdateMessage] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [clickToSeeReview, isClickToSeeReview] = useState(false);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const [updateInquiryData, setUpdateInquiryData] = useState({
        inquiryTitle : "",
        inquiryContent : "",
        inquiryDate : formattedDate,
        file : null,
        fileChangeYn : "N",
        categoryNo : 0
    });
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/boss/mypage/getSpecificInquiry?inquiryNo=${inquiryNo}&categoryNo=${categoryNo}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
        })
        .then(response => {
            if(!response.ok){
                return response.json().then(error => {
                    throw new Error(error.error || "알 수 없는 오류");
                });
            }
            return response.json()
        })
        .then(data => {
            setInquiryInfo(data);
            console.log('inquiry!!!!', data)

            setUpdateInquiryData({
                inquiryTitle: data.inquiryTitle || "",
                inquiryContent: data.inquiryContent || "",
                inquiryDate: data.inquiryDate || formattedDate,
                file: data.file || null,
                fileChangeYn : "N",
                categoryNo : data.categoryNo || 0,
            });
            
        })
        .catch(error => {
            console.error(error);
            setGlobalError(error.message, error.status);

            // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
            if (error.status === 404) {
                navigate('/404');
            } else if (error.status === 403) {
                navigate('/403');
            } else {
                navigate('/500');
            }
        });
    }, [inquiryNo, categoryNo, setGlobalError]);

    // 파일 삭제 버튼 클릭
    const deleteFileHandler = (e) => {
        e.stopPropagation();
        setUpdateInquiryData(prevState => ({
            ...prevState,
            file : null,
            fileChangeYn : "Y"
        }));
    };

    const completeHandler = () => {
        setIsCompleteDeleteInquiry(false);
        setIsCompleteUpdateInquiry(false);
    }

    const deleteInquiry = (inquiryNo, categoryNo, reviewNo) => {
        fetch(`${API_BASE_URL}/boss/mypage/deleteInquiry?inquiryNo=${inquiryNo}&categoryNo=${categoryNo}&reviewNo=${reviewNo}`, {
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
                setCompleteOrFailDeleteMessage("해당 문의 내역이 삭제되었습니다.");
                navigate('/boss/inquiry');
            } else {
                setRealDeleteInquiry(false)
                setIsCompleteDeleteInquiry(true);
                setCompleteOrFailDeleteMessage("문의 내용 삭제에 실패했습니다.");
            }
        })
        .then(data => console.log('문의 내역 삭제 성공', data))
        .catch(error => console.log(error));
    }

    const inputChangeHandler = (e) => {
        const { name, value, files } = e.target;
    
        if (name === 'file' && files) {
            setUpdateInquiryData(prevState => ({
                ...prevState,
                file: files[0], // 실제 파일 객체로 설정
                fileChangeYn : "Y"
            }));
        } else {
            setUpdateInquiryData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    

    const cancelUpdateHandler = () => {
        setIsUpdate(false);
        setUpdateInquiryData({
            inquiryTitle: inquiryInfo.inquiryTitle || "",
            inquiryContent: inquiryInfo.inquiryContent || "",
            inquiryDate: inquiryInfo.inquiryDate,
            file: inquiryInfo.file || null,
            fileChangeYn : "N",
            categoryNo : inquiryInfo.categoryNo || 0
        });
    }

    const updateInquiryHandler = (inquiryNo, categoryNo, reviewNo) => {

        const formData = new FormData();
        formData.append("inquiryTitle", updateInquiryData.inquiryTitle);
        formData.append("inquiryContent", updateInquiryData.inquiryContent);
        formData.append("inquiryDate", updateInquiryData.inquiryDate);
        
        if(updateInquiryData.fileChangeYn === "N"){
            formData.append("inquiryFileUrl", updateInquiryData.file)
        } else {
            formData.append("inquiryFileUrl", "")
        }

        if(updateInquiryData.file){
            formData.append("inquiryFile", updateInquiryData.file);
        }

        formData.append("params", JSON.stringify({
            inquiryTitle: updateInquiryData.inquiryTitle,
            inquiryContent: updateInquiryData.inquiryContent,
            inquiryDate: formattedDate
        }));

        fetch(`${API_BASE_URL}/boss/mypage/updateInquiry?inquiryNo=${inquiryNo}&categoryNo=${categoryNo}&reviewNo=${reviewNo}`, {
            method : 'PUT',
            body : formData,
        })
        .then(res => {
            if(res.ok){
                // 수정 후 상태 없데이트
                setRealUpdateInquiry(false)
                setIsCompleteUpdateInquiry(true);
                setCompleteOrFailUpdateMessage("해당 문의 내용이 수정되었습니다.");
                navigate('/boss/inquiry');
            } else {
                setRealDeleteInquiry(false)
                setIsCompleteDeleteInquiry(true);
                setCompleteOrFailDeleteMessage("문의 내용 수정에 실패했습니다.");
            }
        })
        .then(data => console.log('문의 내용 수정 성공', data))
        .catch(error => {
            console.error('문의 내용 수정 실패:', error);
            setRealUpdateInquiry(false);
            setIsCompleteUpdateInquiry(true);
            setCompleteOrFailUpdateMessage("문의 내용 수정 중 오류가 발생했습니다.");
        });
    }
    
    return(
        <>
            <div className={styles.overlay} style={{display : clickToSeeReview ? "" : "none"}}></div>
            <div id={styles.inquiryArea} style={{display : isUpdate ? "none" : ""}}>
                <p id={styles.strInquiry}>문의 상세보기</p>
                <button 
                    type="button" 
                    id={styles.updateBtn} 
                    style={{display : inquiryInfo.answerDate == null ? "" : "none" }}
                    onClick={() => setIsUpdate(true)}
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
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // 기본 동작 방지
                                const link = document.createElement('a');
                                link.href = inquiryInfo.file;
                                link.download = inquiryInfo.file.split('id=')[1]; // 파일 이름 설정
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            첨부파일
                        </a>
                    </div>
                    <div id={styles.goToReview} onClick={() => isClickToSeeReview(true)} style={{display : inquiryInfo.categoryNo === 0 ? "" : "none"}}>
                        리뷰 보러가기
                    </div>
                    <div style={{display : clickToSeeReview ? "" : "none"}}> 
                        <SpecificReviewModal reviewNo={inquiryInfo.reviewNo}/>
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
                {/* 문의 삭제 */}
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
            {/* 문의 수정 */}
            <div id={styles.updateInquiry} style={{display : isUpdate ? "" : "none"}}>
                <p id={styles.strUpdateInquiry}>문의 수정</p>
                <button 
                    type="button" 
                    id={styles.cancelBtn} 
                    onClick={() => cancelUpdateHandler()}
                >
                    취소
                </button>
                <button 
                    type="button" 
                    id={styles.confirmBtn}
                    onClick={() => setRealUpdateInquiry(true)}
                >
                    완료
                </button>
                <span id={styles.strTitle} className={styles.StringElement}>제목 : </span> 
                <input 
                    type='text' 
                    id={styles.inquiryTitle} 
                    className={styles.StringElement}
                    name = "inquiryTitle"
                    value={updateInquiryData.inquiryTitle} 
                    onChange={(e) => inputChangeHandler(e)}
                />
                <span id={styles.strDate} className={styles.StringElement}>수정 일자 : </span> 
                <span id={styles.inquiryDate} className={styles.StringElement}>{formattedDate}</span>
                <div id={styles.updateInquiryContent}>
                    <textarea 
                        type='text' 
                        name = "inquiryContent"
                        id={styles.updateInquiryContent} 
                        value={updateInquiryData.inquiryContent} 
                        onChange={(e) => inputChangeHandler(e)}
                    />
                    <div 
                        id={styles.updateFile} 
                        onClick={() => document.getElementById('fileInput').click()}  // div 클릭 시 파일 탐색기 열기
                        style={{ cursor: 'pointer', display : updateInquiryData.categoryNo === 0 ? "none" : "" }}  // 클릭 가능하도록 스타일 설정
                    >
                        {/* 파일 이름이 선택되지 않았다면 "첨부파일"을 표시, 그렇지 않으면 파일 이름 표시 */}
                        {/* {updateInquiryData.file ? (
                            <span id={styles.updateFileName}>{updateInquiryData.file.name || updateInquiryData.file}</span>
                        ) : (
                            <span>파일첨부</span>
                        )} */}
                        <span id={styles.updateFileName}>파일첨부</span>
                        {/* 파일 선택 input을 숨깁니다 */}
                        <input 
                            type="file" 
                            id="fileInput" 
                            name="file" 
                            onChange={(e) => setUpdateInquiryData({ ...updateInquiryData, file: e.target.files[0], fileChangeYn : "Y" })}
                            style={{ display: 'none' }}  // 파일 입력 필드를 숨김
                        />

                        {/* 파일 삭제 버튼 추가 */}
                        {updateInquiryData.file && (
                            <button 
                                type="button" 
                                id={styles.deleteFileBtn} 
                                onClick={(e) => deleteFileHandler(e)}
                                style={{ marginLeft: '5px', background : "none", border:"none", color: '#232323', cursor: 'pointer' }}
                            >
                                &#x2716;
                            </button>
                        )}
                    </div>
                </div>
                <div id={styles.updateNoAnswerArea}>
                    <img src={noAnswerLogo} id={styles.updateNoAnswerLogo} alt="우끼 로고"/>
                    <div id={styles.updateProcessingMessage}>문의를 접수하는 중 입니다! 관리자의 답변을 기다려 주세요.</div>
                </div>
                {realUpdateInquiry && (
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
                            <p id={styles.reallyUpdateInquiry}>해당 문의를 수정하시겠습니까?</p>
                            <p id={styles.inquiry}>선택하신 문의가 수정된 내용으로 접수됩니다.</p>
                            <button type='button' id={styles.cancleUpdateInquiry} onClick={() => setRealUpdateInquiry(false)}>취소</button>
                            <button type='submit' id={styles.confirmUpdateInquiry} onClick={() => updateInquiryHandler(inquiryInfo.inquiryNo, inquiryInfo.categoryNo, inquiryInfo.reviewNo)}>확인</button>
                        </div>
                    </div>
                )}
                {isCompleteUpdateInquiry && (
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
                            id={styles.completeUpdateInquiry}
                            style={{
                                backgroundColor: '#FFFFFF',
                                padding: '20px',
                                borderRadius: '30px',
                                position: 'relative'
                            }}
                        >
                            <p id={styles.completedUpdateMessage}>{completeOrFailUpdateMessage}</p>
                            <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SpecificInquiry;