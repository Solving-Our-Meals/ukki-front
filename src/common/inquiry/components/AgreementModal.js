import '../css/reset.css';
import '../css/AgreementModal.css'

function AgreementModal({ message, onConfirm, onCancel }) {
    return (
        <>
            <div id='agreementModal'>
                <div id='agreementMessage'>{message}</div>
                <button id='agreementCancleBtn' onClick={onCancel}>취소</button>
                <button id='agreementOkBtn' onClick={onConfirm}>확인</button>
            </div>
        </>
    );
}

export default AgreementModal;
