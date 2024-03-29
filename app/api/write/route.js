import { toMeal_trainer, toMeal_member, toMeal_list, toMeal_comment, toMeal_face, toMeal_trainerMeal, toMeal_memberMeal } from '../db.js'

async function getDB(type) {
    let result;
    switch (type) {
        // case 'tr': result = await toMeal_trainer.find().toArray(); break;
        case 'mb': result = await toMeal_member.find().toArray(); break;
        case 'list': result = await toMeal_list.find().toArray(); break;
        // case 'com': result = await toMeal_comment.find().toArray() ; break;
        // case 'face': result = await toMeal_face.find().toArray()  ; break;
        // case 'trMeal': result = await toMeal_trainerMeal.find().toArray()  ; break;
        // case 'mbMeal': result = await toMeal_memberMeal.find().toArray()  ; break;
    }
    return result;
}


async function postDB(type, mode, data) {

    let result;
    //식단 작성 페이지
    //DB에 저장하기
    if (type === 'list' && mode === 'insert') {
        await toMeal_list.insertOne(data);
        result = await toMeal_list.find().toArray();
    }
    //내가 올린 식단(일반멤버)
    if (type === 'mb' && mode === 'nameUpdate') {
        const mealListId = data.dbId;
        result = await toMeal_list.updateOne({ post_user: { $in: mealListId } }).toArray();
    }

    //게시글 수정
    if (type === 'change' && mode === 'changePost') {
        const postId = data.post_id;
        const img = data.post_img;
        const txt = data.post_text;
        const when = data.post_when;
        const open = data.post_open;

        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(postId);

        result = await toMeal_list.updateOne({ _id: objectId },
            { $set: { "post_text": txt, "post_img": img, "post_when": when, "post_open": open } }
        );
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
