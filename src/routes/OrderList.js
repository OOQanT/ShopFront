/* eslint-disable */

import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { format } from "date-fns";


function OrderList(){

    let [data,setData] = useState([]);
    let [date,setDate] = useState([]);

    function formatDate(date) {
        return format(new Date(date), "yyyy-MM-dd HH:mm");
    }

    async function getOrders(){
        await axios.get('http://localhost:8080/order/order_list',{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            setData(response.orderList);
            
            const formattedDates = response.orderList.map(data => formatDate(data.orderTime));
            setDate(formattedDates);
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    async function cancel_order(index){
        await axios.put(`http://localhost:8080/order/${index}/cancel`,{},{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert('주문이 취소되었습니다.');
            window.location.replace('/orderList');
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }


    useEffect(()=>{
        getOrders();
    },[])

    return(
        <div>
            <Container className="mt-5">
            <h4>주문 목록</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>주문 가격</th>
                            <th>주문 시간</th>
                            <th>주문 상태</th>
                            <th>배송 상태</th>
                            <th>결제 방법</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((data,index)=>{

                                return (
                                    <tr key={index}>
                                        <td>{data.orderId}</td>
                                        <td>{data.totalPrice}</td>
                                        <td>{date[index]}</td>
                                        <td>{data.orderState}</td>
                                        <td>{data.delivery}</td>
                                        <td>{data.payment}</td>
                                        <td>
                                            {
                                                data.orderState == 'ORDER' ?
                                                <button className="deleteButton" onClick={()=>{
                                                    if(confirm('주문을 취소하시겠습니까?')){
                                                        cancel_order(data.orderId);
                                                    }
                                                }}>주문 취소</button> :
                                                <button className="deleteButton" style={{backgroundColor:'grey'}} disabled>주문 취소</button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default OrderList;