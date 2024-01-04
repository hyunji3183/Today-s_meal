"use client"
import { useEffect, useState } from 'react';
import evaluationList from './evaluationList.module.scss'
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Loading from '@/app/com/loading';

export default function page() {
    const nav = useRouter();
    const postid = useSearchParams().get('id');
    const [faceEvalData, setFaceEvalData] = useState();

    useEffect(() => {
        getFaceEvaluation();
    }, [])
    // 고유id 사용해서 해당 포스트에 작성된 표정 가져오기
    const getFaceEvaluation = async function () {
        console.log(postid);

        const res = await axios.post("/api/list?type=face&mode=getById", { postid });

        setFaceEvalData(res.data);
    }

    const arrowClick = () => {
        nav.push('/pages/list/mainList')
    }
    const close = () => {
        nav.push('/pages/list/mainList')
    }
    console.log(faceEvalData);

    if (!faceEvalData) { return <Loading /> }
    return (
        <div className={evaluationList.evaluationList_wrap}>
            <header>
                <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기' /></figure>
                <p>평가한 사람 보기</p>
            </header>

            <div className={evaluationList.evaluationList_list}>
                <ul>
                    {   
                        faceEvalData.map((v, k) => (
                            <li key={k}>
                                <figure className={evaluationList.profile}><img src={v.face_userImg} alt='유저 프로필 사진'/></figure>
                                <p>{v.face_userName}님</p>
                                <div className={evaluationList.faces}>
                                    {v.face_which === 0? <figure><img src='/1_1.png' alt='' /></figure> :<figure><img src='/1.png' alt='' /></figure>}
                                    {v.face_which === 1? <figure><img src='/2_1.png' alt='' /></figure> :<figure><img src='/2.png' alt='' /></figure>}
                                    {v.face_which === 2? <figure><img src='/3_1.png' alt='' /></figure> :<figure><img src='/3.png' alt='' /></figure>}
                                </div>
                            </li>
                        ))
                    }

                </ul>
                <button onClick={close}>닫기</button>
            </div>
        </div>
    )
}