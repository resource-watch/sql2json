const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - OrderBy', () => {
    it('SQL with ORDER BY', () => {
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

    it('SQL with ORDER BY with number of name of columns', () => {
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

    it('SQL with ORDER BY with double quotes (literal)', () => {
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


    it('SQL with ORDER BY with quotes', () => {
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

    it('SQL with ORDER BY and direction', () => {
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

    it('SQL with several ORDER BY and direction', () => {
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

    it('SQL with several ORDER BY and direction 2', () => {
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

    it('With ORDER BY with function as value', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With ORDER BY with function as value with direction', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                direction: 'asc',
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name) asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With ORDER BY and several functions', () => {
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

    it('With ORDER BY with function call on value', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [
                {
                    type: 'literal',
                    alias: null,
                    value: 'col1'
                }, {
                    type: 'dot',
                }, {
                    value: 'avg',
                    type: 'function',
                    alias: null,
                    arguments: [
                        {
                            value: 'name',
                            type: 'literal',
                            alias: null
                        }
                    ]
                }]
        };

        const response = 'SELECT * FROM tablename ORDER BY col1.avg(name)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With ORDER BY with function call and column name', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }, {
                value: 'name',
                type: 'literal',
                alias: null,
                direction: 'asc'
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name), name asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With ORDER BY with function call and column name with table', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }, {
                value: 'tablename',
                type: 'literal'
            }, {
                type: 'dot'
            }, {
                value: 'name',
                type: 'literal',
                alias: null,
                direction: 'asc'
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name), tablename.name asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With ORDER BY with function call on column name with table name', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'tablename',
                type: 'literal'
            }, {
                type: 'dot'
            }, {
                value: 'name',
                type: 'literal',
                alias: null
            }, {
                type: 'dot'
            }, {
                value: 'avg',
                type: 'function',
                alias: null,
                direction: 'asc',
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY tablename.name.avg(name) asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
