const assert = require('assert');
const Sql2json = require('../').sql2json;
require('should');


describe('sql2json', () => {

    describe('Errors', () => {

        it('Error: Check throw error if create instance without sql', () => {
            try {
                new Sql2json(null);
                assert(false, 'Expected throw error');
            } catch (e) {
                e.message.should.be.equal('Sql required');
            }
        });

    });

    describe('Delete', () => {
        it('basic delete', () => {
            const response = {
                delete: true,
                from: '75832571-44e7-41a3-96cf-4368a7f07075'
            };

            const obj = new Sql2json('DELETE FROM 75832571-44e7-41a3-96cf-4368a7f07075');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('with where', () => {
            const response = {
                delete: true,
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

            const obj = new Sql2json('DELETE FROM tablename WHERE id > 2');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });
    });

    describe('From', () => {

        it('With table name', () => {
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

        it('With table name inside quotes', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '"tablename"'
            };

            const obj = new Sql2json('select * from "tablename"');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('With table name inside quotes 2', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '"ft:table/name"'
            };

            const obj = new Sql2json('select * from "ft:table/name"');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('With table name inside simple quotes', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '\'ft:tablename\''
            };

            const obj = new Sql2json('select * from \'ft:tablename\'');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('With table name inside dots', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'public.pepe'
            };

            const obj = new Sql2json('select * from public.pepe');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('With table name like bigquery', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: '[bigquery-public-data:noaa_gsod.stations]'
            };

            const obj = new Sql2json('select * from [bigquery-public-data:noaa_gsod.stations]');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

    });

    describe('Select', () => {

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


        it('SQL with function', () => {
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

    });

    describe('Where', () => {

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
                        arguments:  [{
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
                        type: 'string'
                    }]
                }
            };

            const obj = new Sql2json('select * from tablename where data in (\'a\', \'b\')');
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

            const obj = new Sql2json('select * from tablename where country_iso = "BRA"');
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

    describe('GroupBy', () => {
        it('Group by one field', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: [{
                    type: 'literal',
                    value: 'name'
                }]
            };

            const obj = new Sql2json('select * from tablename group by name');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('Group by several fields', () => {
            const response = {
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
                }]
            };

            const obj = new Sql2json('select * from tablename group by name, surname');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('Group with where', () => {
            const response = {
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
                }
            };

            const obj = new Sql2json('select * from tablename where data between 1 and 3 group by name, surname');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('Group with function', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                group: [{
                    type: 'function',
                    value: 'ST_GeoHash',
                    alias: null,
                    arguments: [{
                        type: 'literal',
                        value: 'the_geom_point'
                    }, {
                        type: 'number',
                        value: 8
                    }]
                }],

            };

            const obj = new Sql2json('select * from tablename group by ST_GeoHash(the_geom_point, 8)');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });
    });

    describe('OrderBy', () => {
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
                    direction: null
                }]
            };

            const obj = new Sql2json('select * from tablename order by name');
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
                    direction: 'asc'
                }, {
                    value: 'createdAt',
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
                    direction: 'asc'
                }, {
                    value: 'createdAt',
                    direction: null
                }]
            };

            const obj = new Sql2json('select * from tablename order by name asc, createdAt');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });
    });

    describe('Limit and offset', () => {
        it('Limit', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                limit: 5
            };

            const obj = new Sql2json('select * from tablename limit 5');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('Offset', () => {
            const response = {
                select: [{
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                }],
                from: 'tablename',
                limit: 5,
                offset: 10
            };

            const obj = new Sql2json('select * from tablename limit 5 offset 10');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });
    });

    describe('brackets', () => {
        it('brackets', () => {
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
                            value: 'a',
                            type: 'literal'
                        },
                        value: '>',
                        right: {
                            value: 2,
                            type: 'number'
                        }
                    },
                    right: {
                        type: 'bracket',
                        value: {
                            type: 'conditional',
                            value: 'or',
                            left: {
                                type: 'operator',
                                left: {
                                    value: 'c',
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
                                    value: 'c',
                                    type: 'literal'
                                },
                                value: '<',
                                right: {
                                    value: 0,
                                    type: 'number'
                                }
                            }
                        }
                    }
                }
            };

            const obj = new Sql2json('select * from tablename where a > 2 and (c > 2 or c < 0)');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });

        it('brackets complex', () => {
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
                        type: 'bracket',
                        value: {
                            type: 'conditional',
                            value: 'or',
                            left: {
                                type: 'operator',
                                left: {
                                    value: 'a',
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
                                    value: 'c',
                                    type: 'literal'
                                },
                                value: '<',
                                right: {
                                    value: 1,
                                    type: 'number'
                                }
                            }
                        }
                    },
                    right: {
                        type: 'bracket',
                        value: {
                            type: 'conditional',
                            value: 'or',
                            left: {
                                type: 'operator',
                                left: {
                                    value: 'c',
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
                                    value: 'c',
                                    type: 'literal'
                                },
                                value: '<',
                                right: {
                                    value: 0,
                                    type: 'number'
                                }
                            }
                        }
                    }
                }
            };

            const obj = new Sql2json('select * from tablename where (a > 2 or c < 1) and (c > 2 or c < 0)');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });
    });

    describe('all', () => {
        it('All', () => {
            const response = {
                select: [{
                    type: 'function',
                    alias: null,
                    value: 'ST_Value',
                    arguments: [{
                        type: 'function',
                        alias: null,
                        value: 'st_transform',
                        arguments: [{
                            value: 'the_raster_webmercator',
                            type: 'literal'
                        },
                        {
                            value: 4326,
                            type: 'number'
                        }]
                    }, {
                        type: 'function',
                        alias: null,
                        value: 'st_setsrid',
                        arguments: [{
                            type: 'function',
                            alias: null,
                            value: 'st_geomfromgeojson',
                            arguments: [{
                                value: '{"type":"Point","coordinates":[-60.25001,-9.33794]}',
                                type: 'string'
                            }]
                        }, {
                            value: 4326,
                            type: 'number'
                        }]
                    }, {
                        value: 'true',
                        type: 'literal'
                    }]
                }],
                from: '0f9e6ed2-24b4-4671-82e8-4e339420a694',
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
                    direction: null
                }]
            };

            const obj = new Sql2json('select ST_Value(st_transform(the_raster_webmercator,4326), st_setsrid(st_geomfromgeojson(\'{"type":"Point","coordinates":[-60.25001,-9.33794]}\'),4326), true)  from 0f9e6ed2-24b4-4671-82e8-4e339420a694 where data between 1 and 3 group by name, surname order by name limit 1');
            const json = obj.toJSON();
            json.should.deepEqual(response);
        });


    });

});
