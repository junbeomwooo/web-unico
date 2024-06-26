/**
 * Redux-Slice에서 반복적으로 사용되는 처리로직을 재사용하기 위해 만든 모듈
 */
const pending = (state, { payload }) => {
    return { ...state, loading: true }
};

const fulfilled = (state, { payload }) => {
    return {
        ...state,
        data: payload.item,
        loading: false,
        error: null
    }
};

const rejected = (state, { payload }) => {

    const err = new Error();
    // 리액트 자체 서버 에러일 경우 문자열로 payload.data에 전달됌
    if (typeof payload.data === "string") {
        err.code = payload.status ? payload.status : 500;
        err.name = "React Error";
        err.message = payload.data;
    } else {
    // 자신이 만든 백엔드 에러정보에 관하여
        err.code = payload.data.rtcode;
        err.name = payload.data.rt;
        err.message = payload.data.rtmsg;
    }

    return {
        ...state,
        loading: false,
        error: err
    }
};

export { pending, fulfilled, rejected };