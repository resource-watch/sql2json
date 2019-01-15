const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Where', () => {
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

    it('With equality', () => {
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
                    value: 'country_iso',
                    type: 'literal'
                },
                value: '=',
                right: {
                    value: 'BRA',
                    type: 'string'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE country_iso = \'BRA\'';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With equality with single quotes', () => {
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
                    value: 'country_iso',
                    type: 'literal'
                },
                value: '=',
                right: {
                    value: 'BRA',
                    type: 'string'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE country_iso = \'BRA\'';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With cast', () => {
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
                    value: 'day::int',
                    type: 'literal'
                },
                value: '>',
                right: {
                    value: 2,
                    type: 'number'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE day::int > 2';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With cast', () => {
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
                    value: 'day::int',
                    type: 'literal'
                },
                value: '>',
                right: {
                    value: 2,
                    type: 'number'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE day::int > 2';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With like', () => {
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
                    value: 'country_iso',
                    type: 'literal'
                },
                value: 'LIKE',
                right: {
                    value: 'BRA',
                    type: 'string'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE country_iso LIKE \'BRA\'';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With like and string wildcard', () => {
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
                    value: 'country_iso',
                    type: 'literal'
                },
                value: 'LIKE',
                right: {
                    value: '%BRA%',
                    type: 'string'
                }
            }
        };

        const response = 'SELECT * FROM tablename WHERE country_iso LIKE \'%BRA%\'';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('Where with false name column', () => {
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
                    value: 'false',
                    type: 'literal'
                },
                value: '>',
                right: {
                    value: 2,
                    type: 'number'
                }
            }

        };

        const response = 'SELECT * FROM tablename WHERE false > 2';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

});
