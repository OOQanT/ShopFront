/* eslint-disable */

import { useState } from 'react';
import { Container, Nav, Navbar, Button, Form  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login(){


    let navigate = useNavigate();

    let [username,setUsername] = useState('');
    let [password,setPassword] = useState('');

    async function loginPost(){
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        await axios.post('http://localhost:8080/login',formData)
        .then((response)=>{
            if(response.status >= 200 && response.status < 300){
                const accessToken = response.headers['authorization'];
                console.log(accessToken);
                
                localStorage.setItem('accessToken',accessToken);
                window.location.replace("/");
            }else{
                alert("아이디나 비밀번호를 확인해주세요");
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    return(
        <div style={{height : '70%'}}>
            <h4 className="p-3 mt-3 mb-3">로그인</h4>
            <Container style={{ width: '800px'}} className="border p-3 mt-3 mb-3">
                <Form>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Control type="text" placeholder="Enter id" style={{ height: '55px' }} onChange={(e)=>{
                            setUsername(e.target.value);
                        }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Control type="password" placeholder="Password" style={{ height: '55px' }} onChange={(e)=>{
                            setPassword(e.target.value);
                        }}/>
                    </Form.Group>
                </Form>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={()=>{
                        if(username == ''){
                            alert('아이디를 입력해주세요');
                        }else if(password == ''){
                            alert('비밀번호를 입력해주세요');
                        }else{
                            loginPost();
                        }
                    }}>로그인</Button>
                    <Button variant="secondary" size="lg" onClick={()=>{
                        navigate('/join');
                    }}>회원 가입</Button>
                </div>
            </Container>
        </div>
        
    )
}

export default Login;