import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminToken: null,
        adminData: null, // Stores email, id, etc.
        loading: false
    },
    reducers: {
        adminLogin: (state, action) => {
            state.adminToken = action.payload.token;
            state.adminData = action.payload.admin; // Expecting { email, _id, ... }
            
            // Optional: Persist to localStorage automatically here if you prefer, 
            // or handle it in the component like you likely do for users.
            localStorage.setItem("adminToken", action.payload.token);
        },
        adminLogout: (state) => {
            state.adminToken = null;
            state.adminData = null;
            localStorage.removeItem("adminToken");
        },
        setAdminLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { adminLogin, adminLogout, setAdminLoading } = adminSlice.actions;

export const adminReducer = adminSlice.reducer;