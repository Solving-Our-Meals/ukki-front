import { Routes, Route } from 'react-router-dom';
import QrCheck from '../pages/QrCheck';
import QrConfirm from '../pages/QrConfirm';
import '../../../../common/inquiry/css/reset.css'


 function QrRoutes() { 
    return (
    <Routes> 
        <Route path=":qrName" element={<QrCheck />} />
        <Route path=":qrName/confirm" element={<QrConfirm />} />
    </Routes> ); }
export default QrRoutes