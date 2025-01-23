import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../css/Find.module.css';
import '../css/reset.css';
import signupLogo from '../../signup/images/signupLogo.png';
import Default from '../../signup/images/default.png';
import On from '../../signup/images/on.png';
import {API_BASE_URL} from '../../../../config/api.config';

    function Find() {
        const [step, setStep] = useState(1);
        const [formData, setFormData] = useState({
            email: '',
            auth: '',
            newPassword: '',
            confirmNewPassword: '',
        });
        const [error, setError] = useState('');
        const [verificationCodeSent, setVerificationCodeSent] = useState(false);
        const [emailPending, setEmailPending] = useState(false);
        const [loading, setLoading] = useState(false);
        const [foundUserId, setFoundUserId] = useState('');
        const [showPassword, setShowPassword] = useState(false);

        const { type } = useParams();

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        };

        const handleEmailSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setEmailPending(true);

            const response = await fetch(`${API_BASE_URL}/auth/checkemail`, {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const result = await response.json();

            if (!result.isDuplicate) {
                setError('ⓘ 해당 이메일은 존재하지 않습니다.');
                setEmailPending(false);
                return;
            }

            setLoading(true);
            const sendCodeResponse = await fetch(`${API_BASE_URL}/auth/sendemail`, {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const sendCodeResult = await sendCodeResponse.json();
            if (sendCodeResult.success) {
                setVerificationCodeSent(true);
                setError('');
                setStep(2);  // 이메일 인증 단계로
            } else {
                setError('ⓘ 이메일 전송에 실패했습니다. 다시 시도해주세요.');
            }

            setLoading(false);
            setEmailPending(false);
        };

        const handleVerificationSubmit = async (e) => {
            e.preventDefault();

            if (!formData.auth) {
                setError('ⓘ 인증번호를 입력해주세요.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/verifycode`, {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    authCode: formData.auth,
                }),
            });

            const result = await response.json();
            if (result.isValid) {
                setStep(3);
                setError('');
            } else {
                setError('ⓘ 인증번호가 올바르지 않습니다.');
            }
        };

        useEffect(() => {
            if (step === 3 && type === 'password' && formData.email) {
                setStep(4);
            } else if (step === 3 && type !== 'password' && formData.email) {
                const fetchUserId = async () => {
                    const userIdResponse = await fetch(`${API_BASE_URL}/auth/find/id`, {
                        method: 'POST',
                        headers: {
                            'Accept' : 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: formData.email }),
                    });

                    const userIdResult = await userIdResponse.json();
                    if (userIdResult.success) {
                        setFoundUserId(userIdResult.userId);
                    } else {
                        setError('ⓘ 아이디 찾기에 실패했습니다.');
                    }
                };

                fetchUserId();
            }
        }, [step, formData.email, type]);

        // 폼 초기화용 -> 자꾸 저장됨 -> 편의성을 위해 이메일은 안할까하는데 혹시몰라서 주석처리로 해놓음 -> 주석처리 금지 -> 주석하면 폼은 그대로 남아있으나 데이터 값은 써진게 없는걸로 판단함
        useEffect(() => {
            if (step === 1) {
                setFormData({
                    email: '',
                    auth: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            }
        }, [step]);

        const validatePassword = (newPassword) => {
            if (newPassword.length < 8) {
                return "ⓘ 비밀번호는 최소 8자 이상이어야 합니다.";
            }

            if (!newPassword.match(/\d/)) {
                return "ⓘ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.";
            }

            if (!newPassword.match(/[!@#$%^&*(),.?":{}|<>]/)) {
                return "ⓘ 비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.";
            }

            return null;
        };


        const handlePasswordSubmit = async (e) => {
            e.preventDefault();

            if (formData.newPassword !== formData.confirmNewPassword) {
                setError('ⓘ 비밀번호가 일치하지 않습니다.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/find/pwd`, {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setStep(6);
                setError('');
            } else {
                setError('ⓘ 비밀번호 변경에 실패했습니다.');
            }
        };

        const searchError = {
            display: 'flex',
            cursor: 'pointer',
            transform: error ? 'translateY(255px)' : 'translateY(230px)',
            width: '1000px',
            position: 'absolute',
            zIndex: 1
        }

        const togglePasswordVisibility = () => {
            setShowPassword(prevState => !prevState);
        };

        return (
            <div className={styles.findAccount}>
                <div className={styles.findAccountContent}>
                    <p className={`${styles.signupText} ${type === 'id' ? styles.signupTextId : styles.signupTextPassword}`}>{type === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</p>
                    <img className={styles.signupLogo} src={signupLogo} alt="회원가입 로고"></img>
                    <div style={searchError}>
                        <p className={styles.findAccountText}>{type === 'id' ? (
                            <Link to="/auth/find/password" onClick={() => setStep(1)}>비밀번호 찾기</Link>
                        ) : (
                            <Link to="/auth/find/id" onClick={() => setStep(1)}>아이디 찾기</Link>
                        )}</p>
                    </div>

                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit}>
                                <fieldset>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`findEmail ${error ? 'errorInput' : ''}`}
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="이메일 입력"
                                        />
                                        <label htmlFor="email">이메일 입력</label>
                                    </div>
                                </fieldset>
                                {error && <p className={styles.error}>{error}</p>}
                                <button
                                    className={styles.nextButton}
                                    type="submit"
                                    disabled={loading || emailPending}
                                >
                                    {loading || emailPending ? '처리중' : '다음'}
                                </button>
                                <button
                                    className={styles.loginButton}
                                    type="button"
                                    onClick={() => window.location.href = '/auth/login'}
                                >로그인
                                </button>
                            </form>
                        )}

                    {step === 2 && verificationCodeSent && (
                        <form onSubmit={handleVerificationSubmit}>
                            <fieldset>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`findAuth ${error ? 'errorInput' : ''}`}
                                            type="text"
                                            name="auth"
                                            value={formData.auth}
                                            onChange={handleChange}
                                            placeholder="인증번호 입력"
                                        />
                                        <label htmlFor="auth">인증번호 입력</label>
                                    </div>
                                </fieldset>
                                {error && <p className={styles.error}>{error}</p>}
                                <button className={styles.nextButton} type="submit">
                                    다음
                                </button>
                            <button className={styles.loginButton}
                                    type="button"
                                    onClick={() => setStep(1)}  // 비밀번호 입력 단계로 돌아가기
                            >
                                뒤로
                            </button>
                            </form>
                        )}

                        {step === 3 && foundUserId && (
                            <div>
                                <p className={styles.userId}>아이디: <strong>{foundUserId}</strong></p>
                                <button
                                    className={styles.nextButton}
                                >
                                    <Link to="/auth/login">로그인</Link>
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setError('');
                                // 번거로운 부분이 있어 find에서는 프론트에서 진행
                                const passwordError = validatePassword(formData.newPassword);
                                if (passwordError) {
                                    setError(passwordError);
                                    return;
                                }
                                setStep(5);
                            }}>
                                <fieldset>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`findPass ${error ? 'errorInput' : ''}`}
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="새 비밀번호 입력"
                                        />
                                        <label htmlFor="newPassword" className="newPasswordLabel">변경할 비밀번호</label>
                                    </div>
                                </fieldset>
                                <div className={styles.passwordToggleBtn}>
                                    <img
                                        src={showPassword ? Default : On}
                                        alt="비밀번호 보이기/숨기기"
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                                {error && <p className={styles.error}>{error}</p>}
                                <button className={styles.nextButton} type="submit">
                                    다음
                                </button>
                            </form>
                        )}

                    {step === 5 && (
                        <form onSubmit={handlePasswordSubmit}>
                            <fieldset>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`findPassConfirm ${error ? 'errorInput' : ''}`}
                                        type={showPassword ? "text" : "password"}
                                        name="confirmNewPassword"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        placeholder="새 비밀번호 입력"
                                    />
                                    <label htmlFor="confirmNewPassword">비밀번호 확인</label>
                                </div>
                            </fieldset>
                            <div className={styles.passwordToggleBtn}>
                                <img
                                    src={showPassword ? Default : On}
                                    alt="비밀번호 보이기/숨기기"
                                    onClick={togglePasswordVisibility}
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.loginButton}
                                    type="button"
                                    onClick={() => setStep(4)}  // 비밀번호 입력 단계로 돌아가기
                            >
                                뒤로
                            </button>
                            <button className={styles.changeButton} type="submit">
                                변경
                            </button>
                        </form>
                    )}

                    {step === 6 && (
                        <div>
                            <p className={styles.changeConfirm}>비밀번호가 변경되었습니다.</p>
                            <button
                                className={styles.loginButton}
                                onClick={() => window.location.href = '/auth/login'}
                            >
                                로그인
                            </button>
                            <button
                                className={styles.nextButton}
                                onClick={() => window.location.href = '/main'}
                            >
                                메인
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

export default Find;