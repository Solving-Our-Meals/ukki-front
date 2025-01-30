
import '../css/reset.css';
import '../css/AgreementModal.css'

function AgreementModal({ message, onConfirm, onCancel }) {
    return (
        <>
            <div id='agreementModal'>
                <div id='agreementMessage'>{message}</div>
                <button id='agreementCancleBtn' type={"button"} onClick={onCancel}>취소</button>
                <button id='agreementOkBtn' type={"button"} onClick={onConfirm}>확인</button>
            </div>
        </>
    );
}

export default AgreementModal;
