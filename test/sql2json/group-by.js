const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Group By', () => {
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

    it('Group by number of column name', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            group: [{
                type: 'number',
                value: 123
            }]
        };

        const obj = new Sql2json('select * from tablename group by 123');
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

    it('Group with function with constant as argument', () => {
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
                    type: 'string',
                    value: '1d'
                }, {
                    type: 'number',
                    value: 8
                }]
            }],

        };

        const obj = new Sql2json('select * from tablename group by ST_GeoHash(\'1d\', 8)');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('Group with nested functions', () => {
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
                    type: 'function',
                    value: 'foo',
                    alias: null,
                    arguments: [{
                        type: 'number',
                        value: 8
                    }]
                }]
            }],

        };

        const obj = new Sql2json('select * from tablename group by ST_GeoHash(the_geom_point, foo(8))');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('Group with random function', () => {
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

    it('Where with false name column', () => {
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

        const obj = new Sql2json('select * from tablename where false > 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

});
