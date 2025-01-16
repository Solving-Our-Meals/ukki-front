import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/reset.css';
import styles from '../css/NoticeInfo.module.css';
import { NoticeInfoAPI } from '../api/NoticeInfo';
import AdminAgreementModal from '../../../components/AdminAgreementModal';
import AdminResultModal from '../../../components/AdminResultModal';

function NoticeInfo(){

    const { noticeNo } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState({
        category : "",
        categoryNo : 0,
        title : "",
        content : "",
        date : ""
    });
    const [editMode, setEditMode] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [agreeMessage, setAgreeMessage] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [deleteNotice, setDeleteNotice] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editCategory, setEditCategory] = useState(notice.categoryNo);
    const [editTitle, setEditTitle] = useState(notice.title);
    const [editContent, setEditContent] = useState(notice.content);



    useEffect(() => {
        fetchNoticeInfo();
    }, [noticeNo])

    const fetchNoticeInfo = async () => {
        const noticeInfo = await NoticeInfoAPI(noticeNo);
        let categoryName = "";
            switch(noticeInfo.categoryNo){
                case 1 : categoryName = "안내"; break;
                case 2 : categoryName = "소개"; break;
                case 3 : categoryName = "가게"; break;
            }
            setNotice(prevState => ({
                ...prevState,
                category : categoryName,
                categoryNo : noticeInfo.categoryNo,
                title : noticeInfo.noticeTitle,
                content : noticeInfo.noticeContent,
                date : noticeInfo.date
            }));
    }

    const handleEdit = () => {
        if (editMode) {
            if (notice.title === "" || notice.title === null || notice.content === "" || notice.content === null) {
                setResultMessage("공지사항 제목과 내용을 입력해주세요.");
                setShowResultModal(true);
                return;
            } else if (notice.title === notice.title && notice.content === notice.content) {
                setResultMessage("공지사항 제목과 내용이 동일합니다.");
                setShowResultModal(true);
                return;
            } else {
                setShowAgreementModal(true);
                setAgreeMessage("공지사항을 수정하시겠습니까?");
            }
        } else {
            setEditMode(true);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
    }

    if (!notice) {
        return <div className={styles.error}>해당 공지사항을 찾을 수 없습니다.</div>;
    }

    const handleEditNotice = async () => {
        try {
            const response = await fetch(`/admin/notices/info/${noticeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notice),
            });
            if (response.ok) {
                setEditSuccess(true);
                setResultMessage("공지사항이 수정되었습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            } else {
                setEditSuccess(false);
                setResultMessage("공지사항 수정에 실패했습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeleteConfirm = () => {
        setDeleteNotice(true);
        setShowAgreementModal(true);
        setAgreeMessage("공지사항을 삭제하시겠습니까?");
    }

    const handleDeleteNotice = async () => {
        try {
            const response = await fetch(`/admin/notices/info/${noticeNo}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setResultMessage("공지사항이 삭제되었습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            } else {
                setResultMessage("공지사항 삭제에 실패했습니다.");
                setShowResultModal(true);
                setShowAgreementModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <div className={styles.noticeInfo}>
                        <p id={styles.strNotice}>공지사항</p>
                        <div id={styles.categoryArea}>
                        {!editMode? <span
                            id={styles.category}
                            style={{backgroundColor : notice.category === '안내' ? "#FF8AA3" : notice.category === '소개' ? "#FEDA00" : "#B3E7FF" }}
                        >
                            {notice.category}
                        </span> : <>
                        <span id={styles.category}  style={{backgroundColor: "#FF8AA3"}} onClick={() => setEditCategory(1)}>안내</span>
                        <span id={styles.category}  style={{backgroundColor: "#FEDA00"}} onClick={() => setEditCategory(2)}>소개</span>
                        <span id={styles.category}  style={{backgroundColor: "#B3E7FF"}} onClick={() => setEditCategory(3)}>가게</span>
                        </>
                        }
                        </div>

                        <span>제목 : </span> <span>{notice.title}</span>
                        <span>작성 날짜 : </span> <span>{notice.date}</span>
                        <span id={styles.content}>{notice.content}</span>
                    </div>
                </div>
            </div>
            {editMode && <button className={styles.cancelButton} onClick={handleCancel}>취소</button>}
            {!editMode && <button className={styles.delButton} onClick={handleDeleteConfirm}>삭제</button>}
            <button className={styles.editButton} onClick={handleEdit} style={editMode ? { left: '1403px', width: '115px' } : {}}>{editMode ? '확인' : '수정'}</button>
            {showAgreementModal && (
                <AdminAgreementModal
                    message={agreeMessage}
                    onConfirm={() => {
                        if (editMode) {
                            handleEditNotice();
                        } else if (deleteNotice) {
                            handleDeleteNotice();
                        }
                        setShowAgreementModal(false);
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <AdminResultModal message={resultMessage} close={() => {
                    if (deleteNotice) {
                        setShowResultModal(false);
                        navigate("/admin/notices/list");
                        setDeleteNotice(false);
                    } else {
                        setShowResultModal(false);
                    }
                    if (editSuccess) {
                        setEditMode(false);
                        navigate(`/admin/notices/info/${noticeNo}`);
                    } else {
                        setShowResultModal(false);
                    }
                }} />
            )}
        </>
    );
}

export default NoticeInfo;