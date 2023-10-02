import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: "",
    email: "",
    isAuthenticated: false,
    authToken: "",
    refreshToken: "",
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState: initialState,
    reducers: {
        updateAuth(state, action) {
            switch(action.payload.type) {
                case "LoggedIn": {
                    console.log(action.payload.state);
                    state.name = action.payload.state.name;
                    state.email = action.payload.state.email;
                    state.isAuthenticated = true;
                    state.authToken = action.payload.state.authToken;
                    state.refreshToken = action.payload.state.refreshToken;
                    break;
                }
                case "LoggedOut": {
                    state.name = "";
                    state.email = "";
                    state.isAuthenticated = false;
                    state.authToken = "";
                    state.refreshToken = "";
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