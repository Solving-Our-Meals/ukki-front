import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import '../css/reset.css';
import styles from '../css/Find.module.css';
import '../../signup/css/Signup.css'

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
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const searchType = searchParams.has('1') ? 'id' : (searchParams.has('2') ? 'password' : '');

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

            const response = await fetch('/auth/checkemail', {
                method: 'POST',
                headers: {
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
            const sendCodeResponse = await fetch('/auth/sendemail', {
                method: 'POST',
                headers: {
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

            const response = await fetch('/auth/verifycode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    authCode: formData.auth,
                }),
            });

            const result = await response.json();
            if (result.isValid) {
                setStep(3);  // 인증번호가 유효하면 step을 3으로 변경
                setError('');
            } else {
                setError('ⓘ 인증번호가 올바르지 않습니다.');
            }
        };

        useEffect(() => {
            if (step === 3 && searchType === 'password' && formData.email) {
                setStep(4);
            } else if (step === 3 && searchType !== 'password' && formData.email) {
                const fetchUserId = async () => {
                    const userIdResponse = await fetch('/auth/finds1', {
                        method: 'POST',
                        headers: {
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
        }, [step, formData.email, searchType]);

        const handlePasswordSubmit = async (e) => {
            e.preventDefault();

            if (formData.newPassword !== formData.confirmNewPassword) {
                setError('ⓘ 비밀번호가 일치하지 않습니다.');
                return;
            }

            const response = await fetch('/auth/finds2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setStep(6);  // 비밀번호 변경 완료 단계로
                setError('');
            } else {
                setError('ⓘ 비밀번호 변경에 실패했습니다.');
            }
        };

        return (
            <div className={styles.findAccount}>
                <div className={styles.findAccountContent}>
                    <p className={styles.findAccountText}>아이디/비밀번호 찾기</p>

                    {/* 이메일 입력 단계 */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit}>
                            <fieldset>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="이메일 입력"
                                    />
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
                        </form>
                    )}

                    {/* 이메일 인증 단계 */}
                    {step === 2 && verificationCodeSent && (
                        <form onSubmit={handleVerificationSubmit}>
                            <fieldset>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        name="auth"
                                        value={formData.auth}
                                        onChange={handleChange}
                                        placeholder="인증번호 입력"
                                    />
                                </div>
                            </fieldset>
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.nextButton} type="submit">
                                다음
                            </button>
                        </form>
                    )}

                    {step === 3 && foundUserId && (
                        <div>
                            <p className={styles.userId}>가입된 아이디: <strong>{foundUserId}</strong></p>

                            <button
                                className={styles.nextButton}
                                onClick={() => setStep(4)} // 비밀번호 변경 단계로 이동
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    )}

                    {/* 비밀번호 변경 단계 */}
                    {step === 4 && (
                        <form onSubmit={handlePasswordSubmit}>
                            <fieldset>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="새 비밀번호 입력"
                                    />
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="password"
                                        name="confirmNewPassword"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        placeholder="새 비밀번호 확인"
                                    />
                                </div>
                            </fieldset>
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.nextButton} type="submit">
                                비밀번호 변경
                            </button>
                        </form>
                    )}

                    {/* 비밀번호 변경 완료 단계 */}
                    {step === 6 && (
                        <div>
                            <p>비밀번호가 성공적으로 변경되었습니다.</p>
                            <button
                                className={styles.loginButton}
                                onClick={() => window.location.href = '/auth/login'}
                            >
                                로그인 페이지로
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

export default Find;