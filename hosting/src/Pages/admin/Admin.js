import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { orderGetList } from "../../slices/OrderDetailSlice";
import { guestOrderGetList } from "../../slices/GuestOrderDetailSlice";
import {
  // 공통 항목들
  Chart,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 세로, 막대 그래프 전용
  BarElement,
  // 선 그래프 및 산점도 그래프 적용
  PointElement,
  LineElement,
  // 레이더 차트 전용 (선그래프 요소를 포함해야 함)
  RadialLinearScale,
  Filler,
  // 파이 그래프 전용
  ArcElement,
} from "chart.js";
import { Spinner } from "react-bootstrap";
import ErrorView from "../../components/ErrorView";

import { Bar, Line, Pie } from "react-chartjs-2";

Chart.register(
  // 공통항목들
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 세로, 가로 막대 그래프 전용
  BarElement,
  // 선 그래프 및 산점도 그래프 전용
  PointElement,
  LineElement,
  // 레이더 차트 전용 (선 그래프 요소를 포함해야 함)
  RadialLinearScale,
  Filler,
  // 파이 그래프 전용
  ArcElement
);

const Box = styled.div`
  padding: 20px 50px;
  box-sizing: border-box;
  width: 80%;
  height: 1100px;
  .bar {
    width: 107%;
    height: 40%;

    .title {
      display: flex;
      justify-content: space-between;

      .dropdown {
        padding-top: 20px;

        label {
          font-size: 14px;
        }

        select {
          font-size: 13px;
        }
      }
    }
  }
  .smallBox {
    margin-top: 80px;
    width: 107%;
    height: 50%;
    display: flex;

    .pieBox {
      width: 60%;
      height: 60%;
      .title {
        margin-bottom: 50px;
      }

      .pie {
        margin-left: 70px;
        height: 120%;
      }
    }

    .lineBox {
      width: 80%;
      height: 65%;

      .title {
        margin-bottom: 50px;
      }

      .line {
        height: 110%;
      }
    }
  }
`;

const Admin = memo(() => {
  // 리덕스 초기화
  const dispatch = useDispatch();

  // 회원 주문 리덕스 값
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
    productDetails,
  } = useSelector((state) => state.OrderDetailSlice);

  // 비회원 주문 리덕스 값
  const {
    data: guestOrderData,
    loading: guestOrderLoading,
    error: guestOrderError,
    productDetails: guestProductDetails,
  } = useSelector((state) => state.GuestOrderDetailSlice);

  // 월별 매출을 저장할 상태값 (Bar)
  const [monthlySales, setMonthlySales] = useState({});

  // 품목별 주문 갯수를 저장할 상태값 (Pie)
  const [sunglassesCount, setSunglassesCount] = useState(0);
  const [glassesCount, setGlassesCount] = useState(0);

  // 각 월별 주문 갯수를 저장할 상태값 (Line)
  const [monthlyOrderCounts, setMonthlyOrderCounts] = useState({});

  // 연도값을 설정할 상태값
  const [selectedYear, setSelectedYear] = useState(2023); // 선택된 연도를 상태로 관리

  // 선택 가능한 연도 목록
  const yearOptions = [2023, 2024];

  /** 렌더링시 데이터 받아오기 */
  useEffect(() => {
    dispatch(
      orderGetList({
        orderDateFilter: selectedYear,
      })
    );
    dispatch(
      guestOrderGetList({
        orderDateFilter: selectedYear,
      })
    );
  }, [selectedYear]);

  /** 렌더링과 데이터 값이 바뀌었을 경우 실행 */
  useEffect(() => {
    // orderData와 guestOrderData가 모두 로딩되면 처리
    if (
      !orderLoading &&
      !guestOrderLoading &&
      Array.isArray(orderData) &&
      Array.isArray(guestOrderData) &&
      Array.isArray(productDetails) &&
      Array.isArray(guestProductDetails)
    ) {
      // orderData와 guestOrderData를 하나의 배열로 만듬
      const combineData = [...orderData, ...guestOrderData];

      /** 각 월마다 주문 금액 합산 및 주문 갯수를 구하는 방식 (Bar,Line)*/

      // 월별 주문 갯수 계산을 위한 변수
      const monthlyOrderCountsData = {};

      // 월별 매출 계산 위한 변수
      const monthlySalesData = {};

      combineData.forEach((data) => {
        // order_date 값을 새로운 날짜 객체로 변경
        const orderDate = new Date(data.order_date);
        // ex) 2023-12 와 같은 값으로 month key를 생성
        const monthKey = `${orderDate.getFullYear()}-${
          orderDate.getMonth() + 1
        }`;
        /** 각 월별 매출 누적 */
        // 방금 생성한 monthKey를 객체의 속성으로 적용 시킨뒤 각 객체 속성과 일치하는 것끼리 tprice값을 더해줌, 만약 해당 월에 대한 속성이 이미 존재한다면, 기존의 총 매출 값에 현재 주문의 tprice 값을 더함. 만약 해당 월에 대한 속성이 없다면, 초기값으로 0을 사용하여 현재 주문의 tprice 값을 더해줌.
        monthlySalesData[monthKey] =
          (monthlySalesData[monthKey] || 0) + data.tprice;

        // 상태변수에 월별 판매금액 저장
        setMonthlySales(monthlySalesData);

        /** 각 월별 주문 갯수 누적 */
        // 방금 생성한 monthKey를 객체의 속성으로 적용한 뒤, 해당 객체 속성이 없다면 초기값 1로 설정하고,
        // 이미 해당 월에 대한 속성이 있다면 현재 주문의 갯수를 더해줌.
        monthlyOrderCountsData[monthKey] =
          (monthlyOrderCountsData[monthKey] || 0) + 1;

        // 상태변수에 월별 주문갯수 결과값 저장
        setMonthlyOrderCounts(monthlyOrderCountsData);
      });

      /** 품목별 주문 갯수를 구하는 방식 (Pie) */

      // productDetails과 guestProductDetails 하나의 배열로 만듬
      const combineProductDetails = [...productDetails, ...guestProductDetails];

      // combineProductDetails 배열에서 sub_category_subcateno가 1인 경우는 선글라스, 2인 경우는 안경으로 구분
      const sunglassesOrders = combineProductDetails.filter(
        (item) => item.sub_category_subcateno === 1
      );
      const glassesOrders = combineProductDetails.filter(
        (item) => item.sub_category_subcateno === 2
      );

      // 상태변수에 결과 값 저장
      setSunglassesCount(sunglassesOrders.length);
      setGlassesCount(glassesOrders.length);
    }
  }, [orderData, guestOrderData, productDetails, guestProductDetails]);
  // 하단 라벨 없는 기본옵션
  const defaultOption1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,
    },
  };

  // 하단 라벨 존재하는 기본옵션
  const defaultOption2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  // 파이 그래프를 위한 옵션 (다른 그래프와 옵션 공유 불가)
  const pieOption = cloneDeep(defaultOption2);

  // plugins.legend.labels 객체를 생성
  pieOption.plugins.legend.labels = {
    padding: 40, // 적절한 값을 지정
  };

  // 총 수익 계산
  const totalRevenue = Object.values(monthlySales).reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  const key = Object.keys(monthlySales);
  const year = key[0]?.substring(0, 4);

  // 가로, 세로 막대 그래프를 위한 데이터 정의
  const bar = {
    labels: [
      `${year} Jan`,
      `${year} Feb`,
      `${year} Mar`,
      `${year} Apr`,
      `${year} May`,
      `${year} Jun`,
      `${year} July`,
      `${year} Agu`,
      `${year} Sep`,
      `${year} Oct`,
      `${year} Nov`,
      `${year} Dec`,
    ],
    datasets: [
      {
        label: null,
        // 객체를 반환 값을 값들로 이루어진 배열로 줌
        // Object.keys는 반환 값을 키로 이루어진 배열로 줌
        data: Object.values(monthlySales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(34, 49, 63, 0.5)",
          "rgba(231, 76, 60, 0.5)",
          "rgba(149, 165, 166, 0.5)",
          "rgba(46, 204, 113, 0.5)",
          "rgba(52, 152, 219, 0.5)",
          "rgba(241, 196, 15, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(34, 49, 63, 1)",
          "rgba(231, 76, 60, 1)",
          "rgba(149, 165, 166, 1)",
          "rgba(46, 204, 113, 1)",
          "rgba(52, 152, 219, 1)",
          "rgba(241, 196, 15, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 파이 그래프를 위한 데이터 정의
  const pie = {
    labels: ["Sunglasses", "Glasses"],
    datasets: [
      {
        label: "Order",
        data: [sunglassesCount, glassesCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(53, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(53, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // 선 그래프를 위한 데이터 정의
  const line = {
    labels: [
      `${year} Jan`,
      `${year} Feb`,
      `${year} Mar`,
      `${year} Apr`,
      `${year} May`,
      `${year} Jun`,
      `${year} July`,
      `${year} Agu`,
      `${year} Sep`,
      `${year} Oct`,
      `${year} Nov`,
      `${year} Dec`,
    ],
    datasets: [
      {
        label: "Order Quantity",
        data: Object.values(monthlyOrderCounts),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  /** 이벤트 */

  // 연도 선택 시 호출되는 함수
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <>
      <Spinner loading={orderLoading.toString() || guestOrderLoading.toString()} />
      {orderError || guestOrderError ? (
        <ErrorView error={orderError || guestOrderError} />
      ) : (
        <Box>
          <div className="bar">
            <div className="title">
              <h3>
                {year} Total Revenue : ${totalRevenue}
              </h3>

              <div className="dropdown">
                <label htmlFor="yearSelect">Select Year: </label>
                <select
                  id="yearSelect"
                  onChange={handleYearChange}
                  value={selectedYear}
                >
                  {yearOptions.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Bar options={defaultOption1} data={bar} />
          </div>
          <div className="smallBox">
            <div className="pieBox">
              <h3 className="title">Demand by product orders</h3>
              <div className="pie">
                <Pie options={pieOption} data={pie} />
              </div>
            </div>
            <div className="lineBox">
              <h3 className="title">Order Quantity</h3>
              <div className="line">
                <Line options={defaultOption1} data={line} />
              </div>
            </div>
          </div>
        </Box>
      )}
    </>
  );
});

export default Admin;
