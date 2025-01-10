import './css/reset.css';
import './css/AgreementModal.css'

function AdminResultModal({message, close}){
    return (
        <>
            <div id='agreementModal'>
                <div id='agreementMessage'>{message}</div>
                <button id='resultOkBtn' onClick={close}>확인</button>
            </div>
        </>
    );
}

export default AdminResultModal;