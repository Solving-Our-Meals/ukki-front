// import { useState, useEffect } from 'react';
// import styles from "../css/profile.module.css";

// function Profile({storeNo}) {
//     const [profile, setProfile] = useState('');

//     useEffect(() => {
//         // 프로필 이름 가져오기
//         fetch(`/store/${storeNo}/storeProfile`)
//         .then(res => res.text())
//         .then(data => {
//             // userProfile이 DB에서 null일 때 해당 가게의 배너1번 사진 가져오기
//             if(data === ""){
//                 fetch(`/store/${storeNo}/storebanner`)
//                 .then(res => res.json())
//                 .then(data => {
//                     const profileUrl = `/store/${storeNo}/api/files?filename=${data[0]}`;
//                     setProfile(profileUrl);
//                 });
//             } else {
//                 const profileUrl = `/store/${storeNo}/api/profile?profileName=${data}`
//                 setProfile(profileUrl);
//             }
//         });
//     }, []);
    
//     return (
//         <>
//             <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
//         </>
//     );
// }

// export default Profile;

import { useState, useEffect } from 'react';
import styles from "../css/profile.module.css";
import { API_BASE_URL } from '../../../../config/api.config';

async function fetchStoreProfile(storeNo) {
    const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storeProfile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
}

async function fetchStoreBannerFirstImage(storeNo) {
    const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storebanner`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0];
}

function Profile({storeNo}) {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await fetchStoreProfile(storeNo);
                let profileUrl;

                if (profileData === "") {
                    const firstImage = await fetchStoreBannerFirstImage(storeNo);
                    profileUrl = `${API_BASE_URL}/store/${storeNo}/api/files?filename=${firstImage}`;
                } else {
                    profileUrl = `${API_BASE_URL}/store/${storeNo}/api/profile?profileName=${profileData}`;
                }

                setProfile(profileUrl);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [storeNo]);

    return (
        <>
            <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
        </>
    );
}

export default Profile;
