import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../css/ReservationList.module.css"; 
import "../css/reset.css";
import { ReservationListAPI } from "../api/ReservationListAPI"; 
import { TotalReservationAPI } from "../api/TotalReservationAPI"; 
import PopupCalendar from "../../../components/PopupCalendar";

function ReservationList() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [totalReservations, setTotalReservations] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");

    const fetchTotalReservations = useCallback(async () => {
        const data = await TotalReservationAPI();
        const totalReservationCount = Object.values(data)[0];
        setTotalReservations(totalReservationCount);
    }, []);

    const fetchList = useCallback(async (category, word) => {
        try {
            const reservationList = await ReservationListAPI(category, word);
            if (reservationList && reservationList.length > 0) {
                setList(reservationList);
                setSearchSuccess(true);
            } else {
                setSearchSuccess(false);
            }
        } catch (error) {
            console.log("오류발생", error);
        }
    }, []);

    useEffect(() => {
        fetchList(searchParams.get("category"), searchParams.get("word"));
        fetchTotalReservations();
    }, [searchParams, fetchList]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = useMemo(() => list.slice(indexOfFirstItem, indexOfLastItem), [list, indexOfFirstItem, indexOfLastItem]);

    const totalPages = useMemo(() => Math.ceil(list.length / itemsPerPage), [list.length, itemsPerPage]);

    const visiblePageNum = useCallback(() => {
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(currentPage + 2, totalPages);

        if (currentPage === 1) {
            endPage = Math.min(5, totalPages);
        } else if (currentPage === 2) {
            endPage = Math.min(5, totalPages);
        } else if (currentPage === totalPages - 1) {
            startPage = Math.max(totalPages - 4, 1);
        } else if (currentPage === totalPages) {
            startPage = Math.max(totalPages - 4, 1);
        }

        let pageNumbers = [];
        for (var i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    }, [currentPage, totalPages]);

    const paginate = useCallback((no) => {
        console.log(no);
        if (0 < no && no <= totalPages) {
            setCurrentPage(no);
        }
    }, [totalPages]);

    function categoryChangeHandler(e) {
        setSearchCategory(e.target.value);
    }

    function searchChangeHandler(e) {
        setSearchWord(e.target.value);
    }

    function searchClickHandler() {
        const url = `?category=${searchCategory}&word=${searchWord}`;
        navigate(url);
    }

    function handlerReservationInfo(no, isToday) {
        let url = "";
        if (isToday) {
            url = `/admin/reservations/info/today/${no}`;
        } else {
            url = `/admin/reservations/info/end/${no}`;
        }
        navigate(url);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchClickHandler();
        }
    }

    return (
        <>
            <PopupCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <div className={styles.reservationListText}>예약리스트</div>
            <div className={styles.totalReservationCount}>총 {totalReservations}개의 예약이 있습니다.</div>
            <select className={styles.reservationListSelection} onChange={categoryChangeHandler}>
                <option className={styles.reservationListOption} value="none" selected>검색 기준</option>
                <option className={styles.reservationListOption} value="RES_DATE">예약 날짜</option>
                <option className={styles.reservationListOption} value="USER_NAME">사용자 이름</option>
                <option className={styles.reservationListOption} value="STORE_NAME">가게 이름</option>
                <option className={styles.reservationListOption} value="RES_DATE">예약 시간</option>
                <option className={styles.reservationListOption} value="QR_CONFIRM">예약 상태</option>
            </select>
            <input
                type="text"
                className={styles.reservationListSearchInput}
                value={searchWord}
                onChange={searchChangeHandler}
                onKeyPress={handleKeyPress}
            />
            <button type="button" onClick={searchClickHandler} className={styles.reservationListSearchBtn}></button>
            <table className={styles.reservationList}>
                <thead className={styles.reservationListHeader}>
                    <tr>
                        <th style={{ width: '179px' }}>예약 날짜</th>
                        <th style={{ width: '400px' }}>예약 회원</th>
                        <th style={{ width: '380px' }}>가게 이름</th>
                        <th style={{ width: '331px' }}>예약 시간</th>
                        <th style={{ width: '159px' }}>예약 상태</th>
                    </tr>
                </thead>
            </table>
            <div id={styles.reservationListBodyPosition}>
                {searchSuccess ? currentItem.map((item, index) => (
                    <div className={styles.reservationListBody} key={index} onClick={() => handlerReservationInfo(item.resNo, item.isToday)}>
                        <div style={{ width: '178px' }}>{item.resDate}</div>
                        <div style={{ width: '400px' }}>{item.userId ? item.userId : "삭제된 회원"}</div>
                        <div style={{ width: '400px' }}>{item.storeName ? item.storeName : "삭제된 가게"}</div>
                        <div style={{ width: '331px' }}>{item.resTime}</div>
                        <div style={{ width: '158px' }}>{item.isToday === "Y" ? "예약 대기중" : (item.qrConfirm? "예약확인" : "노쇼")}</div>
                    </div>
                )) : <div className={styles.reservationListBody}>해당 결과가 존재하지 않습니다.</div>}
            </div>
            <div className={styles.pageNation}>
                {visiblePageNum().map((pageNum) => (
                    <button key={pageNum} onClick={() => paginate(pageNum)} className={pageNum === currentPage ? styles.active : ''}>
                        {pageNum}
                    </button>
                ))}
            </div>
            <button className={styles.pageNationBackBtn} onClick={() => paginate(currentPage - 1)} hidden={currentPage === 1}>◀</button>
            <button className={styles.pageNationForwordBtn} onClick={() => paginate(currentPage + 1)} hidden={currentPage === totalPages}>▶</button>
        </>
    );
}

export default ReservationList;
