"use client"
import React, { useEffect } from 'react'
import footer from './footer.module.scss'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const nav = useRouter();
  const footerUl = useRef();
  useEffect(() => {
    const footerLi = footerUl.current.childNodes;
    const footerClick = (index) => {
      footerLi.forEach((v, k) => {
        v.classList.remove(footer.actives);
        v.childNodes[0].classList.remove(footer.fig1, footer.fig2, footer.fig3, footer.fig4);
      });

      footerLi[index].classList.add(footer.actives);
      const figure = footerLi[index].childNodes[0];

      switch (index) {
        case 0:
          figure.classList.add(footer.fig1);
          break;
        case 1:
          figure.classList.add(footer.fig2);
          break;
        case 2:
          figure.classList.add(footer.fig3);
          break;
        case 3:
          figure.classList.add(footer.fig4);
          break;
        default:
          break;
      }
      localStorage.setItem('activeFooterIndex', String(index));
    };

    footerLi.forEach((v, k) => {
      v.onclick = () => footerClick(k);
    });

    const storedIndex = localStorage.getItem('activeFooterIndex');
    if (storedIndex !== null) {
      footerClick(parseInt(storedIndex, 10));
    }
  }, [footerUl, nav]);

  
  return (
    <footer className={footer.footer_wrap}>
      <ul ref={footerUl}>
        <li className={footer.actives}>
          <Link href="/pages/list/mainList" className={footer.fig1}>
            <figure></figure>
            <p>홈</p>
          </Link>
        </li>
        <li>
          <Link href="/pages/list/mealList">
            <figure></figure>
            <p>식단</p>
          </Link>
        </li>
        <li>
          <Link href="/pages/write/upload">
            <figure></figure>
            <p>식단등록</p>
          </Link>
        </li>
        <li>
          <Link href="/pages/member/mypage">
            <figure></figure>
            <p>마이페이지</p>
          </Link>
        </li>
      </ul>
    </footer>
  )
}
