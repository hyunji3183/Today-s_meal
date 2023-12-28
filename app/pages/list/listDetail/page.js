"use client"
import axios from 'axios';
import listDetail from './listDetail.module.scss'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { info } from 'sass';


export default function page() {
    const nav = useRouter();
    const write = useRef();
    const newCom = useRef({});
    const replyBtn = useRef();

    const arrowClick = () => {
        nav.push('/pages/list/mainList')
    }
    const dotClick = () => {
        write.current.style = `transform:translateY(0px)`
    }
    const closeClick = () => {
        write.current.style = `transform: translateY(230px)`
    }


    const [DBdata, setDBdata] = useState();
    const [haveTr, setHaveTr] = useState(false);
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
                const res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
                setDBdata(res.data);
                setHaveTr(true);
                setTrName(res.data.tr_name)
                setTrImg(res.data.tr_img)
            }
            if (isMb != null) {//일반회원
                const res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
                setDBdata(res.data);
                setUsName(res.data.mb_name)
                setUsImg(res.data.mb_img)
                //일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
            }
        }
        loginCheck();
        get_Post();
        get_review();
    }, [])

    //트레이너 평가페이지 이동
    const router = useRouter();
    const evaluate = (id) => {
        //url받아오기
        const createQuery = (params) => {
            const queryString = new URLSearchParams(params)
            return queryString;
        }
        const queryString = createQuery({ id });

        const isTr = sessionStorage.getItem('tr_id');
        const postTrcode = pos[0].post_trainer;

        if (isTr != null) {
            //작성자의 트레이너 코드와 일치해야만 평가 작성가능
            if (DBdata?.tr_code == postTrcode) {
                router.push(`/pages/list/trainerEvaluation?${queryString}`);
            } else {
                alert('나의 관리회원만 평가할 수 있습니다!')
            }
        } else {
            alert('트레이너만 평가가 가능합니다!')
        }
    }


    const [comData, setComData] = useState();
    const [pos, setPos] = useState();
    const [com, setCom] = useState();
    const [selectItem, setSelectItem] = useState(null);
    const [reply, setReply] = useState();
    const [replyData, setReplyData] = useState();

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


    const data = useSearchParams();
    const postId = data.get('id');
    // 게시글 디테일 출력
    const get_Post = async function () {
        const get_pos = await axios.post('/api/list?type=pos&mode=getDetailPost', { id: postId });
        const posData = get_pos.data.map(item => ({ ...item, formattedDate: formatTimeAgo(item.post_date) }));
        setPos(posData);
    }
    //해당 게시글에 등록된 댓글 가져오기
    const get_review = async () => {
        const AllComment = await axios.post('/api/list?type=com&mode=post_from', { id: postId });
        const commentData = AllComment.data.map(item => ({ ...item, formattedDate: formatTimeAgo(item.com_date) }));
        setCom(commentData)

        console.log(commentData);
    }

    //댓글내용저장
    const save_comment = async (e) => {
        e.preventDefault();
        const user_id = DBdata?._id;
        const in_txt = e.target.text.value
        if (haveTr) {
            const info = {
                com_text: in_txt,
                com_date: Date.now(),
                com_user: user_id,
                com_from: postId,
                com_userImg: DBdata?.tr_img,
                com_userName: DBdata?.tr_name
            }
            const response = await axios.post('/api/list?type=com&mode=commentUpdate', info);
            setComData(response.data);
        }
        else {
            const info = {
                com_text: in_txt,
                com_date: Date.now(),
                com_user: user_id,
                com_from: postId,
                com_userImg: DBdata?.mb_img,
                com_userName: DBdata?.mb_name
            }
            const response = await axios.post('/api/list?type=com&mode=commentUpdate', info);
            setComData(response.data);
        }
        window.location.reload()
        e.target.text.value = '';
    }

    //대댓글저장
    const save_newComment = async (e) => {
        e.preventDefault();
        newCom.current.style = `display: none;`
        const user_id = DBdata?._id;
        const in_newTxt = e.target.text.value

        console.log(e);
        if (haveTr) {
            const commentData = {
                reply_text: in_newTxt, //댓글 내용
                reply_date: Date.now(), //댓 작성 일자
                reply_user: user_id, //댓 작성자 고유 ID
                reply_from: selectItem, //어떤 댓글의 대댓글인지 원본 댓글 고유 ID
                reply_userImg: DBdata?.tr_img, //유저프로필사진
                reply_userName: DBdata?.tr_name //유저이름
            }
            const res = await axios.post('/api/list?type=com&mode=commentUpdate', commentData);
            setReply(res.data);
        }
        else {
            const commentData = {
                reply_text: in_newTxt,
                reply_date: Date.now(),
                reply_user: user_id,
                reply_from: selectItem,
                reply_userImg: DBdata?.mb_img,
                reply_userName: DBdata?.mb_name
            }
            const res = await axios.post('/api/list?type=re&mode=replyUpdate', commentData);
            setReply(res.data);
            console.log(commentData);
            console.log(selectItem);
        }
        window.location.reload()
        e.target.text.value = '';
    }

    //해당 댓글에 등록된 대댓글 가져오기
    useEffect(() => {
        if (selectItem !== null) {
            const get_reply = async () => {
                const AllReply = await axios.post('/api/list?type=re&mode=get_reply', { id: selectItem });
                const ReplyData = AllReply.data.map(item => ({ ...item, formattedDate: formatTimeAgo(item.reply_date) }));
                setReplyData(ReplyData)
            }
            get_reply();
        }
    }, [selectItem])
    console.log(replyData);

    const NewCommnent = (commentId, k) => {
        newCom.current[k].classList.toggle(listDetail.reply)

        setSelectItem(commentId)
        console.log(commentId);
    }

    return (
        <div className={listDetail.listDetail_wrap}>
            <header>
                <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기' /></figure>
                <p>게시글 상세</p>
                <figure onClick={dotClick}><img src='/dot.png' alt='글 삭제, 수정 버튼' /></figure>
            </header>
            {pos && pos.map((item, key) => (
                <div className={listDetail.con} key={key}>
                    <div className={listDetail.con_top}>
                        <figure><img src={item.post_userImg} alt='회원 이미지' /></figure>
                        <div className={listDetail.con_top_txt}>
                            <p><span>{item.post_title}</span>님의 <span>{item.post_when}</span>식단</p>
                            <span>{item.formattedDate}</span>
                        </div>
                    </div>
                    <div className={listDetail.con_mid}>
                        <figure><img src={item.post_img} alt='식단 이미지' /></figure>
                        <p>{item.post_text}</p>
                    </div>
                    <div className={listDetail.con_bot}>
                        <div className={listDetail.con_bot_txt}>
                            <p>트레이너 평가</p>
                            {
                                item.post_trLike === "" ?
                                    <p>[미평가]</p>
                                    :
                                    <p>{item.post_trLike == 0 ? '[좋아요💙]' : '[싫어요👎]'}</p>
                            }
                        </div>
                        {
                            item.post_judge == '' ?
                                <div className={listDetail.con_bot_txt2}>
                                    <span>트레이너 평가전입니다.</span>
                                    <span onClick={() => { evaluate(postId) }}>평가하기</span>
                                </div>
                                :
                                <div className={listDetail.con_bot_txt2}>
                                    <span>{item.post_judge}</span>
                                </div>
                        }
                    </div>
                </div>
            ))}
            <div className={listDetail.comment}>
                <p>댓글 {com?.length}</p>
                <ul>
                    {com?.length <= 0 ? (
                        <li>
                            <p>작성된 댓글이 없습니다.</p>
                        </li>
                    ) : (
                        com && com.map((item, key) => (
                            <li key={key}>
                                <figure><img src={item.com_userImg} alt='회원 이미지' /></figure>
                                <div className={listDetail.comment_txt1}>
                                    <p>{item.com_userName}</p>
                                    <span>{item.formattedDate}</span>
                                    <p>{item.com_text}</p>
                                    <div className={listDetail.comment_txt2}>
                                        <div>
                                            <span>좋아요</span>
                                            <span>5</span>
                                        </div>
                                        <span onClick={() => NewCommnent(item._id, key)}>답글쓰기</span>
                                    </div>
                                    {replyData && replyData.map((re, key) => (
                                        re.reply_from === item._id ?
                                            (
                                                <div className={listDetail.comment_one} key={key}>
                                                    <figure><img src={re.reply_userImg} alt='회원 이미지' /></figure>
                                                    <div className={listDetail.comment_txt1}>
                                                        <p>{re.reply_userName}</p>
                                                        <span>{re.formattedDate}</span>
                                                        <p>{re.reply_text}</p>
                                                        <div className={listDetail.comment_txt2}>
                                                            <span>좋아요</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ('')
                                    ))}
                                    <div className={listDetail.newComment_box} ref={(element) => newCom.current[key] = element}>
                                        <form className={listDetail.newComment} onSubmit={save_newComment}>
                                            <label htmlFor='text'>
                                                <textarea type='text' name='text' placeholder={`${item.com_userName} 님에게 답글 남기는 중...`} />
                                            </label>
                                            <label htmlFor='submit'>
                                                <input type='submit' name='submit' value='등록' />
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
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
