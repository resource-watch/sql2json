const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - From', () => {

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

    it('With table name with slash without quotes', () => {
        const response = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'ft:table/name'
        };

        const obj = new Sql2json('select * from ft:table/name');
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

