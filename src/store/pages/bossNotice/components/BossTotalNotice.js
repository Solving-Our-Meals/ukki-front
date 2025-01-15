import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../css/bossTotalNotice.module.css';
import pin from '../images/Pin.png';
import searchBtn from '../images/searchBtn.png';

function BossTotalNotice(){

    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [currentPage, setCurrentPage] = useState(1); 
    const [currentPageGroup, setCurrentPageGroup] = useState(1);
    
    const itemsPerPage = 6; 
    const pagesPerGroup = 5;

    const totalPages = Math.ceil(notices.length / itemsPerPage);
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);

    const currentItems = notices.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage 
    );
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevGroup = () => {
        if (currentPage > 1) { 
            if ((currentPage - 1) % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev - 1);  
            }
            setCurrentPage(currentPage - 1); 
        }
    };

    const handleNextGroup = () => {
        if (currentPage < totalPages) {  
            if (currentPage % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev + 1);  
            }
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const searchQuery = searchParams.get("searchWord") || "";
        setSearchWord(searchQuery);
        sendSearchWordHandler(searchQuery);
    }, [searchParams]);
    

    const navigateToSpeficifNotice = (noticeNo) => {
        navigate(`/notice/${noticeNo}`);
    }

    const keyPressHandler = (e) => {
        if(e.key === 'Enter'){
            sendSearchWordHandler(searchWord);
            setSearchParams({ searchWord });
        }
    };

    const sendSearchWordHandler = (searchTerm = "") => {
        const term = typeof searchTerm === 'string' ? searchTerm : "";
        const url = searchTerm.trim() === "" ? '/notice/boss' : `/notice/boss?searchWord=${searchTerm}`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            setNotices(Array.isArray(data) ? data : []);
        })
        .catch(error => console.log(error))
    };

    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <div id={styles.dot1} className={styles.dots}></div>
                    <div id={styles.dot2} className={styles.dots}></div>
                    <div id={styles.dot3} className={styles.dots}></div>
                    <div id={styles.dot4} className={styles.dots}></div>
                    <input 
                        id={styles.inputSearch} 
                        name='searchWord' 
                        type='text' 
                        placeholder='검색할 내용을 입력해주세요.' 
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        onKeyPress={(e) => keyPressHandler(e)}
                    />
                    <img 
                        src={searchBtn} 
                        id={styles.searchBtn}
                        onClick={() => { 
                            sendSearchWordHandler(searchWord); 
                            setSearchParams({ searchWord }); 
                        }}
                    />
                    {/* <div id={styles.strNotice}>공지사항</div>
                    <img id={styles.imgPin} src={pin}/>
                    <div className={styles.strArea}>
                        <div id={styles.strCategory}>카테고리</div>
                        <div id={styles.strTitle}>제목</div>
                        <div id={styles.strDate}>날짜</div>
                    </div>
                    <div className={styles.noticeContainer}>
                        {currentItems.map((notice, index) => {
                            let categoryName = "";
                            switch(notice.categoryNo){
                                case 1: categoryName = '안내'; break;
                                case 2: categoryName = '소개'; break;
                                case 3: categoryName = '가게'; break;
                            }
                            return (
                                <div
                                    key={index}
                                    className={styles.notice}
                                    style={{border : (index + 1) % 6 === 0 ? "none" : ""}}
                                    onClick={() => navigateToSpecificNotice(notice.noticeNo)}
                                >
                                    <span 
                                        id={styles.categoryName}
                                        style={{ backgroundColor : notice.categoryNo === 1 ? "#FF8AA3" : notice.categoryNo === 2 ? "#FEDA00" : "#B3E7FF"}}
                                    >
                                        {categoryName}
                                    </span>
                                    <span id={styles.noticeTitle}>{notice.noticeTitle}</span>
                                    <span id={styles.noticeDate}>{notice.date}</span>
                                </div>
                            );
                        })}
                    </div> */}
                    <div id={styles.strNotice}>공지사항</div>
                        <img id={styles.imgPin} src={pin}/>
                        <div className={styles.strArea}>
                            <div id={styles.strCategory}>카테고리</div>
                            <div id={styles.strTitle}>제목</div>
                            <div id={styles.strDate}>날짜</div>
                        </div>
                        <div className={styles.noticeContainer}>
                            {currentItems.length > 0 ? (
                                currentItems.map((notice, index) => {
                                    let categoryName = "";
                                    switch(notice.categoryNo){
                                        case 1: categoryName = '안내'; break;
                                        case 2: categoryName = '소개'; break;
                                        case 3: categoryName = '가게'; break;
                                    }
                                    return (
                                        <div
                                            key={index}
                                            className={styles.notice}
                                            style={{border : (index + 1) % 6 === 0 ? "none" : ""}}
                                            onClick={() => navigateToSpeficifNotice(notice.noticeNo)}
                                        >
                                            <span 
                                                id={styles.categoryName}
                                                style={{ backgroundColor : notice.categoryNo === 1 ? "#FF8AA3" : notice.categoryNo === 2 ? "#FEDA00" : "#B3E7FF"}}
                                            >
                                                {categoryName}
                                            </span>
                                            <span id={styles.noticeTitle}>{notice.noticeTitle}</span>
                                            <span id={styles.noticeDate}>{notice.date}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={styles.noResultsMessage}>해당 결과가 존재하지 않습니다.</div> // 결과가 없을 때 메시지
                            )}
                        </div>
                    <hr/>
                    {/* // 페이지네이션 로직 7 : 페이지네이션 렌더링 */}
                    <div className={styles.pagination}>
                        {/* 이전 그룹 버튼 */}
                        <div
                            className={`${styles.paginationButton} ${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
                            onClick={() => handlePrevGroup()}
                        >
                            ◀
                        </div>
                        {/* 페이지 번호들 */}
                        {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(pageNum => (
                            <div
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                            >
                                {pageNum}
                            </div>
                        ))}    
                        {/* 다음 그룹 버튼 */}
                        <div
                            className={`${styles.paginationButton} ${styles.arrow} ${currentPage === totalPages || totalPages === 0 ? styles.disabled : ''}`}
                            onClick={() => handleNextGroup()}
                        >
                            ▶
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BossTotalNotice;