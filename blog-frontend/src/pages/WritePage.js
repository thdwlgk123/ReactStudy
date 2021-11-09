import React from 'react';
import Responsive from '../components/common/Responsive';
import TagBoxContainer from '../components/write/TagBoxContainer';
import EditorContainer from '../containers/write/EditorContainer';
import WriteActionButtonsContainer from '../containers/write/WriteActionButtonsContainer';

const WritePage=()=>{
  return (
    <Responsive>
      <EditorContainer/>
      <TagBoxContainer/>
      <WriteActionButtonsContainer/>
    </Responsive>
  )
}

export default WritePage;