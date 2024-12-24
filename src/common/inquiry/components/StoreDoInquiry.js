import {useEffect, useState, useRef } from 'react'
import '../css/reset.css';
import '../css/doinquiry.css';
import { inquiryCategory } from '../api/inquiryCategoryAPI';
import ResultSmallModal from './ResultSmallModal';

function StoreDoInquiry({setIsLittleInquiryModal, setStoreDoInquiry}){

    

    const [category, setCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState("");
    const [inquiryTitle, setInquiryTitle] = useState("");
    const [inquiryContent, setInquiryContent] = useState("");
    const [inquiryFile, setInquiryFile] = useState(null);
    const [isWrite, setIsWrite] = useState([false, false, false]);
    const [checkContent, setCheckContent] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const fileInputRef = useRef(null);


    function handleTitleChange(e){
      setInquiryTitle(e.target.value);
      setCheckContent(false);
       if(e.target.value==='' || e.target.value===null || e.target.value.length<5){
        isWrite[0] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[0] = true
        setIsWrite([...isWrite]);
       }}
    function handleContentChange(e){
      setInquiryContent(e.target.value);
      setCheckContent(false);
      if(e.target.value==='' || e.target.value===null || e.target.value.length<5){
        isWrite[1] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[1] = true
        setIsWrite([...isWrite]);
       }
      
      }
  
    function handleCategoryChange(e){
      setSelectCategory(e.target.value);
      setCheckContent(false);
      if(e.target.value==='none'){
        isWrite[2] = false
        setIsWrite([...isWrite]);
       }else{
        isWrite[2] = true
        setIsWrite([...isWrite]);
       }}
    
    function handleFileChange(e){setInquiryFile(e.target.files[0]);}

    function handleCancle(){
      setStoreDoInquiry(false);
      setIsLittleInquiryModal(true)
    }

    
    function handleFileButtonClick() {
      fileInputRef.current.click();
  }


    async function fetchCategory(){
         const categories = await inquiryCategory(); if (categories && categories.length > 0)
        { setCategory(categories.slice(4, categories.lastIndex))}; // 4번째 ~ 마지막(7번째)
    }

    function submit(e) {
      e.preventDefault();
      const inquiryDTO = {
        userNo : 3,
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
      fetch(`/inquiries/stores`, {
        method: "POST",
        headers: {},
        body: formData
      }).then(res => {
        if(res.ok) {
          setResultMessage("문의기 성공적으로 제출되었습니다.")
          setShowResultModal(true);
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
    },[])

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
                        setStoreDoInquiry(false)
                        setIsLittleInquiryModal(true)
                    }}/>
            )}
        </>
    )
}

export default StoreDoInquiry;