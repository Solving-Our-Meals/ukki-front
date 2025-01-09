import { useState, useEffect } from 'react';

export const getBannerAPI = async (storeNo) => {
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetch(`/store/storebanner/${storeNo}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const imageUrls = data.map(filename => `/store/api/files?filename=${filename}`);
                setImages(imageUrls);
            });
    }, []);

    return images;
}