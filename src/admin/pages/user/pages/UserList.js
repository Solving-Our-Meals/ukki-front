import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "../css/UserList.module.css"
import "../css/reset.css"
import { UserListAPI } from "../api/UserListAPI"
import { TotalUserAPI } from "../api/TotalUserAPI"
import LodingPage from "../../../components/LoadingPage";

function UserList(){

    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [totalUser, setTotalUser] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTotalUser = useCallback(async () => {
        const data = await TotalUserAPI();
        console.log(data)
        const totalUserCount = Object.values(data)[0];
        setTotalUser(totalUserCount);
    }, [])

    const fetchList = useCallback(async (category, word) => {
            console.log(category+"fetchlist")
            console.log(word)
                try{
                 const userList = await UserListAPI(category, word);
                 if (
                    (userList && userList.length > 0)
                    ){
                    setSearchSuccess(true)
                    setList(userList)
                    setCurrentPage(1);
                 }else{
                    setSearchSuccess(false)
                 }
                }catch(error){
                    console.log("오류발생", error)
                }
            }, [])

    useEffect(()=>{
        fetchList(searchParams.get("category"), searchParams.get("word"));
        fetchTotalUser();
        setIsLoading(false);
    },[searchParams, fetchList])

    
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


        const paginate = useCallback( (no) => {
            console.log(no)
            if(0<no && no<=totalPages){setCurrentPage(no)}
        },[totalPages]);
    
        function categoryChangeHandler(e){
            console.log(e.target.value)
            setSearchCategory(e.target.value)
        }

        function searchChangeHandler(e){
            console.log(e.target.value)
            setSearchWord(e.target.value)
        }

        function searchClickHandler(){
            const url = `?category=${searchCategory}&word=${searchWord}`;
            navigate(url);
        }

        function handlerUserInfo(no){
            const url = `/admin/users/info/${no}`;
            console.log(url)
            navigate(url)
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter') {
                searchClickHandler();
            }
        }

    if (isLoading) {
        return <LodingPage />;
    }

    return(
    <>
        <div className={styles.userListText}>회원리스트</div>
        <div className={styles.totalUserCount}>총 {totalUser}명의 회원이 가입되어 있습니다.</div>
        <select className={styles.userListSelection} onChange={categoryChangeHandler}>
            <option className={styles.userListOption} value="none" selected>검색 기준</option>
            <option className={styles.userListOption} value="USER_ID">아이디</option>
            <option className={styles.userListOption} value="USER_NAME">닉네임</option>
            <option className={styles.userListOption} value="EMAIL">이메일</option>
        </select>   
        <input 
            type="text" 
            className={styles.userListSearchInput} 
            value={searchWord} 
            onChange={searchChangeHandler}
            onKeyPress={handleKeyPress}
        ></input>
        <button type="button" onClick={searchClickHandler} className={styles.userListSearchBtn}/>
        <table className={styles.userList}>
            <thead className={styles.userListHeader}>
                <tr>
                    <th style={{width: '400px'}}>아이디</th>
                    <th style={{width: '400px'}}>닉네임</th>
                    <th style={{width: '508px'}}>이메일</th>
                    <th style={{width: '181px'}}>노쇼 횟수</th>
                </tr>
            </thead>
        </table>
        <div id={styles.userListBodyPosition}>
            {searchSuccess? currentItem.map((item, index)=>{ 
                return <div className={styles.userListBody}>
                    <div key={index} className={styles[item.userRole] || ''} value={item.userNo} onClick={()=>handlerUserInfo(item.userNo)}>
                        <div style={{width: '400px'}}>{item.userId}</div>
                        <div style={{width: '400px'}}>{item.userName}</div>
                        <div style={{width: '508px'}}>{item.email}</div>
                        <div style={{width: '181px'}}>{item.noShow}</div>
                    </div>
                </div>
            }) : <div className={styles.userListBody}>해당 결과가 존재하지 않습니다.</div>
            }
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
    )   

}

export default UserList;