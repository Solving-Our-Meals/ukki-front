import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/menu.module.css';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';

function Menu() {
    const { storeNo } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState("");
    const { setGlobalError } = useError();

    const fetchStoreMenu = async (storeNo) => {
        return fetch(`${API_BASE_URL}/store/${storeNo}/storeMenu`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',   // 텍스트 형식으로 요청을 추가합니다.
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // if (!response.ok) {
            //     const error = new Error(`HTTP error! status: ${response.status}`);
            //     error.status = response.status;
            //     throw error;
            // }
            // // 비어 있는 응답 대비
            // if(response.status === 204) {
            //     return "";
            // }
            return response.text();
        })
        .catch(error => {
            console.error('fetchStoreMenu error:', error);
            throw error;
        });
    };

    useEffect(() => {
        const fetchData = () => {
            fetchStoreMenu(storeNo)
                .then(menuData => {
                    if (!menuData) {
                        throw new Error('메뉴 데이터를 받아오지 못했습니다.');
                    }
                    const menuUrl = `${API_BASE_URL}/store/${storeNo}/api/menu?menuName=${menuData}`;
                    setMenu(menuUrl);
                })
                .catch(error => {
                    console.error(error);
                    setGlobalError(error.message, error.status);

                    // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                    if (error.status === 404) {
                        navigate('/404');
                    } else if (error.status === 403) {
                        navigate('/403');
                    } else {
                        navigate('/500');
                    }
                });
        };
        fetchData();
    }, [storeNo, navigate, setGlobalError]);

    return (
        <>
            <div id={styles.menuStyle}>
                <img src={menu} id={styles.menuImg} alt='메뉴판' />
            </div>
        </>
    );
}

export default Menu;
