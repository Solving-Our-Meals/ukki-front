import React, { useState, useEffect } from 'react';
import styles from '../css/ProfileInfo.module.css';
import '../css/reset.css';
import { useNavigate, Link } from 'react-router-dom';

function ProfileInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ userPass: '' });
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (!formData.userPass) {
            setPasswordError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/user/mypage/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password: formData.userPass }),
            });

            if (response.ok) {
                fetchUserInfo();
            } else {
                setPasswordError('ⓘ 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            setPasswordError('에러 발생: ' + error.message);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/user/mypage/profile-info', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                navigate('/user/mypage/edit');
            } else if (response.status === 401) {
                setError('인증이 필요합니다.');
                navigate('/auth/login');
            } else {
                setError('유저 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('에러 발생: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.mypageReservation}>
                <div className={styles.allTabs}>
                    <Link to="/user/mypage/review">
                        <div className={styles.tab1}>회원 정보수정</div>
                    </Link>
                    <Link to="/user/mypage/reservation">
                        <div className={styles.tab2}>문의 내역</div>
                    </Link>
                    <div className={styles.line1}>|</div>
                    <Link to="/user/mypage/inquiry">
                        <div className={styles.tab3}>예약리스트</div>
                    </Link>
                    <div className={styles.line2}>|</div>
                    <Link to="/user/mypage/profile">
                        <div className={styles.tab4}>작성된 리뷰</div>
                    </Link>
                </div>
            </div>

            {!userInfo && !loading && (
                <div className={styles.signupBasic}>
                        <p className={styles.loginText}>비밀번호를 입력해주세요</p>
                        <img className={styles.signup} src="/images/mypage/profile/password.png" alt="회원가입 로고"/>
                        <form onSubmit={handlePasswordSubmit}>
                            <fieldset className={styles.fieldPwd}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.signupPwd} ${passwordError ? styles.errorInput : ''}`}
                                        type={showPassword ? "text" : "password"}
                                        name="userPass"
                                        value={formData.userPass}
                                        onChange={handleChange}
                                        id="userPass"
                                        placeholder="비밀번호 입력"
                                    />
                                    <label htmlFor="userPass">비밀번호 입력</label>
                                    <div className={styles.passwordToggleBtn}>
                                        <img
                                            src={showPassword ? "/images/signup/default.png" : "/images/signup/on.png"}
                                            alt="비밀번호 보이기/숨기기"
                                            onClick={togglePasswordVisibility}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            {passwordError && <div className={styles.error}>{passwordError}</div>}
                            <button className={styles.loginButton} type="submit">확인</button>
                        </form>
                    </div>
            )}

            {loading && (
                <div className={styles.loadingContainer}>
                    <img src="/images/inquiry/loadingInquiryList.gif" alt="로딩 중"/>
                </div>
            )}

            {userInfo && (
                <div>
                    <h2>회원 정보</h2>
                    <p>이름: {userInfo.name}</p>
                    <p>이메일: {userInfo.email}</p>
                    {/* 기타 유저 정보 표시 */}
                </div>
            )}
        </div>
    );
}

export default ProfileInfo;
