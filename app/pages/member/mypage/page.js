"use client"
import Footer from '@/app/com/Footer';
import mypage from './mypage.module.scss'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '@/app/com/loading';

export default function page() {
  let isTr, isMb, res;
  const [DBdata, setDBdata] = useState();
  const [mealDBdata, setMealDBdata] = useState();
  const [haveTr, setHaveTr] = useState(false);
  const [familyData, setFamilyData] = useState();
  const [mylistData, setMylistData] = useState();


  useEffect(() => {
    //세션값으로 로그인 db정보 찾아 가져오기
    isTr = sessionStorage.getItem('tr_id');
    isMb = sessionStorage.getItem('mb_id');

    const loginCheck = async function () {
      if (isTr != null) {//트레이너
        res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
        setDBdata(res.data);
        setHaveTr(true);

        let trMeal_id = res.data._id;
        const resMeal = await axios.post("/api/member?type=tr&mode=getMeal", { trMeal_id });
        setMealDBdata(resMeal.data);
      }
      if (isMb != null) {//일반회원
        res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
        setDBdata(res.data);

        let mbMeal_id = res.data._id;
        const resMeal = await axios.post("/api/member?type=mb&mode=getMeal", { mbMeal_id });
        setMealDBdata(resMeal.data);
      }
    }
    loginCheck();
  }, [])

  const nav = useRouter();
  const names = useRef();
  const members = useRef();
  const defaultPage = useRef();


  //이름 클릭시 이름변경창 팝업
  const nameClick = () => {
    names.current.style = `display:flex`
  }
  //이름변경
  const changeName = async function (e) {
    const formdata = new FormData(e.target);
    const value = Object.fromEntries(formdata);
    const nameInput = document.querySelector('[name="nameInput"]').value;
    //미입력방지
    if (!nameInput) {
      alert('변경할 이름을 입력하세요.');
      return;
    }
    if (haveTr) {
      const newName = { id: DBdata?.tr_id, name: value.nameInput }
      const resT = await axios.post("/api/member?type=tr&mode=nameUpdate", newName)
      // console.log(resT.data);
    }
    else {
      const newName = { id: DBdata?.mb_id, name: value.nameInput }
      const resM = await axios.post("/api/member?type=mb&mode=nameUpdate", newName)
      // console.log(resM.data);
    }
  }

  //트레이너가 회원 클릭시 회원관리창 팝업
  const openMyMember = function () {
    getFamily();
    members.current.style = `display:block`
    defaultPage.current.style = `display:none`
  }
  const closeMyMember = function () {
    members.current.style = `display:none`
    defaultPage.current.style = `display:block`
  }
  //트레이너의 관리회원목록 불러오기
  const getFamily = async function () {
    const myFamilys = { mem: DBdata?.tr_family }
    const resFamily = await axios.post("/api/member?type=tr&mode=family", myFamilys);
    setFamilyData(resFamily.data);
  }
  //관리 회원 삭제
  const deleteMember = async function (id) {
    //삭제하고 db에 반영
    const removeData = { tr_id: DBdata?.tr_id, removeId: id }
    const resRemove = await axios.post("/api/member?type=tr&mode=remove", removeData);
    //삭제한 멤버가 빠진 배열을 받음
    //그 배열을 통해 다시 멤버정보를 불러옴
    const myFamilys = { mem: resRemove.data.tr_family }
    const resFamily = await axios.post("/api/member?type=tr&mode=family", myFamilys);
    setFamilyData(resFamily.data);
  }

  //n일째 식단 관리중! 밀리초를 일로
  function msToDay(milliseconds) {
    const dateToday = Date.now();
    const minusMs = dateToday - milliseconds;
    const afterFloor = Math.floor(minusMs / (1000 * 60 * 60 * 24))
    return afterFloor;
  }
  //이미지 base64 코드를 blob으로 짧게 줄이기
  // const base64Blob = function (b64Data, contentType = '') {
  //   const image_data = atob(b64Data.split(',')[1]);

  //   const arraybuffer = new ArrayBuffer(image_data.length);
  //   const view = new Uint8Array(arraybuffer);

  //   for (let i = 0; i < image_data.length; i++) {
  //     view[i] = image_data.charCodeAt(i) & 0xff;
  //   }

  //   const blob = new Blob([arraybuffer], { type: contentType });
  //   return URL.createObjectURL(blob);
  // }
  //이미지 첨부
  const [imageView, setImageView] = useState();
  const inputRef = useRef();

  //input숨기고 이미지클릭으로 대체
  const addImg = function () { inputRef.current.click(); }

  const fileChange = function (e) {
    const file = e.target.files[0];
    file && setImageView(URL.createObjectURL(file));
  };
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

  const uploadFile = function (e) {
    e.preventDefault();
    const fr = new FileReader();
    fr.readAsDataURL(e.target.files[0]);

    //DB에 보내주기
    fr.addEventListener('load', async function () {
      //이미지 축소하기
      const smallerImg = await resizeImg(fr.result, 800, 600);
      const moreSmallImg = await zipImg(smallerImg, 0.5)
      if (haveTr) {
        const imgUrl = { id: DBdata?.tr_id, img: moreSmallImg }
        const resT = await axios.post("/api/member?type=tr&mode=imgUpdate", imgUrl)
        // console.log(resT.data);
      }
      else {
        const imgUrl = { id: DBdata?.mb_id, img: moreSmallImg }
        const resM = await axios.post("/api/member?type=mb&mode=imgUpdate", imgUrl)
        // console.log(resM.data);
      }
    })
    //반영되게 n초후 새로고침
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }
  if (!DBdata) { return <Loading /> }
  return (
    <div className={mypage.mypage_wrap}>
      <div className={mypage.mypage} ref={defaultPage}>
        <header>
          <figure><img src="/character.png" alt="캐릭터 이미지" /></figure>
          <p>오늘의 식단</p>
        </header>

        <div className={mypage.con}>
          <div className={mypage.con_left}>
            <figure><img src=
              {
                haveTr ?
                  DBdata?.tr_img : DBdata?.mb_img
              }
              alt='프로필 이미지' /></figure>
            <figure>
              <img src='/add.png' alt='이미지 변경' onClick={addImg} style={{ cursor: 'pointer' }} />
              <form
                onSubmit={uploadFile}
                method='post'
                encType='multipart/form-data'
                style={{ display: 'none' }}
              >
                <input type='file' name='upload' ref={inputRef}
                  onChange={(e) => {
                    fileChange(e);
                    uploadFile(e);
                  }}
                />
                <img src={imageView} />
              </form>
            </figure>
          </div>
          <div className={mypage.bg} ref={names}>
            <form onSubmit={changeName}>
              <div className={mypage.bg_top}>
                <p>이름</p>
                <input type='text' name='nameInput' maxLength='8'/>
                <span>최대 8글자</span>
              </div>
              <input type='submit' value={'저장'||''} className={mypage.bg_bot} />
            </form>
          </div>
          <div className={mypage.con_right}>
            <p><span>
              {
                haveTr ?
                  msToDay(DBdata?.tr_date) : msToDay(DBdata?.mb_date)
              }
            </span> 일째 식단관리 중</p>
            <div className={mypage.con_right_li}>
              <ul>
                <li>
                  <p>
                    {
                      haveTr ? '총 식단' : '식단'
                    }
                  </p>
                  <span>
                    {
                      haveTr ?
                        mealDBdata?.trMeal_list.length : mealDBdata?.mbMeal_list.length
                    }
                  </span>
                </li>
                <li>
                  <p>
                    {
                      haveTr ? '미평가' : '좋아요'
                    }
                  </p>
                  <span>
                    {
                      haveTr ? mealDBdata?.trMeal_needJudge.length : mealDBdata?.mbMeal_like.length
                    }
                  </span>
                </li>
                {
                  haveTr ?
                    <li onClick={openMyMember} style={{ cursor: 'pointer' }}>
                      <p>회원</p>
                      <span>{DBdata?.tr_family.length}</span>
                    </li>
                    :
                    <li>
                      <p>싫어요</p>
                      <span>{mealDBdata?.mbMeal_hate.length}</span>
                    </li>
                }
              </ul>
            </div>
          </div>
        </div>
        <div className={mypage.con_txt}>
          <ul>
            <li>
              <p>이름</p>
              <div className={mypage.con_names}>
                <p>
                  {
                    haveTr ? DBdata?.tr_name : DBdata?.mb_name
                  }
                </p>
                <img src='/reName.png' alt='이름 변경' onClick={nameClick} style={{ cursor: 'pointer' }} />
              </div>
            </li>
            <li>
              <p>아이디</p>
              <p>
                {
                  haveTr ? DBdata?.tr_id : DBdata?.mb_id
                }
              </p>
            </li>
            <li>
              <p>트레이너 코드</p>
              <p>
                {
                  haveTr ? DBdata?.tr_code : DBdata?.mb_code
                }
              </p>
            </li>
          </ul>
        </div>
      </div>

      {haveTr ? //트레이너일 경우에만 나오는 회원 관리
        <div className={mypage.membership_wrap} ref={members}>
          <header>
            <figure onClick={closeMyMember}>
              <img src='/arrow_left.png' alt='뒤로가기' />
            </figure>
            <p>회원관리</p>
          </header>

          <div className={mypage.membership}>
            <ul>
              <li>
                <p>총 식단</p>
                <span>{mealDBdata?.trMeal_list.length}</span>
              </li>
              <li>
                <p>미평가</p>
                <span>{mealDBdata?.trMeal_needJudge.length}</span>
              </li>
              <li>
                <p>회원</p>
                <span>{DBdata?.tr_family.length}</span>
              </li>
            </ul>
          </div>
          <div className={mypage.membership_list}>
            <ul>
              {
                familyData ?
                  familyData.map((family) => (
                    <li key={family._id}>
                      <div className={mypage.membership_list_txt}>
                        {/* <figure><img src={base64Blob(family.mb_img)} alt='회원이미지' /></figure> */}
                        <figure><img src={family.mb_img} alt='회원이미지' /></figure>
                        <p>{family.mb_name} 님</p>
                      </div>
                      <p onClick={() => deleteMember(family.mb_id)}>[삭제]</p>
                    </li>
                  )) : ''
              }
            </ul>
          </div>
        </div>
        : <></>}
      <Footer />
    </div>
  )
}