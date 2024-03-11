/* eslint-disable */

import axios from "axios";
import { useEffect, useState } from "react";
import { Nav, InputGroup, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Main(){
    let navigate = useNavigate();

    let [items,setItems] = useState([]);
    let [itemName,setItemName] = useState('');

    async function getItems(){
        await axios.get('http://localhost:8080/item/getItems',{
          headers:{
            'Authorization' : localStorage.getItem('accessToken'),
            'Content-Type' : 'application/json'
          }
        })
        .then((action)=>{
          let response = action.data;
          setItems(response.items);
        })
        .catch((error)=>{
          let data = error.response.data;
            if(error.response.status == 403){
              console.log('미인증 요청');
            }
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
        })
    }

    async function findItemsByCondition(){
        await axios.get('http://localhost:8080/item/getItems/search',{
            params:{
                itemName: itemName
            }
        },{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            setItems(response.items);
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    
    useEffect(()=>{
        getItems();
    },[navigate])

    return(
        <div>
            <div className='main-bg'></div>
            <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <InputGroup className="mb-3 mt-3" style={{ maxWidth: '600px' }}>
                    <Form.Control placeholder="상품이름으로 검색" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e)=>{
                        setItemName(e.target.value);
                    }}/>
                    <Button variant="outline-secondary" id="button-addon2" onClick={()=>{
                        console.log(itemName);
                        if(itemName == ''){
                            alert('검색할 상품의 이름을 입력해주세요');
                        }else{
                            findItemsByCondition();
                        }
                    }}>검색</Button>
                </InputGroup>
            </div>
                <div className="row">
                    {
                        items.map((data,index)=>{
                            return(
                                <Card item={data}  navigate = {navigate} key={index}/>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

function Card(props){
    return(
        <div className="col-md-4 mt-4" onClick={()=>{
            props.navigate(`/item_detail/${props.item.id}`)
        }}>
            {
                props.item.storeFilename ? 
                <img src={`http://localhost:8080/item/itemimages/${props.item.storeFilename[0]}`} alt="../public/img/default_item_image.png" width='70%' height='70%'/> :
                <img src="/img/default_item_image.png"  width='70%' height='70%'/>
            }
            
            <h4><Nav.Link>{props.item.itemName}</Nav.Link></h4>
            <p>가격 : {props.item.price}</p>
            <p>남은수량 : {props.item.quantity}</p>
        </div>
    )
}

export default Main;