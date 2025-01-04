import { useState, useEffect } from 'react';
import styles from '../css/profile.module.css';

function Profile(){

    const [profile, setProfile] = useState(null);

    useEffect(
        () => {
            fetch('/reservation/5/profile')
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