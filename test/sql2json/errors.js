const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Errors', () => {

    it('Check throw error if create instance without sql', () => {
        try {
            new Sql2json(null);
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('Sql required');
        }
    });

    it('Check throw error if create instance with unsupported query type - update', () => {
        try {
            const obj = new Sql2json('UPDATE foo SET bar = null');
            obj.toJSON();
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('Unsupported query element detected: UPDATE');
        }
    });

    it('Check throw error if using unsupported query type - create', () => {
        try {
            const obj = new Sql2json('CREATE table foo');
            obj.toJSON();
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('Unsupported query element detected: CREATE');
        }
    });

    it('Check throw error if using orphan math operation', () => {
        try {
            const obj = new Sql2json('SELECT + 1 from foo');
            obj.toJSON();
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('MATH operation found with empty stack - is your query correctly formed?');
        }
    });

    it('Check throw error if using wrong escaping - case 1', () => {
        try {
            const obj = new Sql2json('SELECT \'a from foo');
            obj.toJSON();
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('SQL tokenizer detected an error: Error: NOTHING CONSUMED: Stopped at - \'\'a from foo\'');
        }
    });

    it('Check throw error if using wrong escaping - case 2', () => {
        try {
            const obj = new Sql2json('SELECT first(b1) as x FROM \'users/resourcewatch_wri/foo_024_vegetation_health_index\' WHERE system:time_start >= 1533448800000 and ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON(\'{/"type/":/"Point/",/"coordinates/":[18.632812500000004,21.289374355860424]}),4326), the_geom)');
            obj.toJSON();
            assert(false, 'Expected throw error');
        } catch (e) {
            e.message.should.be.equal('SQL tokenizer detected an error: Error: NOTHING CONSUMED: Stopped at - \'\'{/"type/":/"Point/",/"coordin\'');
        }
    });

});
