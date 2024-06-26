const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const CartService = require("../services/CartService");
const ProductService = require("../services/ProductService");
const MemberService = require("../services/MemberService");

module.exports = (() => {
  const url = "/api/cart";
  const router = express.Router();

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {
    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 사용자의 장바구니 목록 조회
      const cartProduct = await CartService.getList({
        member_userno: user.userno,
      });

      res.sendResult({ item: cartProduct });
    } catch (err) {
      return next(err);
    }
  });

  /** 유저번호를 통한 주문내역 조회 --> Read(SELECT) */
  router.get(`${url}_withMemberNo/:userno`, async (req, res, next) => {
    // (페이지 번호(nowPage), 한 페이지에 표시할 목록 수(listCount)를 알수있는)파라미터
    const {
      userno
    } = req.query;

    try {

      // 전송할 파라미터
      const params = {
        member_userno: userno,
      };

      // 사용자의 장바구니 목록 조회
      const cartInfos = await CartService.getList(params);

      /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
      const cartDetailsWithProducts = [];

      // 각 주문에 대한 상품의 자세한 정보 조회
      // 배열의 순서가 중요하기 때문에 for of 사용
      for (const cartInfo of cartInfos) {
        const productDetail = await ProductService.getItem({
          prodno: cartInfo.product_prodno,
        });
        // 주문과 상품 정보를 합치기
        cartDetailsWithProducts.push({ ...cartInfo, productDetail });
      }

      res.sendResult({ item: cartDetailsWithProducts });
    } catch (err) {
      return next(err);
    }
  });

  // 제품의 자세한 정보 조회 API
  router.get("/api/product/:id", async (req, res, next) => {
    try {
      const { productId } = req.params; // URL 파라미터로부터 제품 ID 추출

      // 이제 productId를 사용하여 해당 제품의 자세한 정보를 조회
      const productDetails = await ProductService.getItem({
        prodno: productId,
      });

      res.sendResult({ productDetails: productDetails });
    } catch (err) {
      return next(err);
    }
  });

  /** 장바구니에 추가 --> Create(INSERT) */
  router.post(url, async (req, res, next) => {
    const { prodno, quantity } = req.body; // 파라미터 받기

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 제품의 id값을 이용하여 제품정보 가져오기
      const product = await ProductService.getItem({
        prodno: prodno,
      });

      // 총 가격 구하기
      const tprice = quantity * product.price;

      // 전송할 파라미터
      const params = {
        member_userno: user.userno,
        product_prodno: prodno,
        quantity: quantity,
        tprice: tprice,
      };

      const addedItem = await CartService.addItem(params);

      res.sendResult({ item: addedItem });
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  });

  /** 카트 정보 수정 */
  router.put(url, async (req, res, next) => {
    // 파라미터 받기
    const { cartno, product_prodno, quantity } = req.body;

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    // 데이터 수정
    let json = null;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 제품의 id값을 이용하여 제품정보 가져오기
      const product = await ProductService.getItem({
        prodno: product_prodno,
      });

      // 총 가격 구하기
      const tprice = quantity * product.price;

      json = await CartService.editItem({
        cartno: cartno,
        member_userno: user.userno,
        product_prodno: product_prodno,
        quantity: quantity,
        tprice: tprice,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 장바구니 목록 삭제 --> put */
  // 이 기능 경우엔 쿼리스트링을 이용한 게 아닌 한 페이지에서 여러 상품을 담고 있으므로 상품의 아이디값을
  // 데이터 값으로 전달하므로 req.body로 받는데 이러한 경우에는 delete가 작동을 안해 put 메서드를 사용
  router.put(`${url}/delete`, async (req, res, next) => {
    // 파라미터 받기
    const { prodno } = req.body;

    // 현재 사용중인 세션 로그인 정보
    const currentUser = req.session.user;

    try {
      // 로그인 중인 계정을 이용해 로그인 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      const params = {
        member_userno: user.userno,
        product_prodno: prodno,
      };

      await CartService.deleteItem(params);
    } catch (err) {
      return next(err);
    }

    res.sendResult();
  });

  return router;
})();
