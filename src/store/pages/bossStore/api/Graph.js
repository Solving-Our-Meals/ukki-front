import { API_BASE_URL } from '../../../../config/api.config';

export const Graph = async () => {



    try {
        const response = await fetch(`${API_BASE_URL}/boss/mypage/reservations/weekly-reservation-count`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};