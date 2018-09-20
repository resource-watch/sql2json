const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Brackets', () => {
    it('brackets', () => {
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

        const response = 'SELECT * FROM tablename WHERE a > 2 and (c > 2 or c < 0)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('brackets', () => {
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

        const response = 'SELECT * FROM tablename WHERE (a > 2 or c < 1) and (c > 2 or c < 0)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
