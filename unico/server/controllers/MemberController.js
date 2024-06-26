const express = require("express");
const logger = require("../helper/LogHelper");
const regexHelper = require("../helper/RegexHelper");
const MemberService = require("../services/MemberService");
const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");
const { pagenation } = require("../helper/UtilHelper");

module.exports = (() => {
  const url = "/api/member";
  const router = express.Router();

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get(url, async (req, res, next) => {
    // 검색어 파라미터
    const { page = 1, rows = 15, query = null, gender = null, sortOption = null } = req.query;

    const params = {
      query: query,
      gender: gender,
      sortOption: sortOption,
    };

    try {
      // 각 성별별 총 데이터 수 얻기
      const allCount = await MemberService.getCount();
      const maleCount = await MemberService.getCount({gender : 'M'});
      const femaleCount = await MemberService.getCount({gender : 'F'});
      const othercount = await MemberService.getCount({gender : 'O'});

      // 하나의 데이터로 구성 
      const count = { allCount , maleCount, femaleCount, othercount};

      // 전체 데이터 수 얻기
      const totalCount = await MemberService.getCount(params);

      const pageInfo = pagenation(totalCount, page, rows);

      params.offset = pageInfo.offset;
      params.listCount = pageInfo.listCount;

      // 전체 데이터 얻기
      const json = await MemberService.getList(params);

      res.sendResult({ pagenation: pageInfo, item: json, count: count});
    } catch (err) {
      return next(err);
    }
  });

  /** 로그인 처리  */
  router.post(`${url}/login`, async (req, res, next) => {
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
        // 로그인 성공시 세션에 사용자 정보 저장
        req.session.user = {
          account: user.account,
          name: user.name,
          gender: user.gender,
          birthdate: user.birthdate,
          phonenumber: user.phonenumber,
          address: user.address,
          city: user.city,
          province: user.province,
          country: user.country,
          zipcode: user.zipcode,
          is_admin: user.is_admin,
        };

        // 클라이언트에게 세션 ID를 쿠키로 전달
        /**도메인이 같을 경우 자동으로 서버와 통신시에 세션과 쿠키를 처리하여 클라이언트에서 명시적으로 세션ID값을 다룰 필요가 없음*/
        // req.sessionID는 express-session 미들웨어를 통해 req.session.user같은 세션데이터가 저장될 경우 자동으로 생성되는 고유값이다.
        res.cookie("session_id", req.sessionID);

        // 로그인 성공시
        res.sendResult({ item: req.session.user });
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

  /** 로그아웃 처리 */
  router.delete(`${url}/login`, async (req, res, next) => {
    try {
      // 클라이언트에서 세션 ID 쿠키 삭제
      res.clearCookie("session_id");
      // 세션삭제
      req.session.destroy();
    } catch (err) {
      return next(err);
    }
    // 로그아웃 성공 시
    res.sendResult({ item: "Logout successful" });
  });

  // 로그인 상태 확인
  router.get(`${url}/login`, async (req, res) => {
    const checkLogin = !!req.session.user; // fasle || true
    if (checkLogin) {
      // 세션에 저장된 사용자 정보가 있을경우
      const user = req.session.user;
      res.sendResult({ item: user });
    } else {
      // 저장된 사용자 정보가 없을 경우
      res.sendResult({ item: null });
    }
  });

  /** 단일행 조회 --> Read(SELECT) */
  router.get(`${url}/:userno`, async (req, res, next) => {
    // 파라미터 받기
    const { userno } = req.params;

    // 데이터 조회
    let json = null;

    try {
      json = await MemberService.getItem({
        userno: userno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 중복 ID값 검사 -->Read(SELECT) */
  router.get(`${url}_checkDuplicated`, async (req, res, next) => {
    try {
      // 검색할 아이디 검사
      const { query } = req.query;

      if (!query) {
        return next(new Error("Please enter an account name."));
      }

      // 중복 아이디 검사를 서비스코드로 전달
      const duplicateCount = await MemberService.duplicateIDcheck({
        account: query,
      });

      // 결과에 따른 응답처리
      res.sendResult({ item: duplicateCount });
    } catch (error) {
      next(error);
    }
  });

  /** 자신의 회원정보 수정/삭제 시 입력된 비밀번호가 맞는지 확인 */
  router.post(`${url}_checkPassword`, async (req, res, next) => {
    const { userpw } = req.body; //  클라이언트에게 입력받은 패스워드

    // 현재 로그인 중인 세션을 가져옴
    const currentUser = req.session.user;

    try {
      // 데이터 베이스에서 현재 로그인 중인 사용자 정보를 가져옴
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 입력받은 비밀번호와 데이터베이스 내부에 저장된 비밀번호를 비교
      const passwordMatch = await bcrypt.compare(userpw, user.userpw);

      if (passwordMatch) {
        // 비밀번호가 일치할 경우
        res.sendResult(200);
      } else {
        res.status(401).send({
          rt: "Password Error",
          rtcode: 401,
          rtmsg: "Please Check Your Password.",
        });
      }
    } catch (err) {
      return next(err);
    }
  });

  /** 데이터 추가 --> Create(INSERT) */
  router.post(url, async (req, res, next) => {
    // 파라미터 받기
    const {
      account,
      userpw,
      name,
      gender,
      birthdate,
      phonenumber,
      address,
      city,
      zipcode,
      province,
      country,
      reg_date,
      is_out,
      is_admin,
    } = req.body;

    // 입력값 공백 제거
    const processedAccount = account.trim().toLowerCase();
    const processedUserpw = userpw.trim();
    const processedName = name.trim().toUpperCase();
    const processedPhone = phonenumber.trim();
    const processedAddress = address.toLowerCase().trim();
    const processedCity = city.trim().toLowerCase();
    const processedZipcode = zipcode.trim();
    const processedProvince = province.trim().toLowerCase();
    const processedCountry = country;

    // 유효성 검사
    try {
      regexHelper.value(processedAccount, "Please enter account name.");
      regexHelper.engNum(
        processedAccount,
        "Please enter account name in English and Number."
      );
      regexHelper.minLength(
        processedAccount,
        6,
        "Please enter an English account name of at least 6 characters."
      );
      regexHelper.maxLength(
        processedAccount,
        20,
        "Please enter an English account name of up to 20 characters."
      );
      regexHelper.value(processedUserpw, "Please enter password.");
      regexHelper.minLength(
        processedUserpw,
        12,
        "Please enter password of at least 12 characters."
      );
      regexHelper.engNumSpe(
        processedUserpw,
        "Passwords must include letters, numbers, and special characters."
      );
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.eng(processedName, "Please enter name in English.");
      regexHelper.value(gender, "Please select gender.");
      regexHelper.value(birthdate, "Please enter your birthdate.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(processedCountry, "Please select your country.");

      const isDuplicate = await MemberService.duplicateIDcheck({
        account: processedAccount,
      });
      if (isDuplicate) {
        return next(new Error("This Account is unavailable."));
      }
    } catch (err) {
      return next(err);
    }

    // 데이터 저장
    let json = null;

    // 현재 시간을 JavaScript 날짜 객체로 생성
    const nowtime = new Date();
    const currentTime = dayjs(nowtime).format("YYYY-MM-DD");

    try {
      json = await MemberService.addItem({
        account: processedAccount,
        userpw: processedUserpw,
        name: processedName,
        gender: gender,
        birthdate: birthdate,
        phonenumber: processedPhone,
        address: processedAddress,
        city: processedCity,
        zipcode: processedZipcode,
        province: processedProvince,
        country: processedCountry,
        reg_date: reg_date || currentTime, // 입력값이 없을 경우 현재시간 값 전송
        // 입력값이 없을 경우 'N' 으로 전송
        is_out: is_out || "N",
        is_admin: is_admin || "N",
      });
    } catch (err) {
      return next(err);
    }
    logger.debug(nowtime);
    logger.debug(currentTime);
    res.sendResult({ item: json });
  });

  /** 멤버 자신의 데이터 수정 --> Update(UPDATE) */
  router.put(`${url}/change_myInfo`, async (req, res, next) => {
    // 현재 로그인 중인 세션을 가져옴
    const currentUser = req.session.user;

    // 파라미터 받아오기
    const {
      name,
      gender,
      birthdate,
      phonenumber,
      address,
      city,
      zipcode,
      province,
      country,
    } = req.body;

    // 데이터 베이스에서 현재 로그인 중인 사용자 정보를 가져옴
    const user = await MemberService.getAccount({
      account: currentUser.account,
    });

    // 클라이언트로 받은 정보가 없을 경우 대비 사용자 정보의 생일을 datetime에서 string으로 변환
    const userBirthdate = user.birthdate.toISOString().substring(0, 10);

    // 입력값 공백 제거 , 만약 전해진 값이 없다면 로그인중인 사용자 정보 값을 그대로 전달
    const processedName = name ? name.trim().toUpperCase() : user.name;
    const processedGender = gender ? gender : user.gender;
    const processedBirthday = birthdate ? birthdate : userBirthdate;
    const processedPhone = phonenumber ? phonenumber.trim() : user.phonenumber;
    const processedAddress = address
      ? address.toLowerCase().trim()
      : user.address;
    const processedCity = city ? city.trim().toLowerCase() : user.city;
    const processedZipcode = zipcode ? zipcode.trim() : user.zipcode;
    const processedProvince = province
      ? province.trim().toLowerCase()
      : user.province;
    const processedCountry = country ? country : user.country;

    // 유효성 검사
    try {
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.value(processedName, "Please enter name in English.");
      regexHelper.value(processedGender, "Please select gender.");
      regexHelper.value(processedBirthday, "Please enter your birthdate.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(processedCountry, "Please select your country.");
    } catch (err) {
      return next(err);
    }

    try {
      const updatedUser = await MemberService.editMyInfo({
        account: user.account,
        name: processedName,
        gender: processedGender,
        birthdate: processedBirthday,
        phonenumber: processedPhone,
        address: processedAddress,
        city: processedCity,
        zipcode: processedZipcode,
        province: processedProvince,
        country: processedCountry,
      });

      // 업데이트 된 사용자 정보를 세션에 반영
      req.session.user = updatedUser;
      res.sendResult({ item: updatedUser });
    } catch (err) {
      return next(err);
    }
  });

  /** 자신 비밀번호 변경 */
  router.put(`${url}/change_password`, async (req, res, next) => {
    // 현재 로그인 중인 세션
    const currentUser = req.session.user;

    // 파라미터 받아오기
    const { userpw, newPassword } = req.body;

    // 입력받은 파라미터 공백제거
    const processedUserpw = userpw.trim();
    const processednewPassword = newPassword.trim();

    // 유효성 검사
    try {
      regexHelper.value(processedUserpw, "Please enter password.");
      regexHelper.minLength(
        processedUserpw,
        12,
        "Please enter password of at least 12 characters."
      );
      regexHelper.engNumSpe(
        processedUserpw,
        "Passwords must include letters, numbers, and special characters."
      );
      regexHelper.value(processednewPassword, "Please enter password.");
      regexHelper.minLength(
        processednewPassword,
        12,
        "Please enter password of at least 12 characters."
      );
      regexHelper.engNumSpe(
        processednewPassword,
        "Passwords must include letters, numbers, and special characters."
      );
    } catch (err) {
      return next(err);
    }

    try {
      // 데이터베이스에서 현재 로그인 중인 사용자 정보 가져오기
      const user = await MemberService.getAccount({
        account: currentUser.account,
      });

      // 이전 비밀번호와 데이터베이스 내부 비밀번호가 일치하는지 확인
      const passwordMatch = await bcrypt.compare(processedUserpw, user.userpw);

      // 데이터 저장을 위한 빈 변수
      let json = null;

      if (passwordMatch) {
        // 새로운 비밀번호 해싱
        const encryptedPassword = await bcrypt.hash(processednewPassword, 10);

        // 새로운 비밀번호를 통해 데이터베이스로 업데이트
        json = await MemberService.changePassword({
          account: user.account,
          userpw: encryptedPassword,
        });

        // 클라이언트에서 세션 ID 쿠키 삭제
        res.clearCookie("session_id");
        // 세션삭제
        req.session.destroy();

        res.sendResult({ item: json });
      } else {
        res.status(401).send({
          rt: "Password Error",
          rtcode: 401,
          rtmsg: "Current password is incorrect.",
        });
      }
    } catch (err) {
      return next(err);
    }
  });

  /** 데이터 수정 --> Update(UPDATE) */
  router.put(`${url}/:userno`, async (req, res, next) => {
    // 파라미터 받기
    const { userno } = req.params;

    const {
      account,
      userpw,
      name,
      gender,
      birthdate,
      phonenumber,
      address,
      city,
      zipcode,
      province,
      country,
      is_out,
      is_admin,
    } = req.body;

    // 입력값 공백 제거
    const processedAccount = account.trim().toLowerCase();
    const processedUserpw = userpw.trim();
    const processedName = name.trim().toUpperCase();
    const processedPhone = phonenumber.trim();
    const processedAddress = address.toLowerCase().trim();
    const processedCity = city.trim().toLowerCase();
    const processedZipcode = zipcode.trim();
    const processedProvince = province.trim().toLowerCase();
    const processedCountry = country;

    // 유효성 검사
    try {
      regexHelper.value(processedAccount, "Please enter account name.");
      regexHelper.engNum(
        processedAccount,
        "Please enter account name in English and Number."
      );
      regexHelper.minLength(
        processedAccount,
        6,
        "Please enter an English account name of at least 6 characters."
      );
      regexHelper.maxLength(
        processedAccount,
        20,
        "Please enter an English account name of up to 20 characters."
      );
      regexHelper.value(processedUserpw, "Please enter password.");
      regexHelper.minLength(
        processedUserpw,
        12,
        "Please enter password of at least 12 characters."
      );
      regexHelper.engNum(
        processedUserpw,
        "Please enter password containing only English characters and numbers"
      );
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.value(processedName, "Please enter name in English.");
      regexHelper.value(gender, "Please select gender.");
      regexHelper.value(birthdate, "Please enter your birthdate.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(processedCountry, "Please select your country.");
    } catch (err) {
      return next(err);
    }

    // 데이터 수정
    let json = null;

    try {
      json = await MemberService.editItem({
        userno: userno,
        account: processedAccount,
        userpw: processedUserpw,
        name: processedName,
        gender: gender,
        birthdate: birthdate,
        phonenumber: processedPhone,
        address: processedAddress,
        city: processedCity,
        zipcode: processedZipcode,
        province: processedProvince,
        country: processedCountry,
        // 입력값이 없을 경우 'N' 으로 전송
        is_out: is_out || "N",
        is_admin: is_admin || "N",
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: json });
  });

  /** 자신의 계정 삭제 --> Delete(DELETE) */
  router.delete(`${url}/delete_account`, async (req, res, next) => {
    // 현재 로그인 중인 세션
    const currentUser = req.session.user;

    // 현재 시간을 JavaScript 날짜 객체로 생성
    const nowtime = new Date();
    const currentTime = dayjs(nowtime).format("YYYY-MM-DD");

    // 세션 정보를 통해 현재 로그인 중인 계정 정보 값 받기
    const user = await MemberService.getAccount({
      account: currentUser.account,
    });

    // 유저가 이미 탈퇴한 상황이라면
    if (user.is_out !== null) {
      const isOut = user.is_out.toString();

      if (isOut === "Y") {
        res.status(401).send({
          rt: "Account Error",
          rtcode: 401,
          rtmsg: "This account has already been terminated.",
        });
        return;
      }
    }

    try {
      // 받아온 계정 정보를 통해 삭제 처리
      await MemberService.deleteMyAccount({
        userno: user.userno,
        out_date: currentTime,
      });

      // 클라이언트에서 세션 ID 쿠키 삭제
      res.clearCookie("session_id");
      // 세션삭제
      req.session.destroy();
    } catch (err) {
      return next(err);
    }

    res.sendResult({ item: "Your account has been deleted." });
  });

  /** 데이터 삭제 --> Delete(DELETE) */
  router.delete(`${url}/:userno`, async (req, res, next) => {
    // 파라미터 받기
    const { userno } = req.params;

    // 유효성 검사
    try {
      regexHelper.value(userno, "Please enter user number");
      regexHelper.num(userno, "User number is invalid.");
    } catch (err) {
      return next(err);
    }

    try {
      await MemberService.deleteItem({
        userno: userno,
      });
    } catch (err) {
      return next(err);
    }

    res.sendResult();
  });

  return router;
})();
