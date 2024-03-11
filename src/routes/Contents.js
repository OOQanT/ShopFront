/* eslint-disable */

import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Table, Form, Col, Row, InputGroup, Button } from "react-bootstrap";
import { addYears, format } from "date-fns";
import '../App.css';
import { useNavigate } from "react-router-dom";


function Contents(){

    let [data,setData] = useState([]);

    let [title, setTitle] = useState('');
    let [author, setAuthor] = useState('');

    let request = {title: title, nickname: author};

    let navigate = useNavigate();

    async function getContentByCondition(){
        await axios.post('http://localhost:8080/board/contents_condition',{
            title: title,
            nickname: author
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            console.log(response);
            setData(response.data);
        })
        .catch((error)=>{
           console.log(error);
        })
    }

    useEffect(()=>{
        axios.get('http://localhost:8080/board/contents',{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            console.log(response);
            setData(response.data);
        })
        .catch((error)=>{
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
        })
    },[navigate]);

    return(
        <div>
            <Container>
                <h3 style={{textAlign:'left',marginTop:'50px'}}>자유게시판</h3>
                <Form>
                    <Row className="align-items-center justify-content-end">
                        
                        <Col sm={3} className="my-1">
                            <Form.Label htmlFor="inlineFormInputName" visuallyHidden>제목</Form.Label>
                            <Form.Control id="inlineFormInputName" placeholder="제목" onChange={(e)=>{
                                setTitle(e.target.value);
                            }}/>
                        </Col>
                        <Col sm={3} className="my-1">
                        <Form.Label htmlFor="inlineFormInputGroupUsername" visuallyHidden>작성자</Form.Label>
                        <InputGroup>
                            <Form.Control id="inlineFormInputGroupUsername" placeholder="작성자" onChange={(e)=>{
                                setAuthor(e.target.value);
                            }}/>
                        </InputGroup>
                        </Col>
                        <Col xs="auto" className="my-1">
                            <Button type="button" onClick={()=>{
                                console.log(title);
                                console.log(author);
                                getContentByCondition();
                            }}>검색</Button>
                            <Button style={{textAlign:'left', marginLeft:'10px'}} onClick={()=>{
                                navigate('/content/write')
                            }}>글쓰기</Button>
                        </Col>
                    </Row>
                </Form>
                <hr style={{ height: '2px', backgroundColor: 'black'}}/>
                <Table>
                    <thead style={{backgroundColor: 'grey'}}>
                        <tr>
                            <th>No</th>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data ? data.map((data,index)=>{
                                let time = new Date(data.createTime);
                                let formattedTime = format(time,'yyyy-MM-dd');
                                return(
                                    <tr 
                                        key={index} 
                                        className="mb-10 mt-10" 
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            navigate(`/content/${data.id}`);
                                        }}
                                        onMouseEnter={(e)=>{
                                            e.currentTarget.querySelectorAll('td').forEach(td => {
                                                td.style.backgroundColor = 'rgba(128, 128, 128, 0.1)'; // 해당 행의 모든 td의 배경색 변경
                                            });
                                        }}  
                                        onMouseLeave={(e)=>{
                                            e.currentTarget.querySelectorAll('td').forEach(td => {
                                                td.style.backgroundColor = ''; // 배경색 초기화
                                            });
                                        }}>
                                        <td>{data.id}</td>
                                        <td style={{width:'750px',textAlign: 'left'}} ><div>{data.title}</div></td>
                                        <td>{data.nickname}</td>
                                        <td>{formattedTime}</td>
                                    </tr>
                                )
                            }) : <div> Loading... </div>
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Contents;