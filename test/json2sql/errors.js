const assert = require('assert');
const Json2sql = require('../../index').json2sql;
require('should');


describe('JSON to SQL - Errors', () => {

    it('Error: Check throw error if create instance without data', () => {
        try {
            Json2sql.toSQL(null);
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('JSON required');
        }
    });

});
