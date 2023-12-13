"use client"
import Footer from '@/app/com/Footer';
import Loading from '@/app/com/loading';
import mainList from './mainList.module.scss'
import { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function () {
	const [DBdata, setDBdata] = useState();
	const [haveTr, setHaveTr] = useState(false);
	const [myListData, setMyListData] = useState();
	const [posData, setPosData] = useState();
	const [postingTime, setPostingTime] = useState('');

	useEffect(() => {
		const loginCheck = async function () {
			//세션값으로 로그인 db정보 찾아 가져오기
			const isTr = sessionStorage.getItem('tr_id');
			const isMb = sessionStorage.getItem('mb_id');

			if (isTr != null) {//트레이너
				const res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
				setDBdata(res.data);
				setHaveTr(true);

				//트레이너->내가 평가해야할 식단 리스트에 추가하기
				makeTrMealList(res.data);
			}
			if (isMb != null) {//일반회원
				const res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
				setDBdata(res.data);
				//일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
				makeMbMealList(res.data);
			}
		}
		loginCheck();

		const getPost = async function () {
			const getdata = await axios.get("/api/list?type=list&mode=getPost");
			const reverseData = [...getdata.data].reverse();
			setPosData(reverseData);
			console.log(getdata.data);


			const TimeAgo = (dateString) => {
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
			const TimeArray = reverseData.map((post) => {
				return TimeAgo(post.post_date);})
				setPostingTime(TimeArray);
			
		};

		getPost();

	}, [])


	//트레이너->내가 평가해야할 식단 리스트에 추가하기
	const makeTrMealList = async function (data) {
		const trData = { tr_dbId: data._id, myFam: data.tr_family };

		//아이디로 내 회원 고유id 가져오기
		const resFamily = await axios.post("/api/list?type=tr&mode=familyGet", trData);
		const famIdArray = [];
		for (const obj of resFamily.data) { famIdArray.push(obj._id); }

		//그 회원이 작성한 리스트 있으면 가져오기
		const resFamList = await axios.post("/api/list?type=tr&mode=familyNewList", famIdArray);
		//회원들의 식단 리스트 id를 한 배열에 담기
		const newListArray = [];
		for (const obj of resFamList.data) { newListArray.push(...obj.mbMeal_list); }
		// console.log(newListArray);

		//DB확인 후 미평가 식단에 넣기
		const haveList = await axios.post("/api/list?type=tr&mode=listIDCheck", trData);
		if (haveList.data == 0) {
			//신규 DB생성
			const makeTrMeal = {
				trMeal_id: res.data._id,
				trMeal_list: newListArray,
				trMeal_needJudge: newListArray
			};
			const makeList = await axios.post("/api/list?type=tr&mode=makeList", makeTrMeal);
		} else {
			//기존 DB에 list추가후 미평가 리스트 갱신
			const addData = {
				trMeal_id: data._id,
				trMeal_list: newListArray
			}
			const addList = await axios.post("/api/list?type=tr&mode=listUpdate", addData);
		}
	}
	//일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
	const makeMbMealList = async function (data) {
		const listData = { dbId: data._id };
		const resList = await axios.post("/api/list?type=mb&mode=listIDGet", listData);
		const haveList = await axios.post("/api/list?type=mb&mode=listIDCheck", listData);
		// console.log(resList.data);

		if (haveList.data == 0) {
			//신규 DB생성
			const myMeals_id = {
				mbMeal_id: data._id,
				mbMeal_list: resList.data,
				mbMeal_like: [],
				mbMeal_hate: []
			};
			const makeList = await axios.post("/api/list?type=mb&mode=makeList", myMeals_id);
		} else {
			//기존 DB에 list추가
			const addData = {
				mbMeal_id: data._id,
				mbMeal_list: resList.data
			}
			const addList = await axios.post("/api/list?type=mb&mode=listUpdate", addData);
		}
	}


	//이미지 base64 코드를 blob으로 짧게 줄이기
	const base64Blob = function (b64Data, contentType = '') {
		const image_data = atob(b64Data.split(',')[1]);

		const arraybuffer = new ArrayBuffer(image_data.length);
		const view = new Uint8Array(arraybuffer);

		for (let i = 0; i < image_data.length; i++) {
			view[i] = image_data.charCodeAt(i) & 0xff;
		}

		const blob = new Blob([arraybuffer], { type: contentType });
		return URL.createObjectURL(blob);
	}

	const write = useRef();
	const faceImg = useRef();
	const faceIcons = useRef();
	const dotClick = () => {
		write.current.style = `transform:translateY(0px)`
	}
	const closeClick = () => {
		write.current.style = `transform: translateY(230px)`
	}
	const faceClick = () => {
		faceImg.current.classList.toggle(mainList.faces)
	}
	useEffect(() => {
		if (faceIcons.current) {
			const faceLi = faceIcons.current.childNodes;
			let num = 0;
			faceLi.forEach((v, k) => {
				v.onclick = function () {
					const cn = v.childNodes;
					cn[num].style = `background:url("/${k + 1}_1.png"); width:25px; height:25px; background-size: 100% 100%;`;
				};
			});
		}
	}, [faceIcons]);



	const router = useRouter();

	const nav = (id) => {
		const createQuery = (params) => {
			const queryString = new URLSearchParams(params)
			return queryString;
		}

		const queryString = createQuery({ id });
		router.push(`/pages/list/listDetail?${queryString}`);
	};


	if (!DBdata) { return <Loading /> }
	return (
		<div className={mainList.mainList_wrap}>
			<header>
				<figure><img src="/character.png" alt="캐릭터 이미지" /></figure>
				<p>오늘의 식단</p>
			</header>
			{posData ?
				posData.map((v, k) => {
					if (v.post_open === 'on') {
						return (
							<div className={mainList.con} key={k} >
								<ul>
									<li>
										<div className={mainList.con_top}>
											<div className={mainList.con_top_txt1}>
												<figure><img src='/member_img.png' alt='회원 이미지' /></figure>
												<div className={mainList.con_top_txt2}>
													<p><span>{v.post_title}</span> {v.post_boolean ? '트레이너' : ''}님의 <span>{v.post_when}</span>식단</p>
													<span> {postingTime[k]}</span>
												</div>
											</div>
											<figure onClick={dotClick}><img src='/dot.png' alt='글 삭제, 수정 버튼' /></figure>
										</div>
										<div className={mainList.con_mid}>
											<figure onClick={() => { nav(v._id) }}>
												<img src={base64Blob(v.post_img)} alt='식단 이미지' />
											</figure>
											<div className={mainList.con_mid_txt1}>
												<div className={mainList.con_mid_txt1s}>
													<p>트레이너 평가</p>
													<p>[좋아요]</p>
												</div>
												<span>트레이너 평가전입니다.</span>
											</div>
											<div className={mainList.con_mid_txt2}>
												<p>{v.post_text}</p>
												<span onClick={() => { nav(v._id) }}>더보기</span>
											</div>
										</div>
										<div className={mainList.con_bot}>
											<div className={mainList.con_bot_txt1}>
												<div className={mainList.con_bot_txt1_flex}>
													<div>
														<figure><img src='/1_1.png' alt='표정이미지' /></figure>
														<figure><img src='/2_1.png' alt='표정이미지' /></figure>
														<figure><img src='/3_1.png' alt='표정이미지' /></figure>
													</div>
													<p>김수미님 외 2명</p>
												</div>
												<span>댓글 0</span>
											</div>
											<div className={mainList.con_bot_txt2}>
												<div onClick={faceClick}>
													<figure><img src='/expression.png' alt='표정짓기' /></figure>
													<p>표정짓기</p>
												</div>
												<div>
													<figure><img src='/comment.png' alt='댓글달기' /></figure>
													<p onClick={() => { nav(v._id) }}>댓글달기</p>
												</div>
											</div>
											<div className={mainList.con_bot_txt3} ref={faceImg}>
												<ul ref={faceIcons}>
													<li><figure></figure></li>
													<li><figure></figure></li>
													<li><figure></figure></li>
												</ul>
											</div>
										</div>
									</li>
								</ul>
							</div>
						)
					}
				}) : <Loading />
			}
			<div className={mainList.write} ref={write}>
				<div className={mainList.write_list}>
					<button>글 <span>삭제</span>하기</button>
					<button>글 <span>수정</span>하기</button>
				</div>
				<button onClick={closeClick}>닫기</button>
			</div>
			<Footer />
		</div >
	)
}