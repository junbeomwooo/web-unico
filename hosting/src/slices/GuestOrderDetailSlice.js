import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

const URL = "/api/guest_order_detail";

/** 다중행 조회를 위한 함수 */
export const guestOrderGetList = createAsyncThunk(
  "GuestOrderDetailSlice/guestOrderGetList",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let array = [];

    try {
      const response = await axios.get(URL, {
        params : {
          page: payload?.page || null,
          rows: payload?.rows || null,
          email: payload?.email || null,
          orderStatus: payload?.orderStatus || null,
          orderMethod: payload?.orderMethod || null,
          startDate: payload?.startDate || null,
          endDate: payload?.endDate || null,
          sortOption: payload?.sortOption || 'desc',
          orderDateFilter: payload?.orderDateFilter,
        }
      });
      result = response.data;

       // 만약 결과값이 0보다 크다면
       if (result.item && result.item.length > 0) {
        // 반복문 돌리기
        for (let i = 0; i < result.item.length; i++) {
          const productDetailResponse = await axios.get(
            `/api/product/${result.item[i].product_prodno}`
          );
          // 반복문 결과를 배열에 넣어준다
          array.push(productDetailResponse.data.item);
        }
      }
      result.productDetails = array;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 세션에 홀딩된 값을 불러오는 함수 */
export const guestGetHoldingItem = createAsyncThunk(
  "GuestOrderDetailSlice/guestGetHoldingItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let params = null;

    try {
      const response = await axios.get("/api/guest_order_detailHolding", {
        params: params,
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 주문번호를 파라미터를 이용한 단일행 데이터 조회를 위한 비동기 함수 */
export const guestGetItemParams = createAsyncThunk(
  "OrderSlice/getItemParams",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}/${payload?.orderno}`);
      result = response.data;

      const productDetailResponse = await axios.get(
        `/api/product/${result.item.product_prodno}`
      );
      result.productDetails = productDetailResponse.data.item;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 저장을 위해 세션에 홀드만 해두는 비동기 함수 */
export const guestHoldItem = createAsyncThunk(
  "GuestOrderDetailSlice/guestHoldItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post("/api/guest_order_detailHolding", payload);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 저장을 위한 비동기 함수 */
export const guestPostItem = createAsyncThunk(
  "GuestOrderDetailSlice/guestPostItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let array = [];

    try {
      const response = await axios.post(URL, payload);
      result = response.data;

      // 만약 결과값이 0보다 크다면
      if (result.item && result.item.length > 0) {
        // 반복문 돌리기
        for (let i = 0; i < result.item.length; i++) {
          const productDetailResponse = await axios.get(
            `/api/product/${result.item[i].product_prodno}`
          );
          // 반복문 결과를 배열에 넣어준다
          array.push(productDetailResponse.data.item);
        }
      }
      result.productDetails = array;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 수정을 위한 비동기 함수 */
export const guestPutItem = createAsyncThunk(
  "GuestOrderDetailSlice/guestPutItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(`${URL}/${payload?.guest_orderno}`, payload);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 삭제를 위한 비동기 함수 */
export const guestDeleteItem = createAsyncThunk(
  "GuestOrderDetailSlice/guestDeleteItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.delete(`${URL}/:id`);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 상태 값 */
const GuestOrderDetailSlice = createSlice({
  name: "OrderSlice",
  // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
  initialState: {
    pagenation: null,
    data: null,
    productDetails: [],
    loading: false,
    error: null,
    count: null,
  },
  /** 동기시 사용할 리듀서 함수 구현 */
  reducers: {
    guestGetCurrentData: (state, action) => {
      return state;
    },
  },
  /** 비동기시 사용할 리듀서 함수 구현 ,Ajax의 처리 과정에 따라 자동으로 실행된다. */
  extraReducers: {
    /** 다중행 데이터 조회를 위한 액션함수 */
    [guestOrderGetList.pending]: pending,
    [guestOrderGetList.fulfilled]:  (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        productDetails: payload.productDetails,
        pagenation: payload.pagenation,
        count: payload.count,
        loading: false,
        error: null,
      };
    },
    [guestOrderGetList.rejected]: rejected,

    /** 세션에 홀딩된 값을 불러오는 함수 */
    [guestGetHoldingItem.pending]: pending,
    [guestGetHoldingItem.fulfilled]: fulfilled,
    [guestGetHoldingItem.rejected]: rejected,

    /** 주문번호를 파라미터를 이용한 단일행 데이터 조회를 위한 비동기 함수 */
    [guestGetItemParams.pending]: pending,
    [guestGetItemParams.fulfilled]:  (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        productDetails: payload.productDetails,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [guestGetItemParams.rejected]: rejected,

    /** 데이터를 홀드하기 위한 액션 함수 */
    [guestHoldItem.pending]: pending,
    [guestHoldItem.fulfilled]: fulfilled,
    [guestHoldItem.rejected]: rejected,

    /** 데이터 저장을 위한 액션 함수 */
    [guestPostItem.pending]: pending,
    [guestPostItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        productDetails: payload.productDetails,
        loading: false,
        error: null,
      };
    },
    [guestPostItem.rejected]: rejected,

    /** 데이터 수정을 위한 액션 함수 */
    [guestPutItem.pending]: pending,
    [guestPutItem.fulfilled]: fulfilled,
    [guestPutItem.rejected]: rejected,

    /** 데이터 삭제를 위한 액션 함수 */
    [guestDeleteItem.pending]: pending,
    [guestDeleteItem.fulfilled]: fulfilled,
    [guestDeleteItem.rejected]: rejected,
  },
});

/** 동기시 액션함수들 내보내기  */
export const { guestGetCurrentData } = GuestOrderDetailSlice.actions;
/** 리듀서 객체 내보내기 */
export default GuestOrderDetailSlice.reducer;
