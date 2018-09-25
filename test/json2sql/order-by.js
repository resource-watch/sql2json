const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - OrderBy', () => {
    it('SQL with orderby', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                type: 'literal',
                value: 'name',
                direction: null
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with number of name of columns', () => {
        const data = {
            select: [{
                value: 123,
                alias: null,
                type: 'number'
            }],
            from: 'tablename',
            orderBy: [{
                value: 123,
                alias: null,
                type: 'number',
                direction: null
            }]
        };

        const response = 'SELECT 123 FROM tablename ORDER BY 123';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with orderby with double quotes (literal)', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                alias: null,
                type: 'literal',
                direction: null
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name';
        Json2sql.toSQL(data).should.deepEqual(response);
    });


    it('SQL with order by with quotes', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                alias: null,
                type: 'literal',
                direction: null
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with orderby and direction', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                direction: 'asc'
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with several orderby and direction', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                direction: 'asc'
            }, {
                value: 'createdAt',
                direction: 'desc'
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name asc, createdAt desc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with several orderby and direction 2', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                direction: 'asc'
            }, {
                value: 'createdAt',
                direction: null
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY name asc, createdAt';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with order by and function', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                type: 'function',
                direction: null,
                value: 'avg',
                alias: null,
                arguments: [{
                    type: 'literal',
                    value: 'name'
                }]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with order by and several functions', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                type: 'function',
                direction: 'asc',
                value: 'avg',
                alias: null,
                arguments: [{
                    type: 'literal',
                    value: 'name'
                }]
            }, {
                type: 'function',
                direction: null,
                value: 'sum',
                alias: null,
                arguments: [{
                    type: 'literal',
                    value: 'num'
                }]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name) asc, sum(num)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
