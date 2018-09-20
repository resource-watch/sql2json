const assert = require('assert');
const Sql2json = require('../../').sql2json;
require('should');


describe('SQL to JSON - Delete', () => {
    it('basic delete', () => {
        const response = {
            delete: true,
            from: '75832571-44e7-41a3-96cf-4368a7f07075'
        };

        const obj = new Sql2json('DELETE FROM 75832571-44e7-41a3-96cf-4368a7f07075');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });

    it('with where', () => {
        const response = {
            delete: true,
            from: 'tablename',
            where: {
                type: 'operator',
                left: {
                    value: 'id',
                    type: 'literal'
                },
                value: '>',
                right: {
                    value: 2,
                    type: 'number'
                }
            }
        };

        const obj = new Sql2json('DELETE FROM tablename WHERE id > 2');
        const json = obj.toJSON();
        json.should.deepEqual(response);
    });
});

