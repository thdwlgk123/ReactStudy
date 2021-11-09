import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import nodemon from 'nodemon';
import sanitizeHtml from 'sanitize-html';

const {ObjectId}=mongoose.Types;
//html 을 필터링 할 때 허용할 것을 설정
const sanitizeOption={
  allowedTags:[
    'h1','h2','b','i','u','s','p','ul','ol','li','blockquote','a','img'
  ],
  allowedAttributes:{
    a:['href','name','target'],
    img:['src'],
    li:['class']
  },
  allowedSchemes:['data','http']
}
//html을 없애고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten=body=>{
  const filtered=sanitizeHtml(body, {
    allowedTags:[]
  });
  return filtered.length<200?filtered:`${filtered.slice(0,200)}...`;
}
// 유효하지 않은 id값 검색에 대한 400 request 처리
export const getPostById=async (ctx, next)=>{
  const {id}=ctx.params;
  console.log('getpostbyid: '+id);
  if(!ObjectId.isValid(id)){
    ctx.status=400;
    return;
  }
  try{
    const post=await Post.findById(id);
    if(!post){
      ctx.status=404;
      return;
    }
    ctx.state.post=post;
    console.log('set state: '+ctx.state.post)
    return next();
  }catch(e){
    ctx.throw(500,e);
  }
}
//await 사용 시 함수 선언 부분에 async가 필요, try/catch문으로 오류 처리
export const write=async ctx=>{
  const schema=Joi.object().keys({
    //객체가 다음 항목을 가지고 있는지 검증
    title:Joi.string().required(),  //required()가 있으면 필수 항목
    body:Joi.string().required(),
    tags:Joi.array().items(Joi.string()).required() //문자열로 이루어진 배열
  })
  //검증결과가 실패인 경우 에러 처리
  // const result=Joi.validate(ctx.request.body, schema);
  const result=schema.validate(ctx.request.body)
  if(result.error){
    ctx.status=400;
    ctx.body=result.error;
    return;
  }

  const {title, body, tags}=ctx.request.body;
  //포스트의 인스턴스를 만들 때는 new를 사용
  const post=new Post({
    title, body:sanitizeHtml(body, sanitizeOption), tags,user:ctx.state.user //생성자의 파라미터에 정보를 지닌 객체 넣음
  });
  try{
    //async/await문법으로 저장 요청 완료까지 대기할 수 있음
    await post.save();   //save() 함수 실행시 데이터베이스에 저장
    ctx.body=post;
  } catch(e){
    ctx.throw(500,e);
  }
}
export const read=async ctx=>{
  ctx.body=ctx.state.post;
}
export const list=async ctx=>{
  const page=parseInt(ctx.query.page || '1',10);
  if(page<1){
    ctx.status=400;
    return;
  }
  const {tag, username}=ctx.query;
  //tab,username값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query={
    ...(username?{'user.username':username}:{}),
    ...(tag?{tags:tag}:{})
  };
//  console.log('list set query posts.ctrl: '+query.tags+", "+query['user.username']);
  try{
    const posts=await Post.find(query)
                          .sort({_id:-1})
                          .limit(5)
                          .skip((page-1)*5)
                          .exec(); //find함수 호출한 후에는 exec를 붙여줘야 서버에 쿼리를 요청함
    const postCount=await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount/5));
    ctx.body=posts
    .map(post=>post.toJSON()) //JSON 형태로 변환. 위에서 lean()을 사용하면 변환 필요없음
    .map(post=>({
      ...post,
      body:removeHtmlAndShorten(post.body)
    }))

  }catch(e){
    ctx.throw(500,e);
  }
}
export const remove=async ctx=>{
  const {id}=ctx.params;
  try{
    await Post.findByIdAndRemove(id).exec();
    ctx.status=204; //성공했지만 응답할 데이터 없음

  }catch(e){
    ctx.throw(500,e);
  }
}
export const update=async ctx=>{
  const {id}=ctx.params;
  const schema=Joi.object().keys({
    //객체가 다음 항목을 가지고 있는지 검증
    title:Joi.string(),  
    body:Joi.string(),
    tags:Joi.array().items(Joi.string()) //문자열로 이루어진 배열
  })
  //검증결과가 실패인 경우 에러 처리
  // const result=Joi.validate(ctx.request.body, schema);<-이전문법
  const result=schema.validate(ctx.request.body)  //<-새로운 문법
  if(result.error){
    ctx.status=400;
    ctx.body=result.error;
    return;
  }
  const nextData={...ctx.request.body};//객체 복사
  if(nextData.body){
    nextData.body=sanitizeHtml(nextData.body);
  }
  try{
    const post=await Post.findByIdAndUpdate(id, nextData,{
      new:true  //update된 데이터를 반환하기 위한 설정
    }).exec();
    if(!post){
      ctx.status=404;
      return;
    }
    ctx.body=post;
  }catch(e){
    ctx.throw(500,e);
  }
}
export const checkOwnPost=(ctx, next)=>{
  const {user, post}=ctx.state;
  console.log('user'+post.user+", post "+{post})
  if(post.user._id.toString()!==user._id){
    ctx.status=403;
    return;
  }
  return next();
}