/* eslint-disable */

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Nav} from "react-bootstrap";
import { useSelector } from "react-redux";



function ItemDetail(){

    let {id} = useParams();
    let [data,setData] = useState();
    let navigate = useNavigate();
    
    let [quantity,setQuantity] = useState(1);

    let redux = useSelector((state)=>{
        return state.member;
    });

    async function getItem(){
        await axios.get(`http://localhost:8080/item/getItems/${id}`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            setData(response);
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    async function delete_item(){
        await axios.delete(`http://localhost:8080/item/${id}/delete`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert("상품이 삭제되었습니다.");
            window.location.replace("/");
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    async function add_cart(){
        await axios.post('http://localhost:8080/cart/addItem',{
            itemId: data.id,
            quantity: quantity
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            alert('장바구니에 추가되었습니다.');
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    useEffect(()=>{
        getItem(); 
        console.log(redux.nickname);
    },[])
    
    return(
        <div>
            {
                data ? 
                <div className="mt-4">
                    <div className="row">
                        <div className="col-md-6">
                            {
                                data.filenames ?
                                <img src={`http://localhost:8080/item/itemimages/${data.filenames[0]}`} alt='../public/img/default_item_image.png' width="50%" /> :
                                <img src='/img/default_item_image.png'  width="50%" />          
                            }
                            
                        </div>
                        <div className="col-md-6 mt-7">
                            {
                                redux.nickname == data.seller ?
                                <div style={{textAlign:'right'}}>
                                    <Button style={{marginRight:'10px'}} variant="outline-secondary" onClick={()=>{
                                        navigate(`/item_detail/${id}/edit`,{state:{
                                            itemName: data.itemName,
                                            price: data.price,
                                            quantity: data.quantity,
                                            description: data.description
                                        }});
                                    }}>수정</Button>
                                    <Button style={{marginRight:'30px'}} variant="outline-danger" onClick={()=>{
                                        if(confirm("상품을 삭제 하시겠습니까?")){
                                            delete_item();
                                        }
                                    }}>삭제</Button>
                                </div>
                                : null
                            }
                            <h4 className="pt-5">{data.itemName}</h4>
                            <p>가격 : {data.price}</p>
                            <p>남은수량 : {data.quantity}</p>

                            
                            <div className="mb-3">
                                선택 수량 : {quantity}
                                <Button style={{marginLeft:'10px'}} variant="secondary" onClick={()=>{
                                    let copy = quantity + 1;
                                    setQuantity(copy);
                                }}>+</Button>
                                <Button style={{marginLeft:'5px', marginRight:'5px'}} variant="secondary" onClick={()=>{
                                    let copy = quantity - 1;
                                    setQuantity(copy);
                                    if(quantity <= 1){
                                        setQuantity(1);
                                    }
                                }}>-</Button>
                            </div>
                            

                            <button className="btn btn-danger" onClick={()=>{
                                if(quantity > data.quantity){
                                    alert("남은 수량 보다 많이 주문할 수 없습니다.");
                                    setQuantity(1);
                                }else{
                                    add_cart();
                                }
                            }}>장바구니</button> 

                            
                            <Nav variant="tabs"  defaultActiveKey="link0">
                                <Nav.Item>
                                    <Nav.Link eventKey="link0" onClick={()=>{}}>상품설명</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="mt-3">{data.description}</div>
                        </div>
                    </div>

                    

                </div> 
                
                : <div>Loading...</div>
            }
        </div>
    );
}



export default ItemDetail;