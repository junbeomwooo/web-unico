import React, { memo, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentData } from "../slices/OrderDetailSlice";
import mq from "../MediaQuery/MediaQuery";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import { loginCheck } from "../slices/MemberSlice";
import { guestGetCurrentData } from "../slices/GuestOrderDetailSlice";

const Container = styled.div`
  padding-top: 180px;
  width: 450px;
  margin: auto;
  margin-bottom: 200px;

  ${mq.maxWidth("xsm")`
       width: 300px;
    `}

  hr {
    margin: 50px 0;
  }

  .main {
    h1 {
      font-size: 18px;
      margin-bottom: 35px;
    }

    h2 {
      font-size: 14px;
      font-weight: 500;
    }

    h3 {
      margin-top: 40px;
      font-size: 13.5px;
      font-weight: 400;
    }
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
      button {
        width: 100%;
        height: 50px;
        background-color: black;
        border: 1px solid black;
        color: white;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;
const ProductContainer = styled.div`
  position: absolute;
  width: 350px;
  top: 180px;
  right: 130px;
  ${mq.maxWidth("xxxl")`
    position: static;
    margin: auto;
    width: 450px;
    margin-top: -150px;
    margin-bottom: 150px;
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

const ConfirmPayment = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();
  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();

  // 로그인 확인 여부를 위한 값
  const { isLoggedIn } = useSelector((state) => state.MemberSlice);

  // 로그인 중일 경우
  const {
    data: orderData,
    loading,
    error,
    productDetails,
  } = useSelector((state) => state.OrderDetailSlice);

  // 비로그인 중일 경우
  const {
    data: guestOrderData,
    loading: guestLoading,
    error: guestError,
    productDetails: guestProductDetails,
  } = useSelector((state) => state.GuestOrderDetailSlice);

  useEffect(() => {
    dispatch(loginCheck()).then((response) => {
      if (isLoggedIn === true) {
        dispatch(getCurrentData());
      } else if (isLoggedIn === false) {
        dispatch(guestGetCurrentData());
      }
    });
    
  }, []);

  /** 일반 이벤트 */
  const moveToMain = useCallback((e) => {
    e.preventDefault();
    navigate("/");
  });
  return (
    <>
      <Spinner loading={isLoggedIn === true ? loading : guestLoading} />
      {error ? (
        <ErrorView error={isLoggedIn === true ? error : guestError} />
      ) : // 로그인 중일 경우
      isLoggedIn ? (
        orderData && (
          <>
            <Container>
              <div className="main">
                <h1>Thank you for your order</h1>
                <h2>
                  Please pay for your order within 48hours using information
                  given below, failing to do so will result in cancelation of
                  your order.{" "}
                </h2>
                <h3>Account number : 941602-00-056287</h3>
                <h3>Bank : KOOKMIN BANK</h3>
                <h3>
                  Amount : $
                  {Array.isArray(orderData) &&
                    orderData.reduce((total, item) => {
                      return total + item.tprice;
                    }, 0)}
                </h3>
              </div>
              <hr />
              <div className="orderDetail">
                <h1>Information</h1>
                <h3>Email</h3>
                <h4>{orderData[0]?.email}</h4>
                <div className="shipping">
                  <h3>Shipping</h3>
                </div>
                <div className="shippingBox">
                  <div className="shippingAddress">
                    <h5>Address</h5>
                    <h4>{orderData[0]?.address}</h4>
                    <h4>{orderData[0]?.city}</h4>
                    <h4>{orderData[0]?.province}</h4>
                    <h4>{orderData[0]?.country}</h4>
                  </div>
                  <div className="Billing Address">
                    <h5>information</h5>
                    <h4>{orderData[0]?.email}</h4>
                    <h4>{orderData[0]?.name}</h4>
                    <h4>{orderData[0]?.phonenumber}</h4>
                  </div>
                </div>
                <div className="buttons">
                  <button onClick={moveToMain}>Continue Shopping</button>
                </div>
              </div>
            </Container>
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>
                {productDetails.length > 0 ? (
                  productDetails.map((v, i) => {
                    // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                    const orderInfo =
                      orderData &&
                      Array.isArray(orderData) &&
                      orderData.find(
                        (item) => item.product_prodno === v.prodno
                      );

                    return (
                      <div className="productBox" key={i}>
                        <img
                          src={v.img1}
                          alt={v.title}
                        />
                        <div className="productInfo">
                          <div className="nameAndPrice">
                            <h2>{v.title}</h2>
                            <h4>${orderInfo?.tprice}</h4>
                          </div>
                          <h4>Quantity:{orderInfo?.quantity}</h4>
                          <h4>Duty not included</h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>No Product in my order list.</h3>
                )}

                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(orderData) &&
                        orderData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
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
                    <h4>
                      $
                      {Array.isArray(orderData) &&
                        orderData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          </>
        )
      ) : (
        // 비로그인 일 경우
        guestOrderData && (
          <>
            <Container>
              <div className="main">
                <h1>Thank you for your order</h1>
                <h2>
                  Please pay for your order within 48hours using information
                  given below, failing to do so will result in cancelation of
                  your order.{" "}
                </h2>
                <h3>Account number : 941602-00-056287</h3>
                <h3>Bank : KOOKMIN BANK</h3>
                <h3>
                  Amount : $
                  {Array.isArray(guestOrderData) &&
                    guestOrderData.reduce((total, item) => {
                      return total + item.tprice;
                    }, 0)}
                </h3>
              </div>
              <hr />
              <div className="orderDetail">
                <h1>Information</h1>
                <h3>Email</h3>
                <h4>{guestOrderData[0]?.email}</h4>
                <div className="shipping">
                  <h3>Shipping</h3>
                </div>
                <div className="shippingBox">
                  <div className="shippingAddress">
                    <h5>Address</h5>
                    <h4>{guestOrderData[0]?.address}</h4>
                    <h4>{guestOrderData[0]?.city}</h4>
                    <h4>{guestOrderData[0]?.province}</h4>
                    <h4>{guestOrderData[0]?.country}</h4>
                  </div>
                  <div className="Billing Address">
                    <h5>information</h5>
                    <h4>{guestOrderData[0]?.email}</h4>
                    <h4>{guestOrderData[0]?.name}</h4>
                    <h4>{guestOrderData[0]?.phonenumber}</h4>
                  </div>
                </div>
                <div className="buttons">
                  <button onClick={moveToMain}>Continue Shopping</button>
                </div>
              </div>
            </Container>
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>
                {guestProductDetails.length > 0 ? (
                  guestProductDetails.map((v, i) => {
                    // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                    const guestOrderInfo =
                    guestOrderData &&
                      Array.isArray(guestOrderData) &&
                      guestOrderData.find(
                        (item) => item.product_prodno === v.prodno
                      );

                    return (
                      <div className="productBox" key={i}>
                        <img
                          src={v.img1}
                          alt={v.title}
                        />
                        <div className="productInfo">
                          <div className="nameAndPrice">
                            <h2>{v.title}</h2>
                            <h4>${guestOrderInfo?.tprice}</h4>
                          </div>
                          <h4>Quantity:{guestOrderInfo?.quantity}</h4>
                          <h4>Duty not included</h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>No Product in my order list.</h3>
                )}

                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(guestOrderData) &&
                        guestOrderData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
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
                    <h4>
                      $
                      {Array.isArray(guestOrderData) &&
                        guestOrderData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          </>
        )
      )}
    </>
  );
});

export default ConfirmPayment;
