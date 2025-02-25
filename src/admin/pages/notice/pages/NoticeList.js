import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../css/NoticeList.module.css';
import searchBtn from '../css/images/Search.png';
import '../css/reset.css';
import { NoticeListUserAPI } from '../api/UserNoticeList';
import { NoticeListStoreAPI } from '../api/StoreNoticeList';
import LodingPage from '../../../components/LoadingPage';

function NoticeList(){

    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const [searchParams] = useSearchParams();
    const [isUser, setIsUser] = useState(true);
    const [isStore, setIsStore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // 페이지네이션 로직 1 : 기본 상태값과 상수 설정
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [currentPageGroup, setCurrentPageGroup] = useState(1); // 현재 페이지 그룹
    
    const itemsPerPage = 6; // 페이지당 항목 수(한 페이지당 보여줄 아이템 수)
    const pagesPerGroup = 5; // 그룹당 페이지 수(한 그룹당 보여줄 페이지 수)

    // 페이지네이션 로직 2 : 전체 페이지와 그룹 수 계산
    // 전체 페이지 수 계산 => 전체 페이지 = 올림(전체 아이템 수 / 페이지당 아이템 수)
    const totalPages = Math.ceil(list.length / itemsPerPage);
    // 전체 페이지 그룹 수 계산 => 올림(전체 페이지 수 / 그룹당 페이지 수)
    // const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    
    // 페이지네이션 로직 3 : 현재 페이지 그룹의 시작과 끝 페이지 계산
    // 시작 페이지 => (현재 페이지 그룹 - 1) * 그룹당 페이지 수 + 1 
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    // 끝 페이지 => min(현재 그룹 * 그룹당 페이지 수, 전체 페이지)
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);

    // 페이지네이션 로직 4 : 현재 페이지에 표시할 아이템 계산
    // 현재 페이지에 표시할 항목들 => notices배열.slice(시작 인덱스, 끝 인덱스)
    const currentItems = list.slice(
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
        fetchList(searchParams.get("word"));
    }, [searchParams, isUser, isStore]);
    
    const fetchList = useCallback(async (word) => {
        try {
            let noticeList;
            if(isUser) {
                noticeList = await NoticeListUserAPI(word);
            } else if(isStore) {
                noticeList = await NoticeListStoreAPI(word);
            }
                setList(noticeList);
                setCurrentPage(1);
            
        } catch (error) {
            console.error("오류발생", error);
        }
        setIsLoading(false);
    }, [isUser, isStore]);

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchClickHandler();
        }
    }

    function searchChangeHandler(e) {
        setSearchWord(e.target.value);
    }

    function searchClickHandler() {
        if(isUser) {
            let url = `?word=${searchWord}`;
            navigate(url);
        } else if(isStore) {
            let url = `?word=${searchWord}`;
            navigate(url);
        }
    }

    function handlerNoticeInfo(no) {
        let url = `/admin/notices/info/${no}`;
        navigate(url);
    }

    if (isLoading) {
        return <LodingPage />;
    }

    return(
        <>
            <div id={styles.background}>
                <div id={styles.noticeArea}>
                    <input 
                        id={styles.inputSearch} 
                        name='searchWord' 
                        type='text' 
                        placeholder='검색할 내용을 입력해주세요.' 
                        value={searchWord}
                        onChange={(e) => searchChangeHandler(e)}
                        onKeyPress={(e) => handleKeyPress(e)}
                    />
                    <img 
                        src={searchBtn} 
                        id={styles.searchBtn}
                        onClick={() => { 
                            searchClickHandler(); 
                        }}
                    />
                    <div id={styles.strNotice}>공지사항</div>
                    <div className={styles.strArea}>
                        <div id={styles.strCategory}>카테고리</div>
                        <div id={styles.strTitle}>제목</div>
                        <div id={styles.strDate}>날짜</div>
                    </div>
                    <div className={styles.noticeContainer}>
                        {currentItems.length > 0 ? (
                            currentItems.map((list, index) => {
                                let categoryName = "";
                                let backgroundColor = "";
                            
                                switch(list.categoryNo){
                                    case 1: 
                                        categoryName = '안내'; 
                                        backgroundColor = "#FF8AA3";
                                        break;
                                    case 2: 
                                        categoryName = '소개'; 
                                        backgroundColor = "#FEDA00";
                                        break;
                                    case 3: 
                                        categoryName = '가게'; 
                                        backgroundColor = "#B3E7FF";
                                        break;
                                    default:
                                        backgroundColor = "#FFFFFF";
                                        break;
                                }
                            
                                return (
                                    <div
                                        key={index}
                                        className={styles.notice}
                                        style={{border : (index + 1) % 6 === 0 ? "none" : ""}}
                                        onClick={() => handlerNoticeInfo(list.noticeNo)}
                                    >
                                        <span 
                                            id={styles.categoryName}
                                            style={{ backgroundColor : backgroundColor }}
                                        >
                                            {categoryName}
                                        </span>
                                        <span id={styles.noticeTitle}>{list.noticeTitle}</span>
                                        <span id={styles.noticeDate}>{list.date}</span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className={styles.noResultsMessage}>해당 결과가 존재하지 않습니다.</div>
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
            <button type="button" onClick={() => navigate('/admin/notices/regist')} className={styles.noticeRegistBtn}>생성</button>
            <div className={styles.noticeBtnPosition}>
                <button type="button" onClick={() => {setIsUser(true); setIsStore(false)}} className={`${styles.noticeListBtn} ${isUser ? styles.active : ''}`}>사용자</button>
                <button type="button" onClick={() => {setIsUser(false); setIsStore(true)}} className={`${styles.noticeListBtn} ${isStore ? styles.active : ''}`}>가게</button>
            </div>
        </>
    );
}

export default NoticeList;