import React, {useState, useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/reset.css';
import '../css/Find.css';

function Find() {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        auth: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailPending, setEmailPending] = useState(false);
    const [username, setUsername] = useState(''); // 찾은 아이디 저장용 useState
    const [findType, setFindType] = useState('id');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const stepQuery = queryParams.get('step');
        if (stepQuery) {
            setStep(Number(stepQuery));
        }
    }, [location]);

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


        // 이메일 확인 -> 회원가입 로직에서 가져와서 !만 붙여서 응용
        const emailCheckResponse = await fetch('/auth/checkemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
        });

        const emailCheckResult = await emailCheckResponse.json();

        if (!emailCheckResult.isDuplicate) {
            setError('ⓘ 없는 이메일입니다.');
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
            setStep(2); // 인증번호 입력 단계로 이동
        } else {
            setError('ⓘ 이메일 전송에 실패했습니다. 다시 시도해주세요.');
        }

        setLoading(false);
        setEmailPending(false);
    };

    // 이메일 다음 인증번호 부분 -> 동일해서 쓰기만하면 됨
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
            setStep(3);
            setError('');
        } else {
            setError('ⓘ 인증번호가 올바르지 않습니다.');
        }
    };

    // 아이디 찾기
    const handleFindSubmit = async (e, type) => {
        console.log("왜안돼?")
        e.preventDefault();
        const email = formData.email;

        try {
            const response = await fetch('/auth/find', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    type: type
                }),
            });

            const data = await response.json();

            if (response.ok && data.username) {
                setUsername(data.username);
                setError('');
            } else {
                setUsername('');
                setError('ⓘ 이메일에 해당하는 아이디가 없습니다.');
            }
        } catch (err) {
            setError('서버와의 연결에 문제가 발생했습니다.');
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

        <div className="signupBasic">
            <div className="signup">
                <p className="findText">{findType === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</p>
                <img className="signupLogo" src="/images/signupLogo.png" alt="회원가입 로고"></img>

                {/* 이메일 입력받는 스탭 */}
                {step === 1 && (
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
                        <p className="search"><Link to="/auth/find?step=4">비밀번호 찾기</Link></p>
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton"
                                disabled={loading || emailPending}
                        >{loading || emailPending ? '처리중' : '다음'}</button>
                    </form>
                )}

                {step === 2 && verificationCodeSent && (
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
                        <p className="search"><Link to="/auth/find?step=4">비밀번호 찾기</Link></p>
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton">찾기
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleFindSubmit}>
                        <fieldset className="fieldId">
                            <div className="inputWrapper">
                                {username ? (
                                    <p className="findname">아이디: {username}</p>
                                ) : (
                                    <p className="findIdError">아이디를 찾을 수 없습니다.</p>
                                )}
                            </div>
                        </fieldset>
                        {error && <p className="error">{error}</p>}
                        <div className="searchWrapper" style={searchError}>
                            <p className="search"><Link to="/auth/find?step=4">비밀번호 찾기</Link></p>
                        </div>
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/signup'}
                        >로그인
                        </button>
                    </form>
                )}

                {/* 이메일 입력받는 스탭 */}
                {step === 4 && (
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
                        <p className="search"><Link to="/auth/find?step=1">아이디 찾기</Link></p>
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

                {step === 5 && verificationCodeSent && (
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
                        <p className="search"><Link to="/auth/find?step=1">아이디 찾기</Link></p>
                        <button
                            className="loginButton"
                            type="button"
                            onClick={() => window.location.href = '/auth/login'}
                        >로그인
                        </button>
                        <button className="nextButton">찾기
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Find;