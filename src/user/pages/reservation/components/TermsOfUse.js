import { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import styles from "../css/termsOfUse.module.css";
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';


function TermsOfUse () {
    
    const { setGlobalError } = useError();
    const [isComplete, setIsComplete] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [ isFail, setIsFail ] = useState(false);

    const navigate = useNavigate();

    const [isAgree, setIsAgree] = useState(false);
    const [isClick, setIsClick] = useState(false);

    const AgreeHandler = () => {
        setIsAgree(true);
        setIsClick(true);
    }

    const location = useLocation();
    const locationInfo = {...location.state};
    const [reservationInfo, setReservationInfo] = useState({
        userNo : null,
        storeNo : null,
        resDate : null,
        resTime : null
    });

    useEffect(
        () => {
            fetch(`${API_BASE_URL}/user/info`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials : "include",
            })
            .then(response => {
                if (!response.ok) {
                    const error = new Error(`HTTP error! status: ${response.status}`);
                    error.status = response.status;
                    throw error;
                }
                return response.json();
            })
            .then(data => {
                setReservationInfo(prevInfo => ({
                    ...prevInfo,
                    userNo : data.userNo
                }));
            })
            .catch(error => {
                console.error(error);
                setGlobalError(error.message, error.status);

                // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                if (error.status === 404) {
                    navigate('/404');
                } else if (error.status === 403) {
                    navigate('/403');
                } else {
                    navigate('/500');
                }
            });
        
            setReservationInfo(prevInfo => ({
                ...prevInfo,
                storeNo : locationInfo.storeNo,
                resDate : locationInfo.date2,
                resTime : `${locationInfo.time}:00`
                }));
    }, [setGlobalError]);


    const submitHandler = () => {
        console.log('리뷰 저장 누름')

        console.log('reservationInfo : ', reservationInfo);

        fetch(`${API_BASE_URL}/reservation/insert`, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json; charset=UTF-8"
            },
            body : JSON.stringify(reservationInfo)
        })
        .then(response => {
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }
            return response.text();
        })
        .then(data => {
            console.log("예약 결과는 ???" , data)
            if(data.trim() === "예약 성공"){
                setIsComplete(true);
                console.log("예약 성공 state:", isComplete);
            } else {
                setIsDuplicate(true);
                console.log("예약 중복 state:", isDuplicate);
            }
        })
        .catch(error => {
            console.error(error);
            setGlobalError(error.message, error.status);

            // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
            if (error.status === 500) {
                setIsFail(true);
                console.log("예약 실패 state:", isDuplicate);
            }
        });
    }

    const toMain = () => {
        navigate('/main');
    }

    const toMypage = () => {
        navigate('/user/mypage');
    }

    const toStore = () => {
        navigate(`/store/${reservationInfo.storeNo}`);
    }
    
    return(
        <>
            <div className={isComplete || isDuplicate || isFail ? styles.overLay : ""}></div>
            <div className={styles.termsOfUse}>
                <p id={styles.strTerms}>예약 약관</p><br/>
                <div id={styles.temsArea}>
                    <p>제1조(목적)<br/>
                    본 약관은 혼밥 식당 예약 사이트인 우끼(이하 “사이트”)가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 “사이트”의 권리, 의무, 책임사항과 기타 필요한 사항을 규정하는 것을 목적으로 합니다.</p>
                    <br/>
                    <p>제2조(약관의 효력 및 변경)<br/>
                    1. 이용자가 본 약관 내용에 동의하는 경우, "사이트"의 서비스 제공 행위 및 이용자의 서비스 사용 행위에 본 약관이 우선 적용됩니다.<br/>
                    2. "사이트"는 본 약관을 사전 고지 없이 변경할 수 있습니다. 변경된 약관은 "사이트" 내에 공지하거나 e-mail을 통해 회원에게 공지하며, 공지와 동시에 그 효력이 발생됩니다. 이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 본인의 회원 등록을 취소(회원탈퇴)할 수 있으며 계속 사용하는 경우는 변경된 약관에 동의한 것으로 간주됩니다.</p>
                    <br/>
                    <p>제3조(약관 외 준칙)<br/>
                    본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신윤리위원회 심의규정, 정보통신 윤리강령, 프로그램 보호법 및 기타 관련 법령의 규정에 의합니다.</p>
                    <br/>
                    <p>제4조(용어의 정의)<br/>
                    본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br/>
                    1. 이용자: 본 약관에 따라 "사이트"에서 제공하는 서비스를 받는 자<br/>
                    2. 가입: "사이트"에서 제공하는 가입신청양식에 해당 정보를 기입하고, 본 약관에 동의하여 서비스 이용계약을 완료시키는 행위<br/>
                    3. 회원: "사이트"에 개인 정보를 제공하여 회원 가입을 한 자로써 "사이트"가 제공하는 서비스를 이용할 수 있는 자<br/>
                    4. 아이디: 회원 식별과 회원의 서비스 이용을 위하여 회원이 선정하고 "사이트"가 승인하는 문자, 숫자 또는 양자의 조합<br/>
                    5. 비밀번호: 이용자와 회원 아이디가 일치하는지를 확인하고 통신상 자신의 비밀 보호를 위하여 이용자 자신이 선정한 문자, 숫자 또는 양자의 조합<br/>
                    6. 탈퇴(해지): 회원이 이용계약을 종료시키는 행위</p>
                    <br/>
                    <p>제5조(이용계약의 성립)<br/>
                    1. 이용계약은 신청자가 온라인으로 "사이트"에서 제공하는 소정의 가입신청양식을 작성하여 가입을 완료하는 것으로 성립됩니다.<br/>
                    2. "사이트"는 다음 각 호에 해당하는 이용계약에 대하여 가입을 취소할 수 있습니다.<br/>
                    (1) 다른 사람의 명의를 사용하여 신청하는 경우<br/>
                    (2) 이용계약 신청서의 내용을 허위로 기재하였거나 신청하는 경우<br/>
                    (3) 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등의 행위를 하는 경우<br/>
                    (4) "사이트"를 이용하여 법령과 본 약관이 금지하는 행위를 하는 경우<br/>
                    (5) 기타 "사이트"가 정한 이용신청요건이 미비할 경우</p>
                    <br/>
                    <p>제6조(회원정보 사용에 대한 동의)<br/>
                    1. 회원의 개인정보는 공공기관의 개인정보 보호에 관한 법률에 의해 보호됩니다.<br/>
                    2. "사이트"의 회원 정보는 다음 각 호와 같이 사용, 관리, 보호됩니다.<br/>
                    (1) 개인정보의 사용: "사이트"는 서비스 제공과 관련해서 수집된 회원의 신상정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 단, 법률의 규정에 의해 국가기관의 요구가 있는 경우, 범죄에 대한 수사상의 목적이 있거나 정보통신윤리위원회의 요청이 있는 경우 또는 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우, 이용자가 "사이트"에 제공한 개인정보를 스스로 공개한 경우에는 그러하지 않습니다.<br/>
                    (2) 개인정보의 관리: 이용자는 개인정보의 보호 및 관리를 위하여 서비스의 개인정보 관리에서 수시로 이용자의 개인정보를 수정/삭제할 수 있습니다.<br/>
                    (3) 개인정보의 보호: 이용자의 개인정보는 오직 이용자만이 열람/수정/삭제 할 수 있으며, 이는 전적으로 이용자의 아이디와 비밀번호에 의해 관리되고 있습니다. 따라서 타인에게 본인의 아이디와 비밀번호를 알려주어서는 안 되며, 작업 종료 시에는 반드시 로그아웃하고, 웹 브라우저의 창을 닫아야 합니다.</p>
                    <br/>
                    <p>3. 회원이 본 약관에 따라 이용신청을 하는 것은, 가입신청양식에 기재된 회원정보를 수집, 이용하는 것에 동의하는 것으로 간주됩니다.<br/>
                    4. 회원정보는 언제든지 수정이 가능하지만, 이름과 아이디는 변경이 불가능하므로 작성 시 주의해야 합니다.</p>
                    <br/>
                    <p>제7조(사용자의 정보 보안)<br/>
                    1. 가입 신청자가 "사이트"에 가입 절차를 완료하는 순간부터 이용자는 입력한 정보의 비밀을 유지할 책임이 있으며, 회원의 아이디와 비밀번호를 사용하여 발생하는 모든 결과에 대한 책임은 회원 본인에게 있습니다.<br/>
                    2. 회원의 아이디나 비밀번호가 부정하게 사용되었다는 사실을 발견한 경우에는 즉시 "사이트"에 신고하여야 합니다. 신고를 하지 않음으로 인한 모든 책임은 회원 본인에게 있습니다.<br/>
                    3. 이용자는 "사이트" 서비스의 사용 종료 시마다 정확히 접속을 종료해야 하며, 정확히 종료하지 아니함으로써 제3자가 귀하에 관한 정보를 이용하게 되는 등의 결과로 인해 발생하는 손해 및 손실에 대하여 "사이트"는 책임을 부담하지 아니합니다.</p>
                    <br/>
                    <p>제8조(서비스의 중지)<br/>
                    "사이트"는 이용자가 본 약관의 내용에 위배되는 행동을 한 경우, 임의로 서비스 사용을 제한 및 중지할 수 있습니다.</p>
                    <br/>
                    <p>제9조(서비스의 이용)<br/>
                    1. "사이트"는 이용자가 서비스를 이용하여 기대하는 손익이나 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않으며, 회원이 본 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.<br/>
                    2. "사이트"는 서비스 이용과 관련하여 가입자에게 발생한 손해 중 가입자의 고의, 과실에 의한 손해에 대하여 책임을 지지 않습니다.</p>
                    <br/>
                    <p>제10조(저작권)<br/>
                    1. "사이트"에서 제공하는 정보, 콘텐츠, 학습교재 등에 대한 권리와 책임은 "사이트"에 있으며, 이용자는 "사이트"의 동의 없이 이를 영리적 목적으로 사용할 수 없습니다. 단, 비영리적 목적인 경우 이용자는 "사이트"의 승인을 받아 이를 사용할 수 있으며 서비스 내의 게재권을 갖습니다.<br/>
                    2. 이용자가 게시한 게시물의 내용에 대한 권리와 책임은 이용자 본인에게 있습니다.<br/>
                    3. "사이트"는 게시된 내용을 사전 통지 없이 편집, 이동할 수 있는 권리를 보유하며, 게시판 운영 원칙에 따라 사전 통지 없이 삭제할 수 있습니다.<br/>
                    4. 이용자의 게시물이 타인의 저작권을 침해함으로써 발생하는 민, 형사상의 책임은 전적으로 회원 본인에게 있습니다.</p>
                    <br/>
                    <p>제11조(회원의 의무)<br/>
                    1. 회원 가입 시에 요구되는 정보는 정확하게 기입하여야 합니다. 또한 이미 제공된 이용자에 대한 정보가 정확한 정보가 되도록 유지, 갱신하여야 합니다.<br/>
                    2. 이용자는 서비스를 이용할 때 다음 각 호의 행위를 하지 않아야 합니다.<br/>
                    (1) 다른 이용자의 이용자 번호 등을 부정하게 사용하는 행위<br/>
                    (2) 서비스를 이용하여 얻은 정보를 "사이트"의 사전 승낙 없이 이용자의 이용 이외의 목적으로 복제하거나 이를 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위<br/>
                    (3) 다른 이용자 또는 제3자를 비방하거나 중상모략으로 명예를 훼손하는 행위<br/>
                    (4) 공공질서 및 미풍양속에 위배되는 내용의 정보, 문장, 도형 등을 타인에게 유포하는 행위<br/>
                    (5) 국가의 안전을 위태롭게 하는 행위<br/>
                    (6) 다른 이용자 또는 제3자의 저작권 등 기타 권리를 침해하는 행위<br/>
                    (7) 범죄 행위 기타 이 법 또는 다른 법률에서 금지하는 행위<br/>
                    (8) "사이트"의 사전 승낙 없이 서비스를 이용한 영리 행위<br/>
                    (9) 서비스의 안정적인 운영에 지장을 주거나 줄 우려가 있는 일체의 행위</p>
                    <br/>
                    <p>3. 이용자는 이 약관에서 규정하는 사항과 서비스 이용 안내 또는 주의사항을 준수하여야 합니다.</p>
                    <br/>
                    <p>제12조(이용자의 권리)<br/>
                    1. "사이트"에서 제공하는 대부분의 서비스를 무료로 제공받을 수 있습니다.<br/>
                    2. 이용자는 언제든지 본 서비스 동의를 철회할 수 있습니다.<br/>
                    3. 이용자는 자신의 개인정보에 대한 열람을 요구할 수 있으며, 자신의 개인정보에 오류가 있는 경우 그 정정을 요구할 수 있습니다.</p>
                    <br/>
                    <p>제13조(양도금지)<br/>
                    이용자는 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없습니다.</p>
                    <br/>
                    <p>제14조(이의신청 및 손해배상청구금지)<br/>
                    이용자는 "사이트"에서 제공하는 서비스 이용 시 발생되는 어떠한 문제에 대해서도 우끼에 손해배상 청구를 할 수 없으며 우끼는 이에 대해 책임을 지지 아니합니다.</p>
                    <br/>
                    <p>제15조(면책조항)<br/>
                    1. "사이트"는 회원이나 제3자에 의해 표출된 의견을 승인하거나 반대하거나 수정하지 않습니다. "사이트"는 어떠한 경우라도 회원이 서비스에 담긴 정보에 의존해 얻은 이익이나 입은 손해에 대해 책임이 없습니다.<br/>
                    2. "사이트"는 회원 간 또는 회원과 제3자 간에 서비스를 매개로 하여 물품 거래 혹은 금전적 거래 등과 관련하여 어떠한 책임도 부담하지 아니하고, 회원이 서비스의 이용과 관련하여 기대하는 이익에 관하여 책임을 부담하지 않습니다.</p>
                    <br/>
                    <p>제16조(재판관할)<br/>
                    1. "사이트"와 이용자 간에 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국법을 적용하며, 본 분쟁으로 인한 소는 대한민국의 법원에 제기합니다.</p>
                    <br/>
                    <p>부칙<br/>
                    제1조(시행일)<br/>
                    이 약관은 공지된 날부터 시행합니다.</p>
                </div>
            </div>
            <div className={styles.agreeArea}>
                <button type="button" id={styles.agree} onClick={() => AgreeHandler()} style={{backgroundColor : isClick ? "#FF8AA3" : ""}}>예약 약관 및 제 3자 제공에 동의합니다.</button>
                <button type="submit" id={styles.agreeAll} style={{color : isAgree ?  "" : '#BDBEBF'}} onClick={() => submitHandler()}>동의 및 예약 확정</button>
            </div>
            <div id={styles.completeReservation} style={{display : isComplete ? "" : "none"}}>
                <p id={styles.completeMessage}>예약이 완료되었습니다.</p>
                <p id={styles.comfirnEmailMessage}>QR 코드는 가입한 이메일에서 확인 가능합니다.</p>
                <button type='button' id={styles.toMain} onClick={() => toMain()}>메인으로</button>
                <button type='submit' id={styles.toMypage} onClick={() => toMypage()}>예약확인</button>
            </div>
            <div id={styles.duplicateReservation} style={{display : isDuplicate ? "" : "none"}}>
                <p id={styles.failMessage}>이미 예약 되어있습니다.</p>
                <p id={styles.duplicateMessage}>중복 예약이 불가합니다.</p>
                <button type='button' id={styles.confirm} onClick={() => toStore()}>확인</button>
            </div>
            <div id={styles.failReservation} style={{display : isFail ? "" : "none"}}>
                <p id={styles.failMessage}>예약에 실패했습니다.</p>
                <p id={styles.failReservationMessage}>예약하는 도중에 에러가 발생했습니다.</p>
                <button type='button' id={styles.confirm} onClick={() => toStore()}>확인</button>
            </div>
        </>
    );
}

export default TermsOfUse;