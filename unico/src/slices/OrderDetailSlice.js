import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected } from "../helper/ReduxHelper";
import { cloneDeep } from "lodash";

const URL = "/api/order_detail";

/** 다중행 조회를 위한 함수 */
export const orderGetList = createAsyncThunk(
  "OrderSlice/getList",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let array = [];

    try {
      const response = await axios.get(URL, {
        params: {
          page: payload?.page || null,
          rows: payload?.rows || null,
          email: payload?.email || null,
          orderStatus: payload?.orderStatus || null,
          orderMethod: payload?.orderMethod || null,
          startDate: payload?.startDate || null,
          endDate: payload?.endDate || null,
          sortOption: payload?.sortOption || 'desc',
          orderDateFilter: payload?.orderDateFilter,
        },
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

/** 유저번호를 통한 주문내역 조회 --> Read(SELECT) */
export const getOrderItem = createAsyncThunk(
  "OrderSlice/getOrderItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}_withMemberNo/${payload?.userno}`, {
        params: {
          page: payload?.page || 1,
          rows: payload?.rows || 4,
          sortOption: payload?.sortOption || "desc",
          userno: payload?.userno,
        },
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }
    return result;
  }
);

/** 세션에 홀딩된 값을 불러오는 함수 */
export const getHoldingItem = createAsyncThunk(
  "OrderSlice/getHoldingItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    let params = null;

    try {
      const response = await axios.get("/api/order_detailHolding", {
        params: params,
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 로그인 중인 유저번호를 통한 주문내역 조회 --> Read(SELECT) */
export const getItem = createAsyncThunk(
  "OrderSlice/getItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}_memberNo`, {
        params: {
          page: payload?.page || 1,
          rows: payload?.rows || 10,
          sortBy: payload.sortBy || "orderno",
          sortOrder: payload.sortOrder || "desc",
        },
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 주문번호를 파라미터를 이용한 단일행 데이터 조회를 위한 비동기 함수 */
export const getItemParams = createAsyncThunk(
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
export const holdItem = createAsyncThunk(
  "OrderSlice/holdItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post("/api/order_detailHolding", payload);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk(
  "OrderSlice/postItem",
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
export const putItem = createAsyncThunk(
  "OrderSlice/putItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(`${URL}/${payload?.orderno}`, payload);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 상품 환불을 위한 비동기 함수 */
export const putRefundItem = createAsyncThunk(
  "OrderSlice/putRefundItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(`${URL}_refund/${payload?.orderno}`, {
        orderno: payload?.orderno,
        status: payload?.status,
      });
      result = response.data;
      console.log(result);
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 멤버일 때 아이디와 비밀번호가 일치하는 지 확인 후 주문내역 반환  */
export const trackItem = createAsyncThunk(
  "OrderSlice/trackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post(`${URL}_memberOrder`, payload);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 전달받은 아이디값을 통하여 다중행 조회 */
export const getTrackItem = createAsyncThunk(
  "OrderSlice/getTrackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get(`${URL}_memberOrder`, {
        params: {
          page: payload?.page || 1,
          rows: payload?.rows || 10,
          sortBy: payload.sortBy || "orderno",
          sortOrder: payload.sortOrder || "desc",
          account: payload?.account || null,
        },
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** (게스트) 전달받은 아이디값을 통한 경우를 위한 환불일 경우 */
export const putRefundTrackItem = createAsyncThunk(
  "OrderSlice/putRefundTrackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(
        `${URL}_memberOrder/${payload?.orderno}`,
        {
          account: payload?.account,
          orderno: payload?.orderno,
          status: payload?.status,
        }
      );
      result = response.data;
      console.log(result);
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 한 슬라이스에서 상태값을 같이 관리하는게 편하기 때문에
 * 게스트 전용 비회원 주문내역 조회를 이곳에 함께 포함함
 * 회원 주문추적시 비회원 값인 guestTrack을 null로 만들고 비회원 추적시 회원 값인 memberTrack을 null로 만들기 위해 */

/** (게스트) 전달받은 이메일을 통해 이메일이 존재하는지 확인  */
export const guestTrackItem = createAsyncThunk(
  "OrderDetailSlice/guestTrackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.post(
        "/api/guest_order_detail_guestOrder",
        payload
      );
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** (게스트) 전달받은 이메일값을 통하여 다중행 조회 */
export const guestGetTrackItem = createAsyncThunk(
  "OrderDetailSlice/guestGetTrackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.get("/api/guest_order_detail_guestOrder", {
        params: {
          page: payload?.page || 1,
          rows: payload?.rows || 10,
          sortBy: payload.sortBy || "guest_orderno",
          sortOrder: payload.sortOrder || "desc",
          email: payload?.email || null,
        },
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 전달받은 아이디값을 통한 경우를 위한 환불일 경우 */
export const guestPutRefundTrackItem = createAsyncThunk(
  "OrderSlice/guestPutRefundTrackItem",
  async (payload, { rejectWithValue }) => {
    let result = null;

    try {
      const response = await axios.put(
        `/api/guest_order_detail_guestOrder/${payload?.orderno}`,
        {
          email: payload?.email,
          orderno: payload?.orderno,
          status: payload?.status,
        }
      );
      result = response.data;
      console.log(result);
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 상태 값 */
const OrderDetailSlice = createSlice({
  name: "OrderDetailSlice",
  // 이 모듈이 관리하고자하는 상태값들을 명시(개발자 맘에따라 변수이름 변경가능)
  initialState: {
    pagenation: null,
    data: [],
    productDetails: [],
    totalOrders: [],
    loading: false,
    error: null,
    memberTrack: null,
    guestTrack: null,
    count:null,
  },
  /** 동기시 사용할 리듀서 함수 구현 */
  reducers: {
    getCurrentData: (state, action) => {
      return state;
    },
  },
  /** 비동기시 사용할 리듀서 함수 구현 ,Ajax의 처리 과정에 따라 자동으로 실행된다. */
  extraReducers: {
    /** 다중행 데이터 조회를 위한 액션함수 */
    [orderGetList.pending]: pending,
    [orderGetList.fulfilled]: (state, { payload }) => {
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
    [orderGetList.rejected]: rejected,

    /** 유저번호를 통한 단일행 데이터 조회를 위한 액션함수 */
    [getOrderItem.pending]: pending,
    [getOrderItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        pagenation: payload.pagenation,
        totalOrders: payload.totalOrders,
        loading: false,
        error: null,
      };
    },
    [getOrderItem.rejected]: rejected,

    /** 세션에 홀딩된 값을 불러오는 함수 */
    [getHoldingItem.pending]: pending,
    [getHoldingItem.fulfilled]: fulfilled,
    [getHoldingItem.rejected]: rejected,

    /** 단일행 데이터 조회를 위한 액션함수 */
    [getItem.pending]: pending,
    [getItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [getItem.rejected]: rejected,

    /** 주문번호를 파라미터를 이용한 단일행 데이터 조회를 위한 비동기 함수 */
    [getItemParams.pending]: pending,
    [getItemParams.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        productDetails: payload.productDetails,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [getItemParams.rejected]: rejected,

    /** 데이터를 홀드하기 위한 액션 함수 */
    [holdItem.pending]: pending,
    [holdItem.fulfilled]: fulfilled,
    [holdItem.rejected]: rejected,

    /** 데이터 저장을 위한 액션 함수 */
    [postItem.pending]: pending,
    [postItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        productDetails: payload.productDetails,
        loading: false,
        error: null,
      };
    },
    [postItem.rejected]: rejected,

    /** 데이터 수정을 위한 액션 함수 */
    [putItem.pending]: pending,
    [putItem.fulfilled]: fulfilled,
    [putItem.rejected]: rejected,

    /** 상품 환불을 위한 비동기 함수 */
    [putRefundItem.pending]: pending,
    [putRefundItem.fulfilled]: fulfilled,
    [putRefundItem.rejected]: rejected,

    /** 멤버일 때 아이디와 비밀번호가 일치하는 지 확인 후 주문내역 반환  */
    [trackItem.pending]: pending,
    [trackItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        memberTrack: payload.memberTrack,
        guestTrack: null,
        loading: false,
        error: null,
      };
    },
    [trackItem.rejected]: rejected,

    /** 전달받은 아이디값을 통하여 다중행 조회 */
    [getTrackItem.pending]: pending,
    [getTrackItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [getTrackItem.rejected]: rejected,

    /** 전달받은 아이디값을 통한 경우를 위한 환불일 경우 */
    [putRefundTrackItem.pending]: pending,
    [putRefundTrackItem.fulfilled]: fulfilled,
    [putRefundTrackItem.rejected]: rejected,

    /** 한 슬라이스에서 상태값을 같이 관리하는게 편하기 때문에
     * 게스트 전용 주문내역 조회를 이곳에 함께 포함함  */

    /** (게스트) 전달받은 이메일을 통해 이메일이 존재하는지 확인 */
    [guestTrackItem.pending]: pending,
    [guestTrackItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        guestTrack: payload.guestTrack,
        memberTrack: null,
        loading: false,
        error: null,
      };
    },
    [guestTrackItem.rejected]: rejected,

    /** (게스트) 전달받은 아이디값을 통하여 다중행 조회 */
    [guestGetTrackItem.pending]: pending,
    [guestGetTrackItem.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        data: payload.item,
        pagenation: payload.pagenation,
        loading: false,
        error: null,
      };
    },
    [guestGetTrackItem.rejected]: rejected,

    /** (게스트) 전달받은 아이디값을 통한 경우를 위한 환불일 경우 */
    [guestPutRefundTrackItem.pending]: pending,
    [guestPutRefundTrackItem.fulfilled]: fulfilled,
    [guestPutRefundTrackItem.rejected]: rejected,
  },
});

/** 동기시 액션함수들 내보내기  */
export const { getCurrentData } = OrderDetailSlice.actions;
/** 리듀서 객체 내보내기 */
export default OrderDetailSlice.reducer;
