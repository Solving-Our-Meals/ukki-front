import '../css/reset.css';
import '../css/AgreementModal.css'

function ResultSmallModal(message){
    return (
        <>
            <div id='agreementModal'>
                <div id='agreementMessage'>{message}</div>
                <button id='agreementOkBtn' onClick={onConfirm}>확인</button>
            </div>
        </>
    );
}

export default ResultSmallModal;