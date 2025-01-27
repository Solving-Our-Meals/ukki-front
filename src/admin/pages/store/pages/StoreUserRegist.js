import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/StoreUserRegist.module.css';
import '../css/reset.css';
import AdminResultModal from '../../../components/AdminResultModal';
import { API_BASE_URL } from '../../../../config/api.config';

export default function StoreUserRegist(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isValid, setIsValid] = useState({
        userId : false,
        userPassword : false,
        userName : false,
        email : false,
    });

    const [userInfo, setUserInfo] = useState({
        userId : '',
        userPassword : '',
        userName : '',
        email : '',
    });

    const [isPass, setIsPass] = useState(false);

    function handleChange(e){
        const {name, value} = e.target;
        setUserInfo({...userInfo, [name] : value});
        setIsValid({...isValid, [name] : false});
    }

    
    // 아이디 유효성 검사
    const validateUsername = (userId) => {
        const usernamePattern = /^[a-zA-Z0-9_-]{6,15}$/;
        return usernamePattern.test(userId);  // 영문, 숫자, 하이픈, 언더바 가능, 길이 6~15자
    };

    // 닉네임 유효성 검사
    const validateNickname = (userName) => {
        const nicknamePattern = /^[a-zA-Z0-9가-힣]{1,12}$/;
        return nicknamePattern.test(userName);  // 영문, 숫자, 한글 가능, 길이 1~12자
    };

    const validateEmail = (email) => {
        const emailPattern = /^[A-Za-z0-9+_.-]+@(.+)$/;
        return emailPattern.test(email);
    }

   const handleUsernameSubmit = async (e) => {
        e.preventDefault();

        // 아이디 유효성 검사
        if (!validateUsername(userInfo.userId)) {
            setIdError('ⓘ 아이디는 영문, 숫자, 하이픈, 언더바 조합으로 6~15자 이내로 입력해주세요.');
            return;
        }

        console.log("Submitting userid:", userInfo.userId);

        const response = await fetch(`${API_BASE_URL}/auth/signupid`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({userId: userInfo.userId})
        });
        const result = await response.json();
        if (result.isValid) {
            setIdError('');
            setIsValid({...isValid, userId : true});
        } else {
            setIdError('ⓘ 유효하지 않거나 중복된 아이디입니다.');
            setIsValid({...isValid, userId : false});
        }
    };

 const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API_BASE_URL}/auth/signuppwd`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({userPass: userInfo.userPassword})
        });

        const result = await response.json();

        if (result.isValid) {
            setPasswordError('');
            setIsValid({...isValid, userPassword : true});
        } else {
            setPasswordError(result.message);
            setIsValid({...isValid, userPassword : false});
        }
    };


   const handleEmailSubmit = async (e) => {
        e.preventDefault();

        // 이메일 유효성 검사
        if (!validateEmail(userInfo.email)) {
            setEmailError('ⓘ 이메일 형식이 올바르지 않습니다.');
            return;
        }

        // 이메일 중복
        const emailCheckResponse = await fetch(`${API_BASE_URL}/auth/checkemail`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({email: userInfo.email}),
        });

        const emailCheckResult = await emailCheckResponse.json();
        console.log(emailCheckResult)

        if (emailCheckResult.isDuplicate) {
            setEmailError('ⓘ 이 이메일은 이미 사용 중입니다.');
            setIsValid({...isValid, email : false});
            return;
        }

        if (emailCheckResult.isNoshowLimitExceeded) {
            setEmailError('ⓘ 이전의 노쇼 횟수가 3회로 가입이 불가합니다.');
            setIsValid({...isValid, email : false});
            return;
        }

        setEmailError('');
        setIsValid({...isValid, email : true});
}

    const handleNicknameSubmit = async (e) => {
        e.preventDefault();

        // 닉네임 유효성 검사
        if (!validateNickname(userInfo.userName)) {
            setNameError('ⓘ 닉네임은 영문, 숫자, 한글 조합으로 1~12자 이내로 입력해주세요.');
            setIsValid({...isValid, userName : false});
            return;
        }

        const response = await fetch('/auth/signupnickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({userName: userInfo.userName})
        });
        const result = await response.json();
        if (result.isValid) {
            setNameError('');
            setIsValid({...isValid, userName : true});
        } else {
            setNameError('ⓘ 유효하지 않거나 중복된 닉네임입니다.');
            setIsValid({...isValid, userName : false});
        }
    };

    const canSubmit = isValid.userId && isValid.userPassword && isValid.userName && isValid.email;

    async function handleSubmit(e){
        e.preventDefault();
        if(canSubmit){
            console.log(userInfo)
            const response = await fetch(`${API_BASE_URL}/admin/stores/regist/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(userInfo)
            });
            const result = await response.json();
                setResultMessage('가게 회원 등록이 완료되었습니다.');
                setShowResultModal(true);
                setIsPass(true);
            
        } else {
            setResultMessage('모든 항목을 올바르게 입력해주세요.');
            setShowResultModal(true);
            setIsPass(false);
        }
    }   
    

    return(
        <>  
        <div className={`${styles.storeUserRegist} ${showResultModal ? styles.background : ''}`}>
        <div className={styles.storeUserRegistText}>가게 회원 등록</div>
        <div className={styles.storeUserRegistArea}>
            <div className={styles.storeUserRegistImg}>
                <p className={styles.storeUserRegistImgText}>정보 입력 후 등록 버튼을 눌러주세요</p>
            </div>
            <div className={styles.userIdArea}>
            <div className={styles.inputWrapper}>
                            <input
                                    className={`${styles.inputField} ${idError ? styles.errorInput : ''} ${isValid.userId ? styles.isValidInput : ''}`}
                                    type="text"
                                    name="userId"
                                value={userInfo.userId}
                                onChange={handleChange}
                                id="userId"
                                placeholder="아이디 입력"
                            />
                            <label htmlFor="userId">아이디 입력</label>
            </div>
                <button type="button" className={`${styles.submitButton} ${isValid.userId ? styles.isValidButton : ''}`} onClick={handleUsernameSubmit}>검사</button>
                {idError && <p className={styles.errorMessage}>{idError}</p>}
            </div>
            <div className={styles.userPasswordArea}>
                <div className={styles.inputWrapper}>
                    <input
                        className={`${styles.inputField} ${passwordError ? styles.errorInput : ''} ${isValid.userPassword ? styles.isValidInput : ''}`}
                        type="password"
                        name="userPassword"
                        value={userInfo.userPassword}
                        onChange={handleChange}
                        id="userPassword"
                        placeholder="비밀번호 입력"
                    />
                    <label htmlFor="userPassword">비밀번호 입력</label>
                </div>
                <button type="button" className={`${styles.submitButton} ${isValid.userPassword ? styles.isValidButton : ''}`} onClick={handlePasswordSubmit}>검사</button>
                {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
            </div>
            <div className={styles.userNameArea}>
                <div className={styles.inputWrapper}>
                    <input
                        className={`${styles.inputField} ${nameError ? styles.errorInput : ''} ${isValid.userName ? styles.isValidInput : ''}`}
                        type="text"
                        name="userName"
                        value={userInfo.userName}
                        onChange={handleChange}
                        id="userName"
                        placeholder="이름 입력"
                    />
                    <label htmlFor="userName">이름 입력</label>
                </div>
                <button type="button" className={`${styles.submitButton} ${isValid.userName ? styles.isValidButton : ''}`} onClick={handleNicknameSubmit}>검사</button>
                {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
            <div className={styles.emailArea}>
                <div className={styles.inputWrapper}>
                    <input
                        className={`${styles.inputField} ${emailError ? styles.errorInput : ''} ${isValid.email ? styles.isValidInput : ''}`}
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="이메일 입력"
                    />
                    <label htmlFor="email">이메일 입력</label>
                </div>
                <button type="button" className={`${styles.submitButton} ${isValid.email ? styles.isValidButton : ''}`} onClick={handleEmailSubmit}>검사</button>
                {emailError && <p className={styles.errorMessage}>{emailError}</p>}
            </div>
            <button type="button" className={styles.storeUserRegistSubmitButton} onClick={handleSubmit}>확인</button>
        </div>
        </div>
        {showResultModal && <AdminResultModal message={resultMessage} 
        close={() => {
            setShowResultModal(false);
            setResultMessage('');
            if(isPass){
                navigate('/admin/stores/regist/store');
                setIsPass(false);
            }
        }} />}
        </>
    )
}