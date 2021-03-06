import React,{useState, useCallback, useEffect} from "react";
import styled from "styled-components";
import palette from "../../lib/styles/palette";

const TagBoxBlock=styled.div`
  width:100%;
  border-top:1px solid ${palette.gray[2]};
  padding-top:2rem;

  h4{
    color:${palette.gray[8]}
    margin-top:0;
    margin-bottom:0.5rem;
  }
`;

const TagForm=styled.form`
  border-radius:4px;
  overflow:hidden;
  display:flex;
  width:256px;
  border:1px solid ${palette.gray[9]};
  input,
  button{
    outline:none;
    border:none;
    font-size:1rem;
  }
  input{
    paddin:0.5rem;
    flex:1;
  }
  button{
    cursor:pointer;
    padding-right:1rem;
    padding-left:1rem;
    border:none;
    background:${palette.gray[8]};
    color:white;
    font-weight:bold;
    &:hover{
      background:${palette.gray[6]}
    }
  }
`;

const Tag=styled.div`
  margin-right:0.5rem;
  color:${palette.gray[6]};
  cursor:pointer;
  &:hover{
    opacity:0.5;
  }
`

const TagListBlock=styled.div`
  display:flex;
  margin-top:0.5rem;
`
//React 메모를 사용하여 tag값이 바뀔 때만 리렌더링 되도록 처리
const TagItem=React.memo(({tag, onRemove})=>
  <Tag onClick={()=>onRemove(tag)}>#{tag}</Tag>
  )

//React.memo 를 사용하여 tags 값이 바뀔때만 리렌더링되도록 처리
const TagList=React.memo(({tags, onRemove})=>(
  <TagListBlock>
    {tags.map(tag=>(
      <TagItem key={tag} tag={tag} onRemove={onRemove}></TagItem>
    ))}
  </TagListBlock>
));

const TagBox=({tags,onChangeTags})=>{
  const [input, setInput]=useState('');
  const [localTags, setLocalTags]=useState([]);

  const insertTag=useCallback(
    tag=>{
      if(!tag) return;
      if(localTags.includes(tag)) return;
      const nextTags=[...localTags, tag];
      setLocalTags([...localTags, tag]);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags]
  );

  const onRemove=useCallback(
    tag=>{
      const nextTags=localTags.filter(t=>t!==tag)
      setLocalTags(localTags.filter(t=>t!==tag));
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags]
  )

  const onChange=useCallback(e=>{
    setInput(e.target.value);
  },[]);

  const onSubmit=useCallback(
    e=>{
      e.preventDefault();
      insertTag(input.trim());  //앞뒤 공백을 없앤 후 등록
      setInput(''); //input 초기화
    },
    [input, insertTag]
  );

  //tag값이 바뀔때
  useEffect(()=>{
    setLocalTags(tags)
  },[tags])
  return(
    <TagBoxBlock>
      <h4>tag</h4>
      <TagForm onSubmit={onSubmit}>
        <input placeholder='put tag' value={input} onChange={onChange}></input>
        <button type='submit'>add</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove}></TagList>
    </TagBoxBlock>
  )
}

export default TagBox;