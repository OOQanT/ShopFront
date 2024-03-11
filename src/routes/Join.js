/* eslint-disable */


import { useState } from 'react';
import { Container, Nav, Navbar, Button, Form, InputGroup  } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Join(){

    let redux = useSelector((state)=>{
        return state;
    });

    let navigate = useNavigate();

    let [disableUsername,setDisableUsername] = useState(false);
    let [disableNickname,setDisableNickname] = useState(false);
    let [username,setUsername] = useState('');
    let [password,setPassword] = useState('');
    let [rePassword,setRePassword] = useState('');
    let [nickname,setNickname] = useState('');
    let [email,setEmail] = useState('');

    function nameChecker(username){
        axios.get('http://localhost:8080/join/nameChecker',{ params: { username: username } })
        .then((result)=>{
            let checked = result.data;
            if(checked == false){
                alert("사용가능한 아이디입니다.");
                setDisableUsername(true);
            }else{
                alert("이미 사용중인 아이디입니다.");
            }
        }).catch((error)=>{
            console.log(error);
            alert('잘못된 입력');
        })
      }

    function nicknameChecker(nickname){
        axios.get('http://localhost:8080/join/nicknameChecker',{params : {nickname : nickname}})
        .then((result)=>{
            let checked = result.data;
            if(checked == false){
                alert("사용가능한 닉네임입니다.");
                setDisableNickname(true);
            }else{
                alert("이미 사용중인 닉네임입니다.");
            }
        })
        .catch((error)=>{
            console.log(error);
            alert('잘못된 입력');
        })
    }

    async function joinPost(){
        await axios.post('http://localhost:8080/joinProc',{
            username: username,
            password: password,
            rePassword: rePassword,
            nickname: nickname,
            email: email
        })
        .then(()=>{
            alert('가입되었습니다.');

            navigate('/');
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    function disable(){
        if(disableUsername == true && disableNickname == true){
            return false;
        }else{
            return true;
        }
    }
    

    return(
        <div style={{height : '70%'}}>
          <h4 className="p-3 mt-3 mb-3">회원가입</h4>
           <Container style={{ width: '800px'}} className="border p-3 mt-3 mb-3">
  
            <div style={{textAlign:'left'}}>아이디</div>
            <InputGroup className="mb-5">
                <Form.Control placeholder="아이디" style={{ height: '55px' }} aria-label="Recipient's username"aria-describedby="basic-addon2" onChange={(e)=>{
                    setUsername(e.target.value);
                }}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={()=>{nameChecker(username)}}>중복확인</Button>
            </InputGroup>
            
            <div style={{textAlign:'left'}}>비밀번호</div>
            <Form.Control type='password'style={{ height: '55px' }} placeholder="비밀번호" aria-label="Recipient's username"aria-describedby="basic-addon2" className='mb-5' onChange={(e)=>{
                setPassword(e.target.value);
            }}/>
  
            <div style={{textAlign:'left'}}>비밀번호 재입력</div>
            <Form.Control type='password' style={{ height: '55px' }} placeholder="비밀번호 재입력" aria-label="Recipient's username"aria-describedby="basic-addon2" className='mb-5' onChange={(e)=>{
                setRePassword(e.target.value);
            }}/>
  

            <div style={{textAlign:'left'}}>닉네임</div>
            <InputGroup className="mb-5">
                <Form.Control type='text' style={{ height: '55px' }} placeholder="닉네임" aria-label="Recipient's username"aria-describedby="basic-addon2"  onChange={(e)=>{
                    setNickname(e.target.value);
                }}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={()=>{nicknameChecker(nickname)}}>중복확인</Button>
            </InputGroup>

  
            <div style={{textAlign:'left'}}>이메일</div>
            <Form.Control type='text' style={{ height: '55px' }} placeholder="이메일" aria-label="Recipient's username"aria-describedby="basic-addon2" className='mb-5' onChange={(e)=>{
                setEmail(e.target.value);
            }}/>
            
            <Button variant="primary" size="lg" className='mb-4' disabled={disable()} onClick={()=>{
                if(password !== rePassword){
                    alert('재입력한 비밀번호가 일치하지 않습니다.');
                    //console.log(password);
                    console.log(rePassword);
                }else{
                    joinPost();
                }

            }}>가입하기</Button>
           </Container>
        </div>
    )
  }

  export default Join;