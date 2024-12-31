import React, { useState } from 'react';
import styles from '../css/MypageMain.module.css'

function MypageMain () {
    const [reservation, setReservation] = useState([]);

    return (
        <div className={styles.mypageMain}>
            <div className={styles.contentList}></div>
        </div>
    );
}

export default MypageMain;