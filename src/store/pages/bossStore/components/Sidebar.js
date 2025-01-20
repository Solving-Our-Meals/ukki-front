// Sidebar.js
import React from 'react';
import '../css/Sidebar.css'; // 스타일 파일 추가
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <ul>
                <li onClick={() => navigate('/boss/mypage')}>대시보드</li>
                <li onClick={() => navigate('/boss/review')}>리뷰</li>
                <li onClick={() => navigate('/boss/inquiry')}>문의</li>
                <li onClick={() => navigate('/boss/notice')}>공지</li>
            </ul>
        </div>
    );
}

export default Sidebar;
