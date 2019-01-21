const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Experimental flag', () => {

    it('With math (experimental json tree)', () => {
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

    it('With normal select with multiple fields (experimental json tree)', () => {
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

    it('With functions and fields (experimental json tree)', () => {
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
});
