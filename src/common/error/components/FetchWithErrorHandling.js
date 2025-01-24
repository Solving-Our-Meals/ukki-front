// utils/fetchWithErrorHandling.js
export const fetchWithErrorHandling = (url, options = {}) => {

    // 기본 설정
    const defaultOptions = {
        method : 'GET', 
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
    };

    // 전달된 options가 있으면 기본 설정과 합침
    const finalOptions = { ...defaultOptions, ...options };

    return fetch(url, options)
        .then(res => {
            if (!res.ok) {
                const code = res.status;
                let message = '';

                // 상태 코드에 맞는 에러 메시지 설정
                switch (code) {
                    case 404:
                        message = '페이지를 찾을 수 없습니다 (404).';
                        break;
                    case 403:
                        message = '접근이 거부되었습니다 (403).';
                        break;
                    case 500:
                        message = '서버에서 문제가 발생했습니다 (500).';
                        break;
                    default:
                        message = '알 수 없는 오류가 발생했습니다.';
                }
                return Promise.reject(new Error(message));
            }
            return res.json();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

// 사용 예시
// 1)
// GET 요청에서는 fetchWithErrorHandling을 호출할 때 options를 생략하면, 기본적으로 GET 메소드와 함께 headers가 설정됩니다.
// fetchWithErrorHandling('https://example.com/api/data')
//     .then(data => {
//         console.log('데이터:', data);
//     })
//     .catch(error => {
//         console.error('에러:', error);
//     });

// 2)
// POST나 PUT 등의 다른 메소드를 사용할 때는 options를 명시적으로 전달해야 합니다. 
// 이때 method, body 등을 설정할 수 있습니다.
// 이렇게 POST, PUT, DELETE 등 다른 HTTP 메소드에 대해 options를 직접 전달하면, 그에 맞는 요청이 전송됩니다.
// fetchWithErrorHandling('https://example.com/api/data', {
//     method: 'POST',
//     body: JSON.stringify({ name: 'example' }),
// })
// .then(data => {
//     console.log('데이터:', data);
// })
// .catch(error => {
//     console.error('에러:', error);
// });

// 3)
// 컴포넌트에서 GET 요청을 보낼 때 credentials: 'include' 추가
// import React, { useEffect } from 'react';
// import { fetchWithErrorHandling } from '../../../../common/error/components/FetchWithErrorHandling';

// function SomeComponent() {
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetchWithErrorHandling('https://example.com/api/data', {
//                     method: 'GET',
//                     credentials: 'include',  // 여기서 credentials 추가
//                 });
//                 console.log('데이터:', response);
//             } catch (error) {
//                 console.error('에러:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return <div>Some Component</div>;
// }

// export default SomeComponent;

// 4)
// 컴포넌트에서 POST 요청을 보낼 때 credentials: 'include' 추가
// import React, { useEffect } from 'react';
// import { fetchWithErrorHandling } from '../../../../common/error/components/FetchWithErrorHandling';

// function AnotherComponent() {
//     useEffect(() => {
//         const postData = async () => {
//             try {
//                 const response = await fetchWithErrorHandling('https://example.com/api/data', {
//                     method: 'POST',
//                     body: JSON.stringify({ name: 'example' }),
//                     credentials: 'include', // 여기서 credentials 추가
//                 });
//                 console.log('데이터:', response);
//             } catch (error) {
//                 console.error('에러:', error);
//             }
//         };

//         postData();
//     }, []);

//     return <div>Another Component</div>;
// }

// export default AnotherComponent;


