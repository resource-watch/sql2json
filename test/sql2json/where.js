const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Where', () => {

    it('With one comparison', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where id > 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With one comparison (negative number)', () => {
        const response = {
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
                    value: -2,
                    type: 'number'
                }
            }
        };

        const obj = new Sql2json('select * from tablename where id > -2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With one function', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where sum(data) > 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With one function of postgis', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where ST_Intersects(the_geom, \'{}\')');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('With child functions of postgis', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where ST_Intersects(the_geom, st_asgeojson(\'{}\'))');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


    it('With and', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where id > 2 and id < 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With several conditionals', () => {
        const response = {
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

        const obj = new Sql2json('SELECT * FROM tablename WHERE a > 2 and b < 3 or c = 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With in numbers', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where data in (2, 3)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With in numbers floats', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where data in (2.2, 3.3)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With in strings', () => {
        const response = {
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
                    type: 'literal'
                }]
            }
        };

        const obj = new Sql2json('select * from tablename where data in (\'a\', "b")');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With betweens', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where data between 1 and 3');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With equality', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where country_iso=\'BRA\'');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With equality', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where country_iso = \'BRA\'');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With like', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where country_iso LIKE \'BRA\'');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With cast', () => {
        const response = {
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

        const obj = new Sql2json('select * from tablename where day::int > 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With name function as select', () => {
        const response = {
            select: [{
                value: 'avg',
                alias: null,
                type: 'literal'
            }],
            from: 'cait_2_0_country_ghg_emissions_onlyco2'
        };

        const obj = new Sql2json('SELECT avg FROM cait_2_0_country_ghg_emissions_onlyco2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With between and in', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'table',
            where: {
                type: 'conditional',
                value: 'AND',
                left: {
                    type: 'in',
                    value: 'confidence',
                    arguments: [{
                        type: 'string',
                        value: 'nominal'
                    }, {
                        type: 'string',
                        value: '0'
                    }]
                },
                right: {
                    type: 'between',
                    value: 'bright_ti5',
                    arguments: [{
                        type: 'number',
                        value: 1
                    }, {
                        type: 'number',
                        value: 4
                    }]
                }
            }
        };

        const obj = new Sql2json('select * from table where confidence in (\'nominal\',\'0\') AND bright_ti5 between 1 and 4');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

});
