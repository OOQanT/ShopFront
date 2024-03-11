/* eslint-disable */

import axios from 'axios';
import { useState } from 'react';
import { Container, Nav, Navbar, Button, Form  } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';

function ItemEdit(){
    let {id} = useParams();

    const location = useLocation();
    let itemInfo = {...location.state};

    let [itemName,setItemName] = useState(itemInfo.itemName);
    let [price, setPrice] = useState(itemInfo.price);
    let [quantity, setQuantity] = useState(itemInfo.quantity);
    let [description,setDescription] = useState(itemInfo.description);
    let [selectedFiles, setSelectedFiles] = useState([]);


    const handleFileChange = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    async function edit_item(){
        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('description', description);
        selectedFiles.forEach(file => {
            formData.append('itemImages', file);
        });
        await axios.put(`http://localhost:8080/item/${id}/edit`,formData,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((action)=>{
            alert("상품이 수정 되었습니다.");
            window.location.replace("/");
        })
        .catch((error)=>{
            console.log(error.response);
            console.error(error);
            // if(error.response.status){
            //     alert('로그인 후 이용할 수 있습니다.');
            //     window.location.replace("/login");
            // }
        })
    }

    return (
        <div style={{height : '70%'}}>
            <h4 className="p-3 mt-3 mb-3">상품 수정</h4>
            <Container style={{ width: '800px'}} className="border p-3 mt-3 mb-3">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <div style={{textAlign:'left'}}>상품 이름</div>
                        <Form.Control type="text" value={itemName} onChange={(e)=>{
                                setItemName(e.target.value);
                            }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <div style={{textAlign:'left'}}>가격</div>
                        <Form.Control type="text" value={price} onChange={(e)=>{
                                setPrice(e.target.value);
                            }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <div style={{textAlign:'left'}}>수량</div>
                        <Form.Control type="text" value={quantity} onChange={(e)=>{
                                setQuantity(e.target.value);
                            }}/>
                    </Form.Group>
                    <Form.Group controlId="formFileMultiple" className="mb-2">
                    <div style={{textAlign:'left'}}>상품 이미지</div>
                        <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <div style={{textAlign:'left'}}>상품설명</div>
                        <Form.Control as="textarea" rows={15} value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
                    </Form.Group>
                </Form>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={()=>{
                        //console.log(itemName);
                        //console.log(price);
                        //console.log(quantity);
                        //console.log(description);
                        console.log(selectedFiles);

                        
                        if(itemName == ''){
                            alert("상품명을 입력해주세요");
                        }else if(price == null){
                            alert("가격을 입력해주세요");
                        }else if(quantity == null){
                            alert("수량을 입력해주세요");
                        }else{
                            edit_item();
                        }

                    }} >수정</Button>
                    <Button variant="secondary" size="lg">취소</Button>
                </div>
            </Container>
        </div>
    );
}

export default ItemEdit;