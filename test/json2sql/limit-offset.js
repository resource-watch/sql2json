const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Limit and offset', () => {
    it('Limit', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            limit: 5
        };

        const response = 'SELECT * FROM tablename LIMIT 5';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('Offset', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            limit: 5,
            offset: 10
        };

        const response = 'SELECT * FROM tablename LIMIT 5 OFFSET 10';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
