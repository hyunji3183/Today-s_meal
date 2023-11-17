"use client"
import React from 'react'
import '../global.scss'
import { useRouter } from 'next/navigation';

export default function Footer() {
  const nav = useRouter();
  const homeClick = ()=>{
    nav.push('/pages/list/mainList')
  }
  const listClick = ()=>{
    nav.push('/pages/list/mealList')
  }
  const registrationClick = ()=>{
    nav.push('/pages/write/upload')
  }
  const mypageClick = ()=>{
    nav.push('/pages/member/mypage')
  }
  return (
    <footer>
      <ul>
        <li onClick={homeClick} style={{cursor:'pointer'}}>
          <figure><img src='/home.png' alt='홈'/></figure>
          <p>홈</p>
        </li>
        <li onClick={listClick} style={{cursor:'pointer'}}>
          <figure><img src='/diet.png' alt='식단'/></figure>
          <p>식단</p>
        </li>
        <li onClick={registrationClick} style={{cursor:'pointer'}}>
          <figure><img src='/meal_registration.png' alt='식단등록'/></figure>
          <p>식단등록</p>
        </li>
        <li onClick={mypageClick} style={{cursor:'pointer'}}>
          <figure><img src='/mypage.png' alt='마이페이지'/></figure>
          <p>마이페이지</p>
        </li>
      </ul>
    </footer>
  )
}
