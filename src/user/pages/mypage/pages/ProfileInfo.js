import React, { useState, useEffect } from 'react';
import styles from '../css/ProfileInfo.module.css';
import '../css/reset.css';
import { useNavigate, Link } from 'react-router-dom';

function ProfileInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        userPass: '',
        nickname: '',
        newPassword: '',
        profileImage: null,
    });
    const [passwordError, setPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [nicknameSuccess, setNicknameSuccess] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [updateError, setUpdateError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isInputChanged, setIsInputChanged] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo !== null) {
            setLoading(false);
        }
    }, [userInfo]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setIsInputChanged(true);  // 입력값이 변경되었음을 추적
    };

    useEffect(() => {
        const debounceNicknameCheck = setTimeout(async () => {
            if (formData.nickname) {
                // 닉네임 길이 유효성 검사
                if (formData.nickname.length < 1 || formData.nickname.length > 12) {
                    setNicknameError("ⓘ 닉네임은 1~12자 사이여야 합니다.");
                    setNicknameSuccess(false);
                    return;  // 길이가 맞지 않으면 서버 요청하지 않음
                }

                if (!validateNickname(formData.nickname)) {
                    setNicknameError("ⓘ 닉네임은 영문, 숫자, 한글만 가능합니다.");
                    setNicknameSuccess(false);
                    return;  // 유효성 검사 실패
                }

                try {
                    const response = await fetch('/auth/signupnickname', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userName: formData.nickname }),
                    });

                    const result = await response.json();
                    if (response.ok) {
                        setNicknameError(result.isValid ? 'ⓘ 사용 가능한 닉네임입니다.' : 'ⓘ 중복된 닉네임입니다.');
                        setNicknameSuccess(result.isValid);
                    } else {
                        setNicknameError('ⓘ 서버 오류가 발생했습니다. 다시 시도해주세요.');
                        setNicknameSuccess(false);
                    }
                } catch (error) {
                    setNicknameError('ⓘ 서버 오류가 발생했습니다. 다시 시도해주세요.');
                    setNicknameSuccess(false);
                }
            } else {
                setNicknameError('');
                setNicknameSuccess(null);
            }
        }, 500);

        return () => clearTimeout(debounceNicknameCheck);
    }, [formData.nickname]);


    const validatePassword = (newPassword) => {
        if (newPassword.length < 8) {
            setPasswordSuccess(false);
            return "ⓘ 비밀번호는 최소 8자 이상이어야 합니다.";
        }

        if (!newPassword.match(/\d/)) {
            setPasswordSuccess(false);
            return "ⓘ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.";
        }

        if (!newPassword.match(/[!@#$%^&*(),.?":{}|<>]/)) {
            setPasswordSuccess(false);
            return "ⓘ 비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.";
        }

        setPasswordSuccess(true);
        return null;
    };

    useEffect(() => {
        if (formData.newPassword) {
            const validationError = validatePassword(formData.newPassword);
            setPasswordError(validationError || '');
        } else {
            setPasswordError('');
            setPasswordSuccess(null);
        }
    }, [formData.newPassword]);

    const validateNickname = (nickname) => {
        const regex = /^[a-zA-Z0-9가-힣]{1,12}$/;
        return regex.test(nickname);
    };

    const handleUpdateSubmit = async () => {
        const updateData = new FormData();

        if (formData.nickname && formData.nickname !== userInfo.nickname && nicknameSuccess) {
            updateData.append('userName', formData.nickname);
        }

        if (formData.newPassword && passwordSuccess) {
            updateData.append('userPass', formData.newPassword);
        }

        try {
            const updateResponse = await fetch('/user/mypage/update', {
                method: 'PUT',
                body: updateData,
                credentials: 'include',
            });

            const result = await updateResponse.json();
            if (updateResponse.ok) {
                setUpdateSuccess(true);
                setUserInfo(result);
                window.location.reload();
            } else {
                setUpdateError(result.message);
            }
        } catch (error) {
            setUpdateError('네트워크 오류가 발생했습니다.');
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (!formData.userPass) {
            setError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/user/mypage/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: formData.userPass }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('ⓘ 비밀번호 확인에 실패했습니다.');
            }
            setError(null);
            setLoading(true);

            const userInfoData = await fetch('/user/mypage/profile-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const userInfoJson = await userInfoData.json();
            setUserInfo(userInfoJson);

        } catch (error) {
            setError(error.message);
        }
    };

    const ConfirmModal = ({ onConfirm, onCancel }) => (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalMainText}>정말 수정하시겠습니까?</h3>
                <h3 className={styles.modalSubText}>수정한 내용은 복구할 수 없습니다.</h3>
                <div className={styles.modalButtons}>
                    <button className={styles.modalButton1} onClick={onConfirm}>확인</button>
                    <button className={styles.modalButton2} onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );

    const SuccessModal = ({ onClose }) => (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalMainText2}>수정이 완료되었습니다!</h3>
                <div className={styles.modalButtons}>
                    <button className={styles.modalButton3} onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );

    const FailModal = ({ onClose }) => (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalMainText2}>수정에 실패했습니다!</h3>
                <div className={styles.modalButtons}>
                    <button className={styles.modalButton3} onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );

    const handleDeleteAccount = async () => {
        try {
            const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까?");
            if (confirmDelete) {
                const response = await fetch('/user/mypage/delete', {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.ok) {
                    navigate('/main');
                } else {
                    const result = await response.json();
                    alert(result.message || '탈퇴 처리 중 오류가 발생했습니다.');
                }
            }
        } catch (error) {
            alert('탈퇴 처리 중 오류가 발생했습니다.');
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleOpenConfirmModal = (event) => {
        event.preventDefault();
        setShowConfirmModal(true);
    };

    const handleCancelUpdate = () => {
        setShowConfirmModal(false);
    };

    const handleConfirmUpdate = () => {
        setShowConfirmModal(false);
        handleUpdateSubmit();
    };

    return (
        <div>
            {showConfirmModal && <ConfirmModal onConfirm={handleConfirmUpdate} onCancel={handleCancelUpdate} />}
            {updateSuccess && <SuccessModal onClose={() => setUpdateSuccess(false)} />}
            {updateError && <FailModal onClose={() => setUpdateError('')} />}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.mypageReservation}>
                <div className={styles.allTabs}>
                    <Link to="/user/mypage/profile">
                        <div className={styles.tab1}>회원 정보수정</div>
                    </Link>
                    <Link to="/user/mypage/inquiry">
                        <div className={styles.tab2}>문의 내역</div>
                    </Link>
                    <div className={styles.line1}>|</div>
                    <Link to="/user/mypage/reservation">
                        <div className={styles.tab3}>예약리스트</div>
                    </Link>
                    <div className={styles.line2}>|</div>
                    <Link to="/user/mypage/review">
                        <div className={styles.tab4}>작성된 리뷰</div>
                    </Link>
                </div>
            </div>

            {!userInfo && !loading && (
                <div className={styles.signupBasic}>
                    <p className={styles.loginText}>비밀번호를 입력해주세요</p>
                    <img className={styles.signup} src="/images/mypage/profile/password.png" alt="회원가입 로고" />
                    <form onSubmit={handlePasswordSubmit}>
                        <fieldset className={styles.fieldPwd}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupPwd} ${error ? styles.errorInput : ''}`}
                                    type="password"
                                    name="userPass"
                                    value={formData.userPass}
                                    onChange={handleChange}
                                    id="userPass"
                                    placeholder="비밀번호 입력"
                                />
                                <label htmlFor="userPass">비밀번호 입력</label>
                            </div>
                        </fieldset>
                        {passwordError && <div className={styles.error}>{passwordError}</div>}
                        <button className={styles.loginButton} type="submit">확인</button>
                    </form>
                </div>
            )}

            {loading && (
                <div className={styles.loadingContainer}>
                    <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중" />
                </div>
            )}

            {userInfo && (
                <div>
                    <img className={styles.signup2} src="/images/mypage/profile/info.png" alt="회원가입 로고" />
                    <div className={styles.idText}> 아이디 : <div className={styles.infoText1}>{userInfo.userId}</div></div>
                    <div className={styles.nameText}> 닉네임 :</div>
                    <div className={styles.passwordText}> 비밀번호 :</div>
                    <div className={styles.emailText}> 이메일 : <div className={styles.infoText2}>{userInfo.email}</div></div>

                    <form onSubmit={handleOpenConfirmModal}>
                        <div className={styles.inputWrapper}>
                            <input
                                className={styles.inputField}
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="닉네임 수정"
                            />
                        </div>
                        {nicknameError && (
                            <div className={nicknameSuccess ? styles.successName : styles.errorName}>
                                {nicknameError}
                            </div>
                        )}

                        <div className={styles.inputWrapper}>
                            <input
                                className={styles.inputField2}
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="새 비밀번호"
                                id="newPassword"
                            />
                            <div className={styles.passwordToggleBtn2} onClick={togglePasswordVisibility}>
                                <img
                                    src={showPassword ? "/images/signup/default.png" : "/images/signup/on.png"}
                                    alt="비밀번호 보이기/숨기기"
                                />
                            </div>
                        </div>

                        {passwordError && <div className={styles.errorPassword}>{passwordError}</div>}
                        {passwordSuccess && !passwordError &&
                            <div className={styles.successPassword}>ⓘ 유효한 비밀번호입니다.</div>}

                        {updateError && <div className={styles.error2}>{updateError}</div>}

                        <button className={styles.updateButton} type="submit">
                            수정
                        </button>
                    </form>
                    <button className={styles.exitButton} onClick={handleDeleteAccount}>
                        탈퇴
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileInfo;
