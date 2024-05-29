const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const ProductService = require("../services/ProductService");
const MemberService = require("../services/MemberService");
const OrderDetailService = require("../services/OrderDetailService");
const CartService = require("../services/CartService");
const dayjs = require("dayjs");
const { pagenation } = require("../helper/UtilHelper");
const bcrypt = require("bcryptjs");

module.exports = (() => {
  const url = "/api/order_detail";
  const router = express.Router();

  //Payment Verification, Order Placed, Order Preparation, Shipped, Delivered

  // Refund Processing, Refund Completed

  /** 전체 주문내역 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {
    const {
      orderDateFilter = null,
      page = null,
      rows = null,
      email = null,
      orderStatus = null,
      orderMethod = null,
      startDate = null,
      endDate = null,
      sortOption = "desc",
    } = req.query;

    if ((page, rows)) {
      /** page와 rows가 있을 경우 */
      try {
        // 전체 데이터 수 얻기
        const allCount = await OrderDetailService.getCount();

        const params = {
          email: email,
          orderStatus: orderStatus,
          orderMethod: orderMethod,
          startDate: startDate,
          endDate: endDate,
          sortOption: sortOption,
        };

        // 페이지네이션을 구현하기 위해 전체 데이터 수 구하기
        const totalCount = await OrderDetailService.getCount(params);

        // 페이지네이션
        const pageInfo = pagenation(totalCount, page, rows);

        params.offset = pageInfo.offset;
        params.listCount = pageInfo.listCount;

        // 주문내역 가져오기
        const orders = await OrderDetailService.getList(params);

        /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
        const orderDetailsWithProducts = [];

        // 각 주문에 대한 상품의 자세한 정보 조회
        // 배열의 순서가 중요하기 때문에 for of 사용
        for (const orderDetail of orders) {
          const productDetail = await ProductService.getItem({
            prodno: orderDetail.product_prodno,
          });
          // 주문과 상품 정보를 합치기
          orderDetailsWithProducts.push({ ...orderDetail, productDetail });
        }

        res.sendResult({
          item: orderDetailsWithProducts,
          count: allCount,
          pagenation: pageInfo,
        });
      } catch (err) {
        return next(err);
      }
    } else {
      /** page와 rows가 없는 경우 */
      try {
        // 전체 데이터 수 얻기
        const totalCount = await OrderDetailService.getCount();

        const params = {
          orderDateFilter: orderDateFilter,
        };
        // 주문내역 가져오기
        const orders = await OrderDetailService.getList(params);

        res.sendResult({ item: orders, count: totalCount });
      } catch (err) {
        return next(err);
      }
    }
  });
  /** 유저번호를 통한 주문내역 조회 --> Read(SELECT) */
  router.get(`${url}_withMemberNo/:userno`, async (req, res, next) => {
    // (페이지 번호(nowPage), 한 페이지에 표시할 목록 수(listCount)를 알수있는)파라미터
    const { page = 1, rows = 5, sortOption, userno } = req.query;

    try {
      // 회원번호를 통한 전체 주문내역 가져오기
      const totalCount = await OrderDetailService.getCount({
        member_userno: userno,
      });

      // 페이지네이션에 총 데이터 수와 페이지, 페이지 별 상품 수를 전달
      const pageInfo = pagenation(totalCount, page, rows);

      // 전송할 파라미터
      const params = {
        member_userno: userno,
        // 페이지네이션 유틸 파일에서 받아온 값 사용
        offset: pageInfo.offset,
        listCount: pageInfo.listCount,
        sortOption: sortOption,
      };

      // admin/MemberView.js 의 그래프를 위한 총 데이터를 구하기 위함
      const totalOrders = await OrderDetailService.getList({
        member_userno: userno,
      });

      // 사용자의 장바구니 목록 조회
      const orderDetails = await OrderDetailService.getList(params);

      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
      const orderDetailsWithProducts = [];

      // 각 주문에 대한 상품의 자세한 정보 조회
      // 배열의 순서가 중요하기 때문에 for of 사용
      for (const orderDetail of orderDetails) {
        const productDetail = await ProductService.getItem({
          prodno: orderDetail.product_prodno,
        });
        // 주문과 상품 정보를 합치기
        orderDetailsWithProducts.push({ ...orderDetail, productDetail });
      }

      res.sendResult({
        pagenation: pageInfo,
        item: orderDetailsWithProducts,
        totalOrders: totalOrders,
      });
    } catch (err) {
      return next(err);
    }
  });

  /** 로그인 중인 유저번호를 통한 주문내역 조회 --> Read(SELECT) */
  router.get(`${url}_memberNo`, async (req, res, next) => {
    // (페이지 번호(nowPage), 한 페이지에 표시할 목록 수(listCount)를 알수있는)파라미터
    const {
      page = 1,
      rows = 10,
      sortBy = "orderno",
      sortOrder = "desc",
    } = req.query;

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 회원번호를 통한 전체 주문내역 가져오기
      const totalCount = await OrderDetailService.getCount({
        member_userno: user.userno,
      });

      // 페이지네이션에 총 데이터 수와 페이지, 페이지 별 상품 수를 전달
      const pageInfo = pagenation(totalCount, page, rows);

      // 전송할 파라미터
      const params = {
        member_userno: user.userno,
        // 페이지네이션 유틸 파일에서 받아온 값 사용
        offset: pageInfo.offset,
        listCount: pageInfo.listCount,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      // 사용자의 장바구니 목록 조회
      const orderDetails = await OrderDetailService.getList(params);

      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
      const orderDetailsWithProducts = [];

      // 각 주문에 대한 상품의 자세한 정보 조회
      // 배열의 순서가 중요하기 때문에 for of 사용
      for (const orderDetail of orderDetails) {
        const productDetail = await ProductService.getItem({
          prodno: orderDetail.product_prodno,
        });
        // 주문과 상품 정보를 합치기
        orderDetailsWithProducts.push({ ...orderDetail, productDetail });
      }

      res.sendResult({ pagenation: pageInfo, item: orderDetailsWithProducts });
    } catch (err) {
      return next(err);
    }
  });

  /** 제품의 자세한 정보 조회 API */
  router.get(`${url}/:orderno`, async (req, res, next) => {
    try {
      const { orderno } = req.params; // URL 파라미터로부터 제품 ID 추출

      // 전송할 파라미터
      const params = {
        orderno: orderno,
      };

      // 사용자의 장바구니 목록 조회
      const orderDetail = await OrderDetailService.getItem(params);

      res.sendResult({ item: orderDetail });
    } catch (err) {
      return next(err);
    }
  });

  /** 홀드중인 세션 불러오기 --> Read(SELECT) */
  router.get("/api/order_detailHolding", async (req, res, next) => {
    // 현재 사용중인 비회원 세션
    const orderSessionId = req.cookies.orderHoding_session_id;

    // 세션 ID를 사용하여 해당 세션의 장바구니 데이터를 조회
    const currentUser = req.session[orderSessionId];

    try {
      res.sendResult({ item: currentUser });
    } catch (err) {
      return next(err);
    }
  });

  /** 데이터를 추가하기전 세션에 저장해놓기 위한 홀드 함수 생성 */
  router.post("/api/order_detailHolding", async (req, res, next) => {
    const {
      email,
      name,
      gender,
      phonenumber,
      address,
      city,
      zipcode,
      province,
      country,
      quantites,
      products,
    } = req.body; // 파라미터 받기

    // 입력값 공백 제거
    const processedEmail = email.trim().toLowerCase();
    const processedName = name.trim().toUpperCase();
    const processedPhone = phonenumber.trim();
    const processedAddress = address.toLowerCase().trim();
    const processedCity = city.trim().toLowerCase();
    const processedZipcode = zipcode.trim();
    const processedProvince = province.trim().toLowerCase();

    // 유효성 검사
    try {
      regexHelper.value(processedEmail, "Please enter your email.");
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.eng(processedName, "Please enter name in English.");
      regexHelper.value(gender, "Please select gender.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
      regexHelper.phone(
        processedPhone,
        "Please enter correct phone number format."
      );
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(country, "Please select your country.");
    } catch (err) {
      return next(err);
    }

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      let totalPrice = 0;
      let array = [];

      // 각 상품에 대한 처리를 상품의 갯수만큼 반복
      for (let i = 0; i < products.length; i++) {
        const product_prodno = products[i];
        const quantity = quantites[i];

        // 제품의 id값을 이용하여 제품정보 가져오기
        const product = await ProductService.getItem({
          prodno: product_prodno,
        });

        // 총 가격 구하기
        const tprice = quantity * product.price;
        totalPrice += tprice;

        // 전송할 파라미터
        const params = {
          email: processedEmail,
          name: processedName,
          gender: gender,
          phonenumber: processedPhone,
          address: processedAddress,
          city: processedCity,
          zipcode: processedZipcode,
          province: processedProvince,
          country: country,
          quantity: quantity,
          product_prodno: product_prodno,
          tprice: tprice,
          member_userno: user.userno,
        };

        // 새로운 세션을 생성
        const timeStamp = Date.now();
        const uniqueSessionId = `${user.userno}_${timeStamp}`; // 고유한 세션 ID 생성

        // 클라이언트에게 새로 생성한 세션 ID를 쿠키로 전달
        res.cookie("orderHoding_session_id", uniqueSessionId);

        req.session[uniqueSessionId] = array;

        req.session[uniqueSessionId].push(params);
      }

      res.sendResult({ totalPrice });
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  });

  /** 오더 리스트 추가 --> Create(INSERT) */
  router.post(url, async (req, res, next) => {
    const { status, payment_method } = req.body; // 파라미터 받기

    // 현재 사용중인 비회원 세션
    const orderSessionId = req.cookies.orderHoding_session_id;

    // 세션 ID를 사용하여 해당 세션의 장바구니 데이터를 조회
    const currentUser = req.session[orderSessionId];

    // 현재 시간을 JavaScript 날짜 객체로 생성
    const nowtime = new Date();
    const currentTime = dayjs(nowtime).format("YYYY-MM-DD");

    // 데이터를 담을 변수 생성
    let json = null;
    // 빈 배열 생성
    let array = [];
    try {
      // 데이터 배열의 갯수 만큼 반복문
      for (let i = 0; i < currentUser.length; i++) {
        const currentInfo = currentUser[i];

        // 전송할 파라미터
        const params = {
          email: currentInfo.email,
          name: currentInfo.name,
          gender: currentInfo.gender,
          phonenumber: currentInfo.phonenumber,
          address: currentInfo.address,
          city: currentInfo.city,
          zipcode: currentInfo.zipcode,
          province: currentInfo.province,
          country: currentInfo.country,
          tprice: currentInfo.tprice,
          quantity: currentInfo.quantity,
          status: status,
          payment_method: payment_method,
          order_date: currentTime,
          member_userno: currentInfo.member_userno,
          product_prodno: currentInfo.product_prodno,
        };

        // DB 주문내역에 추가
        json = await OrderDetailService.addItem(params);
        array.push(json);

        // DB 카트에 있던 품목을 주문내역에 추가 후 카트목록에서 삭제
        await CartService.deleteItem(params);
      }

      res.sendResult({ item: array });
      logger.debug(json);
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  });

  /** 상품 환불 --> put */
  router.put(`${url}_refund/:orderno`, async (req, res, next) => {
    // 파라미터 받기
    const { orderno } = req.params;
    const { status } = req.body;

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      const params = {
        member_userno: user.userno,
        orderno: orderno,
        status: status,
      };

      const order_detail = await OrderDetailService.editItem(params);

      res.sendResult(order_detail);
    } catch (err) {
      return next(err);
    }
  });

  /** 멤버일 때 아이디와 비밀번호가 일치하는 지 확인 후 만약 맞다면 해당 아이디 값 전달 */
  router.post(`${url}_memberOrder`, async (req, res, next) => {
    const { account, userpw } = req.body;
    try {
      // 입력된 계정 이름으로 데이터 베이스 조회
      const user = await MemberService.getAccount({ account: account });

      // 같은 계정이름을 찾지 못할 경우
      if (!user) {
        res.status(401).send({
          rt: "Account Error",
          rtcode: 401,
          rtmsg: "Wrong account name or password.",
        });

        return;
      }

      // 유저가 이미 탈퇴한 상황이라면
      if (user.is_out !== null) {
        const isOut = user.is_out.toString();

        if (isOut === "Y") {
          res.status(401).send({
            rt: "Account Error",
            rtcode: 401,
            rtmsg: "This account is not available.",
          });
          return;
        }
      }

      // 사용자가 입력한 비밀번호로 데이터베이스의 비밀번호와 일치하는지 조회
      const passwordMatch = await bcrypt.compare(userpw, user.userpw);

      if (passwordMatch) {
        res.sendResult({ memberTrack: user.account });
      } else {
        // 로그인 실패시
        res.status(401).send({
          rt: "Password Error",
          rtcode: 401,
          rtmsg: "Wrong account name or password.",
        });
      }
    } catch (err) {
      return next(err);
    }
  });

  /** 전달받은 아이디값을 통하여 다중행 조회 */
  router.get(`${url}_memberOrder`, async (req, res, next) => {
    // (페이지 번호(nowPage), 한 페이지에 표시할 목록 수(listCount)를 알수있는)파라미터
    const {
      page = 1,
      rows = 10,
      sortBy = "orderno",
      sortOrder = "desc",
      account,
    } = req.query;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: account,
      });

      // 회원번호를 통한 전체 주문내역 가져오기
      const totalCount = await OrderDetailService.getCount({
        member_userno: user.userno,
      });

      // 페이지네이션에 총 데이터 수와 페이지, 페이지 별 상품 수를 전달
      const pageInfo = pagenation(totalCount, page, rows);

      // 전송할 파라미터
      const params = {
        member_userno: user.userno,
        // 페이지네이션 유틸 파일에서 받아온 값 사용
        offset: pageInfo.offset,
        listCount: pageInfo.listCount,
        // 정렬 기준 값
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      // 사용자의 장바구니 목록 조회
      const orderDetails = await OrderDetailService.getList(params);

      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
      const orderDetailsWithProducts = [];

      // 각 주문에 대한 상품의 자세한 정보 조회
      // 배열의 순서가 중요하기 때문에 for of 사용
      for (const orderDetail of orderDetails) {
        const productDetail = await ProductService.getItem({
          prodno: orderDetail.product_prodno,
        });
        // 주문과 상품 정보를 합치기
        orderDetailsWithProducts.push({ ...orderDetail, productDetail });
      }

      res.sendResult({ pagenation: pageInfo, item: orderDetailsWithProducts });
    } catch (err) {
      return next(err);
    }
  });

  /** 상품 환불 --> put */
  router.put(`${url}_memberOrder/:orderno`, async (req, res, next) => {
    // 파라미터 받기
    const { orderno } = req.params;
    const { status, account } = req.body;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: account,
      });

      const params = {
        member_userno: user.userno,
        orderno: orderno,
        status: status,
      };

      const order_detail = await OrderDetailService.editItem(params);

      res.sendResult(order_detail);
    } catch (err) {
      return next(err);
    }
  });

  /** 상품 수정 --> put */
  router.put(`${url}/:orderno`, async (req, res, next) => {
    // 파라미터 받기
    const { orderno, status } = req.body;

    try {
      const params = {
        orderno: orderno,
        status: status,
      };

      const order_detail = await OrderDetailService.editItem(params);

      res.sendResult({ item: order_detail });
    } catch (err) {
      return next(err);
    }
  });

  return router;
})();
