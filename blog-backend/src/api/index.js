import Router from 'koa-router';
import posts from './posts/index.js';
import auth from './auth/index.js';

const api=new Router();

api.use('/posts',posts.routes()); 
api.use('/auth',auth.routes());
// api.get('/test', ctx=>{
//   ctx.body='test Success';
// })

//라우터 내보내기
// module.exports=api;
export default api;