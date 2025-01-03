import React, { useState } from 'react';
import styles from '../css/MypageMain.module.css'
import MyProfile from "./MyProfile";
import '../css/reset.css';

function MypageMain () {
    const [reservation, setReservation] = useState([]);

    return (
        <div className={styles.mypageMain}>
            <div className={styles.contentList}></div>
            <MyProfile />
        </div>
    );
}

export default MypageMain;