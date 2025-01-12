import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from "../css/profile.module.css";

function Profile() {
    const { storeNo } = useParams();
    const [profile, setProfile] = useState('');

    useEffect(() => {
        // 프로필 이름 가져오기
        fetch(`/store/${storeNo}/storeProfile`)
        .then(res => res.text())
        .then(data => {
            // 프로필 이름을 기반으로 실제 이미지 URL 가져오기
            const profileUrl = `/store/${storeNo}/api/profile?profileName=${data}`
            setProfile(profileUrl);
        });
    }, []);

    return (
        <>
            <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
        </>
    );
}

export default Profile;
