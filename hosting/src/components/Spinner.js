import React, { memo } from "react";
import PropTypes from "prop-types";

/** 로딩바 컴포넌트 */
// --> https://mhnpd.github.io/react-loader-spinner/
import { ColorRing } from "react-loader-spinner";

const Spinner = memo(({ loading, width, height }) => {
  return (
    <ColorRing
      visible={loading}
      height={width}
      width={height}
      ariaLabel="blocks-loading"
      wrapperStyle={{
        position: "fixed",
        zIndex: 9999,
        left: "50%",
        top: "50%",
        trasform: "translate(-50%, -50%)",
      }}
      wrapperClass="blocks-wrapper"
      colors={["#ede4dc", "#d6d2cf", "#adabab", "#707070", "#000000"]}
    />
  );
});
/** 기본값 정의 */
Spinner.defaultProps = {
  visible: false,
  width: 150,
  height: 150,
};

/** 데이터 타입 설정 */
Spinner.propTypes = {
  visible: PropTypes.bool.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Spinner;
