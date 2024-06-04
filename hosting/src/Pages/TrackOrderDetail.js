import React, { memo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import mq from "../MediaQuery/MediaQuery";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";

import { useDispatch, useSelector } from "react-redux";

import { getItemParams } from "../slices/OrderDetailSlice";
import { putRefundTrackItem } from "../slices/OrderDetailSlice";
import { guestGetItemParams } from "../slices/GuestOrderDetailSlice";
import { guestPutRefundTrackItem } from "../slices/OrderDetailSlice";

const ProductContainer = styled.div`
  width: 450px;
  top: 180px;
  right: 130px;
  padding-top: 180px;
  padding-bottom: 40px;
  ${mq.maxWidth("xxxl")`

    margin: auto;
    width: 450px;
  `}

${mq.maxWidth("xsm")`
    width: 300px;
    `}

  .container {
    hr {
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;
      margin-top: 18px;
    }
    .subject {
      display: flex;
      justify-content: space-between;

      h1 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      button {
        border: none;
        margin-bottom: 30px;
        background-color: #f4f3f2;
        text-decoration: underline;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .subSubject {
      display: flex;
      justify-content: space-between;

      h3 {
        font-size: 15px;
        font-weight: 400;
        margin: 0;
      }
    }

    .productBox {
      display: flex;
      margin-top: 15px;

      img {
        width: 100px;
        height: 100px;
      }

      .productInfo {
        width: 100%;

        h4 {
          font-size: 14px;
          font-weight: 400;
          margin: 15px 0 0 15px;
        }

        .nameAndPrice {
          display: flex;
          justify-content: space-between;
          h2 {
            font-size: 16px;
            margin: 0 0 0 15px;
          }

          h4 {
            font-size: 14px;
            font-weight: 400;
            margin: 0;
          }
        }
      }
    }

    .priceDetail {
      width: 100%;

      h4 {
        font-size: 14px;
        font-weight: 400;
        margin: 10px 0 0 0;
      }

      h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 0 0;
      }
      .itemTotal {
        display: flex;
        justify-content: space-between;
      }

      .shippingTax {
        display: flex;
        justify-content: space-between;
      }

      .duties {
        display: flex;
        justify-content: space-between;
      }

      .total {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

const Container = styled.div`
  width: 450px;
  margin: auto;
  margin-bottom: 200px;

  ${mq.maxWidth("xsm")`
    width: 300px;
    `}

  hr {
    margin: 50px 0;
  }

  .orderDetail {
    margin-top: 50px;
    h1 {
      font-size: 18px;
      margin-bottom: 35px;
    }
    h3 {
      font-size: 14.5px;
    }

    h4 {
      font-size: 12px;
      font-weight: 400;
    }

    .shipping {
      margin-top: 45px;
      display: flex;
      justify-content: space-between;

      button {
        border: none;
        background-color: #f4f3f2;
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .shippingBox {
      display: flex;
      justify-content: space-between;

      h5 {
        margin-bottom: 14px;
        font-weight: 600;
        font-size: 13px;
      }

      h4 {
        margin-top: 5px;
        margin-bottom: 0px;
      }
    }
    .buttons {
      margin-top: 55px;

      .moveToBack {
        background-color: white;
        border: 1px solid black;
        color: black;
        margin-top: 15px;
      }
      button {
        width: 100%;
        height: 50px;
        background-color: black;
        border: 1px solid black;
        color: white;
        transition: background-color 0.4s ease;

        &:hover {
          cursor: pointer;
          border: none;
          color: white;
          background-color: black;
        }
      }
    }
  }
`;

const TrackOrderDetail = memo(() => {
  /** 파라미터 받기 */
  const { orderno } = useParams();

  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();

  /** 리덕스 초기화 */
  const dispatch = useDispatch();

  const {
    data: orderData,
    productDetails,
    loading: orderLoading,
    error: orderError,
    memberTrack,
    guestTrack,
  } = useSelector((state) => state.OrderDetailSlice);

  const {
    data: guestData,
    productDetails: guestProductDetails,
    loading: guestLoading,
    error: guestError,
  } = useSelector((state) => state.GuestOrderDetailSlice);

  /** 일반 이벤트 관리 */
  const onClickTrackShipping = useCallback((e) => {
    e.preventDefault();
    window.alert(
      "The shipping company does not provide tracking information for this order."
    );
  });

  const onClickMoveToBack = useCallback((e) => {
    e.preventDefault();
    navigate("/customer_service/nonTrack_order");
  });

  /** 페이지 렌더링 시 */
  useEffect(() => {
    window.scrollTo(0, 0);
    // 회원 전용
    if (memberTrack) {
      dispatch(
        getItemParams({
          orderno: orderno,
        })
      );
      // 비회원 전용
    } else if (guestTrack) {
      dispatch(
        guestGetItemParams({
          orderno: orderno,
        })
      );
    }
  }, []);

  /** 이벤트 관리 */
  console.log(memberTrack);
  console.log(guestTrack);

  /** 취소, 반품 버튼 */
  const onClickCancleRefund = useCallback((e) => {
    e.preventDefault();
    // 주문취소버튼
    if (
      orderData?.status === "Payment Verification" ||
      orderData?.status === "Order Placed"
    ) {
      const response = window.confirm(
        "Are you sure you would like to cancel the order?"
      );

      // 예를 눌렀을 경우
      if (response) {
        dispatch(
          putRefundTrackItem({
            account: memberTrack,
            orderno: orderno,
            status: "Refund Processing",
          })
        ).then(({ payload, error }) => {
          console.log(payload);
          if (error) {
            window.alert(payload.data.rtmsg);
          } else if (payload.rtcode === 200) {
            window.alert("Your refund request has been completed.");
            navigate("/customer_service/nonTrack_order");
          }
        });
      }
      // 반품 버튼
    } else if (
      orderData?.status === "Order Preparation" ||
      orderData?.status === "Shipped" ||
      orderData?.status === "Delivered"
    )  {
      const response = window.confirm(
        "Are you sure you would like to return the product?"
      );

      // 예를 눌렀을 경우
      if (response) {
        dispatch(
          putRefundTrackItem({
            account: memberTrack,
            orderno: orderno,
            status: "Refund Processing",
          })
        ).then(({ payload, error }) => {
          console.log(payload);
          if (error) {
            window.alert(payload.data.rtmsg);
          } else if (payload.rtcode === 200) {
            window.alert("Your request for return has been completed.");
            navigate("/customer_service/nonTrack_order");
          }
        });
      }
    }
  });

  /** (게스트) 취소, 반품 버튼 */
  const guestOnClickCancleRefund = useCallback((e) => {
    e.preventDefault();
    // 주문취소버튼
    if (
      guestData?.status === "Payment Verification" ||
      guestData?.status === "Order Placed"
    ) {
      const response = window.confirm(
        "Are you sure you would like to cancel the order?"
      );

      // 예를 눌렀을 경우
      if (response) {
        dispatch(
          guestPutRefundTrackItem({
            email: guestTrack,
            orderno: orderno,
            status: "Refund Processing",
          })
        ).then(({ payload, error }) => {
          console.log(payload);
          if (error) {
            window.alert(payload.data.rtmsg);
          } else if (payload.rtcode === 200) {
            window.alert("Your refund request has been completed.");
            navigate("/customer_service/nonTrack_order");
          }
        });
      }
      // 반품 버튼
    } else if (
      guestData?.status === "Order Preparation" ||
      guestData?.status === "Shipped" ||
      guestData?.status === "Delivered"
    ) {
      const response = window.confirm(
        "Are you sure you would like to return the product?"
      );

      // 예를 눌렀을 경우
      if (response) {
        dispatch(
          guestPutRefundTrackItem({
            email: guestTrack,
            orderno: orderno,
            status: "Refund Processing",
          })
        ).then(({ payload, error }) => {
          console.log(payload);
          if (error) {
            window.alert(payload.data.rtmsg);
          } else if (payload.rtcode === 200) {
            window.alert("Your request for return has been completed.");
            navigate("/customer_service/nonTrack_order");
          }
        });
      }
    }
  });
  return (
    <>
      <Spinner loading={memberTrack ? orderLoading : guestLoading} />
      {orderError ? (
        <ErrorView error={memberTrack ? orderError : guestError} />
      ) : memberTrack ? (
        <Container>
          {productDetails.title && (
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>

                <div className="productBox">
                  <img src={productDetails?.img1} alt={productDetails?.title} />
                  <div className="productInfo">
                    <div className="nameAndPrice">
                      <h2>{productDetails?.title}</h2>
                      <h4>${orderData?.tprice}</h4>
                    </div>
                    <h4>Quantity:{orderData?.quantity}</h4>
                    <h4>{orderData?.status}</h4>
                  </div>
                </div>
                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>${orderData?.tprice}</h4>
                  </div>
                  <div className="shippingTax">
                    <h4>Shipping&Tax</h4>
                    <h4>$0</h4>
                  </div>
                  <div className="duties">
                    <h3>Duties</h3>
                    <h3>Excluded</h3>
                  </div>
                  <hr />
                  <div className="total">
                    <h4>Total</h4>
                    <h4>${orderData?.tprice}</h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          )}
          <div className="orderDetail">
            <h1>Information</h1>
            <h3>Email</h3>
            <h4>{orderData?.email}</h4>
            <div className="shipping">
              <h3>Shipping</h3>
            </div>
            <div className="shippingBox">
              <div className="shippingAddress">
                <h5>Address</h5>
                <h4>{orderData?.address}</h4>
                <h4>{orderData?.city}</h4>
                <h4>{orderData?.province}</h4>
                <h4>{orderData?.country}</h4>
              </div>
              <div className="Billing Address">
                <h5>information</h5>
                <h4>{orderData?.email}</h4>
                <h4>{orderData?.name}</h4>
                <h4>{orderData?.phonenumber}</h4>
              </div>
            </div>
            <div className="buttons">
              <button onClick={onClickTrackShipping}>Track Shipping</button>
              {/* Payment Verification, Order Placed 와 같이 환불이 가능한 상태면 취소버튼을 넣었고,
                  Order Preparation, Shipped, Delivered 와 같이 환불이 불가능한 상태면 취소버튼을 넣었으며,
                  Refund Processing,Refunded 와 같이 환불이 이미 진행중이면 버튼을 보이지 않게 하였음.
              */}
              {orderData?.status === "Payment Verification" ||
              orderData?.status === "Order Placed" ? (
                <button className="moveToBack" onClick={onClickCancleRefund}>
                  Cancel Order
                </button>
              ) : orderData?.status === "Refund Processing" ||
              orderData?.status === "Refund Completed" ? null : (
                <button className="moveToBack" onClick={onClickCancleRefund}>
                  Return Product
                </button>
              )}
              <button className="moveToBack" onClick={onClickMoveToBack}>
                Go Back
              </button>
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          {guestProductDetails.title && (
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>

                <div className="productBox">
                  <img
                    src={guestProductDetails?.img1}
                    alt={guestProductDetails?.title}
                  />
                  <div className="productInfo">
                    <div className="nameAndPrice">
                      <h2>{guestProductDetails?.title}</h2>
                      <h4>${guestData?.tprice}</h4>
                    </div>
                    <h4>Quantity:{guestData?.quantity}</h4>
                    <h4>{orderData?.status}</h4>
                  </div>
                </div>
                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>${guestData?.tprice}</h4>
                  </div>
                  <div className="shippingTax">
                    <h4>Shipping&Tax</h4>
                    <h4>$0</h4>
                  </div>
                  <div className="duties">
                    <h3>Duties</h3>
                    <h3>Excluded</h3>
                  </div>
                  <hr />
                  <div className="total">
                    <h4>Total</h4>
                    <h4>${guestData?.tprice}</h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          )}
          <div className="orderDetail">
            <h1>Information</h1>
            <h3>Email</h3>
            <h4>{guestData?.email}</h4>
            <div className="shipping">
              <h3>Shipping</h3>
            </div>
            <div className="shippingBox">
              <div className="shippingAddress">
                <h5>Address</h5>
                <h4>{guestData?.address}</h4>
                <h4>{guestData?.city}</h4>
                <h4>{guestData?.province}</h4>
                <h4>{guestData?.country}</h4>
              </div>
              <div className="Billing Address">
                <h5>information</h5>
                <h4>{guestData?.email}</h4>
                <h4>{guestData?.name}</h4>
                <h4>{guestData?.phonenumber}</h4>
              </div>
            </div>
            <div className="buttons">
              <button onClick={onClickTrackShipping}>Track Shipping</button>
              {/* Payment Verification, Order Placed 와 같이 환불이 가능한 상태면 취소버튼을 넣었고,
                  Order Preparation, Shipped, Delivered 와 같이 환불이 불가능한 상태면 취소버튼을 넣었으며,
                  Refund Processing,Refunded 와 같이 환불이 이미 진행중이면 버튼을 보이지 않게 하였음.
              */}
              {guestData?.status === "Payment Verification" ||
              guestData?.status === "Order Placed" ? (
                <button
                  className="moveToBack"
                  onClick={guestOnClickCancleRefund}
                >
                  Cancel Order
                </button>
              ) : guestData?.status === "Refund Processing" ||
                guestData?.status === "Refund Completed" ? null : (
                <button
                  className="moveToBack"
                  onClick={guestOnClickCancleRefund}
                >
                  Return Product
                </button>
              )}
              <button className="moveToBack" onClick={onClickMoveToBack}>
                Go Back
              </button>
            </div>
          </div>
        </Container>
      )}
    </>
  );
});

export default TrackOrderDetail;
