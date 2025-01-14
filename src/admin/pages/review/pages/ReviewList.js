import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../css/ReviewList.module.css"; 
import "../css/reset.css";
import { ReviewListAPI } from "../api/ReviewListAPI"; 
import PopupCalendar from "../../../components/PopupCalendar";
import { TotalReviewAPI } from "../api/TotalReviewAPI";

function ReviewList() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [totalReviews, setTotalReviews] = useState(0);
    // const [selectedDate, setSelectedDate] = useState("");
    const [isScope, setIsScope] = useState(false);
    const [selectedScope, setSelectedScope] = useState("none");

    const fetchTotalReviews = useCallback(async () => {
        const data = await TotalReviewAPI();
        const totalReviewCount = Object.values(data)[0];
        setTotalReviews(totalReviewCount);
    }, []);

    const renderStars = (reviewScope) => {
        let stars = [];
        for (let i = 0; i < reviewScope; i++) {
            // stars.push(<span key={i} className={styles.star}>⭐</span>);
            stars.push(<span key={i} className={styles.star}>&#x2B50;</span>);
        }
        return stars;
    };

    const fetchList = useCallback(async (category, word) => {
        try {
            const reviewList = await ReviewListAPI(category, word);
            if (reviewList && reviewList.length > 0) {
                console.log(reviewList);
                setList(reviewList);
                setSearchSuccess(true);
                setIsScope(false);
                setCurrentPage(1);
            } else {
                setSearchSuccess(false);
            }
        } catch (error) {
            console.log("오류발생", error);
        }
    }, []);

    useEffect(() => {
        fetchList(searchParams.get("category"), searchParams.get("word"));
        fetchTotalReviews();
    }, [searchParams, fetchList]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = list.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = useMemo(() => Math.ceil(list.length / itemsPerPage), [list.length, itemsPerPage]);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const currentRangeStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const currentRangeEnd = Math.min(currentRangeStart + 4, totalPages);

    const pageNumbersToDisplay = pageNumbers.slice(currentRangeStart - 1, currentRangeEnd);

    const paginate = useCallback((no) => {
        if (0 < no && no <= totalPages) {
            setCurrentPage(no);
        }
    }, [totalPages]);

    function categoryChangeHandler(e) {
        if(e.target.value === "REVIEW_SCOPE"){
            setIsScope(true);
            setSearchCategory(e.target.value);
        }else{
            setIsScope(false);
            setSearchCategory(e.target.value);
        }
    }

    function searchChangeHandler(e) {
        if(isScope){
            setSelectedScope(e.target.value);
        }else{
            setSearchWord(e.target.value);
        }
    }

    function searchClickHandler() {
        let url = "";
        if(isScope){
            url = `?category=${searchCategory}&word=${selectedScope}`;
            setIsScope(false);
        }else{
            url = `?category=${searchCategory}&word=${searchWord}`;
        }
        navigate(url);
    }

    function handlerReviewInfo(no) {
        const url = `/admin/reviews/info/${no}`;
        navigate(url);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchClickHandler();
        }
    }

    return (
        <>
            {/* <PopupCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}
            <div className={styles.reviewListText}>리뷰리스트</div>
            <div className={styles.totalReviewCount}>총 {totalReviews}개의 리뷰가 있습니다.</div>
            <select className={styles.reviewListSelection} onChange={categoryChangeHandler}>
                <option className={styles.reviewListOption} value="none" selected>검색 기준</option>
                <option className={styles.reviewListOption} value="REVIEW_DATE">리뷰 날짜</option>
                <option className={styles.reviewListOption} value="USER_NAME">사용자 이름</option>
                <option className={styles.reviewListOption} value="STORE_NAME">가게 이름</option>
                <option className={styles.reviewListOption} value="REVIEW_CONTENT">리뷰 내용</option>
                <option className={styles.reviewListOption} value="REVIEW_SCOPE">리뷰 별점</option>
            </select>
            {isScope ? <select className={styles.reviewListStatusSelection} onChange={searchChangeHandler}>
                <option className={styles.reviewListOption} value="none" selected>리뷰 상태</option>
                <option className={styles.reviewListOption} value="리뷰대기중">리뷰대기중</option>
                <option className={styles.reviewListOption} value="리뷰확인">리뷰확인</option>
                <option className={styles.reviewListOption} value="노쇼">노쇼</option>
            </select>
            :
            <input
                type="text"
                className={styles.reviewListSearchInput}
                value={searchWord}
                onChange={searchChangeHandler}
                onKeyPress={handleKeyPress}
            />
            }
            <button type="button" onClick={searchClickHandler} className={styles.reviewListSearchBtn}></button>
            <table className={styles.reviewList}>
                <thead className={styles.reviewListHeader}>
                    <tr>
                        <th style={{ width: '179px' }}>리뷰 날짜</th>
                        <th style={{ width: '325px' }}>리뷰 회원</th>
                        <th style={{ width: '325px' }}>가게 이름</th>
                        <th style={{ width: '480px' }}>리뷰 내용</th>
                        <th style={{ width: '159px' }}>리뷰 별점</th>
                    </tr>
                </thead>
            </table>
            <div id={styles.reviewListBodyPosition}>
                {searchSuccess ? currentItem.map((item, index) => (
                    <div className={styles.reviewListBody} key={index} onClick={() => handlerReviewInfo(item.reviewNo)}>
                        <div style={{ width: '178px' }}>{item.reviewDate}</div>
                        <div style={{ width: '325px' }}>{item.reviewUserId ? item.reviewUserId : "삭제된 회원"}</div>
                        <div style={{ width: '325px' }}>{item.reviewStoreName ? item.reviewStoreName : "삭제된 가게"}</div>
                        <div style={{ width: '480px' }}>{item.reviewContent}</div>
                        <div style={{ width: '158px' }}>{renderStars(item.reviewScope)}</div>
                    </div>
                )) : <div className={styles.reviewListBody}>해당 결과가 존재하지 않습니다.</div>}
            </div>
            <div className={styles.pageNation}>
                <div className={`${styles.pageNationBackBtn} ${currentPage === 1 ? styles.disabled : ''}`} onClick={() => paginate(currentPage - 1)} hidden={currentPage === 1}>◀</div>
                <div className={styles.pageNumArea}>
                    {pageNumbersToDisplay.map((pageNum) => (
                        <div key={pageNum} onClick={() => paginate(pageNum)} className={`${styles.pageNumBtn} ${pageNum === currentPage ? styles.active : ''}`}>
                            {pageNum}
                        </div>
                    ))}
                </div>
                <div className={`${styles.pageNationForwordBtn} ${currentPage === totalPages? styles.disabled : ''}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>▶</div>
            </div>
        </>
    );
}

export default ReviewList;
