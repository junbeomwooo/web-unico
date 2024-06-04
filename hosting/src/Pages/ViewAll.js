import React, { memo, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import mq from "../MediaQuery/MediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { useQueryString } from "../hooks/useQueryString";
import Pagenation from "../helper/Pagenation";
import Spinner from "../components/Spinner";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { logoutAccount } from "../slices/MemberSlice";
import { loginCheck } from "../slices/MemberSlice";
import { getItem } from "../slices/OrderDetailSlice";
const Headers = styled.div`
  padding-top: 180px;
  display: flex;
  justify-content: space-around;

  div {
    width: 35%;

    h1 {
      font-size: 19px;
    }

    hr {
      margin: 55px 0px;

      ${mq.maxWidth("md")`
        margin: 40px 0px;
    `}
    }

    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .logout {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 55px;

      ${mq.maxWidth("md")`
        margin-bottom: 40px;
    `}

      .logoutBtn {
        border: none;
        background: none;
        font-size: 18px;
        font-weight: 700;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;
const Box = styled.div`
  display: flex;

  ${mq.maxWidth("md")`
        display: block;
    `}

  .sort {
    position: absolute;
    right: 7%;
    margin-top:-2px;
    display: flex;
    flex-direction: column;
    height: ${({ sortopen }) => (sortopen === "true" ? "165px" : "20px")};
    width: 100px;
    border: 1px solid black;
    background-color: #f4f3f2;
    transition: height 0.25s ease-in-out; // 트랜지션 효과 추가

    ${mq.maxWidth("md")`
        width: 80px;
        margin-top: -20px;
    `}

${mq.maxWidth("xsm")`
        margin-top: 25px;
        width: 60px;
    `}

    button {
      border: none;
      font-weight: 500;
      background-color: #f4f3f2;
      margin-bottom: 15px;
      height: 20px;

      ${mq.maxWidth("md")`
        font-size: 12.5px;
    `}

${mq.maxWidth("xsm")`
          font-size: 11px;
    `}

      &:hover {
        cursor: pointer;
      }
    }
  }

  .navigator {
    margin-left: 7.4%;
    width: 150px;
    margin-bottom: 400px;
    ${mq.maxWidth("md")`
      width: 100%;
      margin-bottom: 0px;
    `}
    h2 {
      font-size: 15px;

      ${mq.maxWidth("md")`
      margin-top : -15px;
    `}
    }
    .links {
      display: flex;
      flex-direction: column;
      ${mq.maxWidth("md")`
      flex-direction: row;
    `}

      a {
        margin-top: 30px;
        font-size: 13px;

        ${mq.maxWidth("md")`
      margin: 10px 15px 0 0;
      font-size: 13px;
    `}

${mq.maxWidth("xsm")`
      font-size: 12px;
      margin: 10px 15px 0 0;
    `}
      }

      .active {
        text-decoration: underline;
      }
    }
  }

  .container {
    width: 100%;
    padding-left: 125px;
    padding-right: 8%;
    margin-top: 80px;
    margin-bottom: 200px;

    ${mq.maxWidth("mlg")`
      padding: 0;
      margin-top: 50px;
      margin-left: 20px;
      width: 60%;
    `}

    ${mq.maxWidth("md")`
      padding: 0;
      margin: auto;
      margin-top: 20px;
      width: 85%;
    `}

${mq.maxWidth("xsm")`
      margin-top: 40px;
    `}
    
    hr {
      margin: 40px 0;
      opacity: 30%;
      width: 100%;

      &:last-child {
        display: none;
      }
    }
    .category {
      display: flex;
      justify-content: space-between;

      width: 100%;

      h6 {
        font-size: 13px;
        font-weight: 500;
        width: 15%;
        text-align: center;
      }

      .categoryStatus {
        ${mq.maxWidth("sm")`
          display:none;
          `}
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      width: 100%;
      align-items: center;

      &:hover {
        cursor: pointer;
      }

      .numberAndDate {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 15%;
        text-align: center;

        h4 {
          font-size: 12px;
          font-weight: 400;
          text-align: center;
        }

        h5 {
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          margin-top: -13px;
        }
      }

      img {
        width: 15%;
        text-align: center;
      }

      h1 {
        font-size: 14px;
        width: 15%;
        text-align: center;
      }

      h3 {
        font-size: 13px;
        font-weight: 500;
        width: 15%;
        text-align: center;
      }

      .status {
        ${mq.maxWidth("sm")`
        display:none;
    `}
      }
    }
  }
`;
const ViewAll = memo(() => {
  /** 강제이동 함수 생성 */
  const navigate = useNavigate();

  /** 로케이션 */
  const location = useLocation();

  /** 페이지 네이션을 구현하기 위해 파라미터 받아오기 */

  const { page = 1 } = useQueryString();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const {
    data: orderData,
    pagenation,
    loading: orderLoading,
  } = useSelector((state) => state.OrderDetailSlice);

  const { isLoggedIn } = useSelector((state) => state.MemberSlice);

  // 정렬 기준 옵션을 위한 상태값
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("orderno");

  useEffect(() => {
    dispatch(loginCheck()).then(() => {
      setSortOpen(false);
      if (isLoggedIn === true) {
        dispatch(
          getItem({
            page: page,
            rows: 10,
            // 정렬 순을 위해
            sortBy: sortBy, // 정렬할 필드 지정
            sortOrder: sortOrder, // 정렬 순서 지정
          })
        );
      } else if (isLoggedIn === false) {
        // 로그인 상태를 확인
        // alert("You must be logged in to access this page.");
        // navigate("/member");
      }
    });
  }, [page, isLoggedIn, sortOrder, sortBy]);

  /** 이벤트 관리 */

  // 로그아웃 하기
  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    dispatch(logoutAccount()).then(() => {
      dispatch(loginCheck());
      navigate("/");
    });
  }, []);

  // 주문상세정보 이동
  const moveToOrderDetail = useCallback((e) => {
    const orderno = e.currentTarget.dataset.orderno;
    e.preventDefault();

    navigate(`/member_view_all/${orderno}`);
  });

  // 정렬 기준 선택
  const onClickFilter = useCallback(
    (e) => {
      setSortOpen(!sortOpen);
      console.log(sortOpen);
    },
    [setSortOpen, sortOpen]
  );

  //정렬 조건이 바뀌었을 때 페이지 번호를 1로 이동하기 위해 쿼리스트링을 변경 */
  const handlePageChange = (newPage) => {
    const { pathname, search } = location;
    // QueryString 문자열을 객체로 변환
    const params = new URLSearchParams(search);
    // params 객체에 page번호 파라미터 추가
    params.set("page", newPage);
    // params객체를 다시 QueryString 문자열로 변환
    const qs = params.toString();
    // 최종 URL을 추출
    const targetUrl = `${pathname}?${qs}`;
    navigate(targetUrl);
  };

  /** 정렬 기준 */
  // 최신 순
  const onClickNewest = useCallback((e) => {
    setSortBy("orderno");
    setSortOrder("desc");
    handlePageChange(1);
  }, []);
  //오래된 순
  const onClickOldest = useCallback((e) => {
    setSortBy("orderno");
    setSortOrder("asc");
    handlePageChange(1);
  }, []);
  // 가격 높은 순
  const onClickLowest = useCallback((e) => {
    setSortBy("tprice");
    setSortOrder("asc");
    handlePageChange(1);
  }, []);
  // 가격 낮은 순
  const onClickHighest = useCallback((e) => {
    setSortBy("tprice");
    setSortOrder("desc");
    handlePageChange(1);
  }, []);
  return (
    <>
      <Spinner loading={orderLoading} />
      <Headers>
        <div>
          <h1>My Account</h1>
          <hr />
        </div>
        <div>
          <div className="logout">
            <button className="logoutBtn" onClick={onClickLogout}>
              Logout
            </button>
          </div>
          <hr />
        </div>
      </Headers>
      <Box sortopen={sortOpen.toString()}>
        <div className="navigator">
          <h2>My Page</h2>
          <div className="links">
            <NavLink to="/member/account_setting">Information</NavLink>
            <NavLink to="/member/address_setting">Address</NavLink>
            <NavLink to="/member/password_setting">Change Password</NavLink>
            <NavLink to="/member_view_all">Track Order</NavLink>
          </div>
        </div>
        <div className="sort">
          <button onClick={onClickFilter}>Sort</button>
          {sortOpen === true && (
            <>
              <button onClick={onClickNewest} className="openButton">
                Newest
              </button>
              <button onClick={onClickOldest} className="openButton">
                Oldest
              </button>
              <button onClick={onClickLowest} className="openButton">
                Lowest Price
              </button>
              <button onClick={onClickHighest} className="openButton">
                Highest Price
              </button>
            </>
          )}
        </div>
        <div className="container">
          <div className="category">
            <h6>Order Number</h6>
            <h6>Image</h6>
            <h6>Item</h6>
            <h6>Price</h6>
            <h6>Quantity</h6>
            <h6 className="categoryStatus">Status</h6>
          </div>
          {orderData?.length > 0 ? (
            /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
            orderData.map((v, i) => {
              const productDetail = v.productDetail;

              return (
                <React.Fragment key={i}>
                  <div
                    className="content"
                    data-orderno={v?.orderno}
                    onClick={moveToOrderDetail}
                  >
                    <div className="numberAndDate">
                      <h4>{v?.order_date?.substring(0, 10)}</h4>
                      <h5>{v?.orderno}</h5>
                    </div>
                    <img
                      src={productDetail?.img1}
                      alt={productDetail?.title}
                    />
                    <h1>{productDetail?.title}</h1>
                    <h3>${v.tprice}</h3>
                    <h3>{v.quantity}</h3>
                    <h3 className="status">{v.status}</h3>
                  </div>
                  <hr />
                </React.Fragment>
              );
            })
          ) : (
            <h3 className="noProduct"> No product in my order list.</h3>
          )}
          {/* 오더리스트가 있을 경우 페이지네이션 노출 */}
          {orderData?.length > 0 && <Pagenation pagenation={pagenation} />}
        </div>
      </Box>
    </>
  );
});

export default ViewAll;
