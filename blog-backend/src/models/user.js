import mongoose from 'mongoose';
import pkg from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const {Schema}=pkg;
const UserSchema=new Schema({
  username:String,
  hashedPassword:String
});

//인스턴스 메소드를 작성할 때는 화살표가 아닌 function 사용해야함. 아니면 this를 사용하지 못함
UserSchema.methods.setPassword=async function(password){
  const hash=await bcrypt.hash(password, 10);
  this.hashedPassword=hash;
}
UserSchema.methods.checkPassword=async function(password){
  const result=await bcrypt.compare(password, this.hashedPassword);
  return result;  //true or false
}

//static 함수에서 this는 모델을 가르킴. 밑의 경우 User 가르킴.
UserSchema.statics.findByUsername=function(username){
  return this.findOne({username});  
}

UserSchema.methods.serialize=function(){
  const data=this.toJSON();
  delete data.hashedPassword;
  return data;
}

UserSchema.methods.generateToken=function(){
  const token=jwt.sign(
    //첫번째 파라미터는 토큰 안에 넣을 데이터 입력
    {
      _id:this.id, username:this.username
    },
    process.env.JWT_SECRET, //두 번째 파라미터에는 jwt 암호
    {
      expiresIn:'7d'  //7일 동안 유효
    }
  )
  return token;
}
const User=mongoose.model('User', UserSchema);
export default User;