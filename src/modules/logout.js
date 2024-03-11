import axios from 'axios';
import {logOff} from '../store.js';

async function Logout(){
    await axios.post('http://localhost:8080/api/logout',{
      headers:{
        'Authorization' : localStorage.getItem('accessToken'),
        'Content-Type' : 'application/json'
      }
    })
    .then((action)=>{
      logOff();
      localStorage.removeItem('accessToken');
      window.location.replace("/");
    })
    .catch((error)=>{
      console.log('네트워크 오류');
    })
  }

  export default Logout;