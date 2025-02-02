import React, {useState, useRef, useEffect} from 'react';
import styles from '../css/Signup.module.css';
import '../css/reset.css';
import signupLogo from '../images/signupLogo.png';
import Default from '../images/default.png';
import On from '../images/on.png';
import {API_BASE_URL} from "../../../../config/api.config";

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

        const response = await fetch(`${API_BASE_URL}/auth/signupid`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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

        const response = await fetch(`${API_BASE_URL}/auth/signuppwd`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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
        const emailCheckResponse = await fetch(`${API_BASE_URL}/auth/checkemail`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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
        const response = await fetch(`${API_BASE_URL}/auth/sendemail`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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

        const response = await fetch(`${API_BASE_URL}/auth/signupnickname`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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
        const response = fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
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
            const isAtBottom = Math.abs(termsContent.scrollHeight - termsContent.scrollTop - termsContent.clientHeight) <= 1;
            setCanSubmit(isAtBottom);
            console.log("isAtBottom:", isAtBottom);  // 체크용 로그
        }
    };

    return (
        <div className={styles.signupBasic}>
            <div className={styles.signup}>
                <p className={styles.signupText}>회원가입</p>
                <img className={styles.signupLogo} src={signupLogo} alt="회원가입 로고"/>
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
                                        src={showPassword ? Default : On}
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
                        >{loading || emailPending ? '진행' : '다음'}</button>
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
                                <p>**우끼 - 혼밥 음식 예약 서비스 약관**</p>

                                <p>**제 1 조 (목적)**</p>
                                <p>본 약관은 사용자가 **우끼** 플랫폼을 통해 혼자 식사를 원하는 음식점 예약 및 관련 서비스를 이용하는 과정에서 발생할 수 있는 모든 법적 권리와
                                    의무를 규정함을 목적으로 합니다. 사용자는 우끼 서비스를 이용함으로써 본 약관에 동의하는 것으로 간주됩니다.</p>

                                <p>**제 2 조 (서비스의 제공 및 변경)**</p>
                                <p>1. **우끼**는 사용자가 혼자 식사할 수 있는 적합한 음식점을 예약할 수 있는 플랫폼을 제공합니다. 사용자는 우끼 플랫폼을 통해 음식점 예약, 메뉴
                                    주문, 예약 변경 및 취소 등의 서비스를 이용할 수 있습니다.</p>
                                <p>2. **우끼**는 필요에 따라 서비스의 일부 또는 전체를 변경하거나 종료할 수 있으며, 이에 대해 사용자는 이의를 제기하지 않기로 동의합니다.</p>

                                <p>**제 3 조 (회원 가입 및 사용자의 의무)**</p>
                                <p>1. 사용자는 **우끼** 서비스를 이용하기 위해 회원 가입을 완료해야 하며, 이를 위해 정확하고 최신의 정보를 제공해야 합니다.</p>
                                <p>2. 회원은 제공된 정보를 정확하게 유지하고 업데이트할 책임이 있습니다. 허위 정보 제공 시, **우끼**는 서비스 제공을 거부하거나 제한할 수
                                    있습니다.</p>
                                <p>3. 사용자는 본 서비스를 통해 예약한 음식점에서 발생하는 일체의 문제에 대해 본인의 책임 하에 해결해야 하며, **우끼**는 음식점과의 문제에 대한
                                    법적 책임을 지지 않습니다.</p>

                                <p>**제 4 조 (예약 절차 및 확인)**</p>
                                <p>1. 사용자는 **우끼** 플랫폼을 통해 예약을 진행하며, 예약 완료 후 예약 확인서를 이메일 또는 SMS로 받게 됩니다.</p>
                                <p>2. 예약이 완료되면 사용자는 예약한 음식점에서 예약 정보를 확인하고, 정해진 시간에 도착하여 예약을 이용해야 합니다. 예약 시간 미준수 시, 예약
                                    취소나 추가 요금이 발생할 수 있습니다.</p>
                                <p>3. 예약 변경이나 취소는 음식점의 정책을 따르며, **우끼**는 이를 위한 중재 역할을 하지 않습니다.</p>

                                <p>**제 5 조 (결제 및 환불)**</p>
                                <p>1. 사용자는 **우끼**를 통해 예약한 음식점에 대해 결제를 진행해야 합니다. 결제는 **우끼** 플랫폼에서 제공하는 결제 시스템을 통해 이루어지며,
                                    결제 방식은 신용카드, 계좌이체 등 다양한 방법을 지원합니다.</p>
                                <p>2. 결제 완료 후 예약이 확정됩니다. 사용자가 예약을 취소하거나 변경할 경우, 음식점의 취소 및 변경 정책에 따라 수수료가 발생할 수 있으며,
                                    **우끼**는 이에 대해 책임을 지지 않습니다.</p>
                                <p>3. 예약 후 취소는 음식점의 정책에 따라 진행되며, 환불은 해당 정책에 따릅니다. **우끼**는 환불 정책을 따르지 않으며, 환불과 관련된 문제는
                                    음식점과 직접 해결해야 합니다.</p>

                                <p>**제 6 조 (이용 제한 및 서비스 중단)**</p>
                                <p>1. **우끼**는 다음과 같은 사유로 서비스를 제한하거나 중단할 수 있습니다:</p>
                                <p>- 사용자가 본 약관을 위반하거나 불법적인 행위를 할 경우</p>
                                <p>- 시스템의 점검, 수리 또는 업그레이드를 위해 서비스가 일시적으로 중단될 경우</p>
                                <p>- 자연재해, 국가적 비상사태 등 외부 요인으로 서비스 제공이 불가능할 경우</p>
                                <p>2. 서비스가 중단되거나 제한되는 경우, **우끼**는 해당 사항을 사용자에게 사전 고지할 수 있으나, 예외적으로 긴급한 경우 사후 고지가 될 수
                                    있습니다.</p>

                                <p>**제 7 조 (개인정보 보호)**</p>
                                <p>1. **우끼**는 사용자의 개인정보를 중요하게 취급하며, 관련 법령을 준수하여 개인정보를 보호합니다.</p>
                                <p>2. 사용자는 **우끼**에 제공한 개인정보가 정확하고 최신 상태임을 보장해야 하며, 개인정보 처리 방침에 동의함으로써 사용자의 개인정보가 **우끼**와
                                    관련된 서비스 제공을 위해 사용됨에 동의하는 것으로 간주됩니다.</p>
                                <p>3. **우끼**는 사용자의 동의 없이 제3자에게 개인정보를 제공하지 않으며, 사용자는 언제든지 개인정보 조회, 수정, 삭제를 요청할 수
                                    있습니다.</p>

                                <p>**제 8 조 (서비스 이용의 제한)**</p>
                                <p>1. 사용자는 **우끼**를 이용할 때 다음의 행위를 해서는 안 됩니다:</p>
                                <p>- 불법적이거나 부정한 목적을 위한 예약</p>
                                <p>- 다른 사용자의 서비스 이용을 방해하거나 방해할 의도가 있는 행위</p>
                                <p>- 부정확하거나 허위의 예약 정보를 입력하는 행위</p>
                                <p>- 기타 **우끼**의 정상적인 운영을 방해하는 행위</p>
                                <p>2. **우끼**는 위와 같은 행위가 발생할 경우 해당 사용자의 서비스를 제한하거나 종료할 수 있습니다.</p>

                                <p>**제 9 조 (면책 조항)**</p>
                                <p>1. **우끼**는 예약 서비스 제공을 위한 플랫폼일 뿐, 사용자가 예약한 음식점에서 제공되는 서비스에 대한 책임을 지지 않습니다. 음식점에서의 음식
                                    품질, 서비스, 예약 변경 및 취소 등에 대한 문제는 해당 음식점과 사용자 간의 문제로 간주되며, **우끼**는 이를 해결할 책임이 없습니다.</p>
                                <p>2. **우끼**는 시스템 오류나 불가피한 상황으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>

                                <p>**제 10 조 (분쟁 해결 및 준거법)**</p>
                                <p>1. 본 약관은 대한민국 법률에 따라 해석되며, **우끼**와 사용자 간에 발생하는 모든 분쟁은 서울중앙지방법원을 제1심 법원으로 합니다.</p>
                                <p>2. **우끼**와 사용자는 분쟁 발생 시 우호적인 협의를 통해 해결할 수 있도록 노력합니다.</p>

                                <p>**제 11 조 (약관의 개정)**</p>
                                <p>1. **우끼**는 필요에 따라 본 약관을 수정하거나 개정할 수 있으며, 약관이 변경될 경우 **우끼**는 사용자에게 사전 공지하거나 이메일, SMS
                                    등의 방법으로 알립니다.</p>
                                <p>2. 사용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중지할 수 있으며, 서비스 이용을 계속하는 경우 변경된 약관에 동의한 것으로
                                    간주됩니다.</p>

                                <p>**부칙**</p>
                                <p>본 약관은 2025년 1월 30일부터 시행됩니다.</p>
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