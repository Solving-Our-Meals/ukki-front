import { Routes, Route } from 'react-router-dom';
import '../css/reset.css'
import QrCheck from '../pages/QrCheck';


 function QrRoutes() { 
    return (
    <Routes> 
        <Route path=":qrName" element={<QrCheck />} />
    </Routes> ); }
export default QrRoutes