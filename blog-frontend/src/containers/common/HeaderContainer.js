import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { logout } from "../../modules/users";

const HeaderContainer=()=>{
  const {user} =useSelector(({user})=>({user:user.user}));
  const dispatch=useDispatch();
  const onLogout=()=>{
    dispatch(logout());
  }
  return <Header user={user} onLogout={onLogout}></Header>
}

export default HeaderContainer;