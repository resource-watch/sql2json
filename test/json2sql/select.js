const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Select', () => {
    it('SQL with wildcard', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename'
        };

        const response = 'SELECT * FROM tablename';

        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with number of name of columns', () => {
        const data = {
            select: [{
                value: 123,
                alias: null,
                type: 'number'
            }],
            from: 'tablename'
        };

        const response = 'SELECT 123 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with string with alias', () => {
        const data = {
            select: [{
                value: 'values',
                alias: 'x',
                type: 'string'
            }],
            from: 'tablename'
        };

        const response = 'SELECT \'values\' AS x FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);

    });

    it('SQL with function call on column', () => {
        const data = {
            select: [{
                type: 'literal',
                alias: null,
                value: 'Shape'
            }, {
                type: 'dot',
            }, {
                type: 'function',
                alias: null,
                value: 'STLength',
                arguments: []
            }, {
                value: 'x',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT Shape.STLength(), x FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with function call as value', () => {
        const data = {
            select: [
                {
                    type: 'function',
                    alias: null,
                    value: 'STLength',
                    arguments: []
                }, {
                    value: 'x',
                    alias: null,
                    type: 'literal'
                }],
            from: 'tablename'
        };

        const response = 'SELECT STLength(), x FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with static columns', () => {
        const data = {
            select: [{
                value: '1',
                alias: 'group',
                type: 'string'
            }],
            from: 'tablename'
        };

        const response = 'SELECT \'1\' AS group FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with one column', () => {
        const data = {
            select: [{
                value: 'column1',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT column1 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with several columns', () => {
        const data = {
            select: [{
                value: 'column1',
                alias: null,
                type: 'literal'
            }, {
                value: 'column2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT column1, column2 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with one column and alias', () => {
        const data = {
            select: [{
                value: 'column1',
                alias: 'aliascolumn',
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT column1 AS aliascolumn FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with one column and alias and alias with name of function', () => {
        const data = {
            select: [{
                value: 'column1',
                alias: 'count',
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT column1 AS count FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with several columns and one alias', () => {
        const data = {
            select: [{
                value: 'column1',
                alias: 'aliascolumn',
                type: 'literal'
            }, {
                value: 'column2',
                alias: null,
                type: 'literal'
            }, {
                value: 'column3',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT column1 AS aliascolumn, column2, column3 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with function', () => {
        const data = {
            select: [{
                alias: null,
                type: 'function',
                value: 'sum',
                arguments: [{
                    value: 'column1',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT sum(column1) FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with function and alias', () => {
        const data = {
            select: [{
                alias: 'total',
                type: 'function',
                value: 'sum',
                arguments: [{
                    value: 'column1',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT sum(column1) AS total FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with GEE function', () => {
        const data = {
            select: [{
                alias: 'total',
                type: 'function',
                value: 'ST_HISTOGRAM',
                arguments: []
            }],
            from: 'tablename'
        };

        const response = 'SELECT ST_HISTOGRAM() AS total FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with GEE function with arguments', () => {
        const data = {
            select: [{
                value: 'ST_Intersects',
                alias: null,
                type: 'function',
                arguments: [
                    {
                        value: 'the_geom',
                        alias: null,
                        type: 'literal'
                    }, {
                        value: '{}',
                        alias: null,
                        type: 'string'
                    }

                ]
            }],
            from: 'tablename'
        };

        const response = 'SELECT ST_Intersects(the_geom,\'{}\') FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });


    it('SQL with distinct', () => {
        const data = {
            select: [{
                type: 'distinct',
                arguments: [{
                    value: 'countries',
                    type: 'literal',
                    alias: null
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT DISTINCT countries FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with distinct with several files', () => {
        const data = {
            select: [{
                type: 'distinct',
                arguments: [{
                    value: 'countries',
                    type: 'literal',
                    alias: null
                }, {
                    value: 'cities',
                    type: 'literal',
                    alias: null
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT DISTINCT countries, cities FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with function', () => {
        const data = {
            select: [{
                alias: null,
                type: 'function',
                value: 'count',
                arguments: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT count(*) FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with false as column name (literal)', () => {
        const data = {
            select: [{
                alias: null,
                type: 'literal',
                value: 'false'
            }, {
                alias: null,
                type: 'literal',
                value: 'name'
            }],
            from: 'tablename'
        };

        const response = 'SELECT false, name FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with false as column value', () => {
        const data = {
            select: [{
                alias: null,
                type: 'boolean',
                value: false
            }, {
                alias: null,
                type: 'literal',
                value: 'name'
            }],
            from: 'tablename'
        };

        const response = 'SELECT false, name FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with sum', () => {
        const data = {
            select: [{
                type: 'math',
                value: '+',
                arguments: [{
                    type: 'literal',
                    value: 'data',
                    alias: null
                }, {
                    type: 'number',
                    value: 1000
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT data + 1000 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with round and +', () => {
        const data = {
            select: [{
                type: 'math',
                value: '+',
                arguments: [{
                    type: 'function',
                    value: 'round',
                    alias: null,
                    arguments: [{
                        type: 'literal',
                        value: 'data'
                    }]
                }, {
                    type: 'number',
                    value: 1000
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT round(data) + 1000 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with round, sum and +', () => {
        const data = {
            select: [{
                type: 'function',
                value: 'sum',
                alias: null,
                arguments: [{
                    type: 'math',
                    value: '/',
                    arguments: [{
                        type: 'function',
                        value: 'round',
                        alias: null,
                        arguments: [{
                            type: 'literal',
                            value: 'data'
                        }]
                    }, {
                        type: 'number',
                        value: 1000
                    }]
                }]
            }],
            from: 'tablename'
        };

        const response = 'SELECT sum(round(data) / 1000) FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('SQL with string with alias, functions, column and table name with alias, etc', () => {
        const data = {
            select: [
                { value: 'bound1', alias: null, type: 'literal' },
                { value: 'polyname', alias: null, type: 'literal' },
                { value: 'year_data', alias: null, type: 'literal' },
                { type: 'dot' },
                { value: 'year', alias: 'year', type: 'literal' },
                {
                    type: 'function',
                    alias: 'area',
                    value: 'SUM',
                    arguments: [
                        { value: 'year_data', type: 'literal' },
                        { type: 'dot' },
                        { value: 'area_loss', type: 'literal' }
                    ]
                },
                {
                    type: 'function',
                    alias: 'emissions',
                    value: 'SUM',
                    arguments: [
                        { value: 'year_data', type: 'literal' },
                        { type: 'dot' },
                        { value: 'emissions', type: 'literal' }
                    ]
                }
            ],
            from: 'tablename'
        };

        const response = 'SELECT bound1, polyname, year_data.year AS year, SUM(year_data.area_loss) AS area, SUM(year_data.emissions) AS emissions FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });


});
