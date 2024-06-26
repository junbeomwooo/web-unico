import React, { memo, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ErrorView from "../components/ErrorView";
import { getList, deleteItem, putItem } from "../slices/CartSlice";
import {
  guestGetList,
  guestDeleteItem,
  guestPutItem,
} from "../slices/GuestCartSlice";
import { loginCheck } from "../slices/MemberSlice";
import mq from "../MediaQuery/MediaQuery";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 200px 100px 300px 100px;
  display: flex;

  ${mq.maxWidth("lg")`
    display:block;
  `}

${mq.maxWidth("xsm")`
      padding: 100px 30px 200px 30px;
    `}

  .shoppingCartContainer {
    width: 70%;

    ${mq.maxWidth("lg")`
    width: 100%;
  `}

    h1 {
      font-size: 17px;
    }

    .noProduct {
      margin-top: 100px;
    }

    hr {
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;
      margin: 30px 0 0 0;
    }
    .productContainer {
      .subject {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;

        h4 {
          font-weight: 400;
          font-size: 15px;
          margin: 0;
        }
      }
      .productBox {
        display: flex;
        justify-content: flex-start;
        margin-top: 25px;

        img {
          width: 180px;
          height: auto;

          ${mq.maxWidth("lg")`
            width: 100px;
        `}
        }

        .productInfo {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;

          .nameAndPrice {
            display: flex;
            justify-content: space-between;
            margin-left: 25px;

            h2 {
              font-size: 15px;
              margin: 0;
            }

            h4 {
              font-weight: 400;
              font-size: 15px;
              margin: 0;
            }
          }

          .quantityAndDelete {
            display: flex;
            justify-content: space-between;
            margin-left: 25px;
            align-items: center;

            .quantity {
              display: flex;
              border: 1px solid black;
              width: 75px;
              height: 22px;

              button {
                width: 25px;
                border: none;
                background-color: #f4f3f2;
              }

              h5 {
                padding: 0;
                margin-top: 3px;
                width: 25px;
                text-align: center;
                background-color: none;
                font-weight: 500;
              }
            }

            .delete {
              button {
                border: none;
                text-decoration: underline;
                font-size: 14px;
                background-color: #f4f3f2;

                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }

  .orderDetailContainer {
    width: 20%;
    position: fixed;
    right: 0;
    margin-right: 100px;

    ${mq.maxWidth("lg")`
    position: static;
    width: 100%;
  `}
    h1 {
      font-size: 17px;
      ${mq.maxWidth("lg")`
        margin-top: 50px;
  `}
    }

    hr {
      margin-top: 90px;
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;

      ${mq.maxWidth("lg")`
        margin-top: 30px;
  `}
    }

    button {
      width: 100%;
      background-color: black;
      color: white;
      height: 38px;
      border: 1px solid black;
      margin-top: 25px;
      &:hover {
        cursor: pointer;
      }
    }

    .secondHR {
      margin-top: 18px;
    }

    .orderDetailBox {
      display: flex;
      justify-content: space-between;

      .subject {
        h4 {
          font-weight: 400;
          font-size: 14px;
          margin: 7px 0px;

          &:first-child {
            margin-top: 18px;
          }
        }
      }
      .subPrice {
        h4 {
          font-weight: 400;
          font-size: 14px;
          margin: 7px 0px;
          text-align: right;

          &:first-child {
            margin-top: 18px;
          }
        }
      }
    }

    .total {
      display: flex;
      justify-content: space-between;
      h4 {
        font-weight: 400;
        font-size: 14px;
        margin: 7px 0px;
      }
    }
  }
`;
const Cart = memo(() => {
  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.MemberSlice);

  const navigate = useNavigate();

  const { data, productDetails, error } = useSelector(
    (state) => state.CartSlice
  );

  const {
    data: guestCartData,
    productDetails: guestProductDetails,
    error: guestError,
  } = useSelector((state) => state.GuestCartSlice);

  /** useEffect */
  useEffect(() => {
    window.scrollTo(0, 0);
    // 로그인 검사 후 로그인 여부에 따라 데이터 받아오기
    dispatch(loginCheck()).then(() => {
      if (isLoggedIn === true) {
        dispatch(getList());
      } else if (isLoggedIn === false) {
        dispatch(guestGetList());
      }
    });
  }, [isLoggedIn]);

  /** 회원 전용 카트 이벤트 목록 */

  // 회원 장바구니 목록 삭제
  const onClickDeleteCartProduct = useCallback((e) => {
    const prodno = e.currentTarget.dataset.prodno;
    dispatch(
      deleteItem({
        prodno: prodno,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        // 삭제가 성공하면 장바구니 목록을 불러옴
        dispatch(getList());
      }
    });
  });

  // 회원 장바구니 제품 수량 늘리기
  const onClickAddQuantity = useCallback((e) => {
    // 데이터로 담아놓은 각 값들 가져오기
    const prodno = e.currentTarget.dataset.prodno;
    const quantity = e.currentTarget.dataset.quantity;
    const cartno = e.currentTarget.dataset.cartno;

    // 수량을 하나씩 늘린 후 데이터를 다시 읽어와 갱신
    dispatch(
      putItem({
        product_prodno: prodno,
        quantity: parseInt(quantity) + 1,
        cartno: cartno,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        dispatch(getList());
      }
    });
  });

  // 장바구니 제품 수량 줄이기
  const onClickReduceQuantity = useCallback((e) => {
    // 데이터로 담아놓은 각 값들 가져오기
    const prodno = e.currentTarget.dataset.prodno;
    const quantity = e.currentTarget.dataset.quantity;
    const cartno = e.currentTarget.dataset.cartno;
    // 만약 수량이 1개 이상일 경우 수량을 1씩 줄이는 수정 과정을 거침
    if (quantity > 1) {
      dispatch(
        putItem({
          product_prodno: prodno,
          quantity: parseInt(quantity) - 1,
          cartno: cartno,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          dispatch(getList());
        }
      });
      // 수량이 1개일 경우 데이터 삭제
    } else {
      dispatch(
        deleteItem({
          prodno: prodno,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          dispatch(getList());
        }
      });
    }
  });

  // 클릭시 페이지 이동
  const moveToShipping = useCallback((e) => {
    e.preventDefault();
    if (isLoggedIn === true) {
      if (data?.length === 0) {
        window.alert("There is no product in your shopping bag.");
        return;
      }
    } else if (isLoggedIn === false) {
      if (guestCartData?.length === 0) {
        window.alert("There is no product in your shopping bag.");
        return;
      }
    }
    navigate("/checkout_shipping");
  });

  /** 비회원 이벤트 목록 */

  // 비회원 장바구니 삭제 이벤트 값
  const onClickDeleteGuestCart = useCallback((e) => {
    const prodno = e.currentTarget.dataset.prodno;
    dispatch(
      guestDeleteItem({
        prodno: prodno,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        // 삭제가 성공하면 장바구니 목록을 불러옴
        dispatch(guestGetList());
      }
    });
  });

  // 비회원 장바구니 제품 수량 늘리기
  const onClickAddGuestQuantity = useCallback((e) => {
    // 데이터로 담아놓은 각 값들 가져오기
    const prodno = e.currentTarget.dataset.prodno;
    const quantity = e.currentTarget.dataset.quantity;

    // 수량을 하나씩 늘린 후 데이터를 다시 읽어와 갱신
    dispatch(
      guestPutItem({
        product_prodno: prodno,
        quantity: parseInt(quantity) + 1,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        dispatch(guestGetList());
      }
    });
  });

  // 비회원 장바구니 제품 수량 줄이기
  const onClickReduceGuestQuantity = useCallback((e) => {
    // 데이터로 담아놓은 각 값들 가져오기
    const prodno = e.currentTarget.dataset.prodno;
    const quantity = e.currentTarget.dataset.quantity;
    // 만약 수량이 1개 이상일 경우 수량을 1씩 줄이는 수정 과정을 거침
    if (quantity > 1) {
      dispatch(
        guestPutItem({
          product_prodno: prodno,
          quantity: parseInt(quantity) - 1,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          dispatch(guestGetList());
        }
      });
      // 수량이 1개일 경우 데이터 삭제
    } else {
      dispatch(
        guestDeleteItem({
          prodno: prodno,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          dispatch(guestGetList());
        }
      });
    }
  });

  return (
    <>
      {isLoggedIn === true ? (
        // 회원 일 경우
        <>
          {error ? (
            <ErrorView error={error} />
          ) : (
            <Container>
              <div className="shoppingCartContainer">
                <h1>Shopping Bag</h1>
                <div className="productContainer">
                  <div className="subject">
                    <h4>Product</h4>
                    <h4>Price</h4>
                  </div>
                  {productDetails.length > 0 ? (
                    productDetails.map((v, i) => {
                      // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                      const cartInfo =
                        data &&
                        Array.isArray(data) &&
                        data.find((item) => item.product_prodno === v.prodno);
                      return (
                        <React.Fragment key={i}>
                          <hr />
                          <div className="productBox">
                            <img
                              src={v.img1}
                              alt={v.title}
                            />
                            <div className="productInfo">
                              <div className="nameAndPrice">
                                <h2>{v.title}</h2>
                                <h4>${cartInfo?.tprice}</h4>
                              </div>
                              <div className="quantityAndDelete">
                                <div className="quantity">
                                  <button
                                    onClick={onClickAddQuantity}
                                    data-prodno={v.prodno}
                                    data-quantity={cartInfo?.quantity}
                                    data-cartno={cartInfo?.cartno}
                                  >
                                    +
                                  </button>
                                  <h5>{cartInfo?.quantity}</h5>
                                  <button
                                    onClick={onClickReduceQuantity}
                                    data-prodno={v.prodno}
                                    data-quantity={cartInfo?.quantity}
                                    data-cartno={cartInfo?.cartno}
                                  >
                                    -
                                  </button>
                                </div>
                                <div className="delete">
                                  <button
                                    onClick={onClickDeleteCartProduct}
                                    data-prodno={v.prodno}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <h3 className="noProduct">
                      No product in my shopping bag.
                    </h3>
                  )}
                </div>
              </div>
              <div className="orderDetailContainer">
                <h1>Order Detail</h1>
                <hr />
                <div className="orderDetailBox">
                  <div className="subject">
                    <h4>Subtotal</h4>
                    <h4>Standard Shipping</h4>
                    <h4>Duties</h4>
                  </div>
                  <div className="subPrice">
                    <h4>
                      $
                      {Array.isArray(data) &&
                        data.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                    <h4>Free</h4>
                    <h4>Excluded</h4>
                  </div>
                </div>
                <hr className="secondHR" />
                <div className="total">
                  <h4>Total</h4>
                  {/* 리듀스 함수를 사용해 cartDate의 각 원소를 합산후 리턴 */}
                  <h4>
                    $
                    {Array.isArray(data) &&
                      data.reduce((total, item) => {
                        return total + item.tprice;
                      }, 0)}
                  </h4>
                </div>
                <button onClick={moveToShipping}>Check Out</button>
              </div>
            </Container>
          )}
        </>
      ) : (
        // 비회원 일 경우
        <>
          {error ? (
            <ErrorView error={guestError} />
          ) : (
            <Container>
              <div className="shoppingCartContainer">
                <h1>Shopping Bag</h1>
                <div className="productContainer">
                  <div className="subject">
                    <h4>Product</h4>
                    <h4>Price</h4>
                  </div>
                  {guestProductDetails.length > 0 ? (
                    guestProductDetails.map((v, i) => {
                      // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                      const cartInfo =
                        guestCartData &&
                        Array.isArray(guestCartData) &&
                        guestCartData.find(
                          (item) => item.product_prodno === v.prodno
                        );
                      return (
                        <React.Fragment key={i}>
                          <hr />
                          <div className="productBox">
                            <img
                              src={v.img1}
                              alt={v.title}
                            />
                            <div className="productInfo">
                              <div className="nameAndPrice">
                                <h2>{v.title}</h2>
                                <h4>${cartInfo.tprice}</h4>
                              </div>
                              <div className="quantityAndDelete">
                                <div className="quantity">
                                  <button
                                    onClick={onClickAddGuestQuantity}
                                    data-prodno={v.prodno}
                                    data-quantity={cartInfo?.quantity}
                                    data-cartno={cartInfo?.cartno}
                                  >
                                    +
                                  </button>
                                  <h5>{cartInfo.quantity}</h5>
                                  <button
                                    onClick={onClickReduceGuestQuantity}
                                    data-prodno={v.prodno}
                                    data-quantity={cartInfo?.quantity}
                                    data-cartno={cartInfo?.cartno}
                                  >
                                    -
                                  </button>
                                </div>
                                <div className="delete">
                                  <button
                                    onClick={onClickDeleteGuestCart}
                                    data-prodno={v.prodno}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <h3 className="noProduct">
                      No product in my shopping bag.
                    </h3>
                  )}
                </div>
              </div>
              <div className="orderDetailContainer">
                <h1>Order Detail</h1>
                <hr />
                <div className="orderDetailBox">
                  <div className="subject">
                    <h4>Subtotal</h4>
                    <h4>Standard Shipping</h4>
                    <h4>Duties</h4>
                  </div>
                  <div className="subPrice">
                    <h4>
                      $
                      {Array.isArray(guestCartData) &&
                        guestCartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                    <h4>Free</h4>
                    <h4>Excluded</h4>
                  </div>
                </div>
                <hr className="secondHR" />
                <div className="total">
                  <h4>Total</h4>
                  {/* 리듀스 함수를 사용해 cartDate의 각 원소를 합산후 리턴 */}
                  <h4>
                    $
                    {Array.isArray(guestCartData) &&
                      guestCartData.reduce((total, item) => {
                        return total + item.tprice;
                      }, 0)}
                  </h4>
                </div>
                <button onClick={moveToShipping}>Check Out</button>
              </div>
            </Container>
          )}
        </>
      )}
    </>
  );
});

export default Cart;
