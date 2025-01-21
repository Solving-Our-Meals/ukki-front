import { useState, useEffect } from 'react';
import styles from "../css/bossProfile.module.css";

function BossProfile({storeNo}) {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        fetch(`/store/${storeNo}/storeProfile`)
        .then(res => res.text())
        .then(data => {
            if(data === ""){
                fetch(`/store/${storeNo}/storebanner`)
                .then(res => res.json())
                .then(data => {
                    const profileUrl = `/store/${storeNo}/api/files?filename=${data[0]}`;
                    setProfile(profileUrl);
                });
            } else {
                const profileUrl = `/store/${storeNo}/api/profile?profileName=${data}`
                setProfile(profileUrl);
            }
        });
    }, []);

    return (
        <>
            <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
        </>
    );
}

export default BossProfile;
