const assert = require('assert');
const CompleyQueries = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Complex queries', () => {
    it('All', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            group: [{
                type: 'literal',
                value: 'name'
            }, {
                type: 'literal',
                value: 'surname'
            }],
            where: {
                type: 'between',
                value: 'data',
                arguments: [{
                    value: 1,
                    type: 'number'
                }, {
                    value: 3,
                    type: 'number'
                }]
            },
            limit: 1,
            orderBy: [{
                value: 'name',
                type: 'literal',
                direction: null
            }]
        };

        const response = 'SELECT * FROM tablename WHERE data BETWEEN 1 AND 3 GROUP BY "name", "surname" ORDER BY "name" LIMIT 1';
        CompleyQueries.toSQL(data).should.deepEqual(response);
    });
});
