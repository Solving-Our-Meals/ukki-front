import React from 'react';
import styles from '../css/Tabs.module.css'

function Tabs ({activeTab, onTabChange}) {
    return (
        <div className="Tabs">
            <span
                className={`${styles.activeTab1} ${activeTab === 'reservation' ? 'style.active' : ''}`}
                onClick={() => onTabChange('reservation')}
            >
                예약리스트
            </span>
            <span
                className={`${styles.activeTab2} ${activeTab === 'reservation' ? 'style.active' : ''}`}
                onClick={() => onTabChange('review')}
            >
                작성된 리뷰
            </span>
            <span
                className={`${styles.activeTab3} ${activeTab === 'reservation' ? 'style.active' : ''}`}
                onClick={() => onTabChange('inquiry')}
            >
                문의 내역
            </span>
            <span
                className={`${styles.activeTab4} ${activeTab === 'reservation' ? 'style.active' : ''}`}
                onClick={() => onTabChange('profile')}
            >
                회원정보수정
            </span>
        </div>
    );
}

export default Tabs;