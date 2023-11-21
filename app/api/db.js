const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://Yoonha:bPFob5CzQpxLi5Pr@cluster0.zyx3gv4.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
let db,toMeal_trainer,toMeal_member,toMeal_list,toMeal_comment,toMeal_face,toMeal_trainerMeal,toMeal_memberMeal;

client.connect();
db = client.db('today-s_meal');

toMeal_trainer= db.collection('toMeal_trainer');
toMeal_member= db.collection('toMeal_member');
toMeal_list= db.collection('toMeal_list');
toMeal_comment= db.collection('toMeal_comment');
toMeal_face= db.collection('toMeal_face');
toMeal_trainerMeal= db.collection('toMeal_trainerMeal');
toMeal_memberMeal= db.collection('toMeal_memberMeal');

export {toMeal_trainer,toMeal_member,toMeal_list,toMeal_comment,toMeal_face};
