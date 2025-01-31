import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/specificNotice.module.css';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';
import { API_BASE_URL } from '../../../../config/api.config';

function SpecificNotice(){

    const [isLoading, setIsLoading] = useState(true);
    const { noticeNo } = useParams();
    const [notice, setNotice] = useState({
        category : "",
        title : "",
        content : "",
        date : ""
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/notice/getSpecificNotice?noticeNo=${noticeNo}`)
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
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, [])

    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <div className={styles.noticeInfo}>
                        <p id={styles.strNotice}>공지사항</p>
                        <span
                            id={styles.category}
                            style={{backgroundColor : notice.category === '안내' ? "#FF8AA3" : notice.category === '소개' ? "#FEDA00" : "#B3E7FF" }}
                        >
                            {notice.category}
                        </span>
                        <span>제목 : </span> <span>{notice.title}</span>
                        <span>작성 날짜 : </span> <span>{notice.date}</span>
                        {/* <div id={styles.contentArea}>
                            <span>{notice.content}</span>
                        </div> */}
                        <span id={styles.content}>{notice.content}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SpecificNotice;