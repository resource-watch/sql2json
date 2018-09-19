const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Experimental flag', () => {

    it('With *', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select * from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With math', () => {
        const response = {
            select: [{
                value: 'data + 1000',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select data + 1000 from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With normal select', () => {
        const response = {
            select: [{
                value: 'col1, col2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select col1, col2 from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With functions', () => {
        const response = {
            select: [{
                value: 'Shape.STLength(), x',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('SELECT Shape.STLength(), x from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With function and as', () => {
        const response = {
            select: [{
                value: 'ST_HISTOGRAM() as total',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select ST_HISTOGRAM() as total from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With function with variable name', () => {
        const response = {
            select: [{
                value: 'ST_HISTOGRAM() as total',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select ST_HISTOGRAM() as total from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With function intersects', () => {
        const response = {
            select: [{
                value: 'ST_Intersects(the_geom, \'{}\')',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select ST_Intersects(the_geom, \'{}\') from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With function and *', () => {
        const response = {
            select: [{
                value: '( ST_MetaData(the_raster_webmercator)).*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename'
        };

        const obj = new Sql2json('select (ST_MetaData(the_raster_webmercator)).* from tablename', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With where', () => {
        const response = {
            select: [{
                value: 'col1, col2',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            where: {
                value: 'ST_Intersects(the_geom, \'{}\')',
                type: 'literal',
                alias: null
            }
        };

        const obj = new Sql2json('select col1, col2 from tablename where ST_Intersects(the_geom, \'{}\')', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
    it('With orderby', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg(name)',
                type: 'literal',
                alias: null
            }]
        };

        const obj = new Sql2json('select * from tablename order by avg(name)', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With orderby', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            orderBy: [{
                value: 'avg(name), name asc',
                type: 'literal',
                alias: null
            }]
        };

        const obj = new Sql2json('select * from tablename order by avg(name), name asc', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('With groupby', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            group: [{
                value: 'ST_GeoHash(the_geom_point, 8)',
                type: 'literal',
                alias: null
            }]
        };

        const obj = new Sql2json('select * from tablename group by ST_GeoHash(the_geom_point, 8)', true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('Where with order by and function', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'literal'
            }],
            from: 'tablename',
            group: [{
                type: 'literal',
                value: 'date_range(field = \'insert_time\', \'format\' = \'yyyy-MM-dd\', \'2014-08-18\', \'2014-08-17\', \'now-8d\', \'now-7d\', \'now-6d\', \'now\')',
                alias: null,
            }],
        };
        const obj = new Sql2json("SELECT * FROM tablename GROUP BY date_range(field='insert_time','format'='yyyy-MM-dd' ,'2014-08-18','2014-08-17','now-8d','now-7d','now-6d','now')", true);
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

});
