"use client"
import trainerEvaluation from './trainerEvaluation.module.scss'
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';


export default function page() {
  const nav = useRouter();
  const trainer_evaluate = useRef();
  const evaluation_ul = useRef(); 
  const arrowClick = ()=>{
    nav.push('/pages/list/listDetail')
  }
  useEffect(()=>{
    const evaluation_li = evaluation_ul.current.childNodes;
    let num = 0;
    evaluation_li.forEach(function(v,k){
      v.onclick = function(){
        evaluation_li[num].classList.remove(trainerEvaluation.blue);
        v.classList.add(trainerEvaluation.blue);
        num = k;
      };
    });
  },[])
  
  return (
    <div className={trainerEvaluation.trainer_evaluate} ref={trainer_evaluate}>
      <header>
        <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기'/></figure>
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
            <input type='text' placeholder='내용을 입력해 주세요.'/>
          </div>
        </div>
        <div className={trainerEvaluation.trainer_evaluate_btn}>
          <input type='submit' value='등록'/>
        </div>
      </form>
    </div>
  )
}