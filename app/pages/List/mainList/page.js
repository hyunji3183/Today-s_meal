"use client"
import mainList from './mainList.module.scss'

import React from 'react'

export default function () {
  return (
    <div className={mainList.mainList_wrap}>
      <header>
        <figure><img src="/character.png" alt="캐릭터 이미지"/></figure>
        <p>오늘의 식단</p>
      </header>

      <div className={mainList.con}>
        <ul>
          <li>
            <div className={mainList.con_top}>
              <div className={mainList.con_top_txt1}>
                <figure><img src='/member_img.png' alt='회원 이미지'/></figure>
                <div className={mainList.con_top_txt2}>
                  <p><span>정우성</span>님의 식단</p>
                  <span>방금 전</span>
                </div>
              </div>
              <figure><img src='/dot.png' alt='글 삭제, 수정 버튼 '/></figure>
            </div>
          </li>
        </ul>
      </div>

      <footer>
        <ul>
          <li>
            <figure><img src='/home.png' alt='홈'/></figure>
            <p>홈</p>
          </li>
          <li>
            <figure><img src='/home.png' alt='식단'/></figure>
            <p>식단</p>
          </li>
          <li>
            <figure><img src='/home.png' alt='식단등록'/></figure>
            <p>식단등록</p>
          </li>
          <li>
            <figure><img src='/home.png' alt='마이페이지'/></figure>
            <p>마이페이지</p>
          </li>
        </ul>
      </footer>
    </div>
  )
}
