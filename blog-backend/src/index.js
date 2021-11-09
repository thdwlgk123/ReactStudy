// require('esm')(module);
// require('dotenv').config();
import dotenv from "dotenv";
dotenv.config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

const {PORT, MONGO_URI}=process.env;const port=PORT||4000;
//const bodyParser=require('koa-bodyparser');
//const mongoose=require('mongoose');
//비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기


mongoose.connect(
  MONGO_URI,{})
  .then(()=>{console.log('Connect to MongoDB');})
  .catch(e=>{console.log(e)})
//const api=require('./api');

const app=new Koa();
const router=new Router();

//메인 라우터 설정
router.use('/api',api.routes());  //api route 적용

//라우터 적용 전에  bodyparser 적용
app.use(bodyParser());
app.use(jwtMiddleware);
//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// app.listen(4000, ()=>{console.log('Listening to port 4000')})
//PORT가 지정되어 있지 않다면 4000을 사용
// const port=PORT||4000;
app.listen(port, ()=>{console.log('Listening to port %d', port)});
//Koa의 미들웨어 함수는 (ctx, next) 두 개의 파라미터 값 받음
//미들웨어는 app.use를 통해 순서대로 처리
// app.use(ctx=>{ctx.body='hello world'})
// app.use(async (ctx, next)=>{
//   console.log(ctx.url);
//   console.log(1);
//   // ctx.body='hello i vannn next';
//   if(ctx.query.test!=='지하'){
//     ctx.status=401; //Unauthorized
//     return;
//   }

//   // next().then(()=>{console.log('END')});
//   await next();
//   console.log('end');
// })
// app.use((ctx, next)=>{
//   console.log(2);
//   next();
// })
// app.use(ctx=>{
//   ctx.body='hello world';
// })

