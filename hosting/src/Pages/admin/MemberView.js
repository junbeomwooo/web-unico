import React, { memo, useEffect, useState, useCallback } from "react";
import Table from "../../components/Table";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryString } from "../../hooks/useQueryString";
import styled from "styled-components";
import ErrorView from "../../components/ErrorView";
import Pagenation from "../../helper/Pagenation";

import { getItem } from "../../slices/MemberSlice";
import { getOrderItem } from "../../slices/OrderDetailSlice";
import { getCartItem } from "../../slices/CartSlice";

import { Spinner } from "react-bootstrap";

import {
  // 공통 항목들
  Chart,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 선 그래프 그래프 적용
  LineElement,
} from "chart.js";

import { Line } from "react-chartjs-2"; // Scatter는 산점도를 적용하기위해

Chart.register(
  // 공통항목들
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 선 그래프 그래프 전용
  LineElement
);

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 85%;
  height: 1600px;

  hr {
    border: 0.5px solid #212b34;
    margin-top: 20px;
  }

  .header {
    display: flex;
    justify-content: center;
    margin: 10px 0;
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #212b34;
    }
  }

  .member {
    width: 100%;
    margin-top: 80px;
    display: flex;
    justify-content: center;

    table {
      width: 100%;
    }
  }
  .graph {
    height: 400px;
    margin-top: 50px;
    h1 {
      font-size: 18px;
      margin-bottom: 30px;
    }
  }
  .orderAndCart {
    display: flex;
    margin-top: 50px;

    .order {
      margin-right: 20px;
      margin-top: 50px;
      width: 50%;
      .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        h1 {
          font-size: 18px;
        }
      }
      .orderInfoBox {
        border: 1px solid #212b34;
        box-sizing: border-box;
        padding: 10px;
        height: 404px;

        .structure {
          display: flex;
          h3 {
            font-size: 13px;
            font-weight: 600;
            width: 16.5%;
            text-align: center;
            &:first-child {
              width: 80px;
              margin-right: 20px;
            }
          }
        }
        .orderInfo {
          display: flex;
          margin-top: 5px;
          align-items: center;
          &:first-child {
            margin-top: 0;
          }
          img {
            width: 80px;
            margin-right: 20px;
          }

          h4 {
            font-weight: 400;
            font-size: 12px;
            width: 16.5%;
            text-align: center;
          }
        }
      }
    }

    .cart {
      margin-top: 50px;
      margin-left: 20px;
      width: 50%;
      .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        h1 {
          font-size: 18px;
        }
      }

      .cartInfoBox {
        border: 1px solid #212b34;
        box-sizing: border-box;
        padding: 10px;
        height: 404px;

        .structure {
          display: flex;
          h3 {
            font-size: 13px;
            font-weight: 600;
            width: 30%;
            text-align: center;
            &:first-child {
              width: 80px;
              margin-right: 20px;
            }
          }
        }

        .cartInfo {
          display: flex;
          margin-top: 5px;
          align-items: center;
          &:first-child {
            margin-top: 0;
          }
          img {
            width: 80px;
            margin-right: 20px;
          }
          h4 {
            font-weight: 400;
            font-size: 12px;
            width: 30%;
            text-align: center;
          }
        }
      }
    }
  }

  .buttons {
    margin-top: 100px;
    margin-left: 33.5%;

    button {
      width: 450px;
      height: 45px;
      border: 1px solid black;
      background-color: black;
      color: white;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const MemberView = memo(() => {
  /** 로케이션 */
  const location = useLocation();

  /** 강제 이동 함수  */
  const navigate = useNavigate();

  /** path 파라미터 받기 */
  const { userno } = useParams();

  /** 쿼리스트링 받기 */
  const { page = 1 } = useQueryString();

  /** 드롭다운 상태값 */
  const [sortOption, setSortOption] = useState("desc"); // 정렬 옵션 상태 추가

  // 월별 매출을 저장할 상태값
  const [monthlySales, setMonthlySales] = useState([]);

  /** 리덕스 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.MemberSlice);
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
    pagenation,
    totalOrders,
  } = useSelector((state) => state.OrderDetailSlice);
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.CartSlice);

  /** 렌더링 시 실행 */
  useEffect(() => {
    dispatch(
      getOrderItem({
        userno: userno,
        page: page,
        rows: 4,
        sortOption: sortOption,
      })
    );
    dispatch(
      getItem({
        userno: userno,
      })
    );
    dispatch(
      getCartItem({
        userno: userno,
      })
    );
    window.scrollTo(0, 0);
  }, [page, dispatch, userno, sortOption]);

  /** 드롭다운 이벤트 */
  const onChangeDropdown = useCallback((e) => {
    setSortOption(e.target.value);

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
  });

  //   뒤로가기 이벤트
  const moveToBack = useCallback((e) => {
    e.preventDefault();
    navigate("/admin/member");
  });

  /** 그래프 전용 */

  // 그래프 기본 옵션
  const defaultOption = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // 날짜 포맷 변환 함수
  const formatMonth = (date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getFullYear()}-${monthNames[date.getMonth()]}`;
  };

  /** useEffect 밖에 꺼내놓을 시에 너무 많은 렌더링이 발생함으로 useEffect내부에 넣어둠 */
  useEffect(() => {
    // 월별 판매금액 계산
    const monthlySalesData = {};
    totalOrders.forEach((data) => {
      // order_date 값을 새로운 날짜 객체로 변경
      const orderDate = new Date(data.order_date);
      // ex) 2023-12 와 같은 값으로 month key를 생성
      const monthKey = formatMonth(orderDate);
      // 각 월별 매출 누적
      monthlySalesData[monthKey] =
        (monthlySalesData[monthKey] || 0) + data.tprice;
    });

    // 최근 12개월 데이터 추출
    const recent12Months = Object.keys(monthlySalesData).slice(-12);

    /** 최근 12개월 데이터로 상태변수 업데이트 */
    setMonthlySales(
      // total은 반복도는 전체, month는 하나의 아이템(각 달)
      recent12Months.reduce((total, month) => {
        total[month] = monthlySalesData[month];
        return total;
      }, {})
    );
  }, [totalOrders]);

  // 선 그래프를 위한 데이터 정의
  const LineGraph = {
    labels: Object.keys(monthlySales),
    datasets: [
      {
        label: "Order Total",
        data: Object.values(monthlySales),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Spinner
        loading={
          loading.toString() ||
          orderLoading.toString() ||
          cartLoading.toString()
        }
      />
      {error ? (
        <ErrorView error={error || orderError || cartError} />
      ) : (
        <Container>
          <div className="header">
            <h1>Member List</h1>
          </div>
          <hr />
          <div className="member">
            <Table>
              <thead>
                <tr>
                  <th colSpan="14" align="center">
                    Member Information
                  </th>
                </tr>
                <tr>
                  <th>UserNo</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>BirthDate</th>
                  <th>PhoneNumber</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Zipcode</th>
                  <th>Province</th>
                  <th>Country</th>
                  <th>Registration Date</th>
                  <th>is_out</th>
                  <th>is_admin</th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  <tr>
                    <td>{data.userno}</td>
                    <td>{data.account}</td>
                    <td>{data.name}</td>
                    <td>{data.gender}</td>
                    <td>{data?.birthdate?.substring(0, 10)}</td>
                    <td>{data.phonenumber}</td>
                    <td>{data.address}</td>
                    <td>{data.city}</td>
                    <td>{data.zipcode}</td>
                    <td>{data.province}</td>
                    <td>{data.country}</td>
                    <td>{data?.reg_date?.substring(0, 10)}</td>
                    <td>{data.is_out}</td>
                    <td>{data.is_admin}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={14} align="center">
                      There is no user data.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="graph">
            <h1>Monthly Purchase Status</h1>
            <Line options={defaultOption} data={LineGraph} />
          </div>
          <div className="orderAndCart">
            <div className="order">
              <div className="title">
                <h1>Order Details</h1>
                <select value={sortOption} onChange={onChangeDropdown}>
                  <option value="desc">Order Newest</option>
                  <option value="asc">Order Oldest</option>
                  <option value="descend">Descending Order</option>
                  <option value="ascend">Ascending Order</option>
                </select>
              </div>
              <div className="orderInfoBox">
                <div className="structure">
                  <h3>Image</h3>
                  <h3>Name</h3>
                  <h3>Quantity</h3>
                  <h3>Price</h3>
                  <h3>Payment Date</h3>
                  <h3>Status</h3>
                </div>
                {orderData.length > 0 ? (
                  orderData.map((v) => {
                    return (
                      <div className="orderInfo" key={v.orderno}>
                        {v?.productDetail?.title && (
                          <img
                            src={v?.productDetail?.img1}
                            alt={v?.productDetail?.title}
                          />
                        )}
                        <h4>{v?.productDetail?.title}</h4>
                        <h4>{v?.quantity}</h4>
                        <h4>${v?.tprice}</h4>
                        <h4>{v?.order_date.substring(0, 10)}</h4>
                        <h4>{v?.status}</h4>
                      </div>
                    );
                  })
                ) : (
                  <div>There is no order data.</div>
                )}
              </div>
              {orderData?.length > 0 && pagenation && (
                <Pagenation pagenation={pagenation} />
              )}
            </div>
            <div className="cart">
              <div className="title">
                <h1>Cart</h1>
              </div>
              <div className="cartInfoBox">
                <div className="structure">
                  <h3>Image</h3>
                  <h3>Name</h3>
                  <h3>Quantity</h3>
                  <h3>Price</h3>
                </div>
                {cartData?.length > 0 ? (
                  cartData.map((v) => {
                    return (
                      <div className="cartInfo" key={v.cartno}>
                        {v?.productDetail?.title && (
                          <img
                            src={v?.productDetail?.img1}
                            alt={v?.productDetail?.title}
                          />
                        )}
                        <h4>{v?.productDetail?.title}</h4>
                        <h4>{v?.quantity}</h4>
                        <h4>{v?.tprice}</h4>
                      </div>
                    );
                  })
                ) : (
                  <div>There is no cart data.</div>
                )}
              </div>
            </div>
          </div>
          <div className="buttons">
              <button onClick={moveToBack}>Back</button>
            </div>
        </Container>
      )}
    </>
  );
});

export default MemberView;
