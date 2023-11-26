"use client"
import login from './login.module.scss'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function page() {

  const nav = useRouter();
  const joinClick = ()=>{
    nav.push('/pages/member/join')
  }

  const [loginId, setLoginId]= useState();
  const [loginPw, setLoginPw]= useState();
  let resTR, resMB;

  const loginClick =async function(e){
    e.preventDefault();
    //로그인데이터 db에 보내 체크
    const loginData = {id:loginId,pw:loginPw}
    resTR = await axios.post("/api/member?type=tr&mode=login",loginData);
    resMB = await axios.post("/api/member?type=mb&mode=login",loginData);

    if(resTR.data ==false && resMB.data == false){
      alert('아이디 또는 비밀번호가 일치하지 않습니다');
      return;
    }
    //세션에 값 저장하고 메인으로 이동시키기
    if(resTR.data == true){
      sessionStorage.setItem("tr_id",loginId);
      nav.push('/pages/list/mainList');
    }
    if(resMB.data == true){
      sessionStorage.setItem("mb_id",loginId);
      nav.push('/pages/list/mainList');
    }
    

  }
  return (
    <div className={login.login_wrap}>
      <figure><img src='/character.png' alt='캐릭터 이미지'/></figure>
      <h2>오늘의 식단</h2>
      <form>
        <input type="text" value={loginId} placeholder='아이디 입력' onChange={(e)=>setLoginId(e.target.value)}/>
        <input type="password" value={loginPw} placeholder='비밀번호 입력'onChange={(e)=>setLoginPw(e.target.value)}/>
        <input type="submit" onClick={loginClick} value="로그인"/>
      </form>
      <div className={login.login_txt}>
        <p>회원이 아니신가요?</p>
        <span onClick={joinClick}>회원가입</span>
      </div>
    </div>
  )
}
