"use client"
import axios from 'axios';
import listDetail from './listDetail.module.scss'
import {useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';


export default function page() {
    const nav = useRouter();
    const write = useRef();

    const arrowClick = () => {
        nav.push('/pages/list/mainList')
    }
    const dotClick = () => {
        write.current.style = `transform:translateY(0px)`
    }
    const closeClick = () => {
        write.current.style = `transform: translateY(230px)`
    }


    let res;
    const [DBdata, setDBdata] = useState();
    const [UsName, setUsName] = useState();
    const [TrName, setTrName] = useState();
    const [UsImg, setUsImg] = useState();
    const [TrImg, setTrImg] = useState();
    useEffect(() => {
        //세션값으로 로그인 db정보 찾아 가져오기
        const isTr = sessionStorage.getItem('tr_id');
        const isMb = sessionStorage.getItem('mb_id');

        const loginCheck = async function () {
            if (isTr != null) {//트레이너
                res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
                setDBdata(res.data);
                // setHaveTr(true);
                setTrName(res.data.tr_name)
                setTrImg(res.data.tr_img)
            }
            if (isMb != null) {//일반회원
                res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
                setDBdata(res.data);
                setUsName(res.data.mb_name)
                setUsImg(res.data.mb_img)
                //일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
            }
        }
        loginCheck();
    }, [])

    //트레이너 평가페이지 이동
    const evaluate = () => {
         const isTr = sessionStorage.getItem('tr_id');
        if (isTr != null) {
            //작성자의 트레이너 코드와 일치해야만 평가 작성가능
            if (DBdata?.tr_code == DBdata?.tr_code) {
                nav.push('/pages/list/trainerEvaluation')
            } else { alert('나의 관리회원일 때만 평가할 수 있습니다!') }
        } else { alert('트레이너만 평가가 가능합니다!') }
    }

    const formatTimeAgo = (dateString) => {
        const start = new Date(dateString);
        const end = new Date();

        const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
        if (seconds < 60) return '방금 전';

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;

        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`;

        return `${start.toLocaleDateString()}`;
    };



    const [comData, setComData] = useState();
    const [review, setReview] = useState([]);
    const [getData, setGetData] = useState();
    const [pos, setPos] = useState();

    const save_comment = async (e) => {
        e.preventDefault();
        const in_txt = e.target.text.value
        const user_id = DBdata?._id;

        const info = {
            com_text: in_txt,
            com_date: Date.now(),
            com_user: user_id,
            // com_from: 
        }

        const response = await axios.post('/api/list?type=com&mode=commentUpdate', info);
        setComData(response.data);

        const writeTime = formatTimeAgo(info.com_date);
        setReview((prevReview) => [...prevReview, { ...info, writeTime }]);

        const get_data = await axios.get('/api/list?type=com&mode=getData', info);
        setGetData(get_data.data)
    }

    // const get_pos = await axios.get('/api/list?type=pos&mode=getPos');
    // setPos(get_pos.data)


    const data = useSearchParams();
    const postid = data.get('id');
    console.log(postid);

    return (
        <div className={listDetail.listDetail_wrap}>
            <header>
                <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기' /></figure>
                <p>게시글 상세</p>
                <figure onClick={dotClick}><img src='/dot.png' alt='글 삭제, 수정 버튼' /></figure>
            </header>

            <div className={listDetail.con}>
                <div className={listDetail.con_top}>
                    <figure><img src='/member_img.png' alt='회원 이미지' /></figure>
                    <div className={listDetail.con_top_txt}>
                        <p><span>정우성</span>님의 식단</p>
                        <span>방금 전</span>
                    </div>
                </div>
                <div className={listDetail.con_mid}>
                    <figure><img src='/food_img.png' alt='식단 이미지' /></figure>
                    <p>오늘 저녁식단입니다.<br /> 간단하게 양송이를 넣은 샐러드를 만들어보았어요.</p>
                </div>
                <div className={listDetail.con_bot}>
                    <div className={listDetail.con_bot_txt}>
                        <p>트레이너 평가</p>
                        <p>[좋아요]</p>
                    </div>
                    <div className={listDetail.con_bot_txt2}>
                        <span>트레이너 평가전입니다.</span>
                        <span onClick={evaluate}>평가하기</span>
                    </div>
                </div>
            </div>

            <div className={listDetail.comment}>
                <p>댓글 {review.length}</p>
                <ul>
                    {review?.length <= 0 ? (
                        <li>
                            <p>작성된 댓글이 없습니다.</p>
                        </li>
                    ) : (
                        review.map((item, key) => (
                            <li key={key}>
                                <figure><img src={UsImg ? UsImg : TrImg} alt='회원 이미지' /></figure>
                                <div className={listDetail.comment_txt1}>
                                    <p>{UsName ? UsName : TrName}</p>
                                    <span>방금 전</span>
                                    <p>{item.com_text}</p>
                                    <div className={listDetail.comment_txt2}>
                                        <span>좋아요</span>
                                        <span>답글쓰기</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                    <li>
                        <figure><img src='/member_img.png' alt='회원 이미지' /></figure>
                        <div className={listDetail.comment_txt1}>
                            <p>정우성</p>
                            <span>방금 전</span>
                            <p>샐러드 레시피 공유해주세요.</p>
                            <div className={listDetail.comment_txt2}>
                                <span>좋아요</span>
                                <span>답글쓰기</span>
                            </div>
                            <div className={listDetail.comment_one}>
                                <figure><img src='/member_img.png' alt='회원 이미지' /></figure>
                                <div className={listDetail.comment_txt1}>
                                    <p>정우성</p>
                                    <span>방금 전</span>
                                    <p>샐러드 레시피 공유해주세요.</p>
                                    <div className={listDetail.comment_txt2}>
                                        <span>좋아요</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div className={listDetail.write} ref={write}>
                <div className={listDetail.write_list}>
                    <button>글 <span>삭제</span>하기</button>
                    <button>글 <span>수정</span>하기</button>
                </div>
                <button onClick={closeClick}>닫기</button>
            </div>

            <form className={listDetail.comment_wrap} onSubmit={save_comment}>
                <input type='text' name='text' placeholder='댓글 남기기' />
                <input type='submit' value='등록' />
            </form>
        </div>
    )
}
