const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const subcategoryService = require('../services/SubCategoryService');

module.exports = (() => {
  const url = "/api/subcategory";
  const router = express.Router();

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {

    // 데이터 조회
    let json = null;

    try {

      // 전체 데이터 수 얻기
      json = await subcategoryService.getList();

    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 단일행 조회 --> Read(SELECT) */
  router.get(`${url}/:subcateno`, async (req, res, next) => {
    // 파라미터 받기
    const { subcateno } = req.params;

    // 파라미터 유효성검사
    try {
      regexHelper.value(subcateno, "There is no Sub Categories number.");
      regexHelper.num(subcateno, "Sub Categories number is invalid.");
    } catch (err) {
      return next(err);
    }

    // 데이터 조회
    let json = null;

    try {
      json = await subcategoryService.getItem({
        subcateno: subcateno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 추가 --> Create(INSERT) */
  router.post(url, async (req, res, next) => {
    // 파라미터 받기
    const { subcatename, category_cateno } = req.body;

    // 유효성 검사
    try {
      regexHelper.value(subcatename, "There is no Sub categories name.");
      regexHelper.maxLength(subcatename, 20, "Sub Categories can contain up to 20 characters.");
      regexHelper.value(category_cateno, "There is no FK value for Sub Categories.");
      regexHelper.num(category_cateno, "Sub Categories must be integers.");
    } catch (err) {
      return next(err);
    }

    // 데이터 저장
    let json = null;

    try {
      json = await subcategoryService.addItem({
        subcatename: subcatename,
        category_cateno: category_cateno
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 수정 --> Update(UPDATE) */
  router.put(`${url}/:subcateno`, async (req, res, next) => {
    // 파라미터 받기
    const { subcateno } = req.params;
    const { subcatename } = req.body;

    // 유효성 검사
    try {
        regexHelper.value(subcateno, "There is no Sub categories number.")
        regexHelper.num(subcateno, "Sub Categories number is invalid.")
        regexHelper.value(subcatename, "There is no Sub Categories name.")
        regexHelper.maxLength(subcatename, 20, "Sub Categories can contain up to 20 characters.");
    } catch (err) {
        return next(err);
    }

    // 데이터 수정
    let json = null;

    try {
        json = await subcategoryService.editItem({
            subcateno: subcateno,
            subcatename: subcatename,
        });
    } catch(err) {
        return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 삭제 --> Delete(DELETE) */
  router.delete(`${url}/:subcateno`, async (req, res, next) => {
    // 파라미터 받기
    const { subcateno } = req.params;

    // 유효성 검사
    try {
        regexHelper.value(subcateno, "There is no Sub Categories number.");
        regexHelper.num(subcateno, "Sub Categories number is invalid.");
    } catch (err) {
        return next(err);
    }

    try {
        await subcategoryService.deleteItem({
            subcateno: subcateno
        });
    } catch (err) {
        return next(err);
    }

    res.sendResult();
  });
  
  return router;
})();
