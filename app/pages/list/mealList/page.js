"use client"
import Footer from '@/app/com/Footer'
import mealList from './mealList.module.scss'

export default function page() {
  return (
    <div className={mealList.mealList_wrap}>
      <header>
        <figure><img src="/character.png" alt="캐릭터 이미지"/></figure>
        <p>오늘의 식단</p>
      </header>


      <Footer/>
    </div>
  )
}
