import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../scenes/features/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
});