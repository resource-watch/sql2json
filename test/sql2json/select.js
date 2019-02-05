const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Select', () => {

    it('SQL with wildcard', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select * from tablename');
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
            from: 'tablename'
        };

        const obj = new Sql2json('select 123 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('SQL with literal as name column', () => {
        const response = {
            select: [{
                value: 'values',
                alias: 'x',
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select "values" as x from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('SQL with string as name column', () => {
        const response = {
            select: [{
                value: 'values',
                alias: 'x',
                type: 'string'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select \'values\' as x from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with function call on column', () => {
        const response = {
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

        const obj = new Sql2json('SELECT Shape.STLength(), x from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with function call on column', () => {
        const response = {
            select: [{
                type: 'literal',
                alias: null,
                value: 'tablename'
            }, {
                type: 'dot',
            }, {
                type: 'literal',
                alias: null,
                value: 'columnname'
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

        const obj = new Sql2json('SELECT tablename.columnname.STLength(), x from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with function call as value', () => {
        const response = {
            select: [{
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

        const obj = new Sql2json('SELECT STLength(), x from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with static columns', () => {
        const response = {
            select: [{
                value: '1',
                alias: 'group',
                type: 'string'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select \'1\' as group from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with mixed constants as columns', () => {
        const response = {
            select: [{
                value: '1m',
                alias: 'group',
                type: 'string'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select \'1m\' as group from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with one column', () => {
        const response = {
            select: [{
                value: 'column1',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select column1 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several columns', () => {
        const response = {
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

        const obj = new Sql2json('select column1, column2 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with one column and alias', () => {
        const response = {
            select: [{
                value: 'column1',
                alias: 'aliascolumn',
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select column1 as aliascolumn from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with one column and alias and alias with name of function', () => {
        const response = {
            select: [{
                value: 'column1',
                alias: 'count',
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select column1 as count from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with several columns and one alias', () => {
        const response = {
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

        const obj = new Sql2json('select column1 as aliascolumn, column2, column3 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('SQL with function with named argument', () => {
        const response = {
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

        const obj = new Sql2json('select sum(column1) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('SQL with function with constants as arguments', () => {
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'sum',
                arguments: [{
                    value: '1d',
                    type: 'string'
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select sum(\'1d\') from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with fake function name', () => {
        // The lib should not know nor care which functions are valid
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'foo',
                arguments: [{
                    value: 'column1',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select foo(column1) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with nested fake functions', () => {
        // The lib should not know nor care which functions are valid
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'foo',
                arguments: [{
                    alias: null,
                    type: 'function',
                    value: 'bar',
                    arguments: [{
                        alias: null,
                        type: 'function',
                        value: 'roo',
                        arguments: [{
                            value: 'column1',
                            type: 'literal'
                        }]
                    }]
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select foo(bar(roo(column1))) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with function with wildcard argument', () => {
        const response = {
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

        const obj = new Sql2json('select count(*) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with function and alias', () => {
        const response = {
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

        const obj = new Sql2json('select sum(column1) as total from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with gee function', () => {
        const response = {
            select: [{
                alias: 'total',
                type: 'function',
                value: 'ST_HISTOGRAM',
                arguments: []
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select ST_HISTOGRAM() as total from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with distinct', () => {
        const response = {
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

        const obj = new Sql2json('select distinct countries from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with distinct with several files', () => {
        const response = {
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

        const obj = new Sql2json('select distinct countries, cities from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with FIRST function', () => {
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'first',
                arguments: [{
                    value: 'column1',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select first(column1) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with LAST function', () => {
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'last',
                arguments: [{
                    value: 'column1',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select last(column1) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with ST_BANDMETADATA function', () => {
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'ST_BANDMETADATA',
                arguments: [{
                    value: 'rast',
                    type: 'literal'
                },
                    {
                        value: 1,
                        type: 'number'
                    }
                ]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select ST_BANDMETADATA(rast, 1) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with sum and count inside function', () => {
        const response = {
            select: [{
                alias: null,
                type: 'function',
                value: 'sum',
                arguments: [{
                    value: 'count',
                    type: 'literal'
                }]
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select sum(count) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with false as column name', () => {
        const response = {
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

        const obj = new Sql2json('select false, name from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with math', () => {
        const response = {
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

        const obj = new Sql2json('select data + 1000 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with round and +', () => {
        const response = {
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

        const obj = new Sql2json('select round(data) + 1000 from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with round, sum and +', () => {
        const response = {
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

        const obj = new Sql2json('select sum(round(data)/ 1000) from tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('SQL with string with alias, functions, column and table name with alias, etc', () => {
        const response = {
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

        const obj = new Sql2json('SELECT bound1, polyname, year_data.year AS year, SUM(year_data.area_loss) AS area, SUM(year_data.emissions) AS emissions FROM tablename');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

});
