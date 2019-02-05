const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Order By', () => {
    it('SQL with ORDER BY', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY name');
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

        const obj = new Sql2json('select 123 from tablename ORDER BY 123');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY with quotes', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY "name"');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY with table and column name', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'tablename',
                type: 'literal',
                alias: null,
                direction: null
            }, {
                type: 'dot'
            }, {
                value: 'name',
                alias: null,
                type: 'string',
                direction: null
            }]
        };

        const obj = new Sql2json('select * from tablename ORDER BY tablename."name"');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY and direction', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY name asc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY with table and column name with direction', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'tablename',
                type: 'literal',
                alias: null,
                direction: null
            }, {
                type: 'dot'
            }, {
                value: 'name',
                alias: null,
                type: 'string',
                direction: 'asc'
            }]
        };

        const obj = new Sql2json('select * from tablename ORDER BY tablename."name" asc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several ORDER BY and direction', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY name asc, createdAt desc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several ORDER BY and direction 2', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY name asc, createdAt');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY and function', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY avg(name)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY and several functions', () => {
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

        const obj = new Sql2json('select * from tablename ORDER BY avg(name) asc, sum(num)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ORDER BY and several functions called on column values', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [
                {
                    value: 'foo',
                    alias: null,
                    type: 'literal',
                    direction: null
                }, {
                    type: 'dot'
                }, {
                    type: 'function',
                    direction: 'asc',
                    value: 'avg',
                    alias: null,
                    arguments: [{
                        type: 'literal',
                        value: 'name'
                    }]
                }, {
                    value: 'tablename',
                    alias: null,
                    type: 'literal',
                    direction: null
                }, {
                    type: 'dot'
                }, {
                    value: 'foo',
                    alias: null,
                    type: 'literal',
                    direction: null
                }, {
                    type: 'dot'
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

        const obj = new Sql2json('select * from tablename ORDER BY foo.avg(name) asc, tablename.foo.sum(num)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With ORDER BY with function call with column name with table name as argument', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [
                {
                    value: 'avg',
                    type: 'function',
                    alias: null,
                    direction: 'asc',
                    arguments: [
                        {
                            value: 'tablename',
                            type: 'literal'
                        }, {
                            type: 'dot'
                        }, {
                            value: 'name',
                            type: 'literal'
                        }
                    ]
                }]
        };

        const obj = new Sql2json('SELECT * FROM tablename ORDER BY avg(tablename.name) asc');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
});

