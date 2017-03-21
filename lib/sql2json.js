const lexer = require('sql-parser').lexer;

const postgisFunctions = /^(ST_Intersects|ST_AsGeoJson|ST_SetSRID|ST_GeomFromGeoJSON|ST_METADATA|ST_SUMMARYSTATS|ST_HISTOGRAM|TO_NUMBER|TO_CHAR|ST_GeoHash|first|last|ST_BANDMETADATA|st_centroid|ST_X|ST_Y|CF_[a-zA-Z0-9_-])$/gi;
const between = /^between$/gi;
const sqlStatements = /^delete$/gi;

const obtainType = function (token) {
    postgisFunctions.lastIndex = 0;
    between.lastIndex = 0;
    sqlStatements.lastIndex = 0;
    if (token[0] === 'LITERAL' && postgisFunctions.test(token[1])) {
        return 'FUNCTION';
    } else if (token[0] === 'LITERAL' && between.test(token[1])) {
        return 'BETWEEN';
    } else if (token[0] === 'LITERAL' && sqlStatements.test(token[1])) {
        return 'DELETE';
    }
    return token[0];
};

function sql2json(sql) {
    if (!sql) {
        throw new Error('Sql required');
    }
    this.sql = sql;
    this.tokens = lexer.tokenize(this.sql);
    this.index = 0;
    this.stack = [];
    this.parsed = {};
}

sql2json.prototype.hasNext = function () {
    return this.index < this.tokens.length;
};

sql2json.prototype.next = function () {
    return this.tokens[this.index++];
};

sql2json.prototype.parseFunction = function (functionName, isInSelect) {
    const stack = [];
    let findParen = false;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'LITERAL':
                stack.push({
                    value: token[1],
                    type: 'literal'
                });
                break;
            case 'FUNCTION':
                if (!isInSelect) {
                    stack.push(this.parseFunction(token[1], isInSelect));
                } else {
                    stack.push({
                        value: token[1],
                        type: 'literal'
                    });
                }
                break;
            case 'SEPARATOR':
                if (!findParen) {
                    return {
                        value: functionName,
                        type: 'literal',
                        alias: null
                    };
                }
                break;
            case 'LEFT_PAREN':
                findParen = true;
                break;
            case 'RIGHT_PAREN':
                return {
                    type: 'function',
                    alias: null,
                    value: functionName,
                    arguments: stack
                };
            case 'STRING':
                stack.push({
                    value: token[1],
                    type: 'string'
                });
                break;
            case 'DBLSTRING':
                stack.push({
                    value: `"${token[1]}"`,
                    type: 'string'
                });
                break;
            case 'NUMBER':
                stack.push({
                    value: parseFloat(token[1]),
                    type: 'number'
                });
                break;
            default:
                if (!findParen) {
                    this.index--;
                    return {
                        value: functionName,
                        type: 'literal',
                        alias: null
                    };
                }
                stack.push({
                    value: token[1],
                    type: 'literal'
                });

        }
    }
};

sql2json.prototype.parseSelect = function () {
    this.parsed.select = [];
    let containAs = false;
    let isDistinct = false;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'STAR':
                this.parsed.select.push({
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                });
                break;
            case 'LITERAL':
                if (containAs) {
                    this.parsed.select[this.parsed.select.length - 1].alias = token[1];
                    containAs = false;
                } else {
                    this.parsed.select.push({
                        value: token[1],
                        alias: null,
                        type: 'literal'
                    });
                }
                break;
            case 'AS':
                containAs = true;
                break;
            case 'FUNCTION':
            case 'FIRST':
            case 'LAST':
                if (containAs) {
                    this.parsed.select[this.parsed.select.length - 1].alias = token[1];
                    containAs = false;
                } else {
                    this.parsed.select.push(this.parseFunction(token[1], true));
                }
                break;
            case 'DISTINCT':
                isDistinct = true;
                break;
            case 'SEPARATOR':
                break;
            default:
                this.index--;
                if (isDistinct) {
                    this.parsed.select = [{
                        type: 'distinct',
                        arguments: this.parsed.select
                    }];
                }
                return;

        }
    }
};

sql2json.prototype.parseDelete = function () {
    this.parsed.delete = true;
};

sql2json.prototype.parseFrom = function () {
    let name = '';
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'LITERAL':
                name += token[1];
                break;
            case 'NUMBER':
                name += token[1];
                break;
            case 'DOT':
                name += token[1];
                break;
            case 'STRING':
                name += `'${token[1]}'`;
                break;
            case 'DBLSTRING':
                name += `"${token[1]}"`;
                break;
            default:
                this.parsed.from = name;
                this.index--;
                return;

        }
    }
};

sql2json.prototype.parseIn = function () {
    const stack = [];
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'LEFT_PAREN':
            case 'SEPARATOR':
                break;
            case 'STRING':
                stack.push({
                    value: token[1],
                    type: 'string'
                });
                break;
            case 'NUMBER':
                stack.push({
                    value: parseFloat(token[1]),
                    type: 'number'
                });
                break;
            case 'RIGHT_PAREN':
                return stack;
            default:
                return stack;

        }
    }
};

sql2json.prototype.parseBetween = function (between) {
    const stack = [];
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {
            case 'STRING':
                stack.push({
                    value: token[1],
                    type: 'string'
                });
                break;
            case 'NUMBER':
                stack.push({
                    value: parseFloat(token[1]),
                    type: 'number'
                });
                break;
            case 'CONDITIONAL':
                break;
            default:
                return stack;

        }

        if (stack.length === 2) {
            const right = stack.pop();
            const left = stack.pop();
            return {
                type: 'between',
                value: between,
                arguments: [left, right]
            };
        }
    }
};

sql2json.prototype.parseWhere = function () {
    const stack = [];
    let operator = null;
    let conditional = null;
    let between = null;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'LEFT_PAREN':
                stack.push({
                    value: this.parseWhere(),
                    type: 'bracket'
                });
                break;
            case 'RIGHT_PAREN':
                if (operator && stack.length >= 2) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'operator',
                        value: operator,
                        left,
                        right
                    });
                    operator = null;
                }
                if (stack.length >= 2 && conditional) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'conditional',
                        value: conditional,
                        left,
                        right
                    });
                    conditional = null;

                }
                return stack.pop();
                break;
            case 'LITERAL':
                stack.push({
                    value: token[1],
                    type: 'literal'
                });
                break;
            case 'BETWEEN':
                between = stack.pop().value;
                stack.push(this.parseBetween(between));
                break;
            case 'NUMBER':
                stack.push({
                    value: parseFloat(token[1]),
                    type: 'number'
                });
                break;
            case 'DBLSTRING':
                stack.push({
                    value: `${token[1]}`,
                    type: 'string'
                });
                break;
            case 'STRING':
                stack.push({
                    value: token[1],
                    type: 'string'
                });
                break;
            case 'OPERATOR':
                operator = token[1];
                break;
            case 'SUB_SELECT_OP':
                stack.push({
                    type: 'in',
                    value: stack.pop().value,
                    arguments: this.parseIn()
                });
                break;
            case 'FUNCTION':
            case 'LAST':
            case 'FIRST':
                stack.push(this.parseFunction(token[1], false));
                break;
            case 'CONDITIONAL':
                if (operator && stack.length >= 2) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'operator',
                        value: operator,
                        left,
                        right
                    });
                    operator = null;
                }
                if (stack.length >= 2 && conditional) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'conditional',
                        value: conditional,
                        left,
                        right
                    });
                    conditional = null;

                }
                conditional = token[1];
                break;
            default:
                if (stack.length >= 2 && operator) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'operator',
                        value: operator,
                        left,
                        right
                    });
                    operator = null;
                }
                if (stack.length >= 2 && conditional) {
                    const right = stack.pop();
                    const left = stack.pop();
                    stack.push({
                        type: 'conditional',
                        value: conditional,
                        left,
                        right
                    });
                    conditional = null;

                }
                this.parsed.where = stack.pop();
                this.index--;
                return;

        }
    }
};

sql2json.prototype.parseOrder = function () {
    const stack = [];
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'BY':
                break;
            case 'LITERAL':
            case 'FUNCTION':
                stack.push({
                    value: token[1],
                    direction: null
                });
                break;
            case 'DIRECTION':
                stack[stack.length - 1].direction = token[1];
                break;
            case 'SEPARATOR':
                break;
            default:
                this.parsed.orderBy = stack;
                this.index--;
                return;

        }
    }
};


sql2json.prototype.parseLimit = function () {
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'NUMBER':
                this.parsed.limit = parseInt(token[1], 10);
                return;
            default:
                return;

        }
    }
};

sql2json.prototype.parseOfsset = function () {
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'NUMBER':
                this.parsed.offset = parseInt(token[1], 10);
                return;
            default:
                return;

        }
    }
};

sql2json.prototype.parseGroup = function () {
    const stack = [];
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'BY':
            case 'SEPARATOR':
                break;
            case 'LITERAL':
                stack.push({
                    type: 'literal',
                    value: token[1]
                });
                break;
            case 'FUNCTION':
                stack.push(this.parseFunction(token[1]));
                break;
            default:
                this.parsed.group = stack;
                this.index--;
                return;

        }
    }
};

sql2json.prototype.parse = function () {
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'SELECT':
                this.parseSelect();
                break;
            case 'DELETE':
                this.parseDelete();
                break;
            case 'FROM':
                this.parseFrom();
                break;
            case 'WHERE':
                this.parseWhere();
                break;
            case 'GROUP':
                this.parseGroup();
                break;
            case 'ORDER':
                this.parseOrder();
                break;
            case 'LIMIT':
                this.parseLimit();
                break;
            case 'OFFSET':
                this.parseOfsset();
                break;
            case 'EOF':
                return;
            default:
                break;

        }
    }
};

sql2json.prototype.toJSON = function () {
    this.parse();
    return this.parsed;
};

module.exports = sql2json;
