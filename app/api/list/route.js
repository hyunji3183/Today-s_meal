import { toMeal_trainer, toMeal_member, toMeal_list, toMeal_comment, toMeal_face, toMeal_trainerMeal, toMeal_memberMeal, toMeal_reply } from '../db.js'

async function getDB(type) {
    let result;
    switch (type) {
        case 'tr': result = await toMeal_trainer.find().toArray(); break;
        case 'mb': result = await toMeal_member.find().toArray(); break;
        case 'list': result = await toMeal_list.find().toArray(); break;
        case 'com': result = await toMeal_comment.find().toArray(); break;
        case 'face': result = await toMeal_face.find().toArray(); break;
        case 'trMeal': result = await toMeal_trainerMeal.find().toArray(); break;
        case 'mbMeal': result = await toMeal_memberMeal.find().toArray(); break;
        case 're': result = await toMeal_reply.find().toArray(); break;
    }
    return result;
}


async function postDB(type, mode, data) {

    let result;
    //mainList페이지
    //일반회원-> 내가 올린 식단의 고유값 배열로 가져오기
    if (type === 'mb' && mode === 'listIDGet') {
        const mealListId = [data.dbId];
        const idArray = await toMeal_list.find({ post_user: { $in: mealListId } }).toArray();
        result = idArray.map(item => item._id);
    }
    if (type === 'mb' && mode === 'listIDCheck') {//DB에 해당회원이 있는지 확인
        const checkId = data.dbId;
        result = await toMeal_memberMeal.countDocuments({ mbMeal_id: checkId });
    }

    //DB에 없음=> 신규 DB생성
    if (type === 'mb' && mode === 'makeList') {
        await toMeal_memberMeal.insertOne(data);
        result = await toMeal_memberMeal.find().toArray();
    }
    //DB에 있음=> 기존 DB에 추가
    if (type === 'mb' && mode === 'listUpdate') {
        const whoseList = data.mbMeal_id;
        const listId = data.mbMeal_list;

        result = await toMeal_memberMeal.updateOne(
            { "mbMeal_id": whoseList }, { $set: { "mbMeal_list": listId } }
        );
    }
    //게시글 삭제
    if (type === 'list' && mode === 'postDelete') {
        const postId = data.p_id;
        const useId = data.us_id;
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(useId);
        console.log(postId, useId);
        result = await toMeal_list.deleteOne({ "post_user": useId, "_id": objectId });
    }

    //트레이너->내가 평가해야할 식단 리스트에 추가하기
    if (type === 'tr' && mode === 'familyGet') {//내 회원들 정보 가져오기
        const getById = data.myFam;
        result = await toMeal_member.find({ mb_id: { $in: getById } }).toArray();
    }
    if (type === 'tr' && mode === 'familyNewList') {//내 회원이 새로 작성한 List가져오기
        const famId = data;
        result = await toMeal_memberMeal.find({ mbMeal_id: { $in: famId } }).toArray();
    }
    if (type === 'tr' && mode === 'listIDCheck') {//DB에 해당회원이 있는지 확인
        const checkId = data.tr_dbId;
        result = await toMeal_trainerMeal.countDocuments({ trMeal_id: checkId });
    }
    //DB에 없음=> 신규 DB생성
    if (type === 'tr' && mode === 'makeList') {
        await toMeal_trainerMeal.insertOne(data);
        result = await toMeal_trainerMeal.find().toArray();
    }
    //DB에 있음=> 기존 DB에 추가
    if (type === 'tr' && mode === 'listUpdate') {
        const whoseList = data.trMeal_id;
        const listArray = data.trMeal_list;

        await toMeal_trainerMeal.updateOne(//전체 리스트 업데이트
            { "trMeal_id": whoseList }, { $set: { "trMeal_list": listArray } }
        );

        //미평가 리스트 목록 반환하기
        const { ObjectId } = require('mongodb');
        const listArrayObjectIds = listArray.map(id => new ObjectId(id));

        const checkJudge = await toMeal_list.find({
            _id: { $in: listArrayObjectIds },
            post_judge: { $eq: '' }
        }).toArray();

        const notYetJudge = checkJudge.map(obj => obj._id.toString());
        await toMeal_trainerMeal.updateOne(//미평가 리스트 업데이트
            { "trMeal_id": whoseList }, { $set: { "trMeal_needJudge": notYetJudge } }
        );
        result = await toMeal_trainerMeal.find({ "trMeal_id": whoseList }).toArray();
    }

    //트레이너가 식단 평가하기
    if (type === 'list' && mode === 'judge') {
        const postid = data.postid;
        const likeHate = data.post_trLike;
        const judge = data.post_judge;

        const { ObjectId } = require('mongodb');
        const findListId = new ObjectId(postid);

        await toMeal_list.updateOne(//좋아요,싫어요 (0이면 좋아요/1이면 싫어요)
            { _id: findListId }, { $set: { "post_trLike": likeHate, "post_judge": judge } }
        );
        // result = await toMeal_list.find({ _id: findListId }).toArray();
        result = true;
    }

    //메인리스트출력
    if (type == 'list' && mode === 'getAllPost') {
        const result = await toMeal_list.find().sort({ _id: -1 }).toArray();
    }

    //mealList 페이지 출력
    if (type == 'list' && mode === 'getMealPost') {
        const userTrID = data.trid;
        const userMbID = data.mbid;

        if (userTrID != null) {//트레이너
            const findUser = await toMeal_trainer.find({ tr_id: userTrID }).toArray();
            const userCode = findUser[0].tr_code;
            const famPost = await toMeal_list.find({ post_trainer: userCode }).toArray();
            result = famPost;
        }
        if (userMbID != null) {//일반회원
            const findUser = await toMeal_member.find({ mb_id: userMbID }).toArray();
            const user_id = findUser[0]._id;
            const mbPost = await toMeal_list.find({ post_user: user_id.toString() }).toArray();
            result = mbPost;
        }
    }

    //댓글 좋아요+
    if (type === 'com' && mode === 'likeCount') {
        const comID = data;
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(comID);

        await toMeal_comment.updateOne(
            { _id: objectId },
            { $inc: { com_like: 1 } }
        );
        result = true;
    }
    //대댓글 좋아요+
    if (type === 're' && mode === 'replyLikeCount') {
        const replyID = data;
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(replyID);

        await toMeal_reply.updateOne(
            { _id: objectId },
            { $inc: { reply_like: 1 } }
        );
        result = true;
    }

    //식단 리스트의 고유id 배열에 담기
    if (type === 'com' && mode === 'getId') {
        const idArray = await toMeal_list.find({}, { projection: { _id: 1 } }).toArray();
        result = idArray.map(obj => obj._id.toString());
    }
    //해당 게시글에 등록된 댓글 갯수 가져와서 list db에 추가하기
    if (type === 'com' && mode === 'addCount') {
        const idArray = data.ids;
        const updateIdArray = idArray.map(async (post_ID) => {
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(post_ID);
            const commentCount = await toMeal_comment.countDocuments({ com_from: post_ID });

            await toMeal_list.updateOne(
                { _id: objectId },
                { $set: { "post_comCount": commentCount } }
            );
        });
        await Promise.all(updateIdArray);
        result = true;
    }
    //표정 추가
    if (type === 'face' && mode === 'addFaces') {
        const idArray = data.ids;
        const updateIdArray = idArray.map(async (post_ID) => {
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(post_ID);

            const faceCount = await toMeal_face.countDocuments({ face_from: post_ID });
            const latestFaceName = await toMeal_face.findOne(
                { face_from: post_ID },
                { sort: { _id: -1 } } //최신순을 찾기위해
            );
            const lastName = latestFaceName ? latestFaceName.face_userName : null;
            await toMeal_list.updateOne(
                { _id: objectId },
                { $set: { "post_faceCount": faceCount, "post_faceName": lastName } }
            );
        });
        await Promise.all(updateIdArray);
        result = true;
    }
    //표정 디테일 페이지
    if (type === 'face' && mode === 'getById') {
        const post_id = data.postid;
        result = await toMeal_face.find({ face_from: post_id }).toArray();
    }

    //댓글내용저장
    if (type === 'com' && mode === 'commentUpdate') {
        result = await toMeal_comment.insertOne(data);
    }

    //대댓글 저장
    if (type === 're' && mode === 'replyUpdate') {
        result = await toMeal_reply.insertOne(data);
    }

    //게시글 디테일 출력
    if (type === 'pos' && mode === 'getDetailPost') {
        const post_ID = data.id;
        // MongoDB에서 제공하는 ObjectId를 사용하려면 선언해줘야함
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(post_ID);
        result = await toMeal_list.find({ _id: objectId }).toArray();
    }

    //해당 게시글에 등록된 댓글 가져오기
    if (type === 'com' && mode === 'post_from') {
        const post_ID = data.id;
        result = await toMeal_comment.find({ com_from: post_ID }).toArray();
    }

    //해당 댓글에 등록된 대댓글 가져오기
    if (type === 're' && mode === 'get_reply') {
        const replyId = data.id;
        result = await toMeal_reply.find({ reply_from: replyId }).toArray();
    }

    //표정 faceDB로 보내기
    if (type === 'face' && mode === 'faceUpdate') {
        //0은 좋아요 / 1은 보통 / 2는 싫어요
        const userID = data.face_user;
        const postID = data.face_from;
        const didAlready = await toMeal_face.countDocuments({ face_from: postID, face_user: userID });
        if (didAlready == 1) {//이미 표정짓기 했을 경우 제거하기
            await toMeal_face.deleteOne({ face_from: postID, face_user: userID });
        } else {//한적 없을경우 그대로 DB에 추가
            await toMeal_face.insertOne(data);
        }
        result = await toMeal_face.find().toArray();
    }
    if (type === 'face' && mode === 'getFace') {
        result = await toMeal_face.find().toArray();
    }

    return result;
}



export async function GET(req) {
    let type = req.nextUrl.searchParams.get('type')
    let result = await getDB(type);
    return Response.json(result);
}


export async function POST(req) {
    let { type, mode } = Object.fromEntries(req.nextUrl.searchParams);
    let data = await req.json();
    let result = await postDB(type, mode, data)
    return Response.json(result);
}
