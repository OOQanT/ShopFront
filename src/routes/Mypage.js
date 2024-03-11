import axios from "axios";
import { useEffect, useState } from "react";


function Mypage(){

    let [user,setUser] = useState();

    async function getUser(){
        await axios.get(`http://localhost:8080/user`,{
            headers:{
                'Authorization' : localStorage.getItem('accessToken'),
                'Content-Type' : 'application/json'
            }
        })
        .then((action)=>{
            let response = action.data;
            setUser(response);
        })
        .catch((error)=>{
            console.log(error.response);
        })
    }

    useEffect(()=>{
        getUser();
    },[])

    return(
        <div>
            
        </div>
    );
}

export default Mypage;