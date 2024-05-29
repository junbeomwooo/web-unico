import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import mq from "../MediaQuery/MediaQuery";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import { styled } from "styled-components";

// 제품정보 받아오기
import { getItem } from "../slices/ProductSlice";
// 회원전용 카트정보 받아오기
import { postItem, getList, deleteItem, putItem } from "../slices/CartSlice";
// 비회원 전용 카트정보 받아오기
import {
  guestPostItem,
  guestGetList,
  guestDeleteItem,
  guestPutItem,
} from "../slices/GuestCartSlice";
// 로그인 검사
import { loginCheck } from "../slices/MemberSlice";

const ProductContainer = styled.div`
  padding-top: 130px;

  .productBox {
    display: flex;
    justify-content: center;

    ${mq.maxWidth("md")`
            flex-direction: column;
            margin : 0 55px;
        `}

    .imageBox {
      width: 670px;

      ${mq.maxWidth("xl")`
                width: 500px;
            `}

      ${mq.maxWidth("lg")`
                width: 400px;
            `}

            ${mq.maxWidth("md")`
                width: 100%;
            `}

            .rest {
        max-width: 15%;
        height: auto;
        justify-content: space-between;
        margin: 10px 5.55px 0px 5.55px;
        box-sizing: border-box;

        &:hover {
          cursor: pointer;
          border: 1px solid #acb5bd;

          ${mq.maxWidth("lg")`
                        cursor: default;
                        border: none;
                    `}

          ${mq.maxWidth("md")`
                        cursor: pointer;
                        border: 1px solid #ACB5BD; 
                    `}
        }

        ${mq.maxWidth("lg")`
                    max-width: 100%;
                `}

        ${mq.maxWidth("md")`
                    max-width: 15%;
                `}
      }

      :first-child {
        max-width: 100%;
        height: auto;

        ${mq.maxWidth("lg")`
                    display:none;
                `}

        ${mq.maxWidth("md")`
                    display:block;
                `}
      }
    }
    .productInfo {
      width: 360px;
      margin-left: 150px;

      ${mq.maxWidth("xl")`
                width: 300px;
                margin-left: 60px;
            `}

      ${mq.maxWidth("lg")`
                width: 250px;
            `}

            ${mq.maxWidth("md")`
                margin-left: 0px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
            `}

            h1 {
        margin-top: 35px;
        font-size: 23px;

        ${mq.maxWidth("xl")`
                    margin-top: 20px
                `}

        ${mq.maxWidth("md")`
                    margin-top: 45px;
                `}
      }

      h3 {
        margin-top: 40px;
        font-size: 16px;

        ${mq.maxWidth("xl")`
                    margin-top: 30px
                `}

        ${mq.maxWidth("md")`
                    margin-top: 25px;
                `}
      }

      p {
        margin-top: 40px;
        line-height: 30px;
        font-size: 15px;

        ${mq.maxWidth("xl")`
                    margin-top: 30px
                `}
      }

      ${mq.maxWidth("md")`
                    margin-top: 25px;
            `}

      .buttons {
        margin-top: 80px;

        ${mq.maxWidth("xl")`
                    margin-top: 30px
                `}

        ${mq.maxWidth("md")`
                    margin-top: 25px;
                    width: 100%;
                `}

                button {
          width: 85%;
          height: 50px;
          font-size: 16px;

          ${mq.maxWidth("md")`
                        width: 100%;
                    `}

          &:hover {
            cursor: pointer;
          }
        }

        .buyNow {
          background-color: black;
          color: white;
          border: none;
          margin-top: 20px;
        }

        .addShopping {
          background-color: white;
          color: black;
          border: 1px solid black;
        }
      }

      h2 {
        font-size: 18px;
        margin-top: 80px;

        ${mq.maxWidth("xl")`
                    margin-top: 45px
                `}
      }

      p {
        font-size: 15px;
        white-space: pre-line;
        word-break: break-all;
        margin-top: 40px;

        ${mq.maxWidth("xl")`
                    margin-top: 30px
                `}
        ${mq.maxWidth("md")`
                    margin-top: 20px;
                `}
      }
    }
  }

  .imageContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 150px;
    margin-bottom: 100px;

    ${mq.maxWidth("lg")`
            display:none;
        `}

    img {
      width: 50%;
      height: auto;
    }
  }
`;

const CartContainer = styled.div`
  height: 100%;
  width: 300px;
  position: fixed;
  right: ${(props) => props.shoppingcart};
  transition: right 0.3s ease-in-out;
  top: 0;
  z-index: 999;
  background-color: white;
  padding: 40px 20px;

  .header {
    display: flex;
    justify-content: space-between;

    h1 {
      font-size: 16.5px;
    }

    button {
      border: none;
      background-color: white;
      font-size: 21.5px;
      font-weight: 200;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .addedProduct {
    height: 640px;
    margin-top: 25px;

    .cartBox {
      display: flex;
      margin-top: 25px;

      img {
        width: 105px;
        height: 105px;
      }

      .productInfo {
        margin-left: 20px;
        h4 {
          margin: 0;
          font-size: 13.5px;
          padding-bottom: 5px;
        }

        h5 {
          margin: 0;
          padding-top: 8px;
          font-size: 10.5px;
        }

        .pdbuttons {
          margin-top: 17.5px;
          display: flex;
          border: 1px solid black;
          width: 75px;
          height: 22px;

          button {
            width: 25px;
            border: none;
            background-color: white;

            &:hover {
              cursor: pointer;
            }
          }

          h5 {
            padding: 0;
            margin-top: 4px;
            width: 25px;
            display: block;
            text-align: center;
          }
        }
      }

      .delete {
        button {
          border: none;
          background-color: white;
          margin-left: 42px;
          margin-top: 85px;
          text-decoration: underline;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    hr {
      border: 0.5px solid #e0e0e0;
      margin-top: 25px;
    }
  }

  .payment {
    div {
      display: flex;
      height: 30px;
      justify-content: space-between;

      h2 {
        font-size: 14px;
        font-weight: 500;
      }

      h3 {
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .buttons {
    margin-top: 20px;
    button {
      border: 1px solid black;
      width: 100%;
      color: white;
      background-color: black;
      height: 38px;

      &:nth-child(2) {
        background-color: white;
        color: black;
        margin-top: 8px;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const BackGround = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  left: 0;
  top: 0;
  z-index: 100;
  position: fixed;
`;

const ProductView = memo(() => {
  /** path파라미터 받기 */
  const { prodno } = useParams();

  /** 이미지 세팅 상태값 */
  const [activeImage, setActiveImage] = useState("");

  /** 쇼핑카트 상태값 */
  const [shoppingcart, setShoppingCart] = useState("-330px");

  /** 강제 이동 함수 */
  const navigate = useNavigate();
  /** 리덕스 */
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.MemberSlice);
  const { data, loading, error } = useSelector((state) => state.ProductSlice);
  const { data: cartData, productDetails } = useSelector(
    (state) => state.CartSlice
  );
  const { data: guestCartData, productDetails: guestProductDetails } =
    useSelector((state) => state.GuestCartSlice);

  /** 초반 렌더링시 데이터 가져오기 */
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      getItem({
        prodno: prodno,
      })
    );
    dispatch(loginCheck());
  }, []);

  console.log(isLoggedIn);

  /** 마우스 호버 시 이벤트 값 */
  const onMouseHover = useCallback((image) => {
    if (window.innerWidth > 992 || window.innerWidth <= 768) {
      setActiveImage(image);
    }
  });

  /** 회원 전용 카트 이벤트 목록 */

  // Add to Shopping Cart 이벤트 값
  const onClickAddtoCart = useCallback((e) => {
    e.preventDefault();
    setShoppingCart("0");
    dispatch(
      postItem({
        prodno: data.prodno,
        quantity: 1,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        dispatch(getList()).then();
      } else if (response.payload.data.rt === "BadRequestException") {
        alert(response.payload.data.rtmsg);
      } else {
        console.error(response);
      }
    });
  });

  // 쇼핑 컨테이너 닫기
  const onClickCartClose = useCallback((e) => {
    e.preventDefault();
    setShoppingCart("-330px");
  });

  // 쇼핑백 자세히 보기
  const onClickMoveToShopping = useCallback((e) => {
    navigate("/member/cart");
    setShoppingCart("-330px");
  });

  // 장바구니 목록 삭제
  const onClickDeleteCartProduct = useCallback((e) => {
    const prodno = e.currentTarget.dataset.prodno;
    dispatch(
      deleteItem({
        prodno: prodno,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        // 삭제가 성공하면 장바구니 목록을 불러옴
        dispatch(getList()).then((response) => {
          if (response.payload.item.length === 0) {
            setShoppingCart("-330px");
          }
        });
      }
    });
  });

  // 장바구니 제품 수량 늘리기
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
          dispatch(getList()).then((response) => {
            // 카트 목록에 더이상 아무 데이터가 없다면 장바구니 화면 닫기
            if (response.payload.item.length < 1) {
              setShoppingCart("-330px");
            }
          });
        }
      });
    }
  });
  // checkOut버튼
  const onClickCheckOut = useCallback((e) => {
    e.preventDefault();
    dispatch(
      postItem({
        prodno: data.prodno,
        quantity: 1,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        navigate("/member/cart");
      }
    });
  });

  /** 비회원 이벤트 목록 */

  // 비회원 장바구니 추가 이벤트 값
  const onClickAddtoGuestCart = useCallback((e) => {
    e.preventDefault();
    setShoppingCart("0");
    dispatch(
      guestPostItem({
        prodno: data.prodno,
        quantity: 1,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        dispatch(guestGetList()).then();
      } else if (response.payload.data.rt === "BadRequestException") {
        alert(response.payload.data.rtmsg);
      } else {
        console.error(response);
      }
    });
  });

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
        dispatch(guestGetList()).then((response) => {
          if (response.payload.item.length === 0) {
            setShoppingCart("-330px");
          }
        });
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
          dispatch(guestGetList()).then((response) => {
            // 카트 목록에 더이상 아무 데이터가 없다면 장바구니 화면 닫기
            if (response.payload.item.length < 1) {
              setShoppingCart("-330px");
            }
          });
        }
      });
    }
  });
  // 체크아웃 버튼
  const onClickGuestCheckOut = useCallback((e) => {
    e.preventDefault();
    dispatch(
      guestPostItem({
        prodno: data.prodno,
        quantity: 1,
      })
    ).then((response) => {
      if (response.payload.rtcode === 200) {
        navigate("/member/cart");
      }
    });
  });

  /** shipping 페이지로 넘어가기 */
  const moveToShipping = useCallback((e) => {
    e.preventDefault();
    navigate("/checkout_shipping");
  });

  return (
    <>
      {/** 로딩바  */}
      <Spinner loading={loading} />

      {error ? (
        <ErrorView error={error} />
      ) : (
        data && (
          <>
            {/** 조회결과 표시 */}
            <ProductContainer>
              <div className="productBox">
                <div className="imageBox">
                  {data.img1 && (
                    <img
                      className="activeImage"
                      src={activeImage || data.img1}
                      alt={data.title}
                    />
                  )}
                  {data.img1 && (
                    <img
                      className="rest"
                      src={data.img1}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img1)}
                    />
                  )}
                  {data.img2 && (
                    <img
                      className="rest"
                      src={data.img2}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img2)}
                    />
                  )}
                  {data.img3 && (
                    <img
                      className="rest"
                      src={data.img3}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img3)}
                    />
                  )}
                  {data.img4 && (
                    <img
                      className="rest"
                      src={data.img4}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img4)}
                    />
                  )}
                  {data.img5 && (
                    <img
                      className="rest"
                      src={data.img5}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img5)}
                    />
                  )}
                  {data.img6 && (
                    <img
                      className="rest"
                      src={data.img6}
                      alt={data.title}
                      onMouseOver={() => onMouseHover(data.img6)}
                    />
                  )}
                </div>
                <div className="productInfo">
                  <h1>{data.title}</h1>
                  <h3>${data.price}</h3>
                  <p>{data.content}</p>
                  <div className="buttons">
                    {/* 로그인이 되어있다면 onClickAddtoCart 실행
                    안되어 있다면 onClickAddtoGuestCart 실행 */}
                    <button
                      className="addShopping"
                      onClick={
                        isLoggedIn === true
                          ? onClickAddtoCart
                          : onClickAddtoGuestCart
                      }
                    >
                      Add to Shopping Cart
                    </button>
                    {/* 로그인이 되어있다면 onClickCheckOut 실행
                    안되어 있다면 onClickGuestCheckOut 실행 */}
                    <button
                      className="buyNow"
                      onClick={
                        isLoggedIn === true
                          ? onClickCheckOut
                          : onClickGuestCheckOut
                      }
                    >
                      Proceed to Check Out
                    </button>
                  </div>
                  <h2>Product Size</h2>
                  <p>{data.size}</p>
                </div>
              </div>
              <div className="imageContainer">
                {data.img1 && <img src={data.img1} alt={data.title} />}
                {data.img2 && <img src={data.img2} alt={data.title} />}
                {data.img3 && <img src={data.img3} alt={data.title} />}
                {data.img4 && <img src={data.img4} alt={data.title} />}
                {data.img5 && <img src={data.img5} alt={data.title} />}
                {data.img6 && <img src={data.img6} alt={data.title} />}
              </div>
            </ProductContainer>

            {/* 쇼핑카트 추가시 */}
            {shoppingcart && isLoggedIn === true ? (
              // 회원일 경우
              <>
                {/* shoppingCart 위치가 -330이 아닐 경우에만 보여지기 */}
                {shoppingcart !== "-330px" && <BackGround />}

                <CartContainer shoppingcart={shoppingcart}>
                  <div className="mainBox">
                    <div className="header">
                      <h1>Shopping Bag</h1>
                      <button onClick={onClickCartClose}>×</button>
                    </div>
                    <div className="addedProduct">
                      {productDetails.length > 0 ? (
                        productDetails.map((v, i) => {
                          // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                          const cartInfo =
                            cartData &&
                            Array.isArray(cartData) &&
                            cartData.find(
                              (item) => item.product_prodno === v.prodno
                            );
                          return (
                            <div key={i}>
                              <div className="cartBox" key={i}>
                                <Link to={`/product/${v.prodno}`}>
                                  <img
                                    src={v.img1}
                                    alt={v.title}
                                  />
                                </Link>
                                <div className="productInfo">
                                  <h4>{v.title}</h4>
                                  <h5>${v.price}</h5>
                                  <h5>Duty not included</h5>

                                  <div className="pdbuttons">
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
                              <hr />
                            </div>
                          );
                        })
                      ) : (
                        <h3>No product in my shopping bag.</h3>
                      )}
                    </div>
                    <hr />
                    <div className="payment">
                      <div>
                        <h2>Standard Shipping</h2>
                        <h3>Free</h3>
                      </div>
                      <div>
                        <h2>Total</h2>
                        <h3>
                          {/* 리듀스 함수를 사용해 cartDate의 각 원소를 합산후 리턴 */}
                          $
                          {Array.isArray(cartData) &&
                            cartData.reduce((total, item) => {
                              return total + item.tprice;
                            }, 0)}
                        </h3>
                      </div>
                      <div>
                        <h2>Duties</h2>
                        <h3>Excluded</h3>
                      </div>
                    </div>
                    <div className="buttons">
                      <button onClick={moveToShipping}>CheckOut</button>
                      <button onClick={onClickMoveToShopping}>
                        View Shipping Bag
                      </button>
                    </div>
                  </div>
                </CartContainer>
              </>
            ) : (
              // 비회원일 경우
              <>
                {/* shoppingCart 위치가 -330이 아닐 경우에만 보여지기 */}
                {shoppingcart !== "-330px" && <BackGround />}

                <CartContainer shoppingcart={shoppingcart}>
                  <div className="mainBox">
                    <div className="header">
                      <h1>Shopping Bag</h1>
                      <button onClick={onClickCartClose}>×</button>
                    </div>
                    <div className="addedProduct">
                      {guestProductDetails.length > 0 ? (
                        guestProductDetails.map((v, i) => {
                          // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                          const cartInfo =
                            guestCartData &&
                            Array.isArray(guestCartData) &&
                            guestCartData.find(
                              (items) => items.product_prodno === v.prodno
                            );
                          return (
                            <div key={i}>
                              <div className="cartBox" key={i}>
                                <Link to={`/product/${v.prodno}`}>
                                  <img
                                    src={v.img1}
                                    alt={v.title}
                                  />
                                </Link>
                                <div className="productInfo">
                                  <h4>{v.title}</h4>
                                  <h5>${v.price}</h5>
                                  <h5>Duty not included</h5>

                                  <div className="pdbuttons">
                                    <button
                                      onClick={onClickAddGuestQuantity}
                                      data-prodno={v.prodno}
                                      data-quantity={cartInfo?.quantity}
                                    >
                                      +
                                    </button>
                                    <h5>{cartInfo?.quantity}</h5>
                                    <button
                                      onClick={onClickReduceGuestQuantity}
                                      data-prodno={v.prodno}
                                      data-quantity={cartInfo?.quantity}
                                    >
                                      -
                                    </button>
                                  </div>
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
                              <hr />
                            </div>
                          );
                        })
                      ) : (
                        <h3>No product in my shopping bag.</h3>
                      )}
                    </div>
                    <hr />
                    <div className="payment">
                      <div>
                        <h2>Standard Shipping</h2>
                        <h3>Free</h3>
                      </div>
                      <div>
                        <h2>Total</h2>
                        <h3>
                          {/* 리듀스 함수를 사용해 cartDate의 각 원소를 합산후 리턴 */}
                          $
                          {Array.isArray(guestCartData) &&
                            guestCartData.reduce((total, item) => {
                              return total + item.tprice;
                            }, 0)}
                        </h3>
                      </div>
                      <div>
                        <h2>Duties</h2>
                        <h3>Excluded</h3>
                      </div>
                    </div>
                    <div className="buttons">
                      <button onClick={moveToShipping}>CheckOut</button>
                      <button onClick={onClickMoveToShopping}>
                        View Shipping Bag
                      </button>
                    </div>
                  </div>
                </CartContainer>
              </>
            )}
          </>
        )
      )}
    </>
  );
});

export default ProductView;
