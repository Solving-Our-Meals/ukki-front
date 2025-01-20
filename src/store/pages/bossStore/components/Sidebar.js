// Sidebar.js
import React from 'react';
import '../css/Sidebar.css'; // 스타일 파일 추가

function Sidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li>대시보드</li>
                <li>리뷰</li>
                <li>문의</li>
                <li>공지</li>
            </ul>
        </div>
    );
}

export default Sidebar;
