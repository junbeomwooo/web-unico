const mybatisMapper = require('mybatis-mapper');
const DBpool = require('../helper/DBPool');
const { RuntimeException, BadRequestException } = require('../helper/ExceptionHelper');
const logger = require('../helper/LogHelper');

class GuestOrderDetailService {

    /** 생성자 - Mapper 파일을 로드한다. */
    constructor() {
        // mapper의 위치는 이 소스 파일이 아닌 프로젝트 root를 기준으로 상대 경로
        mybatisMapper.createMapper([
            './server/mappers/GuestOrderDetailMapper.xml',
        ]);
    }

    /** 목록 데이터를 조회한다 */
    async getList(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();
    
            let sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'selectList', params);
            let [result] = await dbcon.query(sql);

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }


    /** 단일 데이터를 조회한다. */
    async getItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'selectItem', params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }

    /** 데이터를 추가하고 추가된 결과를 조회하여 리턴한다. */
    async addItem(params) {
        
        let dbcon = null;
        let data = null;

        try {

            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'insertItem', params);
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }
            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'selectItem', { guest_orderno : insertId});
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('Stored data cannot be retrieved.');
            } 

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }

    /** 데이터를 수정하고 수정된 결과를 조회하여 리턴한다. */
    async editItem(params) {

        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'updateItem', params);
            let [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'selectItem', {guest_orderno: params.guest_orderno});
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('Stored data cannot be retrieved.')
            }

            data = result[0];
        } catch(err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }

    /** 데이터를 삭제한다 */
    // async deleteItem(params) {
    //     let dbcon = null;

    //     try {
    //         dbcon = await DBpool.getConnection();

    //         let sql = mybatisMapper.getStatement('CartMapper', 'deleteItem', params);
    //         let [{affectedRows}] = await dbcon.query(sql);

    //         if (affectedRows === 0) {
    //             throw new RuntimeException('No data was deleted.')
    //         }
    //     } catch (err) {
    //         throw err;
    //     } finally {
    //         if (dbcon) { dbcon.release(); }
    //     }
    // }

     /** 전체 데이터 수 조회 */
     async getCount(params) {
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'selectCountAll', params);
            let [result] = await dbcon.query(sql);

            if (result.length > 0) {
                cnt = result[0].cnt;
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return cnt;
    }
}

module.exports = new GuestOrderDetailService();