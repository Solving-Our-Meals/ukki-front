import { useState, useEffect } from 'react';
import styles from '../css/totalNotice.module.css';
import pin from '../images/Pin.png';

function TotalNotice(){

    const [notices, setNotices] = useState([]);

    // 페이지네이션 로직 1 : 기본 상태값과 상수 설정
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [currentPageGroup, setCurrentPageGroup] = useState(1); // 현재 페이지 그룹
    
    const itemsPerPage = 5; // 페이지당 항목 수(한 페이지당 보여줄 아이템 수)
    const pagesPerGroup = 5; // 그룹당 페이지 수(한 그룹당 보여줄 페이지 수)

    // 페이지네이션 로직 2 : 전체 페이지와 그룹 수 계산
    // 전체 페이지 수 계산 => 전체 페이지 = 올림(전체 아이템 수 / 페이지당 아이템 수)
    const totalPages = Math.ceil(notices.length / itemsPerPage);
    // 전체 페이지 그룹 수 계산 => 올림(전체 페이지 수 / 그룹당 페이지 수)
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    
    // 페이지네이션 로직 3 : 현재 페이지 그룹의 시작과 끝 페이지 계산
    // 시작 페이지 => (현재 페이지 그룹 - 1) * 그룹당 페이지 수 + 1 
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    // 끝 페이지 => min(현재 그룹 * 그룹당 페이지 수, 전체 페이지)
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);

    // 페이지네이션 로직 4 : 현재 페이지에 표시할 아이템 계산
    // 현재 페이지에 표시할 항목들 => notices배열.slice(시작 인덱스, 끝 인덱스)
    const currentItems = notices.slice(
        (currentPage - 1) * itemsPerPage, // 시작 인덱스
        currentPage * itemsPerPage // 끝 인덱스
    );
    
    // 페이지네이션 로직 5 : 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 클릭한 페이지 번호로 현재 페이지 변경
    };

    // 페이지네이션 로직 6 : 이전/다음 그룹 이동 핸들러
    // 이전 페이지 그룹으로 이동
    const handlePrevGroup = () => {
        if (currentPage > 1) { // 첫 번째 페이지가 아닐 때만
            // 현재 페이지가 현재 그룹의 첫 페이지인 경우
            if ((currentPage - 1) % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev - 1);  // 이전 그룹으로 이동
            }
            setCurrentPage(currentPage - 1); // 이전 페이지로 이동
        }
    };

    // 다음 페이지 그룹으로 이동
    const handleNextGroup = () => {
        if (currentPage < totalPages) {  // 마지막 페이지가 아닐 때만
            // 현재 페이지가 현재 그룹의 마지막 페이지인 경우
            if (currentPage % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev + 1);  // 다음 그룹으로 이동
            }
            setCurrentPage(currentPage + 1); // 다음 페이지로 이동
        }
    };

    useEffect(() => {
        fetch('/notice/user')
        .then(res => res.json())
        .then(data => {

            console.log('data', data);
            setNotices(data);
        })
        .catch(error => console.log(error));
    }, [])

    


    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <div id={styles.dot1} className={styles.dots}></div>
                    <div id={styles.dot2} className={styles.dots}></div>
                    <div id={styles.dot3} className={styles.dots}></div>
                    <div id={styles.dot4} className={styles.dots}></div>
                    <div className={styles.strArea}>
                        <div id={styles.strNotice}>공지사항</div>
                        <img id={styles.imgPin} src={pin}/>
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
                                    style={{border : (index + 1) % 5 === 0 ? "none" : ""}}
                                >
                                    <span 
                                        id={styles.categoryName}
                                        style={{ backgroundColor : notice.categoryNo === 1 ? "#FF8AA3" : "#FEDA00" }}
                                    >
                                        {categoryName}
                                    </span>
                                    <span id={styles.noticeTitle}>{notice.noticeTitle}</span>
                                    <span id={styles.noticeDate}>{notice.date}</span>
                                </div>
                            );
                        })}
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

export default TotalNotice;