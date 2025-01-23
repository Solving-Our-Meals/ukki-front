import {useEffect, useState, useRef } from 'react'
import '../css/reset.css';
import '../css/doinquiry.css';
import { inquiryCategory } from '../api/inquiryCategoryAPI';
import ResultSmallModal from './ResultSmallModal';
import { API_BASE_URL } from '../../../config/api.config';
import { getUserNo } from '../api/GetUserNoAPI';


function UserDoInquiry({closeModal}){

    

    const [category, setCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState("");
    const [inquiryTitle, setInquiryTitle] = useState("");
    const [inquiryContent, setInquiryContent] = useState("");
    const [inquiryFile, setInquiryFile] = useState(null);
    const [isWrite, setIsWrite] = useState([false, false, false]);
    const [showResultModal, setShowResultModal] = useState(false);
    const [checkContent, setCheckContent] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [userNo, setUserNo] = useState(0);
    const fileInputRef = useRef(null);


    function handleTitleChange(e){
      setCheckContent(false);
      setInquiryTitle(e.target.value);
       if(e.target.value==='' || e.target.value===null || e.target.value.length<5){
        isWrite[0] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[0] = true
        setIsWrite([...isWrite]);
       }}
    function handleContentChange(e){
      setCheckContent(false);
      setInquiryContent(e.target.value);
      console.log(isWrite)
      if(e.target.value==='' || e.target.value===null || e.target.value.length<5){
        isWrite[1] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[1] = true
        setIsWrite([...isWrite]);
       }
      
      }
  
    function handleCategoryChange(e){
      setCheckContent(false);
      setSelectCategory(e.target.value);
      if(e.target.value==='none'){
        isWrite[2] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[2] = true
        setIsWrite([...isWrite]);
       }}
    
    function handleFileChange(e){setInquiryFile(e.target.files[0]); console.log("file 사옹")}

    async function fetchCategory(){
        const categories = await inquiryCategory(); if (categories && categories.length > 0)
        { setCategory(categories.slice(0, 4))}; // 첫 4개의 카테고리만 설정
    }

    function submit(e) {
      e.preventDefault();
      console.log(userNo);
      const inquiryDTO = {
        userNo : userNo,
        inquiryTitle : inquiryTitle,
        inquiryContent : inquiryContent,
        categoryNo : selectCategory,
      }
      const formData = new FormData();
      const json = JSON.stringify(inquiryDTO)
      const blob = new Blob([json], {type: 'application/json'});
      formData.append("data", blob)
      formData.append("file", inquiryFile)
      
      let isPass = isWrite.every(Boolean);
      if(isPass){
        fetch(`${API_BASE_URL}/inquiries/users`, {
          method: "POST",
          credentials: "include",
          body: formData
        }).then(res => {
          if(res.ok) {
            setResultMessage("문의가 성공적으로 제출되었습니다.")
            setShowResultModal(true)
          }else{
            setResultMessage("문의에 실패했습니다.")
          }
        })
      }else{
        setCheckContent(true);
      }
    }

    useEffect(()=>{
        fetchCategory()
        getUserNo().then(userNo => {
            setUserNo(userNo)
        })
    },[])

    function handleCancle(){
      closeModal()
    }

    function handleFileButtonClick() {
      fileInputRef.current.click();
  }


    return(
        <>
        <div id='doInquiryModal' className={showResultModal? 'underModal':''}>
            <div id='doInquiryText'>문의하기</div>
            <div id='doInquiryTitleText'>문의 제목: </div>
            <form>
                <input id='inputDoTitle' type='text' value={inquiryTitle} onChange={handleTitleChange} className={checkContent && !isWrite[0] ? 'inquiryError' : ''} required/>
                <select id='categorySelection' name='categoryNo' onChange={handleCategoryChange} className={checkContent && !isWrite[2] ? 'inquiryError' : ''} required>
                    <option className='selectionOption' value="none" selected>문의 카테고리</option>
                    {category.map((item)=>(
                        <option className='selectionOption' value={item.categoryNo}>{item.categoryName}</option>
                    ))}
                </select>
                <textarea id='inputDoContent'  value={inquiryContent} onChange={handleContentChange} className={checkContent && !isWrite[1] ? 'inquiryError' : ''} required/>
                <input
                        type="file"
                        id="inquiryFile"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" id="inquiryDoFileBtn" onClick={handleFileButtonClick}>
                        첨부파일
                    </button>
                <button type='button' id='inquiryDoCancleBtn' onClick={handleCancle}>취소</button>
                <button id='doInquiryBtn' onClick={submit}>확인</button>
            </form>
            {checkContent && !isWrite[0] && <div id='checkTitle'>내용을 확인해주세요</div>}
            {checkContent && !isWrite[1] && <div id='checkContent'>내용을 확인해주세요</div>}
            {checkContent && !isWrite[2] && <div id='checkCategory'>내용을 확인해주세요</div>}
        </div>
        {showResultModal && (
                <ResultSmallModal
                    message={resultMessage}
                    close={()=>{
                        setShowResultModal(false)
                        closeModal()
                    }}/>
            )}
        </>
    )
}

export default UserDoInquiry;