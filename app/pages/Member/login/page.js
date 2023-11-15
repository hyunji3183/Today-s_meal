"use client"
import login from './login.module.scss'
import { useRouter } from 'next/navigation';

export default function page() {
  const nav = useRouter();
  const joinClick = ()=>{
    nav.push('/pages/Member/join')
  }
  return (
    <div className={login.login_wrap}>
      <figure><img src='/character.png' alt='캐릭터 이미지'/></figure>
      <h2>오늘의 식단</h2>
      <form>
        <input type="text" placeholder='아이디 입력'/>
        <input type="text" placeholder='비밀번호 입력'/>
        <input type="submit" value="로그인"/>
      </form>
      <div className={login.login_txt}>
        <p>회원이 아니신가요?</p>
        <span onClick={joinClick}>회원가입</span>
      </div>
    </div>
  )
}
