import {configureStore} from "@reduxjs/toolkit"
import {authReducer} from "./features/authSlice"
import { adminReducer } from "./features/adminSlice"
// we are going to redux toolkit for state management

// axios for fetch 

// react-pdftotext for extracting text from uploaded pdf file



/*
The store is like a client side database. The store is a single immutable object that stores all the application's states.
*/
export const store = configureStore({
    devTools:true,
    reducer : {
        auth: authReducer,
        admin: adminReducer  // For admin
    }
})