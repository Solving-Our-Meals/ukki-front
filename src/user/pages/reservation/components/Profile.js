import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/profile.module.css';

function Profile(){

    const [profile, setProfile] = useState(null);

    const location = useLocation();
    const storeInfo = {...location.state};
    const storeNo = storeInfo.storeNo;


    useEffect(
        () => {
            fetch(`/reservation/profile?storeNo=${storeNo}`)
            .then(res => res.text())
            .then(data => {
                const profileUrl = `/reservation/api/profile?profileName=${data}`
                setProfile(profileUrl);
            });
        }, []);

    return(
        <img id={styles.profile} src={profile} alt='프로필 사진'/>
    );
}

export default Profile;