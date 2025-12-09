import { createSlice } from "@reduxjs/toolkit";

/*
using the reducer function from redux toolkit to create a slice for authentication.

login, logout, setLoading for managing authentication state. we will getting token and user info from backend api and storing it in the redux store, with the help of the authSlice.


And one more thing, the login doesnt represent the actual login process, its just an action to set the user and token in the redux store after successful login. So, when the user logs in successfully, we dispatch the login action with the token and user data received from the backend through frontend to update the auth state in the store.

*/

const authSlice= createSlice({
    name:'auth',
    initialState:{
        token: null,
        user:null,  //this user is an object containing all user details
        loading:true
    },
    reducers:{
        login:(state,action)=>{
            state.token = action.payload.token
            state.user= action.payload.user
        },
        logout:(state)=>{
            state.token = "",
            state.user = null
            localStorage.removeItem("token")
        },
        setLoading:(state,action)=>
        {
            state.loading= action.payload
        }
    }
})



export const {login,logout,setLoading} = authSlice.actions

export const authReducer = authSlice.reducer