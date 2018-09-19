const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Delete', () => {
    it('basic delete', () => {
        const data = {
            delete: true,
            from: 'tablename'
        };

        const response = 'DELETE FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('with where', () => {
        const data = {
            delete: true,
            from: 'tablename',
            where: {
                type: 'operator',
                left: {
                    value: 'id',
                    type: 'literal'
                },
                value: '>',
                right: {
                    value: 2,
                    type: 'number'
                }
            }
        };

        const response = 'DELETE FROM tablename WHERE id > 2';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
