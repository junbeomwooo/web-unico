import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryString } from "../../hooks/useQueryString";
import { orderGetList, putItem } from "../../slices/OrderDetailSlice";
import {
  guestOrderGetList,
  guestPutItem,
} from "../../slices/GuestOrderDetailSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import mq from "../../MediaQuery/MediaQuery";

import Spinner from "../../components/Spinner";
import ErrorView from "../../components/ErrorView";
import Pagenation from "../../helper/Pagenation";

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 100%;
  height: 1600px;
  margin-left: 250px;

  ${mq.maxWidth("md")`
      margin-left: 0;
      padding: 30px 20px;
    `}

  hr {
    border: 0.5px solid #212b34;
    margin-top: 20px;

    ${mq.maxWidth("md")`
      margin-top: 100px;
      `}
  }

  .header {
    display: flex;
    justify-content: center;
    margin: 10px 0;

    ${mq.maxWidth("md")`
      display:none
      `}
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #212b34;
    }
  }

  .orderCount {
    h6 {
      font-size: 13px;
      font-weight: 400;
    }
  }

  .search {
    display: flex;
    justify-content: center;

    ${mq.maxWidth("md")`
      display:block
      `}

    .classfication {
      margin: 20px 0;

      .searchEmail {
        display: flex;
        align-items: center;

        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        input {
          height: 16px;
          width: 248px;
          margin-left: 10px;
        }
      }

      .memberOrGuest {
        display: flex;
        align-items: center;
        margin-top: -20px;
        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        label {
          margin-left: 10px;
          font-size: 14px;
        }
      }
      .class {
        display: flex;
        align-items: center;
        margin-top: -20px;

        h4 {
          font-weight: 400;
          font-size: 14px;

          ${mq.maxWidth("md")`
            margin: 50px 0 0 -90px;
            color: white;
      `}
        }

        select {
          margin-left: 10px;
        }
      }

      .date {
        display: flex;
        align-items: center;
        margin-top: -20px;
        h4 {
          font-weight: 400;
          font-size: 14px;
          margin-right: 10px;

          ${mq.maxWidth("md")`
            margin: 30px 0 0 -70px;
            color: white;
      `}
        }
      }

      .orderSort {
        display: flex;
        align-items: center;
        margin-top: -20px;
        ${mq.maxWidth("md")`
            margin-top: -10px;
      `}

        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        select {
          margin-left: 10px;
        }
      }

      .searchButtons {
        margin: 10px 0;
        display: flex;
        justify-content: center;
        button {
          margin: 0 5px;
        }
      }
    }
  }

  .table {
    border-collapse: collapse;
    border-top: 3px solid #168;
    font-size: 14px;
    text-align: center;
    margin: auto;
    width: 100%;
    margin-top: 25px;

    ${mq.maxWidth("xl")`
      font-size: 10px;
      `}

    ${mq.maxWidth("lg")`
      display:none
      `}

      th {
      color: #168;
      background: #f0f6f9;
      padding: 10px;
      border: 1px solid #ddd;

      ${mq.maxWidth("xl")`
        padding: 2px;
      `}

      &:first-child {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }

    td {
      padding: 10px;
      border: 1px solid #ddd;

      ${mq.maxWidth("xl")`
        padding: 3px;
      `}

      &:first-child {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }
  }

  .mobileTable {
    border-collapse: collapse;
    border-top: 3px solid #168;
    font-size: 14px;
    text-align: center;
    margin: auto;
    width: 100%;
    margin-top: 25px;

    ${mq.maxWidth("xl")`
      font-size: 10px;
      `}

    ${mq.maxWidth("md")`
      font-size: 7px;
      `}

      ${mq.minWidth("lg")`
      display:none
      `}

      th {
      color: #168;
      background: #f0f6f9;
      padding: 10px;
      border: 1px solid #ddd;

      ${mq.maxWidth("xl")`
        padding: 2px;
      `}

      &:first-child {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }

    td {
      padding: 10px;
      border: 1px solid #ddd;

      select {
        ${mq.maxWidth("md")`
            width: 60px;
            font-size: 10px;
      `}
      }

      button {
        ${mq.maxWidth("md")`
            width: 60px;
            height: 17px;
            margin-top: 5px;
            font-size: 10px;
      `}
      }

      img {
        width: 70px;

        ${mq.maxWidth("xl")`
          width: 30px;
      `}
      }

      ${mq.maxWidth("xl")`
        padding: 2px;
      `}

      &:first-child {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }
  }
`;

const Select = styled.select`
  color: ${(props) =>
    props.value ? "#000" : "#999"}; // 선택 여부에 따라 색상 변경
`;

const DatePickerContainer = styled.div`
  margin-right: 10px; // 오른쪽 마진을 원하는 크기로 조절
  .react-datepicker__input-container {
    input {
      ${mq.maxWidth("md")`
        width: 100px;
    `}
    }
  }
`;
const OrderManagemet = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();

  // 로케이션 함수 생성
  const location = useLocation();

  /** 페이지네이션 구현을 위한 QueryString 변수 받기 */
  const { page = 1 } = useQueryString();

  /** 리덕스 초기화 */
  const dispatch = useDispatch();

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
    pagenation: orderPagenation,
    count: orderCount,
  } = useSelector((state) => state.OrderDetailSlice);

  const {
    data: guestOrderData,
    loading: guestOrderLoading,
    error: guestOrderError,
    pagenation: guestOrderPagenation,
    count: guestOrderCount,
  } = useSelector((state) => state.GuestOrderDetailSlice);
  /** 참조 변수 생성 */

  // 검색어값을 가져오기 위한 참조변수 추가
  const searchRef = useRef("");

  /** 체크박스 상태값 */
  const [checkBoxchecked, setCheckBoxChecked] = useState("member");

  /** submit시 선택된 멤버여부 값 */
  const [checkmember, setCheckMember] = useState(true);

  /** 주문상태 드롭다운 상태값 */
  const [orderStatus, setOrderStatus] = useState("");

  /** 결제방법 드롭다운 상태값 */
  const [orderMethod, setOrderMethod] = useState("");

  /** 날짜 선택 상태값 */
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /** sort 드롭다운 상태값 */
  const [sortOption, setSortOption] = useState("desc");

  /** (회원) 주문상태 상태값 */
  const [selectedStatus, setSelectedStatus] = useState({});

  /** (비회원) 주문상태 상태값 */
  const [guestSelectedStatus, setGuestSelectedStatus] = useState({});

  /** 페이지 로드시 렌더링 (의존성 값이 바뀔때마다 재렌더링) */
  useEffect(() => {
    // 값이 all이라면 빈값으로 변환
    const sumbitOrderStatus = orderStatus === "all" ? "" : orderStatus;
    const submitOrderMethod = orderMethod === "all" ? "" : orderMethod;

    // date객체를 원하는 형식으로 변환
    const submitStartDate = startDate?.toISOString().split("T")[0];
    const submittedEndDate = endDate?.toISOString().split("T")[0];
    dispatch(
      orderGetList({
        page: page,
        rows: 8,
        email: searchRef?.current?.value,
        orderStatus: sumbitOrderStatus,
        orderMethod: submitOrderMethod,
        startDate: submitStartDate,
        endDate: submittedEndDate,
        sortOption: sortOption,
      })
    );
    dispatch(
      guestOrderGetList({
        page: page,
        rows: 8,
        email: searchRef?.current?.value,
        orderStatus: sumbitOrderStatus,
        orderMethod: submitOrderMethod,
        startDate: submitStartDate,
        endDate: submittedEndDate,
        sortOption: sortOption,
      })
    );
  }, [page, dispatch]);
  /** 이벤트 목록 */

  // 체크박스 이벤트
  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(e.currentTarget.value);
  });

  // 버튼 초기화 버튼
  const onClickInitalize = useCallback((e) => {
    searchRef.current.value = "";
    setOrderStatus("");
    setOrderMethod("");
    setStartDate(null);
    setEndDate(null);
    setSortOption("desc");
  });

  // 검색조건 및 정렬 제출 핸들러
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // 값이 all이라면 빈값으로 변환
      const sumbitOrderStatus = orderStatus === "all" ? "" : orderStatus;
      const submitOrderMethod = orderMethod === "all" ? "" : orderMethod;

      // date객체를 원하는 형식으로 변환
      const submitStartDate = startDate?.toISOString().split("T")[0];
      const submittedEndDate = endDate?.toISOString().split("T")[0];

      if (checkBoxchecked === "member") {
        setCheckMember(true);
        dispatch(
          orderGetList({
            // 페이지
            page: 1,
            // 페이지 당 보여줄 수
            rows: 8,
            // 이메일 검색
            email: searchRef?.current?.value,
            // 주문 상태별 검색
            orderStatus: sumbitOrderStatus,
            // 결제 방법 별 검색
            orderMethod: submitOrderMethod,
            // 특정 기간 조회
            startDate: submitStartDate,
            endDate: submittedEndDate,
            // 정렬 기준
            sortOption: sortOption,
          })
        );
      } else if (checkBoxchecked === "guest") {
        setCheckMember(false);
        dispatch(
          guestOrderGetList({
            // 페이지
            page: 1,
            // 페이지 당 보여줄 수
            rows: 8,
            // 이메일 검색
            email: searchRef?.current?.value,
            // 주문 상태별 검색
            orderStatus: sumbitOrderStatus,
            // 결제 방법 별 검색
            orderMethod: submitOrderMethod,
            // 특정 기간 조회
            startDate: submitStartDate,
            endDate: submittedEndDate,
            // 정렬 기준
            sortOption: sortOption,
          })
        );
      }
      /** 정렬 조건이 바뀌었을 때 페이지 번호를 1로 이동하기 위해 쿼리스트링을 변경 */
      const { pathname, search } = location;
      // QueryString 문자열을 객체로 변환
      const params = new URLSearchParams(search);
      // params 객체에 page번호 파라미터 추가
      params.set("page", 1);
      // params객체를 다시 QueryString 문자열로 변환
      const qs = params.toString();
      // 최종 URL을 추출
      const targetUrl = `${pathname}?${qs}`;
      navigate(targetUrl);
    },
    [
      checkBoxchecked,
      dispatch,
      orderStatus,
      orderMethod,
      endDate,
      startDate,
      sortOption,

      location,
      navigate,
    ]
  );

  // 클릭시 회원 전용 주문 상세 페이지 이동
  const onClickMoveToDetail = useCallback((e, orderno) => {
    e.preventDefault();

    // 쿼리스트링을 통해 멤버 주문을 상세 조회하는지 안하는지 판별
    navigate(`/admin/order_management/${orderno}?member=true`);
  });

  // 클릭시 비회원 전용 주문 상세 페이지 이동
  const onClickMoveToGuestDetail = useCallback((e, guest_orderno) => {
    e.preventDefault();

    console.log(guest_orderno);
    // 쿼리스트링을 통해 멤버 주문을 상세 조회하는지 안하는지 판별
    navigate(`/admin/order_management/${guest_orderno}?member=false`);
  });

  // 회원 전용 상품 주문 상태 바꾸기
  const EditStatus = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    // 주문번호 가져오기
    const orderno = current.dataset.orderno;

    // State를 통해 해당 orderNo에 대한 선택된 값 가져오기
    const selectedValue = selectedStatus[orderno];

    // 해당하는 orderno값에 변경된 게 없다면 그냥 리턴
    if (!selectedValue) {
      return;
    }

    dispatch(
      putItem({
        orderno: orderno,
        status: selectedValue,
      })
    ).then(({ payload }) => {
      if (payload.rtcode === 200) {
        window.alert("Order status has been successfully updated.");
        navigate(`/admin/order_management/${payload.item.orderno}?member=true`);
      }
    });
  });

  // 비회원 전용 상품 주문 상태 바꾸기
  const guestEditStatus = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    // 주문 번호 가져오기
    const orderno = current.dataset.guestno;

    // State를 통해 해당 guest_orderno에 대한 선택된 값 가져오기
    const selectedValue = guestSelectedStatus[orderno];

    // 해당하는 guest_orderno값에 변경된 게 없다면 그냥 리턴
    if (!selectedValue) {
      return;
    }

    dispatch(
      guestPutItem({
        guest_orderno: orderno,
        status: selectedValue,
      })
    ).then(({ payload }) => {
      if (payload.rtcode === 200) {
        window.alert("Order status has been successfully updated.");
        navigate(
          `/admin/order_management/${payload.item.guest_orderno}?member=false`
        );
      }
    });
  });

  return (
    <>
      <Spinner loading={orderLoading || guestOrderLoading} />
      {orderError || guestOrderError ? (
        <ErrorView error={orderError || guestOrderError} />
      ) : (
        <Container>
          <div className="header">
            <h1>Order Management</h1>
          </div>
          <hr />
          <div className="orderCount">
            <h6>
              Total : {orderCount + guestOrderCount} | Member : {orderCount} |
              Non-member : {guestOrderCount}
            </h6>
          </div>
          <form className="search" onSubmit={handleSearchSubmit}>
            <div className="classfication">
              <div className="searchEmail">
                <h4>Email:</h4>
                <input type="text" ref={searchRef} />
              </div>
              <div className="memberOrGuest">
                <h4>Member status:</h4>
                <label>
                  <input
                    type="checkbox"
                    value="member"
                    checked={checkBoxchecked === "member"}
                    onChange={onChangeCheckBox}
                  />
                  Member
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="guest"
                    checked={checkBoxchecked === "guest"}
                    onChange={onChangeCheckBox}
                  />
                  Non-member
                </label>
              </div>
              <div className="class">
                <h4>Classfication:</h4>
                <div className="dropDown">
                  <Select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Select Order Status
                    </option>
                    <option value="all">All</option>
                    <option value="Payment Verification">
                      Payment Verification
                    </option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Order Preparation">Order Preparation</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Refund Processing">Refund Processing</option>
                    <option value="Refund Completed">Refund Completed</option>
                  </Select>
                </div>
                <div className="dropDown">
                  <Select
                    value={orderMethod}
                    onChange={(e) => setOrderMethod(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Select Order Method
                    </option>
                    <option value="all">All</option>
                    <option value="card">Card</option>
                    <option value="paypal">Paypal</option>
                    <option value="transfer">Transfer</option>
                  </Select>
                </div>
              </div>
              <div className="date">
                <h4>Date Range:</h4>
                {/* 시작하는 날 */}
                <DatePickerContainer>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    minDate={new Date("2023-01-01")}
                    maxDate={new Date()}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Start Date"
                  />
                </DatePickerContainer>
                {/* 끝나는 날 */}
                <DatePickerContainer>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="End Date"
                  />
                </DatePickerContainer>
              </div>
              <div className="orderSort">
                <h4>Order Sort:</h4>
                <div className="dropDown">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="desc">Order Newest</option>
                    <option value="asc">Order Oldest</option>
                    <option value="descend">Descending Price</option>
                    <option value="ascend">Ascending Price</option>
                  </select>
                </div>
              </div>
              <div className="searchButtons">
                <button type="submit">Search</button>
                <button onClick={onClickInitalize}>Initialize</button>
              </div>
            </div>
          </form>

          {checkmember === true ? (
            <>
              {/** 테이블 */}
              <table className="table">
                <thead>
                  <tr>
                    <th>OrderNo</th>
                    <th>Img</th>
                    <th>Title</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Total Payment</th>
                    <th>Payment Method</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.length > 0 ? (
                    orderData.map((v, i) => {
                      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
                      const productDetail = v.productDetail;

                      return (
                        <tr key={i}>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.orderno}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            <img
                              src={productDetail?.img1}
                              alt={productDetail?.title}
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {productDetail?.title}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.email}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.quantity}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            ${v?.tprice}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.payment_method}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.order_date.substring(0, 10)}
                          </td>
                          <td>
                            <select
                              value={selectedStatus[v?.orderno] || v?.status}
                              onChange={(e) =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [v?.orderno]: e.target.value,
                                }))
                              }
                            >
                              <option value="Payment Verification">
                                Payment Verification
                              </option>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Order Preparation">
                                Order Preparation
                              </option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Refund Processing">
                                Refund Processing
                              </option>
                              <option value="Refund Completed">
                                Refund Completed
                              </option>
                            </select>
                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={EditStatus}
                              data-orderno={v?.orderno}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        There is no result.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <table className="mobileTable">
                <thead>
                  <tr>
                    <th>OrderNo</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Total Payment</th>
                    <th>Payment Method</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.length > 0 ? (
                    orderData.map((v, i) => {
                      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
                      const productDetail = v.productDetail;

                      return (
                        <tr key={i}>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.orderno}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.email}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.quantity}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            ${v?.tprice}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.payment_method}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onClickMoveToDetail(e, v?.orderno)}
                          >
                            {v?.order_date.substring(0, 10)}
                          </td>
                          <td>
                            <select
                              value={selectedStatus[v?.orderno] || v?.status}
                              onChange={(e) =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [v?.orderno]: e.target.value,
                                }))
                              }
                            >
                              <option value="Payment Verification">
                                Payment Verification
                              </option>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Order Preparation">
                                Order Preparation
                              </option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Refund Processing">
                                Refund Processing
                              </option>
                              <option value="Refund Completed">
                                Refund Completed
                              </option>
                            </select>
                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={EditStatus}
                              data-orderno={v?.orderno}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        There is no result.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {orderData?.length > 0 && (
                <Pagenation pagenation={orderPagenation} />
              )}
            </>
          ) : (
            <>
              {/** 테이블 */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Non-OrderNo</th>
                    <th>Img</th>
                    <th>Title</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Total Payment</th>
                    <th>Payment Method</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {guestOrderData?.length > 0 ? (
                    guestOrderData.map((v, i) => {
                      /** 클라이언트에서  같은 제품을 구매한 경우에는 guest_orderno 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
                      const productDetail = v.productDetail;

                      return (
                        <tr key={i}>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.guest_orderno}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            <img
                              src={productDetail?.img1}
                              alt={productDetail?.title}
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {productDetail?.title}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.email}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.quantity}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            ${v?.tprice}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.payment_method}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.order_date.substring(0, 10)}
                          </td>
                          <td>
                            <select
                              value={
                                guestSelectedStatus[v?.guest_orderno] ||
                                v?.status
                              }
                              onChange={(e) =>
                                setGuestSelectedStatus((prev) => ({
                                  ...prev,
                                  [v?.guest_orderno]: e.target.value,
                                }))
                              }
                            >
                              <option value="Payment Verification">
                                Payment Verification
                              </option>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Order Preparation">
                                Order Preparation
                              </option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Refund Processing">
                                Refund Processing
                              </option>
                              <option value="Refund Completed">
                                Refund Completed
                              </option>
                            </select>
                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={guestEditStatus}
                              data-guestno={v?.guest_orderno}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        There is no result.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <table className="mobileTable">
                <thead>
                  <tr>
                    <th>Non-OrderNo</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Total Payment</th>
                    <th>Payment Method</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {guestOrderData?.length > 0 ? (
                    guestOrderData.map((v, i) => {
                      /** 클라이언트에서  같은 제품을 구매한 경우에는 guest_orderno 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
                      const productDetail = v.productDetail;

                      return (
                        <tr key={i}>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.guest_orderno}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.email}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.quantity}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            ${v?.tprice}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.payment_method}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onClickMoveToGuestDetail(e, v?.guest_orderno)
                            }
                          >
                            {v?.order_date.substring(0, 10)}
                          </td>
                          <td>
                            <select
                              value={
                                guestSelectedStatus[v?.guest_orderno] ||
                                v?.status
                              }
                              onChange={(e) =>
                                setGuestSelectedStatus((prev) => ({
                                  ...prev,
                                  [v?.guest_orderno]: e.target.value,
                                }))
                              }
                            >
                              <option value="Payment Verification">
                                Payment Verification
                              </option>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Order Preparation">
                                Order Preparation
                              </option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Refund Processing">
                                Refund Processing
                              </option>
                              <option value="Refund Completed">
                                Refund Completed
                              </option>
                            </select>
                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={guestEditStatus}
                              data-guestno={v?.guest_orderno}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        There is no result.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {guestOrderData?.length > 0 && (
                <Pagenation pagenation={guestOrderPagenation} />
              )}
            </>
          )}
        </Container>
      )}
    </>
  );
});

export default OrderManagemet;
