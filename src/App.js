/* eslint-disable */

import { Container, Nav, Navbar, Button, Form, InputGroup  } from 'react-bootstrap';
import './App.css';
import {Routes, Route, Link, useNavigate, Navigate} from 'react-router-dom'
import Join from './routes/Join.js';
import Login from './routes/Login.js'
import { useEffect, useState,React } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Logout from './modules/logout.js';
import WriteContent from './routes/WriteContent.js'
import refreshToken from './modules/refreshToken.js';
import { logOn, logOff, setMember } from './store.js';
import Contents from './routes/Contents.js';
import Detail from './routes/Detail.js';
import ContentEdit from './routes/ContentEditPage.js';
import ImageFile from './routes/imageFile.js';
import AddItem from './routes/AddItem.js';
import Main from './routes/Main.js';
import ItemDetail from './routes/ItemDetail.js';
import ItemEdit from './routes/ItemEditPage.js';
import Cart from './routes/Cart.js';
import OrderList from './routes/OrderList.js';

function App() {

  let navigate = useNavigate();

  let redux = useSelector((state)=>{
    return state;
  })
  let dispatch = useDispatch();

  let [nickname,setNickname] = useState('');

  const header = {
    'Authorization' : localStorage.getItem('accessToken')
  };

  let getUser = async function(){
      await axios.get("http://localhost:8080/user",{
        headers:{
          'Authorization' : localStorage.getItem('accessToken'),
          'Content-Type' : 'application/json'
        }
      })
      .then((action)=>{
        let response = action.data;
        setNickname(response.data.nickname);
        dispatch(logOn());
        dispatch(setMember(response.data));
      })
      .catch((error)=>{
        let data = error.response.data;
        if(error.response.status == 403){
          console.log('미인증 요청');
        }
        console.log('서버 응답 코드:', error.response.status);
        console.log('서버 응답 데이터:', error.response.data);
        console.log('서버 응답 헤더:', error.response.headers);

        if(data.accessTokenExpired == true && data.refreshTokenExpired == false){
            alert('인증 기간 만료. 다시 로그인 해주세요.');
            window.location.replace("/");
        }
      })
  }

  useEffect(()=>{
    getUser();
  },[navigate,nickname])

  return (
    <div className="App">
     
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Store</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">홈</Nav.Link>
            <Nav.Link href="/content">게시글</Nav.Link>
            {
              nickname ? <Nav.Link href="/content/write">글쓰기</Nav.Link> : null
            }
            {
              nickname ? <Nav.Link href="/item/add_item">상품등록</Nav.Link> : null
            }
            
          </Nav>
          <Nav className="ms-auto">
            {
              nickname ? <Nav.Link onClick={()=>{navigate('/mypage')}}>안녕하세요. {nickname}</Nav.Link> :
              <Nav.Link onClick={()=>{navigate('/login')}}>로그인</Nav.Link>
            }
            {
              nickname ? <Nav.Link onClick={()=>{navigate('/orderList')}}>주문목록</Nav.Link> : null
            }
            {
              nickname ? <Nav.Link onClick={()=>{navigate('/cart')}}>장바구니</Nav.Link> : null
            }
            {
              nickname ? <Nav.Link onClick={()=>{
                alert('로그아웃 하시겠습니까?');
                //dispatch(logOff());
                Logout();
              }}>로그아웃</Nav.Link> :
              <Nav.Link onClick={()=>{navigate('/join')}}>회원가입</Nav.Link>
            }
          </Nav>
        </Container>
      </Navbar> 

      <Routes>
        <Route path='/' element= {<Main/>}/>
        <Route path='/join' element={<Join/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/mypage' element={<div>마이페이지</div>}/>
        <Route path='/content/write' element={redux.isLogin.isLogin ? <ImageFile/> : <Login/>} />
        <Route path='/content' element={<Contents/>}/>
        <Route path='/content/:id'element={<Detail/>}/>
        <Route path='/content/:id/edit' element={<ContentEdit/>} />
        <Route path='/imageFile' element={<ImageFile/>}/>
        <Route path='/item/add_item' element={<AddItem/>}/>
        <Route path='/item_detail/:id' element={<ItemDetail/>} />
        <Route path='/item_detail/:id/edit' element={<ItemEdit/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orderList' element={<OrderList/>} />
      </Routes>
      
    </div>
  );
}

export default App;
