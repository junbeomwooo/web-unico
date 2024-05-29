const mybatisMapper = require('mybatis-mapper');
const DBpool = require('../helper/DBPool');
const { RuntimeException } = require('../helper/ExceptionHelper');
const bcrypt = require("bcryptjs");

class MemberService {

    /** 생성자 - Mapper 파일을 로드한다. */
    constructor() {
        // mapper의 위치는 이 소스 파일이 아닌 프로젝트 root를 기준으로 상대 경로
        mybatisMapper.createMapper([
            './server/mappers/MemberMapper.xml',
        ]);
    }

    /** 목록 데이터를 조회한다 */
    async getList(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();
    
            let sql = mybatisMapper.getStatement('MemberMapper', 'selectList', params);
            let [result] = await dbcon.query(sql);

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }

    /** 회원번호를 통한 단일 데이터를 조회한다. */
    async getItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'selectItem', params);
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
            // 비밀번호 암호화
            const encryptedPassword = await bcrypt.hash(params.userpw, 10);
            dbcon = await DBpool.getConnection();

            const newParams = { ...params, userpw: encryptedPassword};

            let sql = mybatisMapper.getStatement('MemberMapper', 'insertItem', newParams);
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('MemberMapper', 'selectItem', { userno : insertId});
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
    /** 세션을 이용해 자신의 데이터 값을 수정하여 수정된 결과를 리턴 */
    async editMyInfo(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'updateMyInfo', params);
            let [{ affectedRows }] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }
            
            // 새로 저장된 데이터의 아이디 값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('MemberMapper', 'searchAccount', { account: params.account });
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

    /** 세션을 이용한 자신의 비밀번호 변경 */
    async changePassword(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'changeMyPassword', params);
            let [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 Account값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('MemberMapper', 'searchAccount', {account: params.account});
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

    /** 데이터를 수정하고 수정된 결과를 조회하여 리턴한다. */
    async editItem(params) {

        let dbcon = null;
        let data = null;

        try {
            // 비밀번호 암호화
            const encryptedPassword = await bcrypt.hash(params.userpw, 10);
            dbcon = await DBpool.getConnection();

            const newParams = { ...params, userpw: encryptedPassword};

            let sql = mybatisMapper.getStatement('MemberMapper', 'updateItem', newParams);
            let [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was retrieved.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement('MemberMapper', 'selectItem', {userno: params.userno});
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

    /** 자기 자신의 데이터를 삭제한다. */
    async deleteMyAccount(params) {
        let dbcon = null;

        try {
            dbcon = await DBpool.getConnection();

            // 1. member 테이블에서 is_out 컬럼 업데이트 (userno 파라미터 필요);
            let updateSql = mybatisMapper.getStatement('MemberMapper', 'updateIsOut', params);
            let [{affectedRows: updateAffectedRows}] = await dbcon.query(updateSql);

            if (updateAffectedRows === 0) {
                throw new RuntimeException('No data was deleted.')
            }

            // 2. out_member 테이블에 데이터 추가 (userno, outdate 파라미터 필요)
            let insertSql = mybatisMapper.getStatement('MemberMapper', 'insertOutMember', params);
            let [{affectedRows: insertAffectedRows}] = await dbcon.query(insertSql)

            if (insertAffectedRows === 0) {
                throw new RuntimeException('No data was deleted.')
            }

            // 3. 탈퇴 후 15일 후 계정 삭제 예약 (userno 파라미터 필요);
            setTimeout(async () => {
                try {

                    // out_member 테이블 데이터 삭제
                    let deleteOutMemberSql = mybatisMapper.getStatement('MemberMapper', 'deleteOutMember', params)
                    let [{affectedRows : outMemberaffectedRows}] = await dbcon.query(deleteOutMemberSql);

                    if (outMemberaffectedRows === 0) {
                        throw new RuntimeException('No data was deleted.')
                    }
                    
                    // 카트 테이블 삭제
                    let deleteCartInfo = mybatisMapper.getStatement('MemberMapper', 'deleteCart', params)
                    await dbcon.query(deleteCartInfo);
                    
                    // member 테이블 데이터 삭제
                    let deleteSql = mybatisMapper.getStatement('MemberMapper', 'deleteItem', params);
                    let [{affectedRows: memberaffectedRows}] = await dbcon.query(deleteSql);

                    if (memberaffectedRows === 0) {
                        throw new RuntimeException('No data was deleted.')
                    }
                } catch (err) {
                    throw err;
                }
            }, 
            15 * 24 * 60 * 60 * 1000); // 15일 후 
            // 3 * 60 * 1000); // 3분후

        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
    }

    /** 데이터를 삭제한다 */
    async deleteItem(params) {
        let dbcon = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'deleteItem', params);
            let [{affectedRows}] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException('No data was deleted.')
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
    }

    /** 중복 아이디 검사 */
    async duplicateIDcheck(params) {
        let dbcon = null;
        let cnt = 0;

    
        try {
            dbcon = await DBpool.getConnection();
    
            let sql = mybatisMapper.getStatement('MemberMapper', 'checkAccountDuplicate', {account: params.account});
            const [result] = await dbcon.query(sql);
            
            if (result.length > 0) {
                cnt = result[0].cnt;
            }
            
        }catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return cnt
    }

    /** 계정이름을 통한 단일 데이터를 조회한다. */
    async getAccount(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'searchAccount', params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                 // 계정을 찾지 못한 경우 클라이언트에게 보여주기 위해 예외를 throw 하지 않고 null을 반환.
                return null;
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return data;
    }

    /** 전체 데이터 수 조회 */
    async getCount(params) {
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBpool.getConnection();

            let sql = mybatisMapper.getStatement('MemberMapper', 'selectCountAll', params);
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

module.exports = new MemberService();