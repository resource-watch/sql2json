const assert = require('assert');
const Json2sql = require('../').json2sql;
require('should');


describe('json2sql', () => {

    describe('Errors', () => {

        it('Error: Check throw error if create instance without data', () => {
            try {
                Json2sql.toSQL(null);
                assert(false, 'Expected throw error');
            } catch (e) {
                e.message.should.be.equal('JSON required');
            }
        });

    });

    describe('From', () => {

        it('With table name', () => {
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

        it('With table name inside quotes', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '"tablename"'
            };

            const response = 'SELECT * FROM "tablename"';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With table name inside quotes 2', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '"ft:table/name"'
            };

            const response = 'SELECT * FROM "ft:table/name"';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With table name inside simple quotes', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '\'ft:tablename\''
            };

            const response = 'SELECT * FROM \'ft:tablename\'';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

    });

    describe('Select', () => {
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

        it('SQL with gee function', () => {
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
    });
    describe('OrderBy', () => {
        it('SQL with orderby', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                orderBy: [{
                    value: 'name',
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
    });

    describe('GroupBy', () => {
        it('Group by one field', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: ['name']
            };

            const response = 'SELECT * FROM tablename GROUP BY name';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('Group by several fields', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: ['name', 'surname']
            };

            const response = 'SELECT * FROM tablename GROUP BY name, surname';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('Group with where', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: ['name', 'surname'],
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
                }
            };

            const response = 'SELECT * FROM tablename WHERE data BETWEEN 1 AND 3 GROUP BY name, surname';
            Json2sql.toSQL(data).should.deepEqual(response);
        });
    });

    describe('Where', () => {
        it('With one comparison', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
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

            const response = 'SELECT * FROM tablename WHERE id > 2';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With one function', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'operator',
                    left: {
                        value: 'sum',
                        type: 'function',
                        alias: null,
                        arguments: [{
                            value: 'data',
                            type: 'literal'
                        }]
                    },
                    value: '>',
                    right: {
                        value: 2,
                        type: 'number'
                    }
                }
            };

            const response = 'SELECT * FROM tablename WHERE sum(data) > 2';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With one function of postgis', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    value: 'ST_Intersects',
                    type: 'function',
                    alias: null,
                    arguments: [{
                        value: 'the_geom',
                        type: 'literal'
                    }, {
                        value: '{}',
                        type: 'string'
                    }]
                }
            };

            const response = 'SELECT * FROM tablename WHERE ST_Intersects(the_geom, \'{}\')';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With child functions of postgis', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    value: 'ST_Intersects',
                    type: 'function',
                    alias: null,
                    arguments: [{
                        value: 'the_geom',
                        type: 'literal'
                    }, {
                        value: 'st_asgeojson',
                        type: 'function',
                        alias: null,
                        arguments: [{
                            value: '{}',
                            type: 'string'
                        }]
                    }]
                }
            };

            const response = 'SELECT * FROM tablename WHERE ST_Intersects(the_geom, st_asgeojson(\'{}\'))';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With and', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'conditional',
                    value: 'and',
                    left: {
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
                    },
                    right: {
                        type: 'operator',
                        left: {
                            value: 'id',
                            type: 'literal'
                        },
                        value: '<',
                        right: {
                            value: 2,
                            type: 'number'
                        }
                    }
                }
            };

            const response = 'SELECT * FROM tablename WHERE id > 2 and id < 2';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With several conditionals', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'conditional',
                    value: 'or',
                    left: {
                        type: 'conditional',
                        value: 'and',
                        left: {
                            type: 'operator',
                            value: '>',
                            left: {
                                value: 'a',
                                type: 'literal'
                            },
                            right: {
                                value: 2,
                                type: 'number'
                            }
                        },
                        right: {
                            type: 'operator',
                            value: '<',
                            left: {
                                value: 'b',
                                type: 'literal'
                            },
                            right: {
                                value: 3,
                                type: 'number'
                            }
                        }
                    },
                    right: {
                        type: 'operator',
                        value: '=',
                        left: {
                            value: 'c',
                            type: 'literal'
                        },
                        right: {
                            value: 2,
                            type: 'number'
                        }
                    }
                }
            };

            const response = 'SELECT * FROM tablename WHERE a > 2 and b < 3 or c = 2';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With in numbers', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'in',
                    value: 'data',
                    arguments: [{
                        value: 2,
                        type: 'number'
                    }, {
                        value: 3,
                        type: 'number'
                    }]
                }
            };

            const response = 'SELECT * FROM tablename WHERE data IN (2, 3)';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With in numbers floats', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'in',
                    value: 'data',
                    arguments: [{
                        value: 2.2,
                        type: 'number'
                    }, {
                        value: 3.3,
                        type: 'number'
                    }]
                }
            };

            const response = 'SELECT * FROM tablename WHERE data IN (2.2, 3.3)';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With in strings', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                where: {
                    type: 'in',
                    value: 'data',
                    arguments: [{
                        value: 'a',
                        type: 'string'
                    }, {
                        value: 'b',
                        type: 'string'
                    }]
                }
            };

            const response = 'SELECT * FROM tablename WHERE data IN (\'a\', \'b\')';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

        it('With betweens', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
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
                }
            };

            const response = 'SELECT * FROM tablename WHERE data BETWEEN 1 AND 3';
            Json2sql.toSQL(data).should.deepEqual(response);
        });

    });

    describe('Limit and offset', () => {
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
    describe('all', () => {
        it('All', () => {
            const data = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: ['name', 'surname'],
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
                    direction: null
                }]
            };

            const response = 'SELECT * FROM tablename WHERE data BETWEEN 1 AND 3 GROUP BY name, surname ORDER BY name LIMIT 1';
            Json2sql.toSQL(data).should.deepEqual(response);
        });
    });
});
