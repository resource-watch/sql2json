const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Order By', () => {
    it('SQL with orderby', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename order by name');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
    it('SQL with number of name of columns', () => {
        const response = {
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

        const obj = new Sql2json('select 123 from tablename order by 123');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with orderby with quotes', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'name',
                alias: null,
                type: 'string',
                direction: null
            }]
        };

        const obj = new Sql2json('select * from tablename order by "name"');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with orderby and direction', () => {
        const response = {
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
                direction: 'asc'
            }]
        };

        const obj = new Sql2json('select * from tablename order by name asc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several orderby and direction', () => {
        const response = {
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
                direction: 'asc'
            }, {
                value: 'createdAt',
                alias: null,
                type: 'literal',
                direction: 'desc'
            }]
        };

        const obj = new Sql2json('select * from tablename order by name asc, createdAt desc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several orderby and direction 2', () => {
        const response = {
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
                direction: 'asc'
            }, {
                value: 'createdAt',
                alias: null,
                type: 'literal',
                direction: null
            }]
        };

        const obj = new Sql2json('select * from tablename order by name asc, createdAt');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with order by and function', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename order by avg(name)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with order by and serveral functions', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename order by avg(name) asc, sum(num)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
});

