import React, {useState, useRef, useEffect} from 'react';
import styles from '../css/Signup.module.css';
import '../css/reset.css';

function Signup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userId: '',
        userPass: '',
        email: '',
        auth: '',
        userName: '',
        terms: false
    });
    const [error, setError] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // 이메일 다음 버튼 때문에
    const [emailPending, setEmailPending] = useState(false);  // 이메일 대기
    const [canSubmit, setCanSubmit] = useState(false);
    const termsContentRef = useRef(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

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

    //아이디 중복검사
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();

        // 아이디 유효성 검사
        if (!validateUsername(formData.userId)) {
            setError('ⓘ 아이디는 영문, 숫자, 하이픈, 언더바 조합으로 6~15자 이내로 입력해주세요.');
            return;
        }

        console.log("Submitting userid:", formData.userId);

        const response = await fetch('/auth/signupid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: formData.userId})
        });
        const result = await response.json();
        if (result.isValid) {
            setStep(2);
            setError('');
        } else {
            setError('ⓘ 유효하지 않거나 중복된 아이디입니다.');
        }
    };

    // 비밀
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/auth/signuppwd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userPass: formData.userPass})
        });

        const result = await response.json();


        if (result.isValid) {
            setStep(3);
            setError('');
        } else {
            setError(result.message);
        }
    };

    // 이메일 관련
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailPending(true); // 이메일 대기 중 상태 설정

        // 이메일 중복
        const emailCheckResponse = await fetch('/auth/checkemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: formData.email}),
        });

        const emailCheckResult = await emailCheckResponse.json();
        console.log(emailCheckResult)

        if (emailCheckResult.isDuplicate) {
            setError('ⓘ 이 이메일은 이미 사용 중입니다.');
            setEmailPending(false);
            return;
        }

        if (emailCheckResult.isNoshowLimitExceeded) {
            setError('ⓘ 이전의 노쇼 횟수가 3회로 가입이 불가합니다.');
            setEmailPending(false);
            return;
        }

        // 인증번호 전송
        setLoading(true);
        const response = await fetch('/auth/sendemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: formData.email}),
        });

        const result = await response.json();
        if (result.success) {
            setVerificationCodeSent(true);
            setError('');
            setStep(4); // 인증번호 입력 단계로 이동
        } else {
            setError('ⓘ 이메일 전송에 실패했습니다. 다시 시도해주세요.');
        }

        setLoading(false);
        setEmailPending(false);
    };

    // 이메일 다음 인증번호 부분
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
            setStep(5);
            setError('');
        } else {
            // 인증번호가 유효하지 않은 경우
            setError('ⓘ 인증번호가 올바르지 않습니다.');
        }
    };

    // 닉네임
    const handleNicknameSubmit = async (e) => {
        e.preventDefault();

        // 닉네임 유효성 검사
        if (!validateNickname(formData.userName)) {
            setError('ⓘ 닉네임은 영문, 숫자, 한글 조합으로 1~12자 이내로 입력해주세요.');
            return;
        }

        const response = await fetch('/auth/signupnickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName: formData.userName})
        });
        const result = await response.json();
        if (result.isValid) {
            setStep(6);  // 닉네임이 유효하면 약관 동의 단계로 넘어감
            setError('');
        } else {
            setError('ⓘ 유효하지 않거나 중복된 닉네임입니다.');
        }
    };

    // 약관 동의
    const handleTermsSubmit = (e) => {
        e.preventDefault();
        if (!formData.terms) {
            setError('ⓘ 약관에 동의해야 합니다.');
            return;
        }

        // 회원가입 완료
        const response = fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)  // 모든 회원가입 정보 전송
        });
        response.then(res => res.json()).then(result => {
            if (result.success) {
                setStep(7);
            } else {
                setError('ⓘ 회원가입에 실패했습니다.');
            }
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const checkboxWrapperStyle = {
        display: 'flex',
        transform: error ? 'translate(40px, 200px)' : 'translate(40px, 180px)',
        width: '1000px',
    };

    const handleScroll = () => {
        const termsContent = termsContentRef.current;
        if (termsContent) {
            const isAtBottom = termsContent.scrollHeight === termsContent.scrollTop + termsContent.clientHeight;
            setCanSubmit(isAtBottom);
        }
    };

    return (
        <div className={styles.signupBasic}>
            <div className={styles.signup}>
                <p className={styles.signupText}>회원가입</p>
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
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button type="submit" className={styles.nextButton}>다음</button>
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
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className={styles.nextButton}>다음</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleEmailSubmit}>
                        <fieldset className={styles.fieldEmail}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupEmail} ${error ? styles.errorInput : ''}`}
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    id="email"
                                    placeholder="이메일 입력"
                                />
                                <label htmlFor="email">이메일 입력</label>
                            </div>
                        </fieldset>
                        {error && <p className={styles.error}>{error}</p>}
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className={styles.nextButton}
                                disabled={loading || emailPending} // 이메일 전송 중이거나 로딩 중이면 버튼 비활성화
                        >{loading || emailPending ? '처리중' : '다음'}</button>
                    </form>
                )}

                {step === 4 && verificationCodeSent && (
                    <form onSubmit={handleVerificationSubmit}>
                        <fieldset className={styles.fieldAuth}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupAuth} ${error ? styles.errorInput : ''}`}
                                    type="text"
                                    name="auth"
                                    value={formData.auth}
                                    onChange={handleChange}
                                    id="auth"
                                    placeholder="인증번호 입력"
                                />
                                <label htmlFor="email">인증번호 입력</label>
                            </div>
                        </fieldset>
                        {error && <p className={styles.error}>{error}</p>}
                        <button className={styles.loginButton}
                                type="button"
                                onClick={() => setStep(3)}  // 비밀번호 입력 단계로 돌아가기
                        >뒤로
                        </button>

                        <button className={styles.nextButton}>다음</button>
                    </form>
                )}

                {step === 5 && (
                    <form onSubmit={handleNicknameSubmit}>
                        <fieldset className={styles.fieldAuth}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={`${styles.signupName} ${error ? styles.errorInput : ''}`}
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    id="userName"
                                    placeholder="닉네임 입력"
                                />
                                <label htmlFor="email">닉네임 입력</label>
                            </div>
                        </fieldset>
                        {error && <p className={styles.error}>{error}</p>}
                        <button
                            className={styles.loginButton}
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className={styles.nextButton}>다음</button>
                    </form>
                )}

                {step === 6 && (
                    <form onSubmit={handleTermsSubmit}>
                        <fieldset ref={termsContentRef} onScroll={handleScroll} className={`${styles.fieldTerms} ${error ? styles.errorInput : ''}`}>
                            <div className={styles.termsContent}>
                                <p>약관 1 : 사이트 이름</p>
                                <p>약관 1 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                                <p>약관 2 : 위 사이트는 우끼라 칭한다.</p>
                            </div>
                        </fieldset>
                        <div className={styles.checkboxWrapper} style={checkboxWrapperStyle}>
                            <label className={styles.termsLabel} htmlFor="terms">약관에 동의합니다.</label>
                            <input
                                type="checkbox"
                                name="terms"
                                id="terms"
                                checked={formData.terms}
                                onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                                disabled={!canSubmit}
                            />
                        </div>
                        {error && <p className={styles.errorTerms}>{error}</p>}
                        <button className={styles.signupButton}>완료</button>
                    </form>
                )}

                {step === 7 && (
                    <form>
                        <p className={styles.mainConfirm}>회원가입이 완료되었습니다.</p>
                        <p className={styles.subConfirm}>우끼 가입을 환영합니다.</p>
                        <button
                            className={styles.mainButton}
                            type="button"
                            onClick={() => window.location.href = '/main'}
                        >메인
                        </button>
                        <button
                            className={styles.loginButtonConfirm}
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Signup;