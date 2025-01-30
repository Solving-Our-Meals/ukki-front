import { useState, useEffect } from 'react';
import styles from "../css/bossProfile.module.css";
import { API_BASE_URL } from '../../../../config/api.config';

function BossProfile({storeNo}) {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/store/${storeNo}/storeProfile`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials:"include",
        })
        .then(res => res.text())
        .then(data => {
            if(data === ""){
                fetch(`${API_BASE_URL}/store/${storeNo}/storebanner`,{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials:"include",
                })
                .then(res => res.json())
                .then(data => {
                    const profileUrl = `${API_BASE_URL}/store/${storeNo}/api/files?filename=${data[0]}`;
                    setProfile(profileUrl);
                });
            } else {
                const profileUrl = `${API_BASE_URL}/store/${storeNo}/api/profile?profileName=${data}`
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
