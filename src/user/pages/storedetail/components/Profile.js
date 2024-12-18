import { useState, useEffect } from 'react';
import styles from "../css/profile.module.css";

function Profile() {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        // 프로필 이름 가져오기
        fetch('/storeProfile/5')
        .then(res => res.text())
        .then(data => {
            // 프로필 이름을 기반으로 실제 이미지 URL 가져오기
            const profileUrl = `/api/profile?profileName=${data}`
            setProfile(profileUrl);
        });
    }, []);

    return (
        <>
            <div className={styles.profileStyle}>
                <img src={profile} alt="프로필이미지" />
            </div>
        </>
    );
}

export default Profile;
