import axios from 'axios';
import { createContext, useState } from 'react';

export const UseLoginData = createContext();

export const LoginContext = ({ children }) => {

    const test = 100;
    //세션값으로 로그인 db정보 찾아 가져오기
    let isTr, isMb, res;
    const [DBdata, setDBdata] = useState();
    const [haveTr, setHaveTr] = useState(false);

    isTr = sessionStorage.getItem('tr_id');
    isMb = sessionStorage.getItem('mb_id');
    const loginCheck = async function () {
        if (isTr != null) {//트레이너
            res = await axios.post("/api/member?type=tr&mode=bring", { isTr });
            setDBdata(res.data);
            setHaveTr(true);
            //트레이너->내가 평가해야할 식단 리스트에 추가하기
            // makeTrMealList();
        }

        if (isMb != null) {//일반회원
            res = await axios.post("/api/member?type=mb&mode=bring", { isMb });
            setDBdata(res.data);
            //일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
            // makeMbMealList();
        }
    }
    //트레이너->내가 평가해야할 식단 리스트에 추가하기
    const makeTrMealList = async function () {
        const trData = { tr_dbId: res.data._id, myFam: res.data.tr_family };

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
                trMeal_id: res.data._id,
                trMeal_list: newListArray
            }
            const addList = await axios.post("/api/list?type=tr&mode=listUpdate", addData);
        }
    }

    //일반회원-> 내가 작성한 식단 찾아 mb_myMeal에 해당 식단의 id 넣기
    const makeMbMealList = async function () {
        const listData = { dbId: res.data._id };

        const resList = await axios.post("/api/list?type=mb&mode=listIDGet", listData);
        const haveList = await axios.post("/api/list?type=mb&mode=listIDCheck", listData);
        // console.log(resList.data);

        if (haveList.data == 0) {
            //신규 DB생성
            const myMeals_id = {
                mbMeal_id: res.data._id,
                mbMeal_list: resList.data,
                mbMeal_like: [],
                mbMeal_hate: []
            };
            const makeList = await axios.post("/api/list?type=mb&mode=makeList", myMeals_id);
        } else {
            //기존 DB에 list추가
            const addData = {
                mbMeal_id: res.data._id,
                mbMeal_list: resList.data
            }
            const addList = await axios.post("/api/list?type=mb&mode=listUpdate", addData);
        }
    }

    return (
        <UseLoginData.Provider value={{ test }}>
        {/* <UseLoginData.Provider value={{ isTr, isMb, DBdata, haveTr, makeTrMealList, makeMbMealList }}> */}
            {children}
        </UseLoginData.Provider>
    );
};