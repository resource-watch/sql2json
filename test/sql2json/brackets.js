const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Brackets', () => {
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
