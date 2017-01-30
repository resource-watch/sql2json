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

    });

    // describe('GroupBy', () => {
    //     it('Group by one field', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             group: ['name']
    //         };

    //         const obj = new Sql2json('select * from tablename group by name');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('Group by several fields', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             group: ['name', 'surname']
    //         };

    //         const obj = new Sql2json('select * from tablename group by name, surname');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('Group with where', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             group: ['name', 'surname'],
    //             where: {
    //                 type: 'between',
    //                 value: 'data',
    //                 arguments: [{
    //                     value: 1,
    //                     type: 'number'
    //                 }, {
    //                     value: 3,
    //                     type: 'number'
    //                 }]
    //             }
    //         };

    //         const obj = new Sql2json('select * from tablename where data between 1 and 3 group by name, surname');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });
    // });

    // describe('OrderBy', () => {
    //     it('SQL with orderby', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             orderBy: [{
    //                 value: 'name',
    //                 direction: null
    //             }]
    //         };

    //         const obj = new Sql2json('select * from tablename order by name');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('SQL with orderby and direction', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             orderBy: [{
    //                 value: 'name',
    //                 direction: 'asc'
    //             }]
    //         };

    //         const obj = new Sql2json('select * from tablename order by name asc');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('SQL with several orderby and direction', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             orderBy: [{
    //                 value: 'name',
    //                 direction: 'asc'
    //             }, {
    //                 value: 'createdAt',
    //                 direction: 'desc'
    //             }]
    //         };

    //         const obj = new Sql2json('select * from tablename order by name asc, createdAt desc');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('SQL with several orderby and direction 2', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             orderBy: [{
    //                 value: 'name',
    //                 direction: 'asc'
    //             }, {
    //                 value: 'createdAt',
    //                 direction: null
    //             }]
    //         };

    //         const obj = new Sql2json('select * from tablename order by name asc, createdAt');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });
    // });

    // describe('Limit and offset', () => {
    //     it('Limit', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             limit: 5
    //         };

    //         const obj = new Sql2json('select * from tablename limit 5');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });

    //     it('Offset', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             limit: 5,
    //             offset: 10
    //         };

    //         const obj = new Sql2json('select * from tablename limit 5 offset 10');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });
    // });

    // describe('all', () => {
    //     it('All', () => {
    //         const response = {
    //             select: [{
    //                 value: '*',
    //                 alias: null,
    //                 type: 'wildcard'
    //             }],
    //             from: 'tablename',
    //             group: ['name', 'surname'],
    //             where: {
    //                 type: 'between',
    //                 value: 'data',
    //                 arguments: [{
    //                     value: 1,
    //                     type: 'number'
    //                 }, {
    //                     value: 3,
    //                     type: 'number'
    //                 }]
    //             },
    //             limit: 1,
    //             orderBy: [{
    //                 value: 'name',
    //                 direction: null
    //             }]
    //         };

    //         const obj = new Sql2json('select * from tablename where data between 1 and 3 group by name, surname order by name limit 1');
    //         const json = obj.toJSON();
    //         json.should.deepEqual(response);
    //     });
    // });

});
