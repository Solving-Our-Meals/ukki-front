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
        </div>
    )
}

export default Mypage;