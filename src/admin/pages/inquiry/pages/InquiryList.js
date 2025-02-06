import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../css/InquiryList.module.css";
import "../css/reset.css";
import { InquiryListUserAPI } from "../api/InquiryListUserAPI";
import { InquiryListStoreAPI } from "../api/InquiryListStoreAPI";
import { TotalInquiryAPI } from "../api/TotalInquiryAPI";
import { API_BASE_URL } from "../../../../config/api.config";
import LodingPage from "../../../components/LoadingPage";

function InquiryList() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [totalInquiries, setTotalInquiries] = useState(0);
    const [isStatus, setIsStatus] = useState(false);
    const [isCategory, setIsCategory] = useState(false);
    const [isUser, setIsUser] = useState(true);
    const [isStore, setIsStore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTotalInquiries = useCallback(async () => {
        const data = await TotalInquiryAPI();
        const totalInquiryCount = Object.values(data)[0];
        setTotalInquiries(totalInquiryCount);
    }, []);

    const fetchList = useCallback(async (category, word) => {
        try {
            let inquiryList;
            if(isUser) {
                inquiryList = await InquiryListUserAPI(category, word);
            } else if(isStore) {
                inquiryList = await InquiryListStoreAPI(category, word);
            }
            if (inquiryList && inquiryList.length > 0) {
                console.log(inquiryList);
                setList(inquiryList);
                setSearchSuccess(true);
                setCurrentPage(1);
                setIsLoading(false);
            } else {
                setSearchSuccess(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.log("오류발생", error);
        }
    }, [isUser, isStore]);

    useEffect(() => {
        fetchList(searchParams.get("category"), searchParams.get("word"));
        fetchTotalInquiries();
    }, [searchParams, fetchList, isUser, isStore]);

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
        if (e.target.value === "STATUS") {
            setIsStatus(true);
            setIsCategory(false);
            setSearchCategory(e.target.value);
        } else if (e.target.value === "CATEGORY_NAME") {
            setIsStatus(false);
            setIsCategory(true);
            setSearchCategory(e.target.value);
        } else {
            setIsStatus(false);
            setIsCategory(false);
            setSearchCategory(e.target.value);
        }
    }

    function searchChangeHandler(e) {
        setSearchWord(e.target.value);
    }

    function searchClickHandler() {
        let url = `/admin/inquiries/list?category=${searchCategory}&word=${searchWord}`;
        navigate(url);
    }

    function handlerinquiryInfo(no, inquiry) {
        let url = ``;
        if(inquiry) {
            url = `/admin/inquiries/info/${no}`;
        } else {
            url = `/admin/inquiries/info/report/${no}`;
        }
        navigate(url);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchClickHandler();
        }
    }

    if (isLoading) {
        return <LodingPage />;
    }

    return (
        <>
            <div className={styles.inquiryListText}>문의리스트</div>
            <div className={styles.totalInquiryCount}>총 {totalInquiries}개의 문의가 있습니다.</div>
            <div className={styles.inquiryListBtnPosition}>
            <button type="button" className={`${styles.inquiryListBtn} ${isUser ? styles.active : ''}`} onClick={() => {setIsUser(true); setIsStore(false);}}>회원문의</button>
            <button type="button" className={`${styles.inquiryListBtn} ${isStore ? styles.active : ''}`} onClick={() => {setIsStore(true); setIsUser(false);}}>가게문의</button>
            </div>
            <select className={styles.inquiryListSelection} onChange={categoryChangeHandler}>
                <option className={styles.inquiryListOption} value="none" selected>검색 기준</option>
                <option className={styles.inquiryListOption} value="INQ_DATE">문의 날짜</option>
                <option className={styles.inquiryListOption} value="CATEGORY_NAME">카테고리</option>
                <option className={styles.inquiryListOption} value="INQ_TITLE">문의 제목</option>
                <option className={styles.inquiryListOption} value="INQ_CONTENT">문의 내용</option>
                <option className={styles.inquiryListOption} value="STATUS">문의 상태</option>
            </select>
            {isUser && (
                isStatus ? (
                    <select className={styles.inquiryListStatusSelection} onChange={searchChangeHandler}>
                        <option className={styles.inquiryListOption} value="none" selected>문의 상태</option>
                        <option className={styles.inquiryListOption} value="PROCESSING">처리중</option>
                        <option className={styles.inquiryListOption} value="COMPLETE">처리완료</option>
                        <option className={styles.inquiryListOption} value="CHECK">확인완료</option>
                    </select>
                ) : isCategory ? (
                    <select className={styles.inquiryListStatusSelection} onChange={searchChangeHandler}>
                        <option className={styles.inquiryListOption} value="none" selected>카테고리</option>
                        <option className={styles.inquiryListOption} value="리뷰문의">리뷰문의</option>
                        <option className={styles.inquiryListOption} value="예약문의">예약문의</option>
                        <option className={styles.inquiryListOption} value="회원문의">회원문의</option>
                        <option className={styles.inquiryListOption} value="일반문의">일반문의</option>
                    </select>
                ) : (
                    <input
                        type="text"
                        className={styles.inquiryListSearchInput}
                        value={searchWord}
                        onChange={searchChangeHandler}
                        onKeyPress={handleKeyPress}
                        placeholder="검색어를 입력해주세요"
                    />
                )
            )}
            {isStore && (
                isStatus ? (
                    <select className={styles.inquiryListStatusSelection} onChange={searchChangeHandler}>
                        <option className={styles.inquiryListOption} value="none" selected>문의 상태</option>
                        <option className={styles.inquiryListOption} value="PROCESSING">처리중</option>
                        <option className={styles.inquiryListOption} value="COMPLETE">처리완료</option>
                        <option className={styles.inquiryListOption} value="CHECK">확인완료</option>
                    </select>
                ) : isCategory ? (
                    <select className={styles.inquiryListStatusSelection} onChange={searchChangeHandler}>
                        <option className={styles.inquiryListOption} value="none" selected>카테고리</option>
                        <option className={styles.inquiryListOption} value="리뷰신고">리뷰신고</option>
                        <option className={styles.inquiryListOption} value="예약문의">예약문의</option>
                        <option className={styles.inquiryListOption} value="회원문의">회원문의</option>
                        <option className={styles.inquiryListOption} value="일반문의">일반문의</option>
                    </select>
                ) : (
                    <input
                        type="text"
                        className={styles.inquiryListSearchInput}
                        value={searchWord}
                        onChange={searchChangeHandler}
                        onKeyPress={handleKeyPress}
                        placeholder="검색어를 입력해주세요"
                    />
                )
            )}
            <button type="button" onClick={searchClickHandler} className={styles.inquiryListSearchBtn}></button>
            <table className={styles.inquiryList}>
                <thead className={styles.inquiryListHeader}>
                    <tr>
                        <th style={{ width: '179px' }}>문의 날짜</th>
                        <th style={{ width: '325px' }}>카테고리</th>
                        <th style={{ width: '325px' }}>문의제목</th>
                        <th style={{ width: '500px' }}>문의내용</th>
                        <th style={{ width: '159px' }}>상태</th>
                    </tr>
                </thead>
            </table>
            <div id={styles.inquiryListBodyPosition}>
                {searchSuccess ? currentItem.map((item, index) => (
                    <div className={styles.inquiryListBody} key={index} onClick={() => handlerinquiryInfo(item.inqNo, item.inquiry)} value={item.inquiry} style={{ cursor: 'pointer' }}>
                        <div style={{ width: '177px' }}>{item.inqDate}</div>
                        <div style={{ width: '325px' }}>{item.categoryName}</div>
                        <div style={{ width: '325px' }}>{item.inqTitle}</div>
                        <div style={{ width: '500px' }}>{item.inqContent}</div>
                        <div style={{ width: '158px' }}>{item.state}</div>
                    </div>
                )) : <div className={styles.inquiryListBody}>해당 결과가 존재하지 않습니다.</div>}
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
                <div className={`${styles.pageNationForwordBtn} ${currentPage === totalPages ? styles.disabled : ''}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>▶</div>
            </div>
        </>
    );
}

export default InquiryList;
