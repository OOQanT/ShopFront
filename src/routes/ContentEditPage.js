/* eslint-disable */

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, Form  } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import refreshToken from '../modules/refreshToken';

function ContentEdit(){

    let {id} = useParams(); //url파라미터를 받음

    let [data,setData] = useState();

    let [title,setTitle] = useState('');
    let [content,setContent] = useState('');

    let [selectedFiles, setSelectedFiles] = useState([]);

    let navigate = useNavigate();

    async function getContent(){
        await axios.get(`http://localhost:8080/board/contents/${id}`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            setData(response);
            setTitle(response.title);
            setContent(response.content);
        })
        .catch((error)=>{
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
            alert('게시글에 접근할 수 없습니다.');
            window.location.replace("/content");
        })
    }

    async function editContent(){
        const formData = new FormData();
        formData.append('title',title);
        formData.append('content', content);
        selectedFiles.forEach(file =>{
            formData.append('imageFiles', file);
        });
        await axios.put(`http://localhost:8080/board/${id}/edit`,formData,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((action)=>{
            alert('수정되었습니다.');
            navigate(`/content/${id}`);
        })
        .catch((error)=>{
            if(error.response.status == 400){
                console.log(error.response.data.messages[0]);
                alert("오류");
                //navigate(`/content/${id}`);
            }
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
        })
    }

    useEffect(()=>{
        getContent();
    },[navigate]);

    const handleFileChange = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    return(
        <div style={{height : '70%'}}>
            {
                data ? (<><h4 className="p-3 mt-3 mb-3">글수정</h4>
                <Container style={{ width: '800px'}} className="border p-3 mt-3 mb-3">
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <div style={{textAlign:'left'}}>제목</div>
                            <Form.Control type="text" defaultValue={data.title} onChange={(e)=>{
                                setTitle(e.target.value);
                            }}/>
                        </Form.Group>
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>다중 파일 선택</Form.Label>
                            <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <div style={{textAlign:'left'}}>내용</div>
                            <Form.Control as="textarea" rows={15} defaultValue={data.content} onChange={(e)=>{
                                setContent(e.target.value);
                            }}/>
                        </Form.Group>
                    </Form>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" onClick={()=>{
                            //console.log(title);
                            //console.log(content);
                            if(confirm('수정하시겠습니까?')){
                                editContent();
                            }
                        }}>수정</Button>
                        <Button variant="secondary" size="lg" onClick={()=>{
                            navigate(`/content/${id}`);
                        }}>취소</Button>
                    </div>
                </Container></>) : <div>Loading...</div>
            }
        </div>
    );
}

export default ContentEdit;