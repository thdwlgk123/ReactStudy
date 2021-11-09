import './App.css';
import React from 'react';
import {Route} from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

const App=()=> {
  return (
    <div className="App">
      {/* path에 배열을 넣는 경우 여러 개의 라우터 사용 가능 */}
      {/* @username은 localhost:4000/@velopert 경우 velepert 파라미터로 받음 */}
      <Route component={PostListPage} path={['/@username','/']} exact />
      <Route component={LoginPage} path='/login' />
      <Route component={RegisterPage} path='/register' />
      <Route component={WritePage} path='/write' />
      <Route component={PostPage} path="/@:username/:postId" />
      <div></div>
    </div>
  );
}

export default App;
