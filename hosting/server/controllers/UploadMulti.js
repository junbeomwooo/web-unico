const fileHelper = require("../helper/FileHelper");
const express = require("express");
const regexHelper = require("../helper/RegexHelper");
const ProductService = require("../services/ProductService");
const logger = require("../helper/LogHelper");
const { pagenation } = require("../helper/UtilHelper");

module.exports = (() => {
  const url = "/api/product";
  const router = express.Router();
  // 사진 업로드 (req.body로 formData를 제출 못하기떄문에 리덕스는 사용하지 않음)
  router.route("/upload/multiple").post((req, res, next) => {
    // 업로드 결과가 저장될 파일 객체를 배열로 초기화
    req.file = [];

    // name속성이 product경우에 대한 업로드를 수행
    // --> 설정파일에서 UPLOAD_MAX_ACCOUT에 지정한 수량만큼만 업로가 가능
    // --> UPLOAD_MAX_COUNT값을 -1로 지정할 경우 수량제한이 사라짐
    const upload = fileHelper.initMulter().array("product");

    upload(req, res, async (err) => {
      console.group("request");
      console.debug(req.file);
      console.groupEnd();

      // 에러여부를 확인하여 결과코드와 메세지를 생성한다.
      try {
        fileHelper.checkUploadError(err);
      } catch (err) {
        console.error(err);
        res.status(500).send({
          rt: err.code,
          rtmsg: err.message,
        });
        return;
      }

      // 썸네일을 생성 , 얕은복사를 이용한 결과값을 수정하여 프론트에 전송
      try {
        await fileHelper.createThumbnailMultiple(req.file);
      } catch (err) {
        console.error(err);
        res.status(500).send({
          rt: err.code,
          rtmsg: err.message,
        });
        return;
      }

      // 준비한 결과값 변수를 활용하여 클라이언트에게 응답을 보냄
      res.status(200).send(req.file);
    });
  });
  // 업로드 된 썸네일, 사진파일 삭제
  router.route("/upload/multiple").delete((req, res, next) => {
    const { filePath } = req.body;

    logger.debug(`filepath :::: ${JSON.stringify(filePath)}`);

    // filepath 이용하여 deleteFileAndThumbnail 함수 호출
    try {
      // filePath가 존재할 때만 실행
      if (filePath) {
        fileHelper.deleteFileAndThumbnail(filePath);
        res.sendResult({ item: "File and thumbnail deleted successfully." });
      }
    } catch (err) {
      return next(err);
    }
  });
  /** (인피니티스크롤)다중행 조회 */
  router.get(url, async (req, res, next) => {
    // 검색어 파라미터
    const {
      query,
      page,
      sub_category_subcateno,
      sortBy = "prodno",
      sortOrder = "desc",
    } = req.query;

    // 검색어 전달
    const params = {};
    if (query) {
      params.title = query;
    }

    // 페이지를 나누기 위해 현재 페이지와 페이지당 아이템 개수를 설정
    const itemsPerPage = 16;
    const currentPage = parseInt(page) || 1; //요청한 페이지 번호 (기본값:1)

    // 데이터 조회
    let json = null;
    let totalCount = null;

    try {
      if (sub_category_subcateno) {
        params.sub_category_subcateno = sub_category_subcateno;
      }

      // 전체 데이터 수 조회
      totalCount = await ProductService.getCount(params);

      // 정렬기준, 정렬기준 순서 params에 추가
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      // 페이지에 해당하는 데이터만 조회
      const startIndex = (currentPage - 1) * itemsPerPage; // 첫번째 인덱스
      const endIndex = startIndex + itemsPerPage; // 마지막 인덱스

      json = await ProductService.getList(params, startIndex, endIndex);
    } catch (err) {
      return next(err);
    }

    res.sendResult({ pagenation: totalCount, item: json });
  });

  /** (페이지네이션)다중행 조회 */
  router.get(`${url}_pagenation`, async (req, res, next) => {
    // 검색어 파라미터
    const {
      query = null,
      page = 1,
      sub_category_subcateno = null,
      sortOption = "desc",
      rows = 6,
    } = req.query;

    try {
      // 각 카테고리별 총 데이터 수 얻기
      const allCount = await ProductService.getCount();
      const sunglassesCount = await ProductService.getCount({
        sub_category_subcateno: 1,
      });
      const glassesCount = await ProductService.getCount({
        sub_category_subcateno: 2,
      });

      const count = { allCount, sunglassesCount, glassesCount };

      const params = {
        title: query,
        sub_category_subcateno: sub_category_subcateno,
        sortOption: sortOption,
      };
      // 전체 데이터 수 조회
      const totalCount = await ProductService.getCount(params);

      // 페이지네이션에 총 데이터 수와 페이지, 페이지 별 상품 수를 전달
      const pageInfo = pagenation(totalCount, page, rows);

      const startIndex = pageInfo.offset;
      const endIndex = pageInfo.listCount;

      const json = await ProductService.getList(params, startIndex, endIndex);

      res.sendResult({ pagenation: pageInfo, item: json, count: count });
    } catch (err) {
      return next(err);
    }
  });

  /** 단일행 조회 */
  router.get(`${url}/:prodno`, async (req, res, next) => {
    // 파라미터 받기
    const { prodno } = req.params;

    // 파라미터 유효성 검사
    try {
      regexHelper.value(prodno, "Product number does not exist. ");
      regexHelper.num(prodno, "Product number is incorrect.");
    } catch (err) {
      return next(err);
    }

    // 데이터 조회
    let json = null;

    try {
      json = await ProductService.getItem({
        prodno: prodno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 저장 */
  router.post(url, async (req, res, next) => {
    // 파라미터 받기
    const {
      title,
      price,
      content,
      size,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      is_sell,
      sub_category_subcateno,
    } = req.body;

    logger.debug(`title :::: ${title}`);
    logger.debug(`price :::: ${price}`);
    logger.debug(`content :::: ${content}`);
    logger.debug(`size :::: ${size}`);
    logger.debug(`img1 :::: ${img1}`);
    logger.debug(`img2 :::: ${img2}`);
    logger.debug(`img3 :::: ${img3}`);
    logger.debug(`img4 :::: ${img4}`);
    logger.debug(`img5 :::: ${img5}`);
    logger.debug(`img6 :::: ${img6}`);
    logger.debug(`is_sell :::: ${is_sell}`);
    logger.debug(`sub_category_subcateno :::: ${sub_category_subcateno}`);

    // 유효성 검사
    try {
      regexHelper.value(title, "Please enter title.");
      regexHelper.value(price, "Please enter price.");
      regexHelper.value(content, "Please enter product description.");
      regexHelper.value(size, "Please enter product size.");
      regexHelper.value(is_sell, "Please select sales status");
      regexHelper.value(
        sub_category_subcateno,
        "Please select type of product"
      );
      regexHelper.num(price, "Prices must be numeric only.");
      regexHelper.maxLength(
        title,
        20,
        "Title can contain up to 20 characters."
      );
    } catch (err) {
      return next(err);
    }

    // 데이터베이스 저장
    try {
      const json = await ProductService.addItem({
        title: title,
        price: price,
        content: content,
        size: size,
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5,
        img6: img6,
        is_sell: is_sell,
        sub_category_subcateno: sub_category_subcateno,
      });

      res.sendResult({ item: json });
    } catch (err) {
      return next(err);
    }
  });

  /** 데이터 수정 */
  router.put(`${url}/:prodno`, async (req, res, next) => {
    // // 파라미터 받기
    const { prodno } = req.params;
    const {
      title,
      price,
      content,
      size,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      is_sell,
      sub_category_subcateno,
    } = req.body;

    // 유효성 검사
    try {
      regexHelper.value(title, "Please enter title.");
      regexHelper.value(price, "Please enter price.");
      regexHelper.value(content, "Please enter product description.");
      regexHelper.value(size, "Please enter product size.");
      regexHelper.value(is_sell, "Please select sales status");
      regexHelper.value(
        sub_category_subcateno,
        "Please select type of product"
      );
      regexHelper.num(price, "Prices must be numeric only.");
      regexHelper.maxLength(
        title,
        20,
        "Title can contain up to 20 characters."
      );
      regexHelper.value(prodno, "Product number does not exist. ");
      regexHelper.num(prodno, "Product number is incorrect.");
    } catch (err) {
      return next(err);
    }

    // 데이터 수정

    try {
      const params = {
        prodno: prodno,
        title: title,
        price: price,
        content: content,
        size: size,
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5,
        img6: img6,
        is_sell: is_sell,
        sub_category_subcateno: sub_category_subcateno,
      };

      logger.debug(JSON.stringify(params));
      const json = await ProductService.editItem(params);
      
      res.sendResult({ item: json });

    } catch (err) {
      return next(err);
    }
  });

  /** 데이터 삭제 --> Delete(DELETE) */
  router.delete(`${url}/:prodno`, async (req, res, next) => {
    // 파라미터 받기
    const { prodno } = req.params;

    // 유효성 검사
    try {
      regexHelper.value(prodno, "Product number does not exist. ");
      regexHelper.num(prodno, "Product number is incorrect.");
    } catch (err) {
      return next(err);
    }

    try {
      await ProductService.deleteItem({
        prodno: prodno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult();
  });

  return router;
})();
