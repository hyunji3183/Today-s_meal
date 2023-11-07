"use client"
import join from './join.module.scss'

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

export default function page() {
  const nav = useRouter();
  const trainerCon = useRef();
  const memberCon = useRef();
  const [types , setTypes] = useState('m')
  
  const arrowClick = ()=>{
    nav.push('/pages/member/login')
  }
  const mainClick = ()=>{
    nav.push('/pages/list/mainList')
  }

  const trainerClick = ()=>{
    setTypes('t')
  }
  const memberClick = ()=>{
    setTypes('m')
  }
  return (
    <div className={join.join_wrap}>
      <header>
        <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기'/></figure>
        <p>회원가입</p>
      </header>

      <form className={join.joins}>
        <div className={join.trainer}>
          <input type='radio' name='types' value="t" id='check_t' checked={types == 't' ? true : false}/>
          <label for='check_t' onClick={trainerClick}>          
            <div className={join.joins_txt}>
              <p>트레이너로 가입</p>
              <span>회원님들의 식단을 공유 받고 싶어요</span>
            </div>
          </label>
        </div>
        <div className={join.member}>
          <input type='radio' name='types' value='m' id='check_m' checked={types == 't' ? false : true}/>
          <label for='check_m' onClick={memberClick}>
            <div className={join.joins_txt}>
              <p>회원으로 가입</p>
              <span>트레이너님의 식단 평가를 원해요</span>
            </div>
          </label>
        </div>
        {
          types == 't' ?
            <div className={join.trainer_wrap} ref={trainerCon}>
              <label>
                이름
                <input type="text" placeholder='이름을 입력해 주세요.' maxlength='8'/>
              </label>
              <label>
                아이디
                <div>
                  <input type="text" placeholder='아이디를 입력해 주세요.'/>
                  <p>중복확인</p>
                </div>
              </label>
              <label>
                비밀번호
                <input type="text" placeholder='영어 대소문자, 숫자 조합의 8-15자'/>
              </label>
              <label>
                비밀번호 재확인
                <input type="text" placeholder='비밀번호를 입력해 주세요.'/>
              </label>
              <label>
                트레이너 코드
                <input type="text" placeholder='정확한 코드를 입력해 주세요.'/>
              </label>
            </div>
          :
            <div className={join.member_wrap} ref={memberCon}>
              <label>
                이름
                <input type="text" placeholder='이름을 입력해 주세요.' maxlength='8'/>
              </label>
              <label>
                아이디
                <div>
                  <input type="text" placeholder='아이디를 입력해 주세요.'/>
                  <p>중복확인</p>
                </div>
              </label>
              <label>
                비밀번호
                <input type="text" placeholder='영어 대소문자, 숫자 조합의 8-15자'/>
              </label>
              <label>
                비밀번호 재확인
                <input type="text" placeholder='비밀번호를 입력해 주세요.'/>
              </label>
            </div>
        }
      </form>

      <footer onClick={mainClick}>가입하기</footer>
    </div>
  )
}
