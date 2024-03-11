/* eslint-disable */

import axios from "axios";
import { logOff } from '../store.js';

async function refreshToken(request){
    axios.get('http://localhost:8080/token/refresh',{
            headers:{
              'Refresh-Token' : localStorage.getItem('refreshToken'),
              'Content-Type' : 'application/json'
            }
          })
          .then((action)=>{
            console.log('액세스토큰 재발급')
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken',action.headers['authorization']);
            request();
          })
          .catch((error)=>{
            console.log('네트워크 에러');
            console.log('서버 응답 코드:', error.response.status);
            console.log('서버 응답 데이터:', error.response.data);
            console.log('서버 응답 헤더:', error.response.headers);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            logOff();
          })
}

export default refreshToken;