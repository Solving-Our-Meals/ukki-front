import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import styles from "../css/profile.module.css";

function Profile({storeNo}) {
    // const { storeNo } = useParams();
    const [profile, setProfile] = useState('');

    useEffect(() => {
        // 프로필 이름 가져오기
        fetch(`/store/${storeNo}/storeProfile`)
        .then(res => res.text())
        .then(data => {
            // userProfile이 DB에서 null일 때 해당 가게의 배너1번 사진 가져오기
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

    // useEffect(() => {
    //     fetch(`/store/${storeNo}/getInfo`)
    //     .then(res => res.json())
    //     .then(data => {
    //         const newStoreNo = data.storeNo;

    //         fetch(`/store/${newStoreNo}/storeProfile`)
    //         .then(res => res.text())
    //         .then(data => {       
    //             // userProfile이 DB에서 null일 때 해당 가게의 배너1번 사진 가져오기
    //             if(data === ""){
    //                 fetch(`/store/${newStoreNo}/storebanner`)
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     const profileUrl = `/store/${newStoreNo}/api/files?filename=${data[0]}`;
    //                     setProfile(profileUrl);
    //                 });
    //             } else {
    //                 const profileUrl = `/store/${newStoreNo}/api/profile?profileName=${data}`
    //                 setProfile(profileUrl);
    //             }
    //         });
    //     })
    // }, [])

    return (
        <>
            <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
        </>
    );
}

export default Profile;
