const mybatisMapper = require("mybatis-mapper");
const DBpool = require("../helper/DBPool");
const {
  RuntimeException,
  BadRequestException,
} = require("../helper/ExceptionHelper");
const logger = require("../helper/LogHelper");

class CartService {
  /** 생성자 - Mapper 파일을 로드한다. */
  constructor() {
    // mapper의 위치는 이 소스 파일이 아닌 프로젝트 root를 기준으로 상대 경로
    mybatisMapper.createMapper(["./server/mappers/CartMapper.xml"]);
  }

  // /** 목록 데이터를 조회한다 */
  async getList(params) {
    let dbcon = null;
    let data = null;

    try {
      dbcon = await DBpool.getConnection();

      let sql = mybatisMapper.getStatement("CartMapper", "selectList", params);
      let [result] = await dbcon.query(sql);

      data = result;
    } catch (err) {
      throw err;
    } finally {
      if (dbcon) {
        dbcon.release();
      }
    }

    return data;
  }

  /** 데이터를 추가하고 추가된 결과를 조회하여 리턴한다. */
  async addItem(params) {
    let dbcon = null;
    let data = null;

    try {
      dbcon = await DBpool.getConnection();

      // 장바구니에 같은 제품이 있는지 확인 ()
      let checkExistProduct = mybatisMapper.getStatement(
        "CartMapper",
        "existCartProduct",
        params
      );
      let [existCart] = await dbcon.query(checkExistProduct);

      // 이미 존재하는 상품이라면
      if (existCart.length > 0) {
        params.cartno = existCart[0].cartno;
        params.quantity += existCart[0].quantity;
        params.tprice += existCart[0].tprice;

        let updateQuantity = mybatisMapper.getStatement(
          "CartMapper",
          "updateCartInfo",
          params
        );
        let [{ affectedRows }] = await dbcon.query(updateQuantity);

        if (affectedRows === 0) {
          throw new RuntimeException("No data was retrieved.");
        }

        // 새로 업데이트된 데이터의 PK값을 활용하여 다시 조회
        let sql = mybatisMapper.getStatement(
          "CartMapper",
          "selectItem",
          params
        );
        let [result] = await dbcon.query(sql);

        if (result.length === 0) {
          throw new RuntimeException("Stored data cannot be retrieved.");
        }

        data = result[0];

        //  존재하지 않는 상품이라면
      } else {
        // 존재하지 않는 상품일 경우 장바구니의 각 상품이 4개이상 들어가지 못하게하기위해 데이터 수를 조회
        let countCartProduct = mybatisMapper.getStatement(
          "CartMapper",
          "selectCountAll",
          params
        );
        let [count] = await dbcon.query(countCartProduct);

        // 만약 4와 같거나 크다면 에러를 발생시킴
        if (count[0].cnt >= 4) {
          throw new BadRequestException(
            "You cannot add more than 4 items to your cart."
          );
        }

        // 장바구니에 해당 제품이 없으므로 추가
        let sql = mybatisMapper.getStatement(
          "CartMapper",
          "insertItem",
          params
        );
        let [{ affectedRows, insertId }] = await dbcon.query(sql);

        if (affectedRows === 0) {
          throw new RuntimeException("No data was retrieved.");
        }

        // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
        sql = mybatisMapper.getStatement("CartMapper", "selectItem", {
          cartno: insertId,
        });
        let [result] = await dbcon.query(sql);

        if (result.length === 0) {
          throw new RuntimeException("Stored data cannot be retrieved.");
        }

        data = result[0];
      }
    } catch (err) {
      throw err;
    } finally {
      if (dbcon) {
        dbcon.release();
      }
    }

    return data;
  }

  /** 데이터를 수정하고 수정된 결과를 조회하여 리턴한다. */
  async editItem(params) {
    let dbcon = null;
    let data = null;

    try {
      dbcon = await DBpool.getConnection();

      let sql = mybatisMapper.getStatement(
        "CartMapper",
        "updateCartInfo",
        params
      );
      let [{ affectedRows }] = await dbcon.query(sql);

      if (affectedRows === 0) {
        throw new RuntimeException("No data was retrieved.");
      }

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      sql = mybatisMapper.getStatement("CartMapper", "selectItem", {
        cartno: params.cartno,
      });
      let [result] = await dbcon.query(sql);

      if (result.length === 0) {
        throw new RuntimeException("Stored data cannot be retrieved.");
      }

      data = result[0];
    } catch (err) {
      throw err;
    } finally {
      if (dbcon) {
        dbcon.release();
      }
    }

    return data;
  }

  /** 데이터를 삭제한다 */
  async deleteItem(params) {
    let dbcon = null;

    try {
      dbcon = await DBpool.getConnection();

      let sql = mybatisMapper.getStatement("CartMapper", "deleteItem", params);
      let [{ affectedRows }] = await dbcon.query(sql);

      if (affectedRows === 0) {
        throw new RuntimeException("No data was deleted.");
      }
    } catch (err) {
      throw err;
    } finally {
      if (dbcon) {
        dbcon.release();
      }
    }
  }

  /** 전체 데이터 수 조회 */
  async getCount(params) {
    let dbcon = null;
    let cnt = 0;

    try {
      dbcon = await DBpool.getConnection();

      let sql = mybatisMapper.getStatement(
        "CartMapper",
        "selectCountAll",
        params
      );
      let [result] = await dbcon.query(sql);

      if (result.length > 0) {
        cnt = result[0].cnt;
      }
    } catch (err) {
      throw err;
    } finally {
      if (dbcon) {
        dbcon.release();
      }
    }

    return cnt;
  }
}

module.exports = new CartService();
