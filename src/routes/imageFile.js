/* eslint-disable */

import axios from 'axios';
import { useState } from 'react';
import { Container, Nav, Navbar, Button, Form  } from 'react-bootstrap';

function ImageFile(){
    
    let [title,setTitle] = useState('');
    let [content,setContent] = useState('');
    let [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    const write = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            selectedFiles.forEach(file => {
                formData.append('imageFiles', file);
            });

            const response = await axios.post(
                'http://localhost:8080/board/write',
                formData,
                {
                    headers:{
                        'Authorization' : localStorage.getItem('accessToken'),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            alert('글을 등록했습니다.');
            window.location.replace("/content");
        } catch (error) {
            if (error.response) {
                console.log('서버 응답 코드:', error.response.status);
                console.log('서버 응답 데이터:', error.response.data);
                console.log('서버 응답 헤더:', error.response.headers);
            }
            alert('내용을 입력해주세요.');
        }
    };

    return(
        <div style={{height : '70%'}}>
            <h4 className="p-3 mt-3 mb-3">글작성</h4>
            <Container style={{ width: '800px'}} className="border p-3 mt-3 mb-3">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <div style={{textAlign:'left'}}>제목</div>
                        <Form.Control type="text" onChange={(e)=>{setTitle(e.target.value)}}/>
                    </Form.Group>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <div style={{textAlign:'left'}}>이미지</div>
                        <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <div style={{textAlign:'left'}}>내용</div>
                        <Form.Control as="textarea" rows={15} onChange={(e)=>{setContent(e.target.value)}}/>
                    </Form.Group>
                </Form>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={()=>{
                         if(title !== '' && content !== ''){
                            console.log(title);
                            console.log(content);
                            console.log(selectedFiles);
                            write();
                        } else {
                            alert('내용을 입력해주세요.');
                        }
                    }} >글작성</Button>
                    <Button variant="secondary" size="lg">취소</Button>
                </div>
            </Container>
        </div>
    )
}

export default ImageFile;