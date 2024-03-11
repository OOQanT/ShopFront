/* eslint-disable */

import axios from 'axios';
import { useEffect, useState } from 'react';
import {Button, Container, Table, InputGroup, Form} from 'react-bootstrap';

function Cart(){

    let [data,setData] = useState([]);
    let [editQuantity,setEditQuantity] = useState([]);
    let [totalPirce,setTotalPrice] = useState(0);

    let [orderInfo,SetOrderInfo] = useState(false);

    let [address,setAddress] = useState('');
    let [detailAddress,setDetailAddress] = useState('');
    let [payment,setPayment] = useState('카드');

    async function getCartList(){
        await axios.get('http://localhost:8080/cart/cartList',{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data.cartList;
            setData(response);
            setEditQuantity(response.map(item => item.quantity));

            let total = response.reduce((acc, item) => acc + item.total_price, 0);
            setTotalPrice(total);
        })
        .catch((error)=>{
            if(error.response.status == 403){
                alert('인증 만료 다시 로그인해주세요.');
                window.location.replace('/login');
            }else{
                console.log(error.response);
            }
        })
    }

    const handleQuantityChange = (index, event) => {
        const newQuantity = [...editQuantity];
        newQuantity[index] = parseInt(event.target.value);
        setEditQuantity(newQuantity);
    };

    async function edit_quantity(cart_id, quantity){
        await axios.put(`http://localhost:8080/cart/${cart_id}/edit`,{
            quantity: quantity
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert('수정되었습니다.');
            window.location.replace('/cart');
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    async function delete_cart(cart_id){
        await axios.delete(`http://localhost:8080/cart/${cart_id}/delete`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert("상품이 삭제되었습니다.");
            window.location.replace('/cart');
        })
        .catch((error)=>{
            if(error.response.status == 403){
                alert('인증 만료 다시 로그인해주세요.');
                window.location.replace('/login');
            }else{
                console.error(error);
            }
        })
    }

    async function create_order(){
        await axios.post(`http://localhost:8080/order/create_Order`,{
            address: address,
            detailAddress: detailAddress,
            payment: payment
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert('상품이 주문되었습니다.')
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    
    useEffect(()=>{
        getCartList();
    },[])


    return(
        <div>
            {
                data ? 
                <Container className='mt-5'>
                    <h4>장바구니</h4>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>가격</th>
                                <th>총 가격</th>
                                <th>수량 변경</th>
                                <th>변경하기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((data,index)=>(
                                    <tr key={index}>
                                        <td>{data.cartId}</td>
                                        <td>{data.itemName}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.price}</td>
                                        <td>{data.total_price}</td>
                                        <td>
                                            <input type='text' className='quantity_edit' defaultValue={data.quantity} style={{width:'33px', marginRight:'5px'}} onChange={(e)=>{
                                                handleQuantityChange(index, e);
                                            }} />
                                            <button className='editButton' onClick={(()=>{
                                                console.log(editQuantity[index]);

                                                if(editQuantity[index] <= 0){
                                                    alert('수량은 0보다 커야 합니다.');
                                                }else{
                                                    edit_quantity(data.cartId,editQuantity[index]);
                                                }

                                            })}>수정</button>
                                        </td>
                                        <td>
                                            <button className='deleteButton' onClick={()=>{
                                                if(confirm('상품을 삭제 하시겠습니까?')){
                                                    delete_cart(data.cartId);
                                                }
                                            }}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <hr/>
                    <div style={{textAlign:'right'}}>
                        <div>
                            합계: {totalPirce} 원
                            <Button style={{marginLeft:'20px'}} onClick={()=>{
                                if(orderInfo == false){
                                    SetOrderInfo(true);
                                }else{
                                    SetOrderInfo(false);
                                }
                                
                            }}>주문정보입력</Button>
                        </div>
                    </div>
                    
                    {
                        orderInfo ? 
                        <div className='mt-5'>
                        <h4 style={{ textAlign: 'left', marginBottom: '20px' }}>배송 정보 입력</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Form.Group style={{ marginBottom: '15px', textAlign:'left' }}>
                                <Form.Label>주소 입력</Form.Label>
                                <Form.Control type="text" style={{ width: '400px' }} placeholder="주소" onChange={(e)=>{
                                    setAddress(e.target.value);
                                }}/>
                            </Form.Group>
                            <Form.Group style={{ marginBottom: '15px', textAlign:'left' }}>
                                <Form.Control type="text" style={{ width: '400px' }} placeholder="상세주소" onChange={(e)=>{
                                    setDetailAddress(e.target.value);
                                }}/>
                            </Form.Group>

                
                            <Form.Group style={{ marginBottom: '15px', textAlign:'left' }}>
                                <Form.Label>결제 방법</Form.Label>
                                <Form.Check type="radio" label="카드" value="카드" checked name="deliveryOption" id="homeAddress" onChange={(e)=>{
                                    setPayment(e.target.value);
                                }} />
                                <Form.Check  type="radio" label="무통장입금" value="bank" name="deliveryOption" id="officeAddress" onChange={(e)=>{
                                    setPayment(e.target.value);
                                }}/>
                            </Form.Group>
                            <Button onClick={()=>{
                                console.log(address);
                                console.log(detailAddress);
                                console.log(payment);

                                if(address == ''){
                                    alert('주소를 입력해주세요')
                                }else if(detailAddress == ''){
                                    alert('상세 주소를 입력해주세요');
                                }else{
                                    if(confirm('주문하시겠습니까?')){
                                        create_order();
                                    }
                                }

                            }}>주문하기</Button>
                        </div>
                        
                    </div> : null
                    }
                    
                </Container>
                :
                <div>Loading...</div>
            }
        </div>
    );
}

export default Cart;