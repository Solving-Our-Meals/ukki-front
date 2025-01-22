import { API_BASE_URL } from '../../../../config/api.config';

export async function UserListAPI(category, word) {
    try {
        let url = `${API_BASE_URL}/admin/users/list`;
        if (category === 'none' && word) {
            url += `?word=${encodeURIComponent(word)}`;
        } else if (category && word) {
            url += `?category=${encodeURIComponent(category)}&word=${encodeURIComponent(word)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}