import {toMeal_trainer,toMeal_member,toMeal_list,toMeal_comment,toMeal_face,toMeal_trainerMeal,toMeal_memberMeal} from '../db.js'

async function getDB(type){
    let result;
    switch(type){
        case 'tr': result = await toMeal_trainer.find().toArray(); break;
        case 'mb':  result = await toMeal_member.find().toArray(); break;
        case 'list': result = await toMeal_list.find().toArray() ; break;
        case 'com': result = await toMeal_comment.find().toArray() ; break;
        case 'face': result = await toMeal_face.find().toArray()  ; break;
        case 'trMeal': result = await toMeal_trainerMeal.find().toArray()  ; break;
        case 'mbMeal': result = await toMeal_memberMeal.find().toArray()  ; break;
    }
    return result;
}


async function postDB(type,mode,data){

    let result;
    //내가 올린 식단(일반멤버)
    if(type==='mb' && mode==='listUpdate'){
        const mealListId = data.dbId;
        console.log(mealListId);
        result = await toMeal_list.find({post_user:{$in:mealListId}}).toArray();
    }
    return result;
}

export async function GET(req) {
    let type = req.nextUrl.searchParams.get('type')
    let result = await getDB(type);

    return Response.json(result);
}


export async function POST(req) {
    let {type,mode} = Object.fromEntries(req.nextUrl.searchParams);
    let data = await req.json();
    let result = await postDB(type,mode,data)
    return Response.json(result);
}
