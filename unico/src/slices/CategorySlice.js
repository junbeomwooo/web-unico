import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';
import { cloneDeep } from 'lodash';

const URL = "/api/category";

export const getList = createAsyncThunk('CategorySlice/getList', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(URL);

        result = response.data;
    } catch (err) {
        console.group("Category.getList");
        console.error(err);
        console.groupEnd();
        result = rejectWithValue(err.response);
    }

    return result;
});

/** 단일행 데이터 조회를 위한 비동기 함수 */
export const getItem = createAsyncThunk('CategorySlice/getItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(`${URL}/${payload?.cateno}`);
        result = response.data;
    } catch (err) {
        console.group("Category.getItem");
        console.error(err);
        console.groupEnd();
        result = rejectWithValue(err.response);
    }

    return result;
});

/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk('CategorySlice/postItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(URL, payload);
        result = response.data;
    } catch (err) {
        console.group("Category.postItem");
        console.error(err);
        console.groupEnd();
        result = rejectWithValue(err.response);
    }

    return result;
});

/** 데이터 수정을 위한 비동기 함수 */
export const putItem = createAsyncThunk('CategorySlice/putItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(`${URL}/${payload.cateno}`, payload);
        result = response.data;
    } catch (err) {
        console.group("Category.putItem");
        console.error(err);
        console.groupEnd();
        result = rejectWithValue(err.response);
    }

    return result;
});

/** 데이터 삭제를 위한 비동기 함수 */
export const deleteItem = createAsyncThunk('CategorySlice/deleteItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.delete(`${URL}/${payload.cateno}`);
        result = response.data;
    } catch (err) {
        console.group("Category.deleteItem");
        console.error(err);
        console.groupEnd();
        result = rejectWithValue(err.response);
    }

    return result;
});


/** 상태 값 */
const CategorySlice = createSlice({
    name: 'CategorySlice',
     // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
    initialState: {   
        pagenation: null,
        data: null,
        loading: false,
        error: null
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
        [getList.fulfilled]: fulfilled,
        [getList.rejected]: rejected,

        /** 단일행 데이터 조회를 위한 액션함수 */
        [getItem.pending]: pending,
        [getItem.fulfilled]: fulfilled,
        [getItem.rejected]: rejected,

        /** 데이터 저장을 위한 액션 함수 */
        [postItem.pending]: pending,
        [postItem.fulfilled]: fulfilled,
        [postItem.rejected]: rejected,

        /** 데이터 수정을 위한 액션 함수 */
        [putItem.pending]: pending,
        [putItem.fulfilled]: fulfilled,
        [putItem.rejected]: rejected,

        /** 데이터 삭제를 위한 액션 함수 */
        [deleteItem.pending]: pending,
        [deleteItem.fulfilled]: fulfilled,
        [deleteItem.rejected]: rejected,
    },
});

/** 동기시 액션함수들 내보내기  */
export const { getCurrentData } = CategorySlice.actions;
/** 리듀서 객체 내보내기 */
export default CategorySlice.reducer;