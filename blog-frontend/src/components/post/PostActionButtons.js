import React from "react";
import styled from "styled-components";
import palette from "../../lib/styles/palette";

const PostActionButtonBlock=styled.div`
  display:flex;
  justify-content:flex-end;
  margin-bottom:2em;
  margin-top:-1.5rem;
`;

const ActionButton=styled.button`
  padding:0.25rem 0.5rem;
  margin-right:0.5rem;
  border-radius:4px;
  color:${palette.gray[6]};
  font-weight:bold;
  border:none;
  outline:none;
  font-size:0.875rem;
  cursor:pointer;
  &:hover{
    background:${palette.gray[1]};
    color:${palette.gray[7]}
  }
  &+&:{
    margin-left:0.25rem;
  }
`

const PostActionButtons=({onEdit})=>{
  return(
    <PostActionButtonBlock>
      <ActionButton onClick={onEdit}>modify</ActionButton>
      <ActionButton>Delete</ActionButton>
    </PostActionButtonBlock>
  )
}

export default PostActionButtons;