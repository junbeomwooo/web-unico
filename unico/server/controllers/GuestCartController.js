const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const CartService = require("../services/CartService");
const ProductService = require("../services/ProductService");
const MemberService = require("../services/MemberService");
const { BadRequestException } = require("../helper/ExceptionHelper");

module.exports = (() => {
  const url = "/api/guest_cart";
  const router = express.Router();

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {

    // 현재 사용중인 비회원 세션
    const guestSessionId = req.cookies.guest_session_id;

    // 세션 ID를 사용하여 해당 세션의 장바구니 데이터를 조회
    const currentGuest = req.session[guestSessionId];

    try {
      res.sendResult({ item : currentGuest });

    } catch (err) {
      return next(err);
    }
  });

  // 제품의 자세한 정보 조회 API
router.get("/api/product/:id", async (req, res, next) => {
  try {
      const { productId } = req.params // URL 파라미터로부터 제품 ID 추출

      // 이제 productId를 사용하여 해당 제품의 자세한 정보를 조회
      const productDetails = await ProductService.getItem({ prodno: productId });

      res.sendResult({ productDetails: productDetails});
  } catch (err) {
      return next(err);
  }
});

    /** 장바구니에 추가 --> Create(INSERT) */
    router.post(url, async (req, res, next) => {
        const { prodno, quantity } = req.body; // 파라미터 받기

        // 클라이언트로부터 받은 세션 ID 확인
        let guestSessionId = req.cookies.guest_session_id;

        try {
          if (!guestSessionId) {
            // 세션 ID가 없는 경우, 새로운 세션을 생성
            const timeStamp = Date.now();
            const uniqueSessionId = `guest_${timeStamp}`; // 고유한 세션 ID 생성

            if (!req.session[uniqueSessionId]) {
              req.session[uniqueSessionId] = []; // 세션 데이터가 존재하지 않을 때만 초기화
          }

            // 클라이언트에게 새로 생성한 세션 ID를 쿠키로 전달
            res.cookie('guest_session_id', uniqueSessionId);
            // guestSessionId를 업데이트 (만약 sessionID값까지 바꾼다면 세션이 초기화 됨으로써 이전 데이터 내용이 초기화됌)
            guestSessionId = uniqueSessionId;       
        }
        
         // 제품의 정보 가져오기
        const product = await ProductService.getItem({
          prodno: prodno
        });

        if (product) {
            const tprice = quantity * product.price;
    
            // 장바구니에 제품 추가
            const newItem = {
                product_prodno: prodno,
                quantity: quantity,
                tprice: tprice
            };
            // 장바구니에 동일한 제품이 있는지 확인
            const existCart = req.session[guestSessionId]?.find(item => item.product_prodno === prodno);

            if (existCart) {
              // 동일한 제품이 있다면 quantity, tprice 증가
              existCart.quantity += quantity;
              existCart.tprice += tprice;

            } else {
              // 만약 4와 같거나 크다면 에러를 발생시킴
              if (req.session[guestSessionId]?.length >= 4) {
                throw new BadRequestException('You cannot add more than 4 items to your cart.')
              }

              // 장바구니에 없는 경우, 새로운 제품으로 추가
              if (!req.session[guestSessionId]) {
                // req.session값이 없을 경우 배열로써 newItem 대체
                req.session[guestSessionId] = [newItem];
              } else {
                // req.session값이 있을 경우 배열에 newItem 추가
                req.session[guestSessionId].push(newItem);
              }
            }

            res.sendResult({ item: "Product has been successfully added." });
        } else {
            return res.sendResult({ error: "해당 제품이 존재하지 않습니다." });
        }

        }catch(err) {
          
          return next(err);
        }
       
    });

//        /** 카트 정보 수정 */
       router.put(url, async (req, res, next) => {
        // 파라미터 받기
        const { product_prodno, quantity } = req.body;

        // 클라이언트로부터 받은 세션 ID 확인
        let guestSessionId = req.cookies.guest_session_id;
    
        try {
            
            // 제품의 id값을 이용하여 제품정보 가져오기
            const product = await ProductService.getItem({
              prodno: product_prodno
            });

            // 총 가격 구하기
            const tprice = quantity * product.price;

            // 현재 카트 정보 가져온 후 바뀌어야할 상품 인덱스 찾기
            const cart = req.session[guestSessionId] || [];
            const indexOfItemUpdate = cart.findIndex(item => item.product_prodno === parseInt(product_prodno));

            // 찾은 인덱스를 이용해서 업데이트
            if (indexOfItemUpdate !== -1) {
                cart[indexOfItemUpdate].quantity = quantity
                cart[indexOfItemUpdate].tprice = tprice;
            }

            req.session[guestSessionId] = cart;

        } catch(err) {
            return next(err);
        }
    
        res.sendResult({ item: req.session[guestSessionId]});
      });


    /** 장바구니 목록 삭제 --> put */
    // Delete는 payload를 통해서 파라미터로 전송하는게 허용되지 않는 거같음 그래서 put 메서드 사용
  router.put(`${url}/delete`, async (req, res, next) => {
    
    // 파라미터 받기
    const { prodno } = req.body;

    // 클라이언트로부터 받은 세션 ID 확인
    const guestSessionId = req.cookies.guest_session_id;

    try {
    
       // 장바구니에서 삭제할 제품의 인덱스 번호 찾기
       const indexToDelete = req.session[guestSessionId]?.findIndex(item => item.product_prodno === parseInt(prodno));

       if (indexToDelete !== -1) {
        // 찾은 인덱스 번호를 이용하여 장바구니의 물품제거
        req.session[guestSessionId]?.splice(indexToDelete, 1);
        res.sendResult({ item : 'Product has been successfully removed.'});

       } else {
        res.sendResult({ item : 'The product is not in the shopping cart.'});
       }

    } catch (err) {
      return next (err);
    }
  });  
    
      
  
  return router;
})();