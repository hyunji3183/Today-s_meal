"use client"
import Footer from '@/app/com/Footer';
import mypage from './mypage.module.scss'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
  const nav = useRouter();
  const names = useRef();

  const nameClick = ()=>{
    names.current.style = `display:flex`
  }
  return (
    <div className={mypage.mypage_wrap}>
      <header>
        <figure><img src="/character.png" alt="캐릭터 이미지"/></figure>
        <p>오늘의 식단</p>
      </header>

      <div className={mypage.con}>
        <div className={mypage.con_left}>
          <figure><img src='/character2.png' alt='프로필 이미지'/></figure>
          <figure><img src='/add.png' alt='이미지 변경'/></figure>
        </div>
        <div className={mypage.bg} ref={names}>
          <form>
            <div className={mypage.bg_top}>
              <p>이름</p>
              <input type='text'/>
              <span>최대 8글자</span>
            </div>
            <input type='submit' value='저장' className={mypage.bg_bot}/>
          </form>
        </div>
        <div className={mypage.con_right}>
          <p><span>103</span> 일째 식단관리 중</p>
          <div className={mypage.con_right_li}>
            <ul>
              <li>
                <p>식단</p>
                <span>13</span>
              </li>
              <li>
                <p>좋아요</p>
                <span>25</span>
              </li>
              <li>
                <p>싫어요</p>
                <span>10</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={mypage.con_txt}>
        <ul>
          <li onClick={nameClick}>
            <p>이름</p>
            <p>정우성</p>
          </li>
          <li>
            <p>아이디</p>
            <p>asdfd1234</p>
          </li>
          <li>
            <p>트레이너 코드</p>
            <p>Qdfdss5</p>
          </li>
        </ul>
      </div>
      <Footer/>
    </div>
  )
}
