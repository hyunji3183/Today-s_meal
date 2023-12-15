"use client"
import Footer from '@/app/com/Footer'
import upload from './upload.module.scss'
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

export default function page() {
  let isTr, isMb, res;
  const [DBdata, setDBdata] = useState();
  const [haveTr, setHaveTr] = useState(false);

  useEffect(() => {
    //세션값으로 로그인 db정보 찾아 가져오기
    isTr = sessionStorage.getItem('tr_id');
    isMb = sessionStorage.getItem('mb_id');

    const loginCheck = async function () {
      if (isTr != null) {//트레이너
        res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
        setDBdata(res.data);
        setHaveTr(true);
      }
      if (isMb != null) {//일반회원
        res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
        setDBdata(res.data);
      }
    }
    loginCheck();
  }, [])

  //식단선택
  const times = useRef();
  useEffect(() => {
    const timeLi = times.current.childNodes;
    let num = 0;
    timeLi.forEach(function (v, k) {
      v.onclick = function () {
        timeLi[num].classList.remove(upload.actives);
        v.classList.toggle(upload.actives);
        num = k;
        //선택후 inputData에 아침점심저녁 저장
        const value = event.target.innerText;
        setInputData((prevData) => ({
          ...prevData,
          time: value,
        }));
      }
    })
  }, []);

  //이미지 미리보기
  const [imgToggle, setImgToggle] = useState(false);
  const [imageView, setImageView] = useState();

  const fileChange = function (e) {
    const file = e.target.files[0];
    file && setImageView(URL.createObjectURL(file));
    setImgToggle(true);
  };
  //입력값 받기
  const [inputData, setInputData] = useState({
    time: '아침',
    text: '',
    check: 'off'
  });
  const getInput = function (e) {
    const { name, value } = e.target
    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }
  //이미지 용량 줄이는 함수1
  const resizeImg = (imageDataURL, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageDataURL;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);

        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };
  //이미지 용량 줄이는 함수2
  const zipImg = (imageDataURL, quality) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = imageDataURL;
    });
  };
  //이미지 업로드
  const uploadFile = function (e) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const objF = Object.fromEntries(formdata);
    const fr = new FileReader();
    fr.readAsDataURL(objF.upload);

    if (haveTr) {
      fr.addEventListener('load', async function () {
        const smallerImg = await resizeImg(fr.result, 800, 600);
        const moreSmallImg = await zipImg(smallerImg, 0.5)
        const sendPost = {
          post_user: DBdata?._id,
          post_title: DBdata?.tr_name,
          post_userImg : DBdata?.tr_img,
          post_when: inputData.time,
          post_text: inputData.text,
          post_open: inputData.check,
          post_date: Date.now(),
          post_img: moreSmallImg,
          post_trainer: DBdata?.tr_code,
          post_trLike: '',
          post_judge: '',
          post_boolean: true
        }
        axios
          .post("/api/write?type=list&mode=insert", sendPost)
          .then(res => { console.log(res.data); })
      })
    }
    else {
      //DB에 보내주기
      fr.addEventListener('load', async function () {
        const smallerImg = await resizeImg(fr.result, 800, 600);
        const moreSmallImg = await zipImg(smallerImg, 0.5)
        const sendPost = {
          post_user: DBdata?._id,
          post_title: DBdata?.mb_name,
          post_userImg : DBdata?.mb_img,
          post_when: inputData.time,
          post_text: inputData.text,
          post_open: inputData.check,
          post_date: Date.now(),
          post_img: moreSmallImg,
          post_trainer: DBdata?.mb_code,
          post_trLike: '',
          post_judge: '',
          post_boolean: false
        }
        axios
          .post("/api/write?type=list&mode=insert", sendPost)
          .then(res => { console.log(res.data); })
      })
    }

    setTimeout(function () {
      window.location.href = '/pages/list/mainList';
    }, 1000);
  }

  return (
    <div className={upload.upload_wrap}>
      <header>
        <figure><img src="/character.png" alt="캐릭터 이미지" /></figure>
        <p>오늘의 식단</p>
      </header>

      <form onSubmit={uploadFile}>
        <div className={upload.con}>
          <div className={upload.con_img}>
            <label htmlFor='file' >
              {imgToggle ? '' : '이미지 등록'}
              <input type='file' name='upload' id='file'
                onChange={(e) => { fileChange(e); }}
              />
              {imgToggle ? <img src={imageView} alt='식단 이미지' /> : ''}
            </label>
          </div>
          <div className={upload.con_txt}>
            <textarea onChange={getInput} name="text" placeholder='내용을 입력해 주세요.'></textarea>
          </div>
          <div className={upload.con_choice}>
            <p>식단선택</p>
            <ul ref={times}>
              <li className={upload.actives} name="time">아침</li>
              <li name="time">점심</li>
              <li name="time">저녁</li>
            </ul>
          </div>
          <div className={upload.con_share}>
            <p>식단을 공유 하시겠습니까?</p>
            <label htmlFor='check' onChange={getInput}>
              <input type='checkbox' name='check' id='check' />
              <span></span>
              <p>식단공유</p>
            </label>
          </div>
        </div>
        <div className={upload.btn}>
          <input type='submit' value='식단 등록' />
        </div>
      </form>
      <Footer />
    </div>
  )
}
