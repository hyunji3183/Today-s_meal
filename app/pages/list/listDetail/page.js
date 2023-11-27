"use client"
import listDetail from './listDetail.module.scss'
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';


export default function page() {
  const nav = useRouter();
  const write = useRef();
  const arrowClick = ()=>{
    nav.push('/pages/list/mainList')
  }
  const dotClick = ()=>{
    write.current.style = `transform:translateY(0px)`
  }
  const closeClick = ()=>{
    write.current.style = `transform: translateY(230px)`
  }
  const evaluate = ()=>{
    nav.push('/pages/list/trainerEvaluation')
  }
  return (
    <div className={listDetail.listDetail_wrap}>
      <header>
        <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기'/></figure>
        <p>게시글 상세</p>
        <figure onClick={dotClick}><img src='/dot.png' alt='글 삭제, 수정 버튼'/></figure>
      </header>

      <div className={listDetail.con}>
        <div className={listDetail.con_top}>
          <figure><img src='/member_img.png' alt='회원 이미지'/></figure>
          <div className={listDetail.con_top_txt}>
            <p><span>정우성</span>님의 식단</p>
            <span>방금 전</span>
          </div>
        </div>
        <div className={listDetail.con_mid}>
          <figure><img src='/food_img.png' alt='식단 이미지'/></figure>
          <p>오늘 저녁식단입니다.<br/> 간단하게 양송이를 넣은 샐러드를 만들어보았어요.</p>
        </div>
        <div className={listDetail.con_bot}>
          <div className={listDetail.con_bot_txt}>
            <p>트레이너 평가</p>
            <p>[좋아요]</p>
          </div>
          <div className={listDetail.con_bot_txt2}>
            <span>트레이너 평가전입니다.</span>
            <span onClick={evaluate}>평가하기</span>
          </div>
        </div>
      </div>

      <div className={listDetail.comment}> 
        <p>댓글 13</p>
        <ul>
          <li>
            <figure><img src='/member_img.png' alt='회원 이미지'/></figure>
            <div className={listDetail.comment_txt1}>
              <p>정우성</p>
              <span>방금 전</span>
              <p>샐러드 레시피 공유해주세요.</p>
              <div className={listDetail.comment_txt2}>
                <span>좋아요</span>
                <span>답글쓰기</span>
              </div>
            </div>
          </li>
          <li>
            <figure><img src='/member_img.png' alt='회원 이미지'/></figure>
            <div className={listDetail.comment_txt1}>
              <p>정우성</p>
              <span>방금 전</span>
              <p>샐러드 레시피 공유해주세요.</p>
              <div className={listDetail.comment_txt2}>
                <span>좋아요</span>
                <span>답글쓰기</span>
              </div>
              <div className={listDetail.comment_one}>
                <figure><img src='/member_img.png' alt='회원 이미지'/></figure>
                <div className={listDetail.comment_txt1}>
                  <p>정우성</p>
                  <span>방금 전</span>
                  <p>샐러드 레시피 공유해주세요.</p>
                  <div className={listDetail.comment_txt2}>
                    <span>좋아요</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className={listDetail.write} ref={write}>
        <div className={listDetail.write_list}>
          <button>글 <span>삭제</span>하기</button>
          <button>글 <span>수정</span>하기</button>
        </div>
        <button onClick={closeClick}>닫기</button>
      </div>

      <form className={listDetail.comment_wrap}>
        <input type='text' placeholder='댓글 남기기'/>
        <input type='submit' value='등록'/>
      </form>

      
    </div>
  )
}
