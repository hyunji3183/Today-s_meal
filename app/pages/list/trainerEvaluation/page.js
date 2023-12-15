"use client"
import trainerEvaluation from './trainerEvaluation.module.scss'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


export default function page() {
  const nav = useRouter();
  const trainer_evaluate = useRef();
  const evaluation_ul = useRef();
  const arrowClick = () => {
    nav.back();
  }
  //params값 url에서 받아오기
  const postid = useSearchParams().get('id');

  //좋아요,싫어요 (0이면 좋아요/1이면 싫어요)
  const [likeHate, setLikeHate] = useState(0);
  useEffect(() => {
    const evaluation_li = evaluation_ul.current.childNodes;
    let num = 0;
    evaluation_li.forEach(function (v, k) {
      v.onclick = function () {
        evaluation_li[num].classList.remove(trainerEvaluation.blue);
        v.classList.add(trainerEvaluation.blue);
        num = k;
        setLikeHate(k);
      };
    });
  }, [])

  //한줄평 input입력값 받기 
  const [formData, setFormData] = useState({ name: '' });
  const getInput = function (e) {
    const { name, value } = e.target;
    setFormData(() => ({ [name]: value }));
  }

  //좋싫, 한줄평 취합
  let insertData = {
    post_trLike: likeHate,
    post_judge: formData.judge,
    postid:postid
  }

  //평가 등록하기
  const judgeSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judge) {//미입력방지
      alert('한줄평을 입력해 주세요.')
      return;
    }
    console.log(insertData);
    let res = await axios.post("/api/list?type=list&mode=judge",insertData)
      // console.log(res.data);
  }
  return (
    <div className={trainerEvaluation.trainer_evaluate} ref={trainer_evaluate}>
      <header>
        <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기' /></figure>
        <p>트레이너 평가</p>
      </header>

      <form>
        <div className={trainerEvaluation.trainer_evaluate_con}>
          <div className={trainerEvaluation.evaluation}>
            <p>평가</p>
            <ul ref={evaluation_ul}>
              <li className={trainerEvaluation.blue}>좋아요</li>
              <li>싫어요</li>
            </ul>
          </div>
          <div className={trainerEvaluation.review}>
            <p>한줄평</p>
            <input type='text' placeholder='내용을 입력해 주세요.'
              onChange={getInput} name="judge" maxLength='20'
            />
          </div>
        </div>
        <div className={trainerEvaluation.trainer_evaluate_btn}>
          <input type='submit' value='등록' onClick={judgeSubmit} />
        </div>
      </form>
    </div>
  )
}