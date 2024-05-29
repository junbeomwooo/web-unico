import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { pending, fulfilled, rejected } from '../helper/ReduxHelper';
import { cloneDeep } from 'lodash';

const URL = "/api/guest_cart";

export const guestGetList = createAsyncThunk('GuestCartSlice/guestGetList', async (payload, { rejectWithValue }) => {
    let result = null;

    // 빈 배열 
    let array = [];

    try {
        const response = await axios.get(URL, payload);
        result = response.data;
        // 만약 결과값이 0보다 크다면
        if(result.item && result.item.length > 0) {
        // 반복문 돌리기
        for (let i=0; i < result.item.length; i++) {
            const productDetailResponse = await axios.get(`/api/product/${result.item[i].product_prodno}`)
            // 반복문 결과를 배열에 넣어준다
            array.push(productDetailResponse.data.item)
        }}
        result.productDetails = array
    } catch (err) {
        console.group("getList");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});


/** 데이터 저장을 위한 비동기 함수 */
export const guestPostItem = createAsyncThunk('GuestCartSlice/guestPostItem', async (payload, { rejectWithValue }) => {
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

    /** 데이터 수정을 위한 비동기 함수 */
export const guestPutItem = createAsyncThunk('GuestCartSlice/guestPutItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(URL, payload);
        result = response.data;
    } catch (err) {
        console.group("putItem");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});

/** 카트 정보를 삭제하기 위한 비동기 함수 */
export const guestDeleteItem = createAsyncThunk('GuestCartSlice/guestDeleteItem', async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.put(`${URL}/delete`, payload);
        result = response.data;
    } catch (err) {
        console.group("deleteItem");
        result = rejectWithValue(err.response);
        console.groupEnd();
    }

    return result;
});


/** 상태 값 */
const GuestCartSlice = createSlice({
    name: 'GuestCartSlice',
    // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
    initialState: {   
        pagenation: null,
        data: null,
        loading: false,
        error: null,
        productDetails: [],
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
        [guestGetList.pending]: pending,
        [guestGetList.fulfilled]: (state, { payload }) => {
            return {
                ...state,
                data: payload.item,
                productDetails: payload.productDetails,
                loading: false,
                error: null
            }
        },
        [guestGetList.rejected]: rejected,

        /** 데이터 저장을 위한 액션 함수 */
        [guestPostItem.pending]: pending,
        [guestPostItem.fulfilled]: fulfilled,
        [guestPostItem.rejected]: rejected,

        /** 데이터 수정을 위한 액션 함수 */
        [guestPutItem.pending]: pending,
        [guestPutItem.fulfilled]: fulfilled,
        [guestPutItem.rejected]: rejected,

        /** 데이터 수정을 위한 액션 함수 */
        [guestDeleteItem.pending]: pending,
        [guestDeleteItem.fulfilled]: fulfilled,
        [guestDeleteItem.rejected]: rejected,
        
    },
});

/** 동기시 액션함수들 내보내기  */
export const { getCurrentData } = GuestCartSlice.actions;
/** 리듀서 객체 내보내기 */
export default GuestCartSlice.reducer;