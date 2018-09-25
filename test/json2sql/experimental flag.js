const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Experimental flag', () => {

    it('With *', () => {
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

    it('With math (wrong json tree)', () => {
        const data = {
            select: [{
                value: 'data + 1000',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT data + 1000 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With math (correct json tree)', () => {
        const data = {
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

        const response = 'SELECT data + 1000 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With normal select with multiple fields (grouped, invalid tree)', () => {
        const data = {
            select: [{
                value: 'col1, col2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT col1, col2 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With normal select with multiple fields (split, valid tree)', () => {
        const data = {
            select: [{
                value: 'col1',
                alias: null,
                type: 'literal'
            }, {
                value: 'col2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT col1, col2 FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With functions and fields (grouped, invalid tree)', () => {
        const data = {
            select: [{
                value: 'Shape.STLength(), x',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT Shape.STLength(), x FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With functions and fields (split, valid tree)', () => {
        const data = {
            select: [{
                value: 'Shape.STLength',
                alias: null,
                type: 'function',
                arguments: []
            }, {
                value: 'x',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const response = 'SELECT Shape.STLength(), x FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With function and as', () => {
        const data = {
            select: [{
                value: 'ST_HISTOGRAM',
                alias: 'total',
                type: 'function'
            }],
            from: 'tablename'
        };

        const response = 'SELECT ST_HISTOGRAM() AS total FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With function intersects', () => {
        const data = {
            select: [{
                value: 'ST_Intersects',
                alias: null,
                type: 'function',
                arguments: [
                    {
                        value: 'the_geom',
                        alias: null,
                        type: 'literal'
                    }, {
                        value: '{}',
                        alias: null,
                        type: 'string'
                    }

                ]
            }],
            from: 'tablename'
        };

        const response = 'SELECT ST_Intersects(the_geom,\'{}\') FROM tablename';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With where', () => {
        const data = {
            select: [{
                value: 'col1',
                alias: null,
                type: 'literal'
            }, {
                value: 'col2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            where: {
                value: 'ST_Intersects',
                alias: null,
                type: 'function',
                arguments: [
                    {
                        value: 'the_geom',
                        alias: null,
                        type: 'literal'
                    }, {
                        value: '{}',
                        alias: null,
                        type: 'string'
                    }

                ]
            }
        };

        const response = 'SELECT col1, col2 FROM tablename WHERE ST_Intersects(the_geom, \'{}\')';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With orderby with function (invalid tree)', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg( name)',
                type: 'literal',
                alias: null
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg( name)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With orderby with function', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With orderby', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'name',
                        type: 'literal',
                        alias: null
                    }
                ]
            }, {
                value: 'name',
                type: 'literal',
                alias: null,
                direction: 'asc'
            }]
        };

        const response = 'SELECT * FROM tablename ORDER BY avg(name), name asc';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With groupby', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'tablename',
            group: [{
                value: 'ST_GeoHash',
                type: 'function',
                alias: null,
                arguments: [
                    {
                        value: 'the_geom_point',
                        type: 'literal',
                        alias: null
                    }, {
                        value: '8',
                        type: 'number',
                        alias: null
                    }
                ]
            }]
        };

        const response = 'SELECT * FROM tablename GROUP BY ST_GeoHash(the_geom_point,8)';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
