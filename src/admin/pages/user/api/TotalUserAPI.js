import { API_BASE_URL } from '../../../../config/api.config';

export async function TotalUserAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/total`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}