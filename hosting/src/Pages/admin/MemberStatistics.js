import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderGetList } from "../../slices/OrderDetailSlice";
import { guestOrderGetList } from "../../slices/GuestOrderDetailSlice";
import styled from "styled-components";

import Spinner from "../../components/Spinner";
import ErrorView from "../../components/ErrorView";

/** 그래프 전용 */
import { cloneDeep } from "lodash";
import {
  // 공통 항목들
  Chart,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 선 그래프 적용
  LineElement,
  // 파이 그래프 전용
  ArcElement,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

Chart.register(
  // 공통항목들
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // 선 그래프 전용
  LineElement,
  // 파이 그래프 전용
  ArcElement
);

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 85%;
  height: 1350px;

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

  .pieGraph {
    display: flex;
    justify-content: space-between;
    margin-top: 80px;

    .memberGraph {
      width: 50%;
      height: 400px;

      h1 {
        font-size: 17px;
        text-align: center;
        margin-bottom: 40px;
      }
    }

    .guestGraph {
      width: 50%;
      height: 400px;

      h1 {
        font-size: 17px;
        text-align: center;
        margin-bottom: 40px;
      }
    }
  }

  .lineGraph {
    margin-top: 150px;
    height: 500px;
    margin-left: 20px;

    h1 {
        font-size: 17px;
        margin-bottom: 40px;
    }
  }
`;

const MemberStatistics = memo(() => {
  // 멤버 월별 매출을 저장할 상태값
  const [monthlySales, setMonthlySales] = useState([]);
  //   게스트 월별 매출을 저장할 상태값
  const [guestMonthlySales, setGuestMonthlySales] = useState([]);
  // 리덕스 초기화
  const dispatch = useDispatch();
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.OrderDetailSlice);
  const {
    data: guestOrderData,
    loading: guestOrderLoading,
    error: guestOrderError,
  } = useSelector((state) => state.GuestOrderDetailSlice);

  // 렌더링시 실행
  useEffect(() => {
    dispatch(orderGetList());
    dispatch(guestOrderGetList());
  }, []);

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

  /** 멤버 파이 그래프 전용 */

  // 멤버 파이 그래프를 위한 옵션 (다른 그래프와 옵션 공유 불가)
  const pieOption = cloneDeep(defaultOption);

  /** 품목별 주문 갯수를 구하는 방식 (Pie) */
  // data 배열에서 gender가 M인 경우는 male, F인 경우는 Female, O인 경우엔 Others 구분
  const maleOrders =
    Array.isArray(orderData) &&
    orderData?.filter((item) => item.gender === "M").length;
  const femaleOrders =
    Array.isArray(orderData) &&
    orderData?.filter((item) => item.gender === "F").length;
  const otehrOrders =
    Array.isArray(orderData) &&
    orderData?.filter((item) => item.gender === "O").length;

  // 파이 그래프를 위한 데이터 정의
  const memberPie = {
    labels: ["Male", "Female", "Others"],
    datasets: [
      {
        label: "Count",
        data: [maleOrders, femaleOrders, otehrOrders],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(53, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(53, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  /** 비회원 파이 그래프 전용 */

  // 비회원 파이 그래프를 위한 옵션 (다른 그래프와 옵션 공유 불가)
  const guestPieOption = cloneDeep(defaultOption);

  /** 품목별 주문 갯수를 구하는 방식 (Pie) */
  // data 배열에서 gender가 M인 경우는 male, F인 경우는 Female, O인 경우엔 Others 구분
  const guestMaleOrders =
    Array.isArray(guestOrderData) &&
    guestOrderData?.filter((item) => item.gender === "M").length;
  const guestFemaleOrders =
    Array.isArray(guestOrderData) &&
    guestOrderData?.filter((item) => item.gender === "F").length;
  const guestOtehrOrders =
    Array.isArray(guestOrderData) &&
    guestOrderData?.filter((item) => item.gender === "O").length;

  // 파이 그래프를 위한 데이터 정의
  const guestPie = {
    labels: ["Male", "Female", "Others"],
    datasets: [
      {
        label: "Count",
        data: [guestMaleOrders, guestFemaleOrders, guestOtehrOrders],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(53, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(53, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  /** 라인 그래프 전용 */

  /** 각 월마다 주문 금액 합산 및 주문 갯수를 구하는 방식 (Line)*/

  useEffect(() => {
    // 월별 매출 계산 위한 변수
    const monthlySalesData = {};
    const guestMonthlySalesData = {};

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
      return `${date.getFullYear()} ${monthNames[date.getMonth()]}`;
    };

    /** 회원 전용 */
    orderData &&
      orderData?.forEach((data) => {
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
    /** 비회원 전용 */
    guestOrderData &&
      guestOrderData?.forEach((data) => {
        // order_date 값을 새로운 날짜 객체로 변경
        const orderDate = new Date(data.order_date);
        // ex) 2023-12 와 같은 값으로 month key를 생성
        const monthKey = formatMonth(orderDate);
        // 각 월별 매출 누적
        // 객체[특정속성] 형태의 문법을 사용하면 객체에서 특정 속성의 값을 가져올 수 있음.
        guestMonthlySalesData[monthKey] =
          (guestMonthlySalesData[monthKey] || 0) + data.tprice;
      });
    // 최근 12개월 데이터 추출
    const guestRecent12Months = Object.keys(guestMonthlySalesData).slice(-12);
    /** 최근 12개월 데이터로 상태변수 업데이트 */
    setGuestMonthlySales(
      // total은 반복도는 전체, month는 하나의 아이템(각 달)
      guestRecent12Months.reduce((total, month) => {
        total[month] = guestMonthlySalesData[month];
        return total;
      }, {})
    );
  }, [orderData]);

   // 선 그래프를 위한 데이터 정의
   const line = {
    labels: Object.keys(monthlySales),
    datasets: [{
        label: 'Member',
        data: Object.values(monthlySales),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    },{
        label: 'Non-member',
        data: Object.values(guestMonthlySales),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1
    }]
};


  return (
    <>
      <Spinner loading={orderLoading || guestOrderLoading} />
      {orderError || guestOrderError ? (
        <ErrorView error={orderError || guestOrderError} />
      ) : (
        <Container>
          <div className="header">
            <h1>Member Activity Statistics</h1>
          </div>
          <hr />
          <div className="pieGraph">
            <div className="memberGraph">
              <h1>Gender Distribution of Members per Order</h1>
              <Pie options={pieOption} data={memberPie} />
            </div>
            <div className="guestGraph">
              <h1>Gender Distribution of Non-Members per Order</h1>
              <Pie options={guestPieOption} data={guestPie} />
            </div>
          </div>
          <div className="lineGraph">
            <h1>Purchase Amount Status for Members and Non-Members</h1>
            <Line options={defaultOption} data={line} />
          </div>
        </Container>
      )}
    </>
  );
});

export default MemberStatistics;
