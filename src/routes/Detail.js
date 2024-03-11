/* eslint-disable */


import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Container, Form, Button, InputGroup, Image, Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import refreshToken from "../modules/refreshToken";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import '../App.css';
import Contents from "./Contents";


function Detail(){
    let {id} = useParams(); //url파라미터를 받음

    let [data,setData] = useState();

    let [formattedTime,setFormattedTime] = useState('');

    let [text,setText] = useState('');

    let [comments,setComments] = useState([]);
    let [commentDate,setCommentDate] = useState([]);

    let [edit,setEdit] = useState(-1);

    let [editComment,setEditComment] = useState('');

    let [filename,setFilename] = useState([]);
    let [images,setImages] = useState([]);

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
            console.log(action.data);
            setFilename(response.filenames);
        })
        .catch((error)=>{
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
            
            alert('게시글에 접근할 수 없습니다.');
            window.location.replace("/content");
            
        })
    }

    async function deleteContent(){
        await axios.delete(`http://localhost:8080/board/${id}/delete`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert('게시글이 삭제되었습니다.');
            navigate(`/content`);
        })
        .catch((error)=>{
            if(error.response.status){
                alert('로그인 후 이용할 수 있습니다.');
                window.location.replace("/login");
            }
            if(error.response.status == 400){
                alert('타인의 게시글은 삭제할 수 없습니다.');
            }else{
                console.log('서버 응답 코드:', error.response.status);
                console.log('서버 응답 데이터:', error.response.data);
                console.log('서버 응답 헤더:', error.response.headers);
            }
        })
    }


    useEffect(()=>{
        getContent();
        getComments();
    },[]);

    useEffect(()=>{
        if(data){
            let time = new Date(data.createTime);
            setFormattedTime(format(time,'yyyy-MM-dd'));
        }
    },[data]);

    useEffect(()=>{
        console.log(comments);

        if(comments != undefined){
            const formattedDates = comments.map(c =>{
                const time = new Date(data.createTime);
                return format(time, 'yyyy-MM-dd hh:mm');
            });
            setCommentDate(formattedDates);
        }
        

        // if(comments.length != 0){
        //     const formattedDates = comments.map((data) => {
        //         const time = new Date(data.createTime);
        //         return format(time, 'yyyy-MM-dd hh:mm');
        //     });
        //     setCommentDate(formattedDates);
        // }
    },[comments]);

    useEffect(()=>{
        setEditComment('');
    },[edit])


    const onChange = (e) =>{
        setEditComment(e.target.value);
    }

    // const token = localStorage.getItem('accessToken')?.replace('Bearer ', '');
    // const base64Payload = token.split('.')[1];
    // var payload = JSON.parse(atob(base64Payload)); //토큰 해싱값

    return(
        <div>
            <Container style={{width:'55%',marginTop:'3%'}}>
                {
                    data && formattedTime ?(
                        <Fragment>
                            
                            <h4 style={{border: '1px solid white', float: 'left', width: '33%', textAlign:'left'}}>{data.title}</h4>
                            <div style={{border: '1px solid white', float: 'left', width: '33%'}}/>
                            <div style={{border: '1px solid white', float: 'left', width: '33%',textAlign:'right', display:'flex',  justifyContent: 'flex-end',gap:'20px'}}>
                                <div>{data.author}</div>
                                <div>{formattedTime}</div>
                                <button className="editButton" onClick={()=>{
                                    navigate(`/content/${id}/edit`);
                                 }}>수정</button>
                                <button className="deleteButton" onClick={()=>{
                                    if(confirm('게시글을 삭제하시겠습니까?')){
                                        deleteContent();
                                    }
                                }}>삭제</button>
                            </div>
                            
                            
                            <br/>
                            <hr style={{border:'1px solid black'}}/>
                            <br/>

                            {
                                filename ? 
                                filename.map((data,index)=>{

                                    return(
                                        <div key={index}>
                                            <img referrerPolicy="no-referrer" src={`http://localhost:8080/board/images/${filename[index]}`}/>
                                        </div>
                                    )
                                })
                                : null 
                            }

                            <div style={{ border: '1px solid white', height: '100px', padding: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                                <p style={{textAlign:'left'}}>{data.content}</p>
                            </div>
                            
                            <br/>
                            <hr style={{border:'1px solid black'}}/>
                            
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="댓글을 입력해주세요" value={text} aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e)=>{
                                    setText(e.target.value);
                                }}/>
                                <Button variant="outline-secondary" id="button-addon2"style={{backgroundColor:'whitesmoke'}} onClick={()=>{
                                    if(text == ''){
                                        alert('댓글을 입력해주세요');
                                    }else{
                                        writeContent();
                                    }
                                }}>등록</Button>
                            </InputGroup>
                            <hr/>

                            {
                                comments ? 
                                comments.map((data,index)=>{
                                    return(
                                        <div key={index}>
                                            <div>
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <div style={{textAlign:'left',fontWeight: 'bold'}}>{data.nickname}</div>
                                                    <div style={{display:'flex', justifyContent: 'space-between'}}>
                                                        <div style={{ marginRight: '10px' }}>{commentDate[index]}</div>
                                                        <button style={{ marginRight: '10px' , backgroundColor:'white', fontWeight: 'bold', border:'none'}} onMouseEnter={(e)=>{
                                                            e.target.style.backgroundColor = 'rgba(128, 128, 128, 0.1)';
                                                        }} onMouseLeave={(e)=>{
                                                            e.target.style.backgroundColor = 'white';
                                                        }} onClick={()=>{
                                                            setEdit(index);
                                                        }}>수정</button>
                                                        <button style={{backgroundColor: 'white', fontWeight: 'bold',border:'none'}} onMouseEnter={(e)=>{
                                                            e.target.style.backgroundColor = 'rgba(128, 128, 128, 0.1)';
                                                        }} onMouseLeave={(e)=>{
                                                            e.target.style.backgroundColor = 'white';
                                                        }} onClick={()=>{
                                                            if(confirm('댓글을 삭제하시겠습니까?')){
                                                                deleteComment(data.id);
                                                            }
                                                        }}>삭제</button>
                                                    </div>
                                                </div>
                                                <div style={{textAlign:'left', marginTop:'5px', marginBottom:'5px'}}>{data.comment}</div>
                                                {
                                                    edit == index ?
                                                    <div>
                                                        <InputGroup>
                                                            <Form.Control type="text" value={editComment} placeholder="댓글을 입력해주세요." onChange={onChange}/>
                                                            <Button variant="outline-secondary" onClick={()=>{
                                                                if(editComment == ''){
                                                                    alert('댓글을 입력해주세요.');
                                                                }else{
                                                                    if(confirm('수정하시겠습니까?')){
                                                                        putComment(data.id);
                                                                    }
                                                                }
                                                            }}>수정</Button>
                                                            <Button variant="outline-secondary" onClick={()=>{
                                                                setEdit(-1);
                                                            }}>취소</Button>
                                                        </InputGroup>
                                                    </div>
                                                   
                                                    : null
                                                }
                                            </div>
                                            <hr/>
                                        </div>
                                    );
                                })
                                : 
                                // <div>Loading ... </div>
                                null
                            }
                           
                        </Fragment>
                    ) : (
                        <p>
                            Loading...
                            <button onClick={()=>{
                                        console.log(data);
                                        console.log(filename)
                                    }}>버튼</button>
                            </p>
                    )
                }
            </Container>
        </div>
    );

    async function writeContent(){
        await axios.post(`http://localhost:8080/comment/${id}/write`,{
            comment: text
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            console.log('성공');
            setText('');
            getComments();
        })
        .catch((error)=>{
            let message = error.data;
            console.log(message);
            alert(message);
            if(error.response.status){
                alert('로그인 후 이용할 수 있습니다.');
                window.location.replace("/login");
            }
        });
    }  
    
    async function getComments(){
        await axios.get(`http://localhost:8080/comment/${id}/comments`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let data = action.data;
            setComments(data.comments);
        })
        .catch((error)=>{
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
        })
    }

    async function putComment(index){
        await axios.put(`http://localhost:8080/comment/${index}/edit`,{
            comment : editComment
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            setEdit(-1);
            getComments();
            alert('수정되었습니다.');
        })
        .catch((error)=>{
            if(error.response.status){
                alert('로그인 후 이용할 수 있습니다.');
                window.location.replace("/login");
            }
            alert(error.response.data.message);
            // if(error.response.status == 404){
            //     alert('타인의 글은 수정할 수 없습니다.');
            // }
        })
    }

    async function deleteComment(index){
        await axios.delete(`http://localhost:8080/comment/${index}/delete`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            getComments();
            alert('삭제되었습니다.');
        })
        .catch((error)=>{
            if(error.response.status){
                alert('로그인 후 이용할 수 있습니다.');
                window.location.replace("/login");
            }
            if(error.response.status == 400){
                alert('타인의 댓글은 삭제할 수 없습니다.');
            }
            else if(error.response.status == 404){
                alert('존재하지 않는 댓글입니다.');
            }
        })
    }
}

export default Detail;