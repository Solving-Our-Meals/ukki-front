import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserInfoAPI } from "../api/UserInfoAPI";
import '../css/reset.css'
import styles from '../css/UserInfo.module.css'
import AdminAgreementModal from "../../../components/AdminAgreementModal";
import AdminResultModal from "../../../components/AdminResultModal";


function UserInfo(){

    const {userNo} = useParams();
    const [isInfo, setIsInfo] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [deleteUser, setDeleteUser] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const navigate = useNavigate();
    const defaultProfile = '/images/mypage/profile/default.png';

    const fetchInfo = useCallback(async (no) => {
        try{
            const userInfo = await UserInfoAPI(no);
            if (userInfo){
                console.log(userInfo)
                setIsInfo(true)
                setUserInfo(userInfo)
            }else{
                setIsInfo(false)
            }
            }catch(error){
                console.log("오류발생", error)
            }
        })

    useEffect(()=>{
        fetchInfo(userNo)
    },[userNo, showResultModal])

    function handleDeleteUser() {
        setAgreeMessage("해당 회원을 삭제하시겠습니까?")
        setShowAgreementModal(true);
        setDeleteUser(true);
    }

    function handleEditUser() {
        setAgreeMessage("해당 회원 닉네임을 변경하시겠습니까??")
        setShowAgreementModal(true);
        setEditUser(true);
    }


    function resultMessageHandler(message){
        setResultMessage(message);
    }


    function deleteConfirm(){
        fetch(`/admin/users/info/${userNo}`, {
            method: 'DELETE',
        }).then((res) => {
            return res.json();
        }).then((data)=>{
            console.log(data);
            if (data.success) {
                setShowAgreementModal(false)
                resultMessageHandler(data.message);
                setShowResultModal(true);
            } else {
                setShowAgreementModal(false)
                resultMessageHandler(data.message);
                setShowResultModal(true);
            }
        });
    }

    function editConfirm(){
        fetch(`/admin/users/info/${userNo}`, {
            method: 'PUT',
        }).then((res) => {
            return res.json();
        }).then((data)=>{
            console.log(data);
            if (data.success) {
                setShowAgreementModal(false)
                resultMessageHandler(data.message);
                setShowResultModal(true);
            } else {
                setShowAgreementModal(false)
                resultMessageHandler(data.message);
                setShowResultModal(true);
            }
        });
    }
    
    return(
    <>
    {isInfo?
        <>
        <div id={styles.userInfoText}>회원 상세정보</div>
        <div className={styles.horizon1}></div>
        <div id={styles.userInfoProfile}><img src={userInfo.profileImage? userInfo.profileImage : defaultProfile} alt="프로필 이미지" /></div>
        <div id={styles.userInfoContentText}>회원정보</div>
        <div id={styles.userInfoId}><p>아이디 : </p> {userInfo.userId}</div>
        <div id={styles.userInfoName}><p>닉네임 : </p> {userInfo.userName} <button id={styles.userInfoNameChangeBtn} onClick={handleEditUser}>닉네임 변경</button></div>
        <div id={styles.userInfoEmail}><p>이메일 : </p> {userInfo.email}</div>
        <button id={styles.userInfoDeleteBtn} onClick={handleDeleteUser}>삭제</button>
        <div id={styles.badgeArea}>
            <div id={styles.badgeAreaText}>뱃지</div>
            <div id={styles.badgeImgArea}>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge1.png" alt="뱃지1" className={userInfo.resCount >= 10 ? '' : styles.badgeNotAchieved} /></div>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge2.png" alt="뱃지2" className={userInfo.reviewCount >= 10 ? '' : styles.badgeNotAchieved} /></div>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge3.png" alt="뱃지3" className={userInfo.resCount >= 25 ? '' : styles.badgeNotAchieved} /></div>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge4.png" alt="뱃지4" className={userInfo.randomCount >= 3 ? '' : styles.badgeNotAchieved} /></div>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge5.png" alt="뱃지5" className={userInfo.reviewCount >= 20? '' : styles.badgeNotAchieved} /></div>
                <div className={styles.badge}><img src="/src/user/pages/mypage/images/badge6.png" alt="뱃지6" className={userInfo.resCount >= 50 && userInfo.reviewCount >= 30 && userInfo.randomCount >= 7 ? '' : styles.badgeNotAchieved} /></div>
            </div>
        </div>
        <div id={styles.reservationCount}>
            <div className={styles.userActInfoText}>예약 수</div>
            <div className={styles.userActInfoCount}>{userInfo.resCount}</div>
        </div>
        <div className={styles.horizon2}></div>
        <div id={styles.reviewCount}>
            <div className={styles.userActInfoText}>리뷰작성</div>
            <div className={styles.userActInfoCount}>{userInfo.reviewCount}</div>
        </div>
        <div id={styles.noshowCount}>
            <div className={styles.userActInfoText}>노쇼</div>
            <div className={styles.userActInfoCount}>{userInfo.noShow}</div>
        </div>
        </> : 
        <div>해당 회원이 존재하지 않습니다.</div>}
        {showAgreementModal && (
                <AdminAgreementModal
                    message={agreeMessage}
                    onConfirm={() => {
                        if(deleteUser){
                            deleteConfirm();
                        }else{
                            editConfirm();
                        }
                    }}
                    onCancel={() => setShowAgreementModal(false)}
                />
            )}
            {showResultModal && (
                <AdminResultModal message={resultMessage} close={()=>{
                    if(deleteUser){
                        setShowResultModal(false);
                        navigate("/admin/users/list");
                    }else{
                        setShowResultModal(false)
                    }
                }}/>
            )}
    </>
    )   

}

export default UserInfo;