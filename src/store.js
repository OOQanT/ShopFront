/* eslint-disable */

import { configureStore, createSlice } from "@reduxjs/toolkit";

let member  = createSlice({
    name: 'member',
    initialState: {
        username:'',
        nickname:'',
        email:'',
        role:''
    },
    reducers:{
        setMember(state,action){
            let member = action.payload;
            state.username = member.username;
            state.nickname = member.nickname;
            state.email = member.email;
            state.role = member.role;
        }
    }
})
export let { setMember } = member.actions;

let token  = createSlice({
    name: 'token',
    initialState: {
        accessToken: '',
        refreshToken: ''
    },
    reducers:{
        setToken(state,action){
            let accessToken = action.payload;
            state.accessToken = accessToken;
        },
        setRefreshToken(state,action){
            let refreshToken = action.payload;
            state.refreshToken = refreshToken;
        }
    }
})
export let {setToken, setRefreshToken} = token.actions;

let isLogin = createSlice({
    name: 'isLogin',
    initialState:{
        'isLogin': false
    },
    reducers:{
        logOn(state){
            state.isLogin = true;
        },
        logOff(state){
            state.isLogin = false;
        }
    }
})
export let {logOn, logOff} = isLogin.actions;

export default configureStore({
    reducer:{
        member : member.reducer,
        token : token.reducer,
        isLogin : isLogin.reducer,
    }
})