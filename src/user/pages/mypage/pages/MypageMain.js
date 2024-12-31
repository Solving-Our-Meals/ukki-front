import React, { useState } from 'react';
import styles from '../css/MypageMain.module.css'

function MypageMain () {
    const [reservation, setReservation] = useState([]);

    return (
        <div className={styles.mypageMain}>
            <p>마이페이지</p>
        </div>
    );
}

export default MypageMain;