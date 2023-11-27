"use client"
import React, { useEffect } from 'react'
import footer from './footer.module.scss'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const nav = useRouter();
  // const homeClick = ()=>{
  //   nav.push('/pages/list/mainList')
  // }
  // const dietClick = ()=>{
  //   nav.push('/pages/list/mealList')
  // }
  // const registrationClick = ()=>{
  //   nav.push('/pages/write/upload')
  // }
  // const mypageClick = ()=>{
  //   nav.push('/pages/member/mypage')
  // }
  const footerUl = useRef();
  useEffect(()=>{
    const footerLi = footerUl.current.childNodes;
    let num = 0;
    footerLi.forEach((v,k)=>{
      footerLi[0].childNodes[0].style = `background:url("/home_.png"); width: 25px; height: 25px; background-size: 100%; background-repeat: no-repeat;`
      v.onclick = function(){
        // v.classList.add(footer.actives)
        if(num <= 3){
          const footerFig = footerLi[num].childNodes[0];
          num++
          // footerFig.forEach((v2,k2)=>{
          //   v2.onclick = function(){
          //     v2.style = `display:none`
          //   }
          // })
        }
        
        
      }
    })
  },[])
  return (
    <footer className={footer.footer_wrap}>
      <ul ref={footerUl}>
        <li className={footer.actives}>
          <figure></figure>
          <p>홈</p>
        </li>
        <li>
          <figure></figure>
          <p>식단</p>
        </li>
        <li>
          <figure></figure>
          <p>식단등록</p>
        </li>
        <li>
          <figure></figure>
          <p>마이페이지</p>
        </li>
      </ul>
    </footer>
  )
}
