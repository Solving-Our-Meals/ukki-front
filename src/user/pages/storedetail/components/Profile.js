import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../css/profile.module.css";
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';

function Profile({ storeNo }) {
    const [profile, setProfile] = useState('');
    const navigate = useNavigate();
    const { setGlobalError } = useError();

    async function fetchStoreProfile(storeNo) {
        const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storeProfile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            throw error;
        }
        // 비어 있는 응답 대비
        if(response.status === 204) {
            return [];
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
            credentials : "include",
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            throw error;
        }
        // 비어 있는 응답 대비
        if(response.status === 204) {
            return [];
        }    
        const data = await response.json();
        return data[0];
    }

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
                setGlobalError(error.message, error.status);

                if (error.status === 404) {
                    navigate('/404');
                } else if (error.status === 403) {
                    navigate('/403');
                } else {
                    navigate('/500');
                }
            }
        };

        fetchData();
    }, [storeNo, navigate, setGlobalError]);

    return (
        <>
            <img id={styles.profileStyle} src={profile} alt="프로필이미지" />
        </>
    );
}

export default Profile;
