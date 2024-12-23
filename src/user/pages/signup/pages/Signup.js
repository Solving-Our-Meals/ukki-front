import React, {useState} from 'react';
import '../css/Signup.css';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        console.log("Updated formData:", { [name]: value });
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
            body: JSON.stringify({ userId: formData.userId })
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
            body: JSON.stringify({ userPass: formData.userPass })
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
            body: JSON.stringify({ email: formData.email }),
        });

        const emailCheckResult = await emailCheckResponse.json();
        if (emailCheckResult.isDuplicate) {
            setError('ⓘ 이 이메일은 이미 사용 중입니다.');
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
            body: JSON.stringify({ email: formData.email }),
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
            body: JSON.stringify({ userName: formData.userName })
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
                alert('ⓘ 회원가입이 완료되었습니다!');
                setStep(7); // 회원가입 완료 단계로 이동
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
        cursor: 'pointer',
        transform: error ? 'translate(40px, 200px)' : 'translate(40px, 180px)',
        width: '1000px',
    };

    return (
        <div className="signupBasic">
            <div className="signup">
                <p className="signupText">회원가입</p>
                <img className="signupLogo" src="/images/signupLogo.png" alt="회원가입 로고"></img>
                {step === 1 && (
                    <form onSubmit={handleUsernameSubmit}>

                        <fieldset className="fieldId">
                            <div className="inputWrapper">
                                <input
                                    className={`signupId ${error ? 'errorInput' : ''}`}
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
                        {error && <p className="error">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인</button>
                        <button className="nextButton">다음</button>
                    </form>
                )}

                {/* 비밀번호 입력받는 스탭 */}
                {step === 2 && (
                    <form onSubmit={handlePasswordSubmit}>
                        <fieldset className="fieldPwd">
                            <div className="inputWrapper">
                                <input
                                    className={`signupPwd ${error ? 'errorInput' : ''}`}
                                    type={showPassword ? "text" : "password"}
                                    name="userPass"
                                    value={formData.userPass}
                                    onChange={handleChange}
                                    id="userPass"
                                    placeholder="비밀번호 입력"
                                />
                                <label htmlFor="userPass">비밀번호 입력</label>
                                <div className="passwordToggleBtn">
                                    <img
                                        src={showPassword ? "/images/signup/default.png" : "/images/signup/on.png"}
                                        alt="비밀번호 보이기/숨기기"
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        {error && <p className="error">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton">다음</button>
                    </form>
                )}

                {/* 이메일 입력받는 스탭 */}
                {step === 3 && (
                    <form onSubmit={handleEmailSubmit}>
                        <fieldset className="fieldEmail">
                            <div className="inputWrapper">
                                <input
                                    className={`signupEmail ${error ? 'errorInput' : ''}`}
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
                        {error && <p className="error">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton"
                                disabled={loading || emailPending} // 이메일 전송 중이거나 로딩 중이면 버튼 비활성화
                        >{loading || emailPending ? '처리중' : '다음'}</button>
                    </form>
                )}

                {step === 4 && verificationCodeSent && (
                    <form onSubmit={handleVerificationSubmit}>
                        <fieldset className="fieldAuth">
                            <div className="inputWrapper">
                                <input
                                    className={`signupAuth  ${error ? 'errorInput' : ''}`}
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
                        {error && <p className="error">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton">다음
                        </button>
                    </form>
                )}

                {step === 5 && (
                    <form onSubmit={handleNicknameSubmit}>
                        <fieldset className="fieldAuth">
                            <div className="inputWrapper">
                                <input
                                    className={`signupName ${error ? 'errorInput' : ''}`}
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
                        {error && <p className="error">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton">다음</button>
                    </form>
                )}

                {step === 6 && (
                    <form onSubmit={handleTermsSubmit}>
                        <fieldset className={`fieldTerms ${error ? 'errorInput' : ''}`}>

                            {/* 약관 내용 텍스트 */}
                            <div className="termsContent">
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
                        <div className="checkboxWrapper" style={checkboxWrapperStyle}>
                            <label className="termsLabel" htmlFor="terms">약관에 동의합니다.</label>
                            <input
                                type="checkbox"
                                name="terms"
                                id="terms"
                                checked={formData.terms}
                                onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                            />
                        </div>
                        {error && <p className="errorTerms">{error}</p>}
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="signupButton">완료</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Signup;