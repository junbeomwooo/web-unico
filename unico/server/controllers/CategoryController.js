const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const categoryService = require("../services/CategoryService");

module.exports = (() => {
  const url = "/api/category";
  const router = express.Router();

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {

    // 데이터 조회
    let json = null;

    try {

      // 전체 데이터 수 얻기
      json = await categoryService.getList();

    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 단일행 조회 --> Read(SELECT) */
  router.get(`${url}/:cateno`, async (req, res, next) => {
    // 파라미터 받기
    const { cateno } = req.params;

    // 파라미터 유효성검사
    try {
      regexHelper.value(cateno, "There is no category number.");
      regexHelper.num(cateno, "Category number is invalid.");
    } catch (err) {
      return next(err);
    }

    // 데이터 조회
    let json = null;

    try {
      json = await categoryService.getItem({
        cateno: cateno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 추가 --> Create(INSERT) */
  router.post(url, async (req, res, next) => {
    // 파라미터 받기
    const { catename } = req.body;

    // 유효성 검사
    try {
      regexHelper.value(catename, "There is no category name.");
      regexHelper.maxLength( catename, 20, "Category can contain up to 20 characters.");
    } catch (err) {
      return next(err);
    }

    // 데이터 저장
    let json = null;

    try {
      json = await categoryService.addItem({
        catename: catename,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 수정 --> Update(UPDATE) */
  router.put(`${url}/:cateno`, async (req, res, next) => {
    // 파라미터 받기
    const { cateno } = req.params;
    const { catename } = req.body;

    // 유효성 검사
    try {
        regexHelper.value(cateno, "There is no category number.")
        regexHelper.num(cateno, "Category number is invalid.")
        regexHelper.value(catename, "There is no category name.")
        regexHelper.maxLength( catename, 20, "Category can contain up to 20 characters.");
    } catch (err) {
        return next(err);
    }

    // 데이터 수정
    let json = null;

    try {
        json = await categoryService.editItem({
            cateno: cateno,
            catename: catename,
        });
    } catch(err) {
        return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 데이터 삭제 --> Delete(DELETE) */
  router.delete(`${url}/:cateno`, async (req, res, next) => {
    // 파라미터 받기
    const { cateno } = req.params;

    // 유효성 검사
    try {
        regexHelper.value(cateno, "There is no category number.");
        regexHelper.num(cateno, "Category number is invalid.");
    } catch (err) {
        return next(err);
    }

    try {
        await categoryService.deleteItem({
            cateno: cateno
        });
    } catch (err) {
        return next(err);
    }

    res.sendResult();
  });
  
  return router;
})();
