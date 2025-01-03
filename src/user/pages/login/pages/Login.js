import React, {useState} from 'react';
import '../css/reset.css';
import styles from '../css/Login.module.css';
import { Link } from 'react-router-dom'

function Login() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userId: '',
        userPass: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // 아이디
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/auth/login/step-one', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: formData.userId }),
        });

        const result = await response.json();
        if (result.isValid) {
            setStep(2);
            setError('');
        } else {
            setError(' ⓘ 아이디가 유효하지 않거나 존재하지 않습니다.');
        }
    };

    // 비번
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/auth/login/step-two', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: formData.userId,
                userPass: formData.userPass,
            }),
            credentials: 'include' // 쿠키 포함시키기 -> api fetch 사용할 때 필수 (인증된 곳 갈땐 다 담아야함)
        });

        const result = await response.json();

        console.log(result.success)
        if (result.success) {
            setError('');
            window.location.href = '/main';
        } else {
            setError(result.message || 'ⓘ 비밀번호가 잘못되었습니다.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const searchError = {
        display: 'flex',
        cursor: 'pointer',
        transform: error ? 'translateY(255px)' : 'translateY(230px)',
        width: '1000px',
    }

    return (
        <div className={styles.signupBasic}>
            <div className={styles.signup}>
                <p className={styles.loginText}>로그인</p>
                <img className={styles.signupLogo} src="/images/signup/signupLogo.png" alt="회원가입 로고"/>
                {step === 1 && (
                    <form onSubmit={handleUsernameSubmit}>

                        <fieldset className={styles.fieldId}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupId} ${error ? styles.errorInput : ''}`}
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    id="userId"
                                    placeholder="아이디 입력"
                                />
                                <label htmlFor="userId">아이디 입력</label>
                            </div>
                        </fieldset>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.searchWrapper} style={searchError}>
                            <p className={styles.search}><Link to="/auth/find/id">아이디 찾기</Link></p>
                        </div>
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/signup'}
                        >회원가입
                        </button>
                        <button className={styles.nextButton}>다음</button>
                    </form>
                )}

                {/* 비밀번호 입력받는 스탭 */}
                {step === 2 && (
                    <form onSubmit={handlePasswordSubmit}>
                        <fieldset className={styles.fieldPwd}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupPwd} ${error ? styles.errorInput : ''}`}
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
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.searchWrapper} style={searchError}>
                            <p className={styles.search}><Link to="/auth/find/password">비밀번호 찾기</Link></p>
                        </div>
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/signup'}
                        >회원가입
                        </button>
                        <button className={styles.nextButton}>로그인</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login;