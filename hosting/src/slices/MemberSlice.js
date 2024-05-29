import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';
import { cloneDeep } from 'lodash';

const URL = "/api/member";
/** 다중행 데이터 조회를 위한 비동기 함수 */
export const getList = createAsyncThunk('MemberSlice/getList', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(URL, {
            params: {
                page: payload?.page || 1,
                rows: payload?.rows || 15,
                query: payload?.query || '',
                gender: payload?.gender || null,
                sortOption: payload?.sortOption || null,
            }
        });
        result = response.data;
    } catch (err) {
        console.group("getList");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 단일행 데이터 조회를 위한 비동기 함수 */
export const getItem = createAsyncThunk('MemberSlice/getItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(`${URL}/${payload?.userno}`);
        result = response.data;
    } catch (err) {
        console.group("getItem");
        result = rejectWithValue(err.response);
        console.groupEnd();        
    }

    return result;
});

/** 중복 아이디 검사 */
export const checkDuplicated = createAsyncThunk('MemberSlice/checkDuplicated', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(`${URL}_checkDuplicated`, {
            params: {
                query: payload?.account
            }
        });
        result = response.data;
    } catch (err) {
        console.group("checkDuplicated");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 입력받은 비밀번호 값이 현재 로그인한 계정의 패스워드와 일치하는지 검사 */
export const checkPassword = createAsyncThunk('MemberSlice/checkPassword', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(`${URL}_checkPassword`, payload);
        result = response.data;
    } catch (err) {
        console.group("checkPassword");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});


/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk('MemberSlice/postItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(URL, payload);
        result = response.data;
    } catch (err) {
        console.group("postItem");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 자기 자신의 정보를 수정하기 위한 함수 */
export const putMyInfo = createAsyncThunk('MemberSlice/putMyInfo', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(`${URL}/change_myInfo`, payload);
        result = response.data;
    } catch (err) {
        console.group("putMyInfo");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 자기 자신의 비밀번호를 수정하기 위한 함수 */
export const putMyPassword = createAsyncThunk('MemberSlice/putMyPassword', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(`${URL}/change_password`, payload);
        result = response.data;
    } catch (err) {
        console.group("putMyPassword");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});
/** 데이터 수정을 위한 비동기 함수 */
export const putItem = createAsyncThunk('MemberSlice/putItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(`${URL}/${payload?.userno}`, payload);
        result = response.data;
    } catch (err) {
        console.group("putItem");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 로그인 되어있는 자신의 계정을 삭제하기 위한 함수 */
export const deleteMyAccount = createAsyncThunk('MemberSlice/deleteMyAccount', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.delete(`${URL}/delete_account`);
        result = response.data;
    } catch (err) {
        console.group("deleteMyAccount");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});
/** 데이터 삭제를 위한 비동기 함수 */
export const deleteItem = createAsyncThunk('MemberSlice/deleteItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.delete(`${URL}/${payload.userno}`);
        result = response.data;
    } catch (err) {
        console.group("deleteItem");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 로그인 함수 */
export const loginAccount = createAsyncThunk('MemberSlice/loginAccount', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(`${URL}/login`, payload);
        result = response.data;
    } catch (err) {
        console.group("loginAccount");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 로그아웃 함수 */
export const logoutAccount = createAsyncThunk('MemberSlice/logoutAccount', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.delete(`${URL}/login`);
        result = response.data;
    } catch (err) {
        console.group("logoutAccount");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 로그인 상태 확인 */
export const loginCheck = createAsyncThunk('MemberSlice/loginCheck', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(`${URL}/login`);
        result = response.data;
    } catch (err) {
        console.group("loginCheck");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});


/** 상태 값 */
const MemberSlice = createSlice({
    name: 'MemberSlice',
     // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
    initialState: {   
        pagenation: null,
        data: null,
        loading: false,
        error: null,
        isLoggedIn: false,
        count: null
    },
     /** 동기시 사용할 리듀서 함수 구현 */
    reducers: {   
        getCurrentData : (state, action) => {
            return state;
        }
    }, 
    /** 비동기시 사용할 리듀서 함수 구현 ,Ajax의 처리 과정에 따라 자동으로 실행된다. */
    extraReducers: {    
        /** 다중행 데이터 조회를 위한 액션함수 */
        [getList.pending]: pending,
        [getList.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                pagenation: payload.pagenation,
                count: payload.count,
                loading: false,
                error: null
            }
        },
        [getList.rejected]: rejected,

        /** 단일행 데이터 조회를 위한 액션함수 */
        [getItem.pending]: pending,
        [getItem.fulfilled]: fulfilled,
        [getItem.rejected]: rejected,

        /** 중복 아이디 조회를 위한 액션함수*/
        [checkDuplicated.pending]: pending,
        [checkDuplicated.fulfilled]: fulfilled,
        [checkDuplicated.rejected]: rejected,

        /** 입력받은 비밀번호 값이 현재 로그인한 계정의 패스워드와 일치하는지 검사  */
        [checkPassword.pending]: pending,
        [checkPassword.fulfilled]: fulfilled,
        [checkPassword.rejected]: rejected,

        /** 데이터 저장을 위한 액션 함수 */
        [postItem.pending]: pending,
        [postItem.fulfilled]: fulfilled,
        [postItem.rejected]: rejected,

        /** 자기 자신의 정보를 수정하기 위한 함수 */
        [putMyInfo.pending]: pending,
        [putMyInfo.fulfilled] : fulfilled,
        [putMyInfo.rejected] : rejected,

        /** 자기 자신의 패스워드를 수정하기 위한 함수 */
        [putMyPassword.pending]: pending,
        [putMyPassword.fulfilled] : (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                loading: false,
                error: null,
                isLoggedIn: false
            }
        },
        [putMyPassword.rejected] : rejected,

        /** 데이터 수정을 위한 액션 함수 */
        [putItem.pending]: pending,
        [putItem.fulfilled]: fulfilled,
        [putItem.rejected]: rejected,

        /** 로그인 중인 자신의 계정을 삭제하기 위한 함수 */
        [deleteMyAccount.pending]: pending,
        [deleteMyAccount.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                loading: false,
                error: null,
                isLoggedIn: false
            }
        },
        [deleteMyAccount.rejected]: rejected,
        
        /** 데이터 삭제를 위한 액션 함수 */
        [deleteItem.pending]: pending,
        [deleteItem.fulfilled]: fulfilled,
        [deleteItem.rejected]: rejected,

        /** 로그인 기능 구현 */
        [loginAccount.pending]: pending,
        [loginAccount.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                loading: false,
                error: null,
                isLoggedIn: true
            }
        },
        [loginAccount.rejected]: rejected,

        /** 로그아웃 기능 구현 */
        [logoutAccount.pending]: pending,
        [logoutAccount.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                loading: false,
                error: null,
                isLoggedIn: false
            }
        },
        [logoutAccount.rejected]: rejected,

        /** 로그인 여부 확인 기능 구현 */
        [loginCheck.pending]: pending,
        [loginCheck.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                loading: false,
                error: null,
                isLoggedIn: !!payload.item
            }
        },
        [loginCheck.rejected]: rejected,

    },
});

/** 동기시 액션함수들 내보내기  */
export const { getCurrentData } = MemberSlice.actions;
/** 리듀서 객체 내보내기 */
export default MemberSlice.reducer;