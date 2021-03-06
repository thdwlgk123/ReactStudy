import mongoose from 'mongoose';

const {Schema}=mongoose;

const PostSchema=new Schema({
  title:String,
  body:String,
  tags:[String], //문자열로 이루어진 배열
  publishedDate:{
    type:Date,
    default:Date.now//현재날짜가 기본값
  },
  user:{
    _id:mongoose.Types.ObjectId,
    username:String
  }
})

const Post=mongoose.model('Post', PostSchema,'posts');
export default Post;