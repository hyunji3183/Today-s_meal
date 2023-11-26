"use client"
import axios from 'axios';
import join from './join.module.scss'

import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'

export default function page() {

  const nav = useRouter();
  const trainerCon = useRef();
  const memberCon = useRef();
  const [types , setTypes] = useState('m')
  
  const arrowClick = ()=>{
    nav.push('/pages/member/login')
  }
  const trainerClick = ()=>{
    setTypes('t');
  }
  const memberClick = ()=>{
    setTypes('m');
  }

  //입력값 받기
  const [formData, setFormData] = useState({
    name: '',
    userid: '',
    userpw: '',
    checkpw: '',
    trCode: ''
  });
  const getInput = function(e){
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  //트레이너 코드 생성
  function makeTrCode(){
    const char ='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let randomCode = '';

    for(let i=0; i<6; i++){
      const randomMix = Math.floor(Math.random()*char.length);
      randomCode += char.charAt(randomMix);
    }
    return randomCode;
  }

  //받은 값 db에 맞춰 가공
  let insertData;
  if(types=='m'){
    insertData ={
      mb_name:formData.name,
      mb_id:formData.userid,
      mb_pw:formData.userpw,
      mb_code:formData.trCode,
      mb_img:'/character2.png',
      mb_date:Date.now(),
      mb_myMeal:[],
      mb_like:[],
      mb_hate:[]
    }
  }else if(types=='t'){
    insertData ={
      tr_name:formData.name,
      tr_id:formData.userid,
      tr_pw:formData.userpw,
      tr_code:makeTrCode(),
      tr_img:'/character2.png',
      tr_date:Date.now(),
      tr_totalMeal:[],
      tr_family:[],
      tr_needJudge:[]
    }
  }
  //아이디 중복 확인
  const [isIdOk,setIsIdOk]=useState(false);
  const idCheck = async (e)=>{
    e.preventDefault();
    const send = {id:formData.userid}
    let res;
    if(types=='t'){
      res = await axios.post("/api/member?type=tr&mode=idCheck",send)
      console.log(res);
    }else{
      res = await axios.post("/api/member?type=mb&mode=idCheck",send)
      console.log(res.data);
    }

    if(res.data==false){
      alert('이미 사용 중인 아이디입니다');
      setIsIdOk(false); return;
    }else{
      // alert('사용 가능한 아이디입니다'); 
      setIsIdOk(true); return;
    }
  }
  const [isPwOk,setIsPwOk]=useState(false);
  const [isTrCodeOk,setIsTrCodeOk]=useState(false);
  //가입하기 클릭시 유효성 검사 후 DB로 보냄
  const dataSubmit = async (e)=>{
    e.preventDefault();
    // console.log(insertData);

    //아이디 체크
    let regId = /^[A-Za-z0-9]+$/;
    if(!regId.test(formData.userid)){
      alert('아이디는 영문 또는 숫자로 입력해 주세요');
      return
    }
    if(isIdOk==false){
      alert('아이디 중복 확인을 해주세요')
      return;
    }
    //비밀번호 체크
    let regPw = /^(?=.*[A-Za-z])(?=.*\d).{8,15}$/;
    if( !regPw.test(formData.userpw) ){
      alert('영문+숫자 포함 8-15자로 입력해 주세요');
      return
    }
    //비밀번호 재확인
    
    if(formData.userpw != formData.checkpw){
      // alert('비밀번호가 일치하지 않습니다');
      setIsPwOk(true)
      return
    }
    //미입력방지
    if( !formData.name || !formData.userid || !formData.userpw || !formData.checkpw ){
      alert('모든 정보를 입력해 주세요')
      return;
    }

    //트레이너 코드 확인
    const codeSend = {code:formData.trCode, mb_id:formData.userid}
    let res, codeRes;
    
    if(types=='m'){//일반회원일 경우만 진행
      if(!formData.trCode){//미입력방지
        alert('모든 정보를 입력해 주세요'); return;
      }
      res = await axios.post("/api/member?type=mb&mode=codeCheck",codeSend)
      // console.log(res.data);
      codeRes = res.data;

      if(codeRes==false){
        // alert('존재하지 않는 트레이너 코드입니다.');
        setIsTrCodeOk(true)
        return;
      }
    }

    //트레이너/일반회원 DB구분해 전송
    if(types=='t'){
      axios
      .post("/api/member?type=tr&mode=insert",insertData)
      .then(res=>{console.log(res.data);}) 
    }
    if(types=='m'){
      axios
      .post("/api/member?type=mb&mode=insert",insertData)
      .then(res=>{ console.log(res.data);}) 
    }
    
    alert('가입을 축하합니다!');
    arrowClick();
  }

  return (
    <div className={join.join_wrap}>
      <header>
        <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기'/></figure>
        <p>회원가입</p>
      </header>

      <form className={join.joins}>
        <div className={join.trainer}>
          <input type='radio' name='types' value="t" id='check_t' checked={types == 't' ? true : false}/>
          <label for='check_t' onClick={trainerClick}>          
            <div className={join.joins_txt}>
              <p>트레이너로 가입</p>
              <span>회원님들의 식단을 공유 받고 싶어요</span>
            </div>
          </label>
        </div>
        <div className={join.member}>
          <input type='radio' name='types' value='m' id='check_m' checked={types == 't' ? false : true}/>
          <label for='check_m' onClick={memberClick}>
            <div className={join.joins_txt}>
              <p>회원으로 가입</p>
              <span>트레이너님의 식단 평가를 원해요</span>
            </div>
          </label>
        </div>
        {
          types == 't' ?
            <div className={join.trainer_wrap} ref={trainerCon}>
              <label>
                이름
                <input 
                  type="text" maxlength='8'
                  placeholder='이름을 입력해 주세요.' 
                  onChange={getInput} name="name"
                />
              </label>
              <label>
                아이디
                {
                  isIdOk==true?
                  <span>사용 가능한 아이디입니다.</span>
                  :
                  <span></span>
                }
                <div>
                  <input 
                    type="text" placeholder='아이디를 입력해 주세요.'
                    onChange={getInput} name="userid"
                  />
                  <p onClick={idCheck}>중복확인</p>
                </div>
              </label>
              <label>
                비밀번호
                <input 
                  type="text" placeholder='영어 대소문자, 숫자 조합의 8-15자'
                  onChange={getInput} name="userpw"
                />
              </label>
              <label>
                비밀번호 재확인
                {
                  isPwOk==true?
                  <span>비밀번호가 일치하지 않습니다.</span>
                  :
                  <span></span>
                }
                <input 
                  type="text" placeholder='비밀번호를 입력해 주세요.'
                  onChange={getInput} name="checkpw"
                />
              </label>
            </div>
          :
            <div className={join.member_wrap} ref={memberCon}>
              <label>
                이름
                <input 
                  type="text" maxlength='8'
                  placeholder='이름을 입력해 주세요.' 
                  onChange={getInput} name="name"
                />
              </label>
              <label>
                아이디
                {
                  isIdOk==true?
                  <span>사용 가능한 아이디입니다.</span>
                  :
                  <span></span>
                }
                <div>
                  <input 
                    type="text" placeholder='아이디를 입력해 주세요.'
                    onChange={getInput} name="userid"
                  />
                  <p onClick={idCheck}>중복확인</p>
                </div>
              </label>
              <label>
                비밀번호
                <input 
                  type="text" placeholder='영어 대소문자, 숫자 조합의 8-15자'
                  onChange={getInput} name="userpw"
                />
              </label>
              <label>
                비밀번호 재확인
                {
                  isPwOk==true?
                  <span>비밀번호가 일치하지 않습니다.</span>
                  :
                  <span></span>
                }
                <input 
                  type="text" placeholder='비밀번호를 입력해 주세요.'
                  onChange={getInput} name="checkpw"
                />
              </label>
              <label>
                트레이너 코드
                {
                  isTrCodeOk==true?
                  <span>잘못된 코드입니다.</span>
                  :
                  <span></span>
                }
                <input 
                  type="text" placeholder='정확한 코드를 입력해 주세요.'
                  onChange={getInput} name="trCode"
                />
              </label>
            </div>
        }
        <input 
          type="submit" value="가입하기" 
          className={join.join_submit}
          onClick={dataSubmit}
        />
      </form>
    </div>
  )
}
