import React, { useState, useEffect, useRef } from 'react';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import styles from '../css/Inquiry.module.css';

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

    const textareaRef = useRef(null);

    const navigate = useNavigate();

    // 모달
    const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    // 첨부파일 (마지막에 넣었슴다.)
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!userInfo) return;

        const currentInquiry = userInfo.find(item => item.inquiryNo === parseInt(inquiryNo));
        if (currentInquiry) {
            setInquiry(currentInquiry);
            console.log(currentInquiry)

            // 팀원이 갑자기 변경한 부분으로 ''내부의 CHECK는 처리완료로 변경 -> 소통중요성 -> 나도 마찬가지
            if (currentInquiry.answerDate && currentInquiry.inquiryState !== '확인완료') {
                updateInquiryStatus('CHECK');
            }
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
        setFile(selectedFile);
    };

    const ConfirmEditModal = ({ onConfirm, onCancel }) => {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3 className={styles.modalMainText}>정말 수정하시겠습니까?</h3>
                    <h3 className={styles.modalSubText}>이전의 문의는 복구가 불가합니다.</h3>
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton1} onClick={onConfirm}>예</button>
                        <button className={styles.modalButton2} onClick={onCancel}>아니오</button>
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
                        <button className={styles.modalButton1} onClick={onConfirm}>예</button>
                        <button className={styles.modalButton2} onClick={onCancel}>아니오</button>
                    </div>
                </div>
            </div>
        );
    };

    const updateInquiryStatus = async (status) => {
        try {
            const response = await fetch(`/user/mypage/inquiry/${inquiryNo}/status`, {
                method: 'PUT',
                headers: {
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
        return <div className={styles.error}>해당 문의를 찾을 수 없습니다.</div>;
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
            }

            const response = await fetch(`/user/mypage/inquiry/${inquiryNo}`, {
                method: 'PUT',
                body: formData,
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
            navigate(0);

        } catch (error) {
            console.error('수정 오류:', error.message);
        }
    };

    const handleFileDownload = async (filePath) => {
        try {
            // 파일 경로에서 파일 이름만 추출 (예: "2025-01-17.txt") - 이거 없으면 경로가 들어가서 오류남
            const fileName = filePath.split('/').pop().split('\\').pop();

            console.log("파일 다운로드 시작:", fileName);  // 확인용 로그

            // 위에서 자른 파일이름만 전달하기
            const response = await fetch(`/user/mypage/download/${fileName}`, {
                method: 'GET',
                credentials: 'include', // 쿠키 포함
            });

            if (!response.ok) {
                throw new Error('파일 다운로드 실패');
            }

            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;  // 다운로드할 파일명
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
            const response = await fetch(`/user/mypage/inquiry/${inquiryNo}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.href = '/user/mypage/inquiry';
            } else {
                throw new Error('문의 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
    };

    const getFileName = (filePath) => {
        return filePath.split('/').pop().split('\\').pop();
    };

    return (
        <div className={styles.inquiryDetailContainer}>
            {showOverlay && <div className={styles.overlay} onClick={handleShowMore}/>}
            {showOverlay2 && <div className={styles.overlay} onClick={handleShowMore2}/>}

            <div className={styles.fileDownloadContainer}>
                {inquiry.file ? (
                    <button
                        onClick={() => handleFileDownload(inquiry.file)}
                        className={styles.fileDownloadLabel}
                    >
                        {getFileName(inquiry.file)}
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
                        <img src="/images/common/logo.png" alt="문의 관리자 로고" className={styles.logo}/>
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
