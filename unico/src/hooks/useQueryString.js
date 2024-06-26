/**
 * 13단원에서 사용된 파일 재사용
 */
import { useLocation } from 'react-router-dom';

const useQueryString = (props) => {
    // QueryString 문자열 추출함
    const { search } = useLocation();
    // QueryString 문자열을 객체로 변환
    const query = new URLSearchParams(search);
    // 생성된 객체를 JSON으로 변환
    const params = Object.fromEntries(query);
    // 상태값 리턴
    return params;
};

export { useQueryString };