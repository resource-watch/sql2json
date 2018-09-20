const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Limit and offset', () => {
    it('Limit', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            limit: 5
        };

        const obj = new Sql2json('select * from tablename limit 5');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('Offset', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            limit: 5,
            offset: 10
        };

        const obj = new Sql2json('select * from tablename limit 5 offset 10');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
});

