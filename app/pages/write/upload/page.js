"use client"
import Footer from '@/app/com/Footer'
import upload from './upload.module.scss'

export default function page() {
  return (
    <div className={upload.upload_wrap}>
      <header>
        <figure><img src="/character.png" alt="캐릭터 이미지"/></figure>
        <p>오늘의 식단</p>
      </header>

      <form>
        <div className={upload.con}>
          <div className={upload.con_img}>
            <label for='file'>이미지 등록</label>
            <input type="file" name="file" id='file'/>
          </div>
          <div className={upload.con_txt}>
            <textarea></textarea>
          </div>
          <div className={upload.con_choice}>
            <p>식단선택</p>
            <ul>
              <li className={upload.actives}>아침</li>
              <li>점심</li>
              <li>저녁</li>
            </ul>
          </div>
          <div className={upload.con_share}>
            <p>식단을 공유 하시겠습니까?</p>
            <label>
              <input type='checkbox'/>식단공유
            </label>
          </div>
        </div>
        <div className={upload.btn}>
          <input type='submit' value='식단 등록'/>
        </div>
      </form>

      <Footer/>
    </div>
  )
}
