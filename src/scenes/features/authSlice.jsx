import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from '../../api/configApi.js';

const initialState = {
    user : null,
    isError : false,
    isSuccess: false,
    isLoading: false,
    message: "",
    token: null
}

export const LoginUser = createAsyncThunk("user/LoginUser", async(user,thunkAPI) => {
    try {
        const response = await api.post (`/login`, {
            email : user.email,
            password: user.password
        });

        return response.data.token;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const loadTokenFromLocalStorage = createAsyncThunk('auth/loadTokenFromLocalStorage', async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return thunkAPI.rejectWithValue('Token not found in local storage.');
    }
});

export const getMe = createAsyncThunk("user/getMe", async(_,thunkAPI) => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const LogOut = createAsyncThunk("user/LogOut", async() => {
        await api.post('/logout');
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers:(builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            // state.user = action.payload;
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        });
        builder.addCase(LoginUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // Get User Login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;
