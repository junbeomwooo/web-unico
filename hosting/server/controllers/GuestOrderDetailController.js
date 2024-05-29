const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const ProductService = require("../services/ProductService");
const MemberService = require("../services/MemberService");
const OrderDetailService = require("../services/OrderDetailService");
const CartService = require("../services/CartService");
const dayjs = require("dayjs");
const GuestOrderDetailService = require("../services/GuestOrderDetailService");
const { pagenation } = require("../helper/UtilHelper");

module.exports = (() => {
  const url = "/api/guest_order_detail";
  const router = express.Router();

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
        const allCount = await GuestOrderDetailService.getCount();

        const params = {
          // 이미 email 파라미터를 통해 주문조회를 하는 구문이 있어 searchEmail로 검색기능이 가능하게 만듬
          searchEmail: email,
          orderStatus: orderStatus,
          orderMethod: orderMethod,
          startDate: startDate,
          endDate: endDate,
          sortOption: sortOption,
        };

        const totalCount = await GuestOrderDetailService.getCount(params);

        // 페이지네이션
        const pageInfo = pagenation(totalCount, page, rows);

        params.offset = pageInfo.offset;
        params.listCount = pageInfo.listCount;

        // 주문내역 가져오기
        const orders = await GuestOrderDetailService.getList(params);

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
        const totalCount = await GuestOrderDetailService.getCount();
        const params = {
          orderDateFilter: orderDateFilter,
        };

        // 주문내역 가져오기
        const orders = await GuestOrderDetailService.getList(params);

        res.sendResult({ item: orders, count: totalCount });
      } catch (err) {
        return next(err);
      }
    }
  });

  /** 홀드중인 세션 불러오기 --> Read(SELECT) */
  router.get("/api/guest_order_detailHolding", async (req, res, next) => {
    // 현재 사용중인 비회원 세션
    const orderSessionId = req.cookies.guest_orderHoding_session_id;

    // 세션 ID를 사용하여 해당 세션의 장바구니 데이터를 조회
    const currentUser = req.session[orderSessionId];

    try {
      res.sendResult({ item: currentUser });
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
        guest_orderno: orderno,
      };

      // 사용자의 장바구니 목록 조회
      const orderDetail = await GuestOrderDetailService.getItem(params);

      res.sendResult({ item: orderDetail });
    } catch (err) {
      return next(err);
    }
  });

  /** 데이터를 추가하기전 세션에 저장해놓기 위한 홀드 함수 생성 */
  router.post("/api/guest_order_detailHolding", async (req, res, next) => {
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

    try {
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
        };

        // 새로운 세션을 생성
        const timeStamp = Date.now();
        const uniqueSessionId = `${email}_${timeStamp}`; // 고유한 세션 ID 생성

        // 클라이언트에게 새로 생성한 세션 ID를 쿠키로 전달
        res.cookie("guest_orderHoding_session_id", uniqueSessionId);

        req.session[uniqueSessionId] = array;

        req.session[uniqueSessionId].push(params);

        logger.debug(req.session[uniqueSessionId]);
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
    const guestOrderSessionId = req.cookies.guest_orderHoding_session_id;

    // 클라이언트로부터 장바구니 세션 ID 확인
    const guestCartSessionId = req.cookies.guest_session_id;

    // 세션 ID를 사용하여 해당 세션의 장바구니 데이터를 조회
    const currentUser = req.session[guestOrderSessionId];

    // 현재 시간을 JavaScript 날짜 객체로 생성
    const nowtime = new Date();
    const currentTime = dayjs(nowtime).format("YYYY-MM-DD");

    // 데이터를 담을 변수 생성
    let json = null;
    // 빈 배열 생성
    let array = [];
    try {
      // 데이터 배열의 갯수 만큼 반복문
      for (let i = 0; i < currentUser?.length; i++) {
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
          product_prodno: currentInfo.product_prodno,
        };

        // DB 주문내역에 추가
        json = await GuestOrderDetailService.addItem(params);
        array.push(json);
      }

      // // 세션 카트에 있던 품목을 주문내역에 추가 후 카트목록에서 빈 배열로 초기화
      req.session[guestCartSessionId] = [];

      res.sendResult({ item: array });
      logger.debug(json);
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  });

  /** 전달받은 이메일값을 통하여 조회 */
  router.post(`${url}_guestOrder`, async (req, res, next) => {
    const { email } = req.body;
    try {
      // 입력된 계정 이름으로 데이터 베이스 조회
      const guest = await GuestOrderDetailService.getList({ email: email });

      // 같은 이메일을 찾지 못할 경우
      if (!guest.length) {
        res.status(401).send({
          rt: "Account Error",
          rtcode: 401,
          rtmsg: "Wrong email address.",
        });

        return;
      }
      res.sendResult({ guestTrack: guest[0].email });
    } catch (err) {
      return next(err);
    }
  });

  /** 전달받은 이메일을 통하여 다중행 조회 */
  router.get(`${url}_guestOrder`, async (req, res, next) => {
    // (페이지 번호(nowPage), 한 페이지에 표시할 목록 수(listCount)를 알수있는)파라미터
    const {
      page = 1,
      rows = 10,
      sortBy = "guest_orderno",
      sortOrder = "desc",
      email,
    } = req.query;

    try {
      // 회원번호를 통한 전체 주문내역 가져오기
      const totalCount = await GuestOrderDetailService.getCount({
        email: email,
      });

      // 페이지네이션에 총 데이터 수와 페이지, 페이지 별 상품 수를 전달
      const pageInfo = pagenation(totalCount, page, rows);

      // 전송할 파라미터
      const params = {
        email: email,
        // 페이지네이션 유틸 파일에서 받아온 값 사용
        offset: pageInfo.offset,
        listCount: pageInfo.listCount,
        // 정렬 기준 값
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      // 사용자의 장바구니 목록 조회
      const guestOrderDetails = await GuestOrderDetailService.getList(params);

      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
      const orderDetailsWithProducts = [];

      // 각 주문에 대한 상품의 자세한 정보 조회
      // 배열의 순서가 중요하기 때문에 for of 사용
      for (const guestOrderDetail of guestOrderDetails) {
        const productDetail = await ProductService.getItem({
          prodno: guestOrderDetail.product_prodno,
        });
        // 주문과 상품 정보를 합치기
        orderDetailsWithProducts.push({ ...guestOrderDetail, productDetail });
      }

      res.sendResult({ pagenation: pageInfo, item: orderDetailsWithProducts });
    } catch (err) {
      return next(err);
    }
  });

  /** 상품 환불 --> put */
  router.put(`${url}_guestOrder/:orderno`, async (req, res, next) => {
    // 파라미터 받기
    const { orderno } = req.params;
    const { status, email } = req.body;

    try {
      // 입력된 계정 이름으로 데이터 베이스 조회
      const guest = await GuestOrderDetailService.getList({ email: email });

      // 같은 이메일을 찾지 못할 경우
      if (!guest.length) {
        res.status(401).send({
          rt: "Account Error",
          rtcode: 401,
          rtmsg: "Wrong email address.",
        });

        return;
      }

      const params = {
        email: email,
        guest_orderno: orderno,
        status: status,
      };

      const guest_order_detail = await GuestOrderDetailService.editItem(params);

      res.sendResult(guest_order_detail);
    } catch (err) {
      return next(err);
    }
  });

  /** 상품 수정 --> put */
  router.put(`${url}/:orderno`, async (req, res, next) => {
    // 파라미터 받기
    const { guest_orderno, status } = req.body;

    try {
      const params = {
        guest_orderno: guest_orderno,
        status: status,
      };

      const guest_order_detail = await GuestOrderDetailService.editItem(params);

      res.sendResult({ item: guest_order_detail });
    } catch (err) {
      return next(err);
    }
  });

  return router;
})();
