import '../css/reset.css';
import '../css/AgreementModal.css'

function ResultSmallModal({message, close}){
    return (
        <>
            <div id='agreementModal'>
                <div id='agreementMessage'>{message}</div>
                <button id='resultOkBtn' onClick={close}>확인</button>
            </div>
        </>
    );
}

export default ResultSmallModal;