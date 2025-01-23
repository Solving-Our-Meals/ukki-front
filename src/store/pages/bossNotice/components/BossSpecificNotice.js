import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/bossSpecificNotice.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

function BossSpecificNotice(){
    const { noticeNo } = useParams();
    const [notice, setNotice] = useState({
        category : "",
        title : "",
        content : "",
        date : ""
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/notice/getSpecificNotice?noticeNo=${noticeNo}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {

            console.log('공지사항 정보', data);
            let categoryName = "";
            switch(data.categoryNo){
                case 1 : categoryName = "안내"; break;
                case 2 : categoryName = "소개"; break;
                case 3 : categoryName = "가게"; break;
            }
            setNotice(prevState => ({
                ...prevState,
                category : categoryName,
                title : data.noticeTitle,
                content : data.noticeContent,
                date : data.date
            }));

        })
        .catch(error => console.log(error));
    }, [])

    return(
        <>
            <div id={styles.noticeArea}>
                <p id={styles.strNotice}>공지사항</p>
                <span
                    id={styles.category}
                    style={{backgroundColor : notice.category === '안내' ? "#FF8AA3" : notice.category === '소개' ? "#FEDA00" : "#B3E7FF" }}
                >
                    {notice.category}
                </span>
                <span>제목 : </span> <span>{notice.title}</span>
                <span>작성 일자 : </span> <span>{notice.date}</span>
                <div id={styles.noticeContent}>
                    <span id={styles.content}>{notice.content}</span>
                </div>
            </div>
        </>
    );
}

export default BossSpecificNotice;