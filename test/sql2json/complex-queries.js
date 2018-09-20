const assert = require('assert');
const ComplexQueries = require('../../').sql2json;
require('should');


describe('SQL to JSON - Complex queries', () => {
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
                        }
                    ]
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
                alias: null,
                type: 'literal',
                direction: null
            }]
        };

        const obj = new ComplexQueries('select ST_Value(st_transform(the_raster_webmercator,4326), st_setsrid(st_geomfromgeojson(\'{"type":"Point","coordinates":[-60.25001,-9.33794]}\'),4326), true)  from 0f9e6ed2-24b4-4671-82e8-4e339420a694 where data between 1 and 3 group by name, surname order by name limit 1');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });


});
