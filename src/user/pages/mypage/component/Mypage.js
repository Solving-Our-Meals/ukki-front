import React, { useState } from 'react';
import MypageMain from '../pages/MypageMain.js'
import Tabs from '../pages/Tabs.js'
import Header from '../../../../common/header/components/Header'


function Mypage() {
    const [activeTab, setActiveTab] = useState('reservation');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mypage">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            {<Header/>}
            {activeTab === 'reservation' && <MypageMain />}
            {activeTab === 'review' && <div>작성된 리뷰 내용</div>}
            {activeTab === 'profile' && <div>회원정보수정</div>}
            {activeTab === 'inquiry' && <div>문의 내역</div>}
        </div>
    )
}

export default Mypage;