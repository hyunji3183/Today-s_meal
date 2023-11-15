"use client"
import React from 'react'
import '../global.scss'
import { useRouter } from 'next/navigation';

export default function Footer() {
  const nav = useRouter();
  const homeClick = ()=>{
    nav.push('/pages/List/mainList')
  }
  const registrationClick = ()=>{
    nav.push('/pages/Write/upload')
  }
  const mypageClick = ()=>{
    nav.push('/pages/Member/mypage')
  }
  return (
    <footer>
      <ul>
        <li onClick={homeClick}>
          <figure><img src='/home.png' alt='홈'/></figure>
          <p>홈</p>
        </li>
        <li>
          <figure><img src='/diet.png' alt='식단'/></figure>
          <p>식단</p>
        </li>
        <li onClick={registrationClick}>
          <figure><img src='/meal_registration.png' alt='식단등록'/></figure>
          <p>식단등록</p>
        </li>
        <li onClick={mypageClick}>
          <figure><img src='/mypage.png' alt='마이페이지'/></figure>
          <p>마이페이지</p>
        </li>
      </ul>
    </footer>
  )
}
