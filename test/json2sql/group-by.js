const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - GroupBy', () => {
    it('Group by one field', () => {
        const data = {
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

        const response = 'SELECT * FROM tablename GROUP BY name';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('Group by number of column name', () => {
        const data = {
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

        const response = 'SELECT * FROM tablename GROUP BY 123';
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
            group: [{
                type: 'literal',
                value: 'name'
            }, {
                type: 'literal',
                value: 'surname'
            }]
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

        const response = 'SELECT * FROM tablename WHERE data BETWEEN 1 AND 3 GROUP BY name, surname';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('Group with function', () => {
        const data = {
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

        const response = 'SELECT * FROM tablename GROUP BY ST_GeoHash(the_geom_point,8)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('Group with function with column name (double quotes) and constant as arguments', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            group: [{
                type: 'function',
                value: 'date_histogram',
                alias: null,
                arguments: [{
                    type: 'literal',
                    value: 'createdAt'
                }, {
                    type: 'string',
                    value: '1d'
                }]
            }],
        };

        const response = 'SELECT * FROM tablename GROUP BY date_histogram(createdAt,\'1d\')';
        Json2sql.toSQL(data).should.deepEqual(response);

    });

    it('Group with function with named arguments', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            group: [{
                type: 'function',
                value: 'date_histogram',
                alias: null,
                arguments: [{
                    type: 'literal',
                    name: 'field',
                    value: 'createdAt'
                }, {
                    type: 'string',
                    name: 'interval',
                    value: '1d'
                }]
            }],
        };

        const response = 'SELECT * FROM tablename GROUP BY date_histogram( \'field\'="createdAt", \'interval\'=\'1d\')';
        Json2sql.toSQL(data).should.deepEqual(response);

    });
});

