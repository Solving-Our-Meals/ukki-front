import React, { useState, useEffect, useRef } from 'react';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import styles from '../css/Inquiry.module.css';
import Logo from '../images/mypage/logo.png'
import Loading from '../../../../common/inquiry/img/loadingInquiryList.gif';
import {API_BASE_URL} from '../../../../config/api.config';

function InquiryDetail({ userInfo }) {
    const { inquiryNo } = useParams();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);

    const [inquiry, setInquiry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState('');
    const [editedTitle, setEditedTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const textareaRef = useRef(null);

    const navigate = useNavigate();

    // 모달
    const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const [isEditSuccess, setIsEditSuccess] = useState(false);
    const [isEditError, setIsEditError] = useState(false);

    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    const [isDeleteError, setIsDeleteError] = useState(false);

    // 첨부파일 (마지막에 넣었슴다.)
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!userInfo) return;

        const currentInquiry = userInfo.find(item => item.inquiryNo === parseInt(inquiryNo));
        if (currentInquiry) {
            setInquiry(currentInquiry);
            console.log(currentInquiry)

            // 갑자기 변경된 부분으로 ''내부의 CHECK는 처리완료로 변경 -> 소통중요성 -> 나도 마찬가지
            if (currentInquiry.answerDate && currentInquiry.inquiryState !== '확인완료') {
                updateInquiryStatus('CHECK');
            }
            setLoading(false);
        }
    }, [userInfo, inquiryNo]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (inquiry) {
            setEditedTitle(inquiry.title);
            setEditedText(inquiry.text);
        }
    }, [inquiry]);

    const handleShowMore = () => {
        setShowMore(!showMore);
        setShowOverlay(!showOverlay);
    };

    const handleShowMore2 = () => {
        setShowMore2(!showMore2);
        setShowOverlay2(!showOverlay2);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log(selectedFile);
        setFile(selectedFile);
    };

    const ConfirmEditModal = ({ onConfirm, onCancel }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>정말 수정하시겠습니까?</h3>
                    <h3 className={styles.modalSubText}>이전의 문의는 복구가 불가합니다.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton1} onClick={onConfirm}>확인</button>
                        <button className={styles.modalButton2} onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        );
    };

    const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>정말 삭제하시겠습니까?</h3>
                    <h3 className={styles.modalSubText}>삭제된 문의는 복구가 불가합니다.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton1} onClick={onConfirm}>확인</button>
                        <button className={styles.modalButton2} onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        );
    };

    const updateInquiryStatus = async (status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/mypage/inquiry/${inquiryNo}/status`, {
                method: 'PUT',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!inquiry) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중" />
            </div>
        );
    }

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedText(inquiry.text);
        setEditedTitle(inquiry.title);
    };

    const handleTextChange = (event) => {
        setEditedText(event.target.value);
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleSave = async () => {
        setIsConfirmingEdit(true);
    };

    const handleConfirmEdit = async () => {
        try {
            const updatedInquiry = {
                title: editedTitle,
                text: editedText,
            };

            const formData = new FormData();
            formData.append('title', editedTitle);
            formData.append('text', editedText);

            if (file) {
                formData.append('file', file);
                console.log("파일추가" + file);
            }

            const response = await fetch(`${API_BASE_URL}/user/mypage/inquiry/${inquiryNo}`, {
                method: 'PUT',
                headers: {
                    'Accept' : 'application/json',
                },
                body: formData,
                credentials : "include",
            });

            if (!response.ok) {
                throw new Error('수정에 실패했습니다.');
            }

            const data = await response.json();
            console.log(data.message);

            setInquiry((prevInquiry) => ({
                ...prevInquiry,
                title: editedTitle,
                text: editedText,
            }));

            setIsEditing(false);
            setIsConfirmingEdit(false);
            setIsEditSuccess(true);
            setIsEditError(false);
            navigate(0);

        } catch (error) {
            console.error('수정 오류:', error.message);
            setIsEditError(true);
            setIsEditSuccess(false);
        }
    };

    const handleFileDownload = async (fileId) => {
        try {
            console.log("파일 다운로드 시작:", fileId);  // 확인용 로그

            // Google Drive에서 파일 다운로드 링크 생성
            const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

            // 다운로드 링크를 클릭하는 방식으로 파일 다운로드 처리
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = "문의한 첨부파일";  // 다운로드할 파일 이름
            downloadLink.click();
        } catch (error) {
            console.error('파일 다운로드 오류:', error);
        }
    };


    const handleCancelEdit = () => {
        setIsConfirmingEdit(false);
    };

    const handleCancel = () => {
        setEditedText(inquiry.text);
        setEditedTitle(inquiry.title);
        setIsEditing(false);
    };

    const handleDeleteInquiry = async () => {
        setIsConfirmingDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/mypage/inquiry/${inquiryNo}`, {
                method: 'DELETE',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                },
                // 2025-01-23 추가
                credentials: 'include', 
            });

            if (response.ok) {
                setIsConfirmingDelete(false);
                setIsDeleteSuccess(true);
                window.location.href = '/user/mypage/inquiry';
            } else {
                throw new Error('문의 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.log(error.message);
            setIsDeleteError(true);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
    };

    const getFileName = (filePath) => {
        return filePath.split('/').pop().split('\\').pop();
    };

    const EditSuccessModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>수정이 완료되었습니다!</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
    };

    const EditErrorModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>수정에 실패했습니다. 다시 시도해 주세요.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteSuccessModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>삭제가 완료되었습니다!</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteErrorModal = ({ onClose }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>삭제에 실패했습니다. 다시 시도해 주세요.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton3} onClick={onClose}>확인</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중" />
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중" />
            </div>
        );
    }


    return (
        <div className={styles.inquiryDetailContainer}>
            {isDeleteSuccess && <DeleteSuccessModal onClose={() => setIsDeleteSuccess(false)} />}
            {isDeleteError && <DeleteErrorModal onClose={() => setIsDeleteError(false)} />}
            {showOverlay && <div className={styles.overlay} onClick={handleShowMore}/>}
            {showOverlay2 && <div className={styles.overlay} onClick={handleShowMore2}/>}
            {isEditSuccess && <EditSuccessModal onClose={() => setIsEditSuccess(false)} />}
            {isEditError && <EditErrorModal onClose={() => setIsEditError(false)} />}

            <div className={styles.fileDownloadContainer}>
                {inquiry.file ? (
                    <button
                        onClick={() => handleFileDownload(inquiry.file)}
                        className={styles.fileDownloadLabel}
                    >
                        {getFileName("첨부파일")}
                    </button>
                ) : null}
            </div>

            <div className={styles.allTabs}>
                <Link to="/user/mypage/inquiry">
                    <div className={styles.tab1}>문의 내역</div>
                </Link>
                <Link to="/user/mypage/profile">
                    <div className={styles.tab2}>회원 정보수정</div>
                </Link>
                <div className={styles.line1}>|</div>
                <Link to="/user/mypage/reservation">
                    <div className={styles.tab3}>예약리스트</div>
                </Link>
                <div className={styles.line2}>|</div>
                <Link to="/user/mypage/review">
                    <div className={styles.tab4}>작성리뷰</div>
                </Link>
            </div>
            <div className={styles.main}>
                {isEditing ? (
                    <div>
                        <p className={styles.Title}> 문의 제목 : &nbsp;</p><input
                        type="text"
                        value={editedTitle}
                        onChange={handleTitleChange}
                        className={styles.inquiryTitleEditable}
                    />
                    </div>
                ) : (
                    <p className={styles.Title}>
                        문의 제목 : <span className={styles.inquiryTitle}>{inquiry.title}</span>
                    </p>
                )}
                <p className={styles.Date}>문의 일자 : <span className={styles.inquiryDate}>{inquiry.inquiryDate}</span></p>
                <div className={styles.Text}>
                    {isEditing ? (
                        <div>
                            <textarea
                                ref={textareaRef}
                                value={editedText}
                                onChange={handleTextChange}
                                className={styles.inquiryTextEditable}
                            />
                            <div className={styles.CDButtons}>
                                <button onClick={handleSave} className={styles.editConfirm}>확인</button>
                                <button onClick={handleCancel} className={styles.delCancel}>취소</button>
                            </div>
                        </div>
                    ) : (
                        <p className={showMore ? styles.inquiryTextExpanded : styles.inquiryText}>
                            {inquiry.text}
                        </p>
                    )}
                    {inquiry.text.length > 401 && (
                        <div className={styles.button1}
                             onClick={handleShowMore}
                             style={{zIndex: showMore ? 1000 : 1}}
                        >
                            {showMore ? '줄이기' : '더보기'}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.main2}>
                {inquiry.answerDate ? (
                    <div className={styles.answer}>
                        <p className={styles.AnswerTitle}>답변 제목 : <span
                            className={styles.inquiryTitle}>{inquiry.answerTitle}</span></p>
                        <p className={styles.AnswerDate}>답변 일자 : <span
                            className={styles.inquiryDate}>{inquiry.answerDate}</span></p>
                        <div className={styles.Text}>
                            <p className={showMore2 ? styles.inquiryTextExpanded2 : styles.inquiryText2}>
                                {inquiry.answerContent}
                            </p>
                            {inquiry.answerContent.length > 401 && (
                                <div className={styles.button2}
                                     onClick={handleShowMore2}
                                     style={{zIndex: showMore2 ? 1000 : 1}}
                                >
                                    {showMore2 ? '줄이기' : '더보기'}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.notAnswer}>
                        <img src={Logo} alt="문의 관리자 로고" className={styles.logo}/>
                        <p>문의를 접수하는중 입니다! 관리자의 답변을 기다려 주세요</p>
                    </div>
                )}

                {isEditing && (
                    <div className={styles.fileUploadContainer}>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                        />
                        <label htmlFor="file-upload" className={styles.fileLabel}>
                            {file ? file.name : '파일 선택'}
                        </label>
                    </div>
                )}


            </div>
            <div className={styles.editDeleteButtons}>
                {inquiry.answerDate === null && !isEditing && (
                    <>
                        <button className={styles.editButton} onClick={handleEditClick}>
                            수정
                        </button>
                    </>
                )}
                <button className={styles.delButton} onClick={handleDeleteInquiry}>
                    삭제
                </button>
            </div>

            {/* 모달 */}
            {isConfirmingEdit && (
                <ConfirmEditModal
                    onConfirm={handleConfirmEdit}
                    onCancel={handleCancelEdit}
                />
            )}

            {/* 삭제 확인 모달 추가 */}
            {isConfirmingDelete && (
                <ConfirmDeleteModal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}

export default InquiryDetail;
