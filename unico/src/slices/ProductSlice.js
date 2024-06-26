import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

const URL = "/api/product";

/** (인피니티스크롤)다중행 조회 */
export const getList = createAsyncThunk(
  "ProductSlice/getList",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(URL, {
        params: {
          query: payload?.query || "",
          page: payload?.page || 1,
          sub_category_subcateno: payload?.subcate || null,
          sortBy: payload.sortBy || "prodno",
          sortOrder: payload.sortOrder || "desc",
        },
      });
      result = response.data;
    } catch (err) {
      console.group("getList");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** (페이지네이션)다중행 조회 */
export const getListwithPage = createAsyncThunk(
  "ProductSlice/getListwithPage",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}_pagenation`, {
        params: {
          query: payload?.query || "",
          page: payload?.page || 1,
          rows: payload?.rows || 6, 
          sub_category_subcateno: payload?.subcate || null,
          sortOption: payload.sortOption || "desc",
        },
      });
      result = response.data;
    } catch (err) {
      console.group("getListwithPage");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** 단일행 데이터 조회를 위한 비동기 함수 */
export const getItem = createAsyncThunk(
  "ProductSlice/getItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}/${payload?.prodno}`);
      result = response.data;
    } catch (err) {
      console.group("getItem");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk(
  "ProductSlice/postItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post(URL, payload);
      result = response.data;
    } catch (err) {
      console.group("postItem");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** 데이터 수정을 위한 비동기 함수 */
export const putItem = createAsyncThunk(
  "ProductSlice/putItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(`${URL}/${payload?.prodno}`, payload);
      result = response.data;
    } catch (err) {
      console.group("putItem");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** 데이터 삭제를 위한 비동기 함수 */
export const deleteItem = createAsyncThunk(
  "ProductSlice/deleteItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.delete(`${URL}/${payload?.prodno}`);
      result = response.data;
    } catch (err) {
      console.group("deleteItem");
      console.error(err);
      result = rejectWithValue(err.response);
      console.groupEnd();
    }

    return result;
  }
);

/** 상태 값 */
const ProductSlice = createSlice({
  name: "ProductSlice",
  // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
  initialState: {
    pagenation: null,
    data: null,
    loading: false,
    error: null,
    count: null,
  },
  /** 동기시 사용할 리듀서 함수 구현 */
  reducers: {
    getCurrentData: (state, action) => {
      return state;
    },
  },
  /** 비동기시 사용할 리듀서 함수 구현 ,Ajax의 처리 과정에 따라 자동으로 실행된다. */
  extraReducers: {
    /** (인피니티스크롤)다중행 조회 */
    [getList.pending]: pending,
    [getList.fulfilled]: (state, { payload }) => {
      return {
        data: payload.item,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [getList.rejected]: rejected,

    /** (페이지네이션)다중행 조회 */
    [getListwithPage.pending]: pending,
    [getListwithPage.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        pagenation: payload.pagenation,
        count: payload.count,
        loading: false,
        error: null,
      };
    },
    [getListwithPage.rejected]: rejected,

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
export const { getCurrentData } = ProductSlice.actions;
/** 리듀서 객체 내보내기 */
export default ProductSlice.reducer;
