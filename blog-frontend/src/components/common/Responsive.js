import React from "react";
import styled from "styled-components";

const ResponsiveBlock=styled.div`
  padding-left:1rem;
  padding-right:1rem;
  width:1024px;
  margin:0 auto;

  @media(max-width:1024px){
    width:768px;
  }
  @media(max-width:768px){
    width:100%;
  }
`;

const Responsive=({children, ...rest})=>{
  //style, className, onClick 등 props를 사용할 수 있또록  ...rest를 통해 ResponsiveBlock에게 전달
  return <ResponsiveBlock {...rest}>{children}</ResponsiveBlock>
}

export default Responsive;