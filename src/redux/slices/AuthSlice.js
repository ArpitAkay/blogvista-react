import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: "",
    email: "",
    isAuthenticated: false,
    authToken: "",
    refreshToken: "",
    role: ""
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState: initialState,
    reducers: {
        updateAuth(state, action) {
            switch(action.payload.type) {
                case "LoggedIn": {
                    state.name = action.payload.state.name;
                    state.email = action.payload.state.email;
                    state.isAuthenticated = true;
                    state.authToken = action.payload.state.authToken;
                    state.refreshToken = action.payload.state.refreshToken;
                    state.role = action.payload.state.role;
                    break;
                }
                case "LoggedOut": {
                    state.name = "";
                    state.email = "";
                    state.isAuthenticated = false;
                    state.authToken = "";
                    state.refreshToken = "";
                    state.role = "";
                    break;
                }
                case "UpdateName" : {
                    state.name = action.payload.state.name;
                    break;
                }
                default : 
                    break;
            }
        }
    }
})

export const { updateAuth } = AuthSlice.actions;
export default AuthSlice.reducer;