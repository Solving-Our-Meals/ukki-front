import { useState, useEffect } from 'react';

export const getProfileAPI = async (storeNo) => {
    const [profile, setProfile] = useState("");
    useEffect(() => {
        fetch(`/store/storeProfile/${storeNo}`)
        .then(res => res.text())
        .then(data => {
            const profileUrl = `/store/api/profile?profileName=${data}`
            setProfile(profileUrl);

        })
    }, []);

    return profile;
}