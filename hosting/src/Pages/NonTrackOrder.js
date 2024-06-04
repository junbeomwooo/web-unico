import React, { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrackItem, guestGetTrackItem } from "../slices/OrderDetailSlice";
import { getCurrentData } from "../slices/OrderDetailSlice";
import { useQueryString } from "../hooks/useQueryString";
import styled from "styled-components";
import Pagenation from "../helper/Pagenation";
import mq from "../MediaQuery/MediaQuery";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import { useLocation, useNavigate } from "react-router-dom";

const Box = styled.div`
  padding: 0 150px;

  ${mq.maxWidth("lg")`
      padding: 0 100px;
    `}

  ${mq.maxWidth("md")`
      padding: 0 50px;
    `}
      ${mq.maxWidth("xsm")`
      padding: 0 25px;
    `}
 .sort {
    position: absolute;
    right: 4%;
    margin-top: 168px;
    display: flex;
    flex-direction: column;
    height: ${({ sortopen }) => (sortopen === "true" ? "165px" : "20px")};
    width: 100px;
    border: 1px solid black;
    background-color: #f4f3f2;
    transition: height 0.25s ease-in-out; // 트랜지션 효과 추가

    ${mq.maxWidth("md")`
        width: 80px;
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
  .container {
    padding-top: 200px;
    width: 100%;
    margin-bottom: 200px;

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
const NonTrackOrder = memo(() => {
  /** 페이지네이션 구현을 위한 QueryString 변수 받기 */
  const { page = 1 } = useQueryString();

  /** 로케이션 */
  const location = useLocation();

  /** 강제이동 함수 생성 */
  const navigate = useNavigate();

  /** 정렬 기준 옵션을 위한 상태값 */
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  // 필드값이 각각 orderno, guest_orderno로 다르므로
  const [sortBy, setSortBy] = useState("orderno");
  const [guestSortBy, setGuestSortBy] = useState("guest_orderno");

  // 리덕스 초기화
  const dispatch = useDispatch();

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
    pagenation,
    memberTrack,
    guestTrack,
  } = useSelector((state) => state.OrderDetailSlice);

  // 초반 렌더링 시 실행
  useEffect(() => {
    // getCurrentData 함수를 비동기로 호출 , getCurrentData는 then 사용이 불가능하기때문에 async await를 사용함
    dispatch(getCurrentData());
    setSortOpen(false);
    // getCurrentData 함수 호출 후에 실행할 작업
    // 회원일 경우
    if (memberTrack) {
      dispatch(
        getTrackItem({
          account: memberTrack,
          page: page,
          rows: 10,
          // 정렬 순을 위해
          sortBy: sortBy, // 정렬할 필드 지정
          sortOrder: sortOrder, // 정렬 순서 지정
        })
      );
    }
    // 비회원일 경우
    else if (guestTrack) {
      dispatch(
        guestGetTrackItem({
          email: guestTrack,
          page: page,
          rows: 10,
          // 정렬 순을 위해
          sortBy: guestSortBy, // 정렬할 필드 지정
          sortOrder: sortOrder, // 정렬 순서 지정
        })
      );
    }
  }, [dispatch, memberTrack, guestTrack, page, sortBy, sortOrder, guestSortBy]);

  // 이벤트 목록

  /** 정렬 조건이 바뀌었을 때 페이지 번호를 1로 이동하기 위해 쿼리스트링을 변경 */
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

  // 주문상세정보 이동
  const moveToOrderDetail = useCallback((e) => {
    const orderno = e.currentTarget.dataset.orderno;
    e.preventDefault();

    navigate(`/customer_service/track_orderDetail/${orderno}`);
  }, []);

  /** 정렬 기준 */
  const onClickFilter = useCallback(
    (e) => {
      setSortOpen(!sortOpen);
      console.log(sortOpen);
    },
    [setSortOpen, sortOpen]
  );
  /** 멤버용  */
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

  /** 게스트용 */
  const guestClickNewest = useCallback((e) => {
    setGuestSortBy("guest_orderno");
    setSortOrder("desc");
    handlePageChange(1);
  }, []);

  const guestClickOldest = useCallback((e) => {
    setGuestSortBy("guest_orderno");
    setSortOrder("asc");
    handlePageChange(1);
  }, []);

  const guestClickLowest = useCallback((e) => {
    setGuestSortBy("tprice");
    setSortOrder("asc");
    handlePageChange(1);
  }, []);

  const guestClickHighest = useCallback((e) => {
    setGuestSortBy("tprice");
    setSortOrder("desc");
    handlePageChange(1);
  }, []);

  return (
    <>
      <Spinner loading={orderLoading} />
      {orderError ? (
        <ErrorView error={orderError} />
      ) : (
        <Box sortopen={sortOpen.toString()}>
          <div className="sort">
            <button onClick={onClickFilter}>Sort</button>
            {sortOpen === true && (
              <>
                <button
                  onClick={memberTrack ? onClickNewest : guestClickNewest}
                  className="openButton"
                >
                  Newest
                </button>
                <button
                  onClick={memberTrack ? onClickOldest : guestClickOldest}
                  className="openButton"
                >
                  Oldest
                </button>
                <button
                  onClick={memberTrack ? onClickLowest : guestClickLowest}
                  className="openButton"
                >
                  Lowest Price
                </button>
                <button
                  onClick={memberTrack ? onClickHighest : guestClickHighest}
                  className="openButton"
                >
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
                const productDetail = v?.productDetail;
                return (
                  <React.Fragment key={i}>
                    <div
                      className="content"
                      data-orderno={memberTrack ? v?.orderno : v?.guest_orderno}
                      onClick={moveToOrderDetail}
                    >
                      <div className="numberAndDate">
                        <h4>{v?.order_date?.substring(0, 10)}</h4>
                        <h5>{memberTrack ? v?.orderno : v?.guest_orderno}</h5>
                      </div>
                      <img
                        src={productDetail?.img1}
                        alt={productDetail?.title}
                      />
                      <h1>{productDetail?.title}</h1>
                      <h3>${v?.tprice}</h3>
                      <h3>{v?.quantity}</h3>
                      <h3 className="status">{v?.status}</h3>
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
      )}
    </>
  );
});

export default NonTrackOrder;
