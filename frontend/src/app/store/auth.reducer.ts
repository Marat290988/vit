import { createReducer, on } from "@ngrx/store";
import { login, loginSuccess, loginFailed, logoutSuccess } from './auth.actions';

export const AUTH_FEATURENAME = 'auth';

export interface AuthData {
    accessToken: string;
    iat: number;
    exp: number;
    username: string;
    role: string;
    userId: string;
    email: string;
}

export interface AuthState {
    loading: boolean;
    loaded: boolean;
    serverError: string;
    authData?: AuthData;
}

const initialState: AuthState = {
    loading: false,
    loaded: true,
    serverError: ''
}

export const authReducer = createReducer(
    initialState,
    on(login, state => ({
        ...state,
        loaded: true,
        loading: true
    })),
    on(loginSuccess, (state, {authData}) => ({
        ...state,
        authData,
        loaded: true,
        loading: false,
        serverError: ''
    })),
    on(loginFailed, (state, {serverError}) => ({
        ...state,
        authData: null,
        loaded: true,
        loading: false,
        serverError
    })),
    on(logoutSuccess, () => ({
        ...initialState,
        authData: null
    }))
);