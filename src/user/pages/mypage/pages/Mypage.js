import React, { useState } from 'react';
import Header from '../../../../common/header/components/Header'
import styles from '../css/Mypage.module.css';
import '../css/reset.css';
import MyProfile from "../component/MyProfile";
import Reservation from "./Reservation";

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