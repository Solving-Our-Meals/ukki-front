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
        try {
            const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storeMenu`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });
            
            // 응답이 비어 있지 않으면 텍스트로 반환
            if (response.ok) {
                const text = await response.text();
                return text.trim();  // 공백을 제거하여 반환
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            // console.error('fetchStoreMenu error:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menuData = await fetchStoreMenu(storeNo);

                // menuData가 없으면 빈 문자열로 처리
                if (!menuData || menuData === "") {
                    setMenu('');  // menu가 비어 있으면 메뉴 이미지를 표시하지 않음
                    throw new Error('메뉴 데이터를 받아오지 못했습니다.');
                }

                // 유효한 menuData가 있으면 menuUrl 설정
                const menuUrl = `${API_BASE_URL}/store/${storeNo}/api/menu?menuName=${menuData}`;
                setMenu(menuUrl);
            } catch (error) {
                // console.error(error);
                setGlobalError(error.message, error.status);
                // 에러 발생 시, 네비게이션 처리 또는 추가 로직 추가 가능
                // navigate('/500');
            }
        };

        fetchData();
    }, [storeNo, navigate, setGlobalError]);

    return (
        <div id={styles.menuStyle}>
            {/* menu가 없으면 display: none 처리 */}
            <img
                src={menu}
                id={styles.menuImg}
                alt="메뉴판"
                style={{ display: menu ? '' : 'none' }} // menu가 없으면 display: none
            />
        </div>
    );
}

export default Menu;
