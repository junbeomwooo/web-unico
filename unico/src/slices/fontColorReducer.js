// 액션 타입 정의
const UPDATE_COLOR = 'UPDATE_COLOR';

// 초기 상태 정의
const initialState = {
  fontColor: '#000000', // 초기 폰트 색상
};

// 리듀서 함수
const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COLOR:
      return {
        ...state,
        fontcolor: action.payload,
      };
    default:
      return state;
  }
};

// 액션 생성자 함수
export const updateColor = (color) => {
  return {
    type: UPDATE_COLOR,
    payload: color,
  };
};

export default colorReducer;