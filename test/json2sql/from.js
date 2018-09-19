const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - From', () => {

    it('With table name', () => {
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

    it('With table name inside quotes', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: '"tablename"'
        };

        const response = 'SELECT * FROM "tablename"';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With table name inside quotes 2', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: '"ft:table/name"'
        };

        const response = 'SELECT * FROM "ft:table/name"';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With table name inside simple quotes', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: '\'ft:tablename\''
        };

        const response = 'SELECT * FROM \'ft:tablename\'';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With table name inside dots', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: 'public.pepe'
        };

        const response = 'SELECT * FROM public.pepe';
        Json2sql.toSQL(data).should.deepEqual(response);
    });

    it('With table name like bigquery', () => {
        const data = {
            select: [{
                value: '*',
                alias: null,
                type: 'wildcard'
            }],
            from: '[bigquery-public-data:noaa_gsod.stations]'
        };

        const response = 'SELECT * FROM [bigquery-public-data:noaa_gsod.stations]';
        Json2sql.toSQL(data).should.deepEqual(response);
    });
});
