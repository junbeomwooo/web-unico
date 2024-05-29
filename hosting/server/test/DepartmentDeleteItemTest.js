const DBPool = require('../helper/DBPool');
const departmentService = require('../services/DepartmentService');

(async () => {
    try {
        const params = { deptno: 207 };
        await departmentService.deleteItem(params);
    } catch (e) {
        console.error(e);
    } finally {
        DBPool.close();
    }
})();