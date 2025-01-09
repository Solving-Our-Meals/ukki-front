import React, { useState } from 'react';
import Header from '../../../../common/header/components/Header'
import styles from '../css/Mypage.module.css';
import '../css/reset.css';
import MyProfile from "../pages/MyProfile";
import Reservation from "../pages/Reservation";
import { Link } from 'react-router-dom';

function Mypage() {
    return (
        <div className={styles.mypage}>
            <Header/>
            <div className={styles.contentList}>
                    <Reservation />
            </div>
            <MyProfile />
        </div>
    )
}

export default Mypage;