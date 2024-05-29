const mybatisMapper = require('mybatis-mapper');
const DBpool = require('../helper/DBPool');
const { RuntimeException } = require('../helper/ExceptionHelper');

class ProductService {

    /** 생성자 - Mapper 파일을 로드한다. */
    constructor() {
        // mapper의 위치는 이 소스 파일이 아닌 프로젝트 root를 기준으로 상대 경로
        mybatisMapper.createMapper([
            './server/mappers/ProductMapper.xml',
            './server/mappers/OrderDetailMapper.xml',
            './server/mappers/GuestOrderDetailMapper.xml',
            './server/mappers/CartMapper.xml'
        ]);
    }

    /** 목록 데이터를 조회한다 */
    async getList(params, startIndex, endIndex) {
        let dbcon = null;
        let data = null;

        const newParams = {
            ...params,
            startIndex:startIndex,
            endIndex:endIndex,
        }

        try {
            dbcon = await DBpool.getConnection();
    
            let sql = mybatisMapper.getStatement('ProductMapper', 'selectList', newParams);
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

            let sql = mybatisMapper.getStatement('ProductMapper', 'selectItem', params);
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
        
        const img1 = params.img1 || null;
        const img2 = params.img2 || null;
        const img3 = params.img3 || null;
        const img4 = params.img4 || null;
        const img5 = params.img5 || null;
        const img6 = params.img6 || null;

        // 나머지 파라미터와 이미지 파라미터들을 합쳐서 새로운 params 객체를 생성
        const newParams = { ...params, img1, img2, img3, img4, img5, img6 };

        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('ProductMapper', 'insertItem', newParams);
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('ProductMapper', 'selectItem', { prodno : insertId});
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

        const img1 = params.img1 || null;
        const img2 = params.img2 || null;
        const img3 = params.img3 || null;
        const img4 = params.img4 || null;
        const img5 = params.img5 || null;
        const img6 = params.img6 || null;

        // 나머지 파라미터와 이미지 파라미터들을 합쳐서 새로운 params 객체를 생성
        const newParams = { ...params, img1, img2, img3, img4, img5, img6 };

        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('ProductMapper', 'updateItem', newParams);
            let [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('ProductMapper', 'selectItem', {prodno: params.prodno});
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
    async deleteItem(params) {
        let dbcon = null;

        try {
            dbcon = await DBpool.getConnection();

            /** 받아온 prodno을 참조키로 사용한 모든 데이터 삭제 */

            let sql = mybatisMapper.getStatement('OrderDetailMapper', 'deleteByProdno', params);
            let [{affectedRows}] = await dbcon.query(sql);

            sql = mybatisMapper.getStatement('GuestOrderDetailMapper', 'deleteByProdno', params);
            [{affectedRows}] = await dbcon.query(sql);

            sql = mybatisMapper.getStatement('CartMapper', 'deleteByProdno', params);
            [{affectedRows}] = await dbcon.query(sql);

            sql = mybatisMapper.getStatement('ProductMapper', 'deleteItem', params);
            [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was deleted.')
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
    }

    /** 전체 데이터 수 조회 */
    async getCount(params) {
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('ProductMapper', 'selectCountAll', params);
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

module.exports = new ProductService();