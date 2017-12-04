const lexer = require('sql-parser').lexer;

const postgisFunctions = /^(nested|ST_SummaryStatsAgg|ST_value|st_valueCount|st_transform|ST_Intersects|st_buffer|ST_AsGeoJson|ST_SetSRID|ST_GeomFromGeoJSON|ST_METADATA|ST_SUMMARYSTATS|ST_HISTOGRAM|TO_NUMBER|TO_CHAR|ST_GeoHash|first|last|ST_BANDMETADATA|st_centroid|round|trunc|abs|ceil|exp|floor|power|sqrt|acos|asin|atan|atan2|cos|cot|sin|tan|to_timestamp|ST_X|ST_Y|CF_[a-zA-Z0-9_-])$/gi;
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

function sql2json(sql, experimental=false) {
    if (!sql) {
        throw new Error('Sql required');
    }
    this.sql = sql;
    this.experimental = experimental;
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
                stack.push(this.parseFunction(token[1], isInSelect));
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
                if (!findParen) {
                    this.index--;
                    return {
                        type: 'literal',
                        value: functionName
                    };
                }
                return {
                    type: 'function',
                    alias: null,
                    value: functionName,
                    arguments: stack
                };
            case 'STRING':
                stack.push({
                    value: `'${token[1]}'`,
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
            case 'MATH_MULTI':
            case 'MATH':
                if (stack.length > 0) {
                    stack.push(this.parseMath(token[1], stack.pop()));
                } else {
                    stack.push({
                        value: '*',
                        alias: null,
                        type: 'wildcard'
                    });
                }
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


sql2json.prototype.parseSelectExperimental = function () {
    this.parsed.select = [];
    let lastParen = false;
    while(this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'FROM':
                this.index--;
                return;
            default:
                let el = null;
                if (this.parsed.select.length > 0) {
                    el = this.parsed.select.pop();
                    if (token[0] === 'STRING') {
                        token[1] = `'${token[1]}'`;
                    }
                    if (token[0] === 'DBLSTRING') {
                        token[1] = `"${token[1]}"`;
                    }
                    if (!lastParen && token[1] !== '(' && token[1] !== ')' && token[1] !== ',' && token[1] !== '.'  && token[1] !== '*') {
                        el.value += ' ' + token[1];
                    } else {
                        if (token[1] === '('){
                            lastParen = true;
                        } else {
                            lastParen = false;
                        }
                        el.value += token[1];
                    }
                } else  {
                    el = {
                        value: token[1],
                        alias: null,
                        type: 'literal'
                    }
                }
                this.parsed.select.push(el);
                break;
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
            case 'DBLSTRING':
                this.parsed.select.push({
                    value: `"${token[1]}"`,
                    type: 'string'
                });
                break;
            case 'NUMBER':
                this.parsed.select.push({
                    value: parseFloat(token[1]),
                    type: 'number',
                    alias: null
                });
                break;
            case 'STAR':
                this.parsed.select.push({
                    value: '*',
                    alias: null,
                    type: 'wildcard'
                });
                break;
            case 'LEFT_PAREN':
            case 'RIGHT_PAREN':
                this.parsed.select[this.parsed.select.length - 1].value = this.parsed.select[this.parsed.select.length - 1].value + token[1];
                break;

            case 'LITERAL':
            case 'BOOLEAN':
            case 'GROUP':
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
            case 'STRING':
                if (containAs) {
                    this.parsed.select[this.parsed.select.length - 1].alias = token[1];
                    containAs = false;
                } else {
                    this.parsed.select.push({
                        value: `'${token[1]}'`,
                        alias: null,
                        type: 'string'
                    });
                }
                break;
            case 'MATH_MULTI':
            case 'MATH':
                this.parsed.select.push(this.parseMath(token[1], this.parsed.select.pop()));
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
            case 'MATH':
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
                    value: `'${token[1]}'`,
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

sql2json.prototype.parseMath = function (value, first) {
    const stack = [first];
    let minus = false;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {
            case 'MATH':
                minus = true;
                break;
            case 'LITERAL':
                stack.push({
                    value: token[1],
                    type: 'literal'
                });
                break;
            case 'NUMBER':
                stack.push({
                    value: minus ? parseFloat(token[1]) * -1 : parseFloat(token[1]),
                    type: 'number'
                });
                break;
            default:
                return stack;

        }

        if (stack.length === 2) {
            return {
                type: 'math',
                value,
                arguments: stack
            };
        }
    }
};

sql2json.prototype.parseBetween = function (between) {
    const stack = [];
    let mult = 1;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {
            case 'STRING':
                stack.push({
                    value: `'${token[1]}'`,
                    type: 'string'
                });
            break;
	    case 'MATH':
	        if (token[1] === '-') {
		    mult = -1;
	        }
	        break;
            case 'NUMBER':
                stack.push({
                    value: mult * parseFloat(token[1]),
                    type: 'number'
                });
	        mult = 1;
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
    let minus = null;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {
            case 'MATH_MULTI':
            case 'MATH':
                if (operator) {
                    minus = true;
                } else {
                    stack.push(this.parseMath(token[1], stack.pop()));
                }
                break;
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
            case 'BOOLEAN':
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
                    value: minus ? -1 * parseFloat(token[1]) : parseFloat(token[1]),
                    type: 'number'
                });
                minus = false;
                break;
            case 'DBLSTRING':
                stack.push({
                    value: `"${token[1]}"`,
                    type: 'string'
                });
                break;
            case 'STRING':
                stack.push({
                    value: `'${token[1]}'`,
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
sql2json.prototype.parseWhereExperimental = function () {
    const stack = [];
    let lastParen = false;
    while (this.hasNext()) {
        const token = this.next();

        switch (obtainType(token)) {

            case 'GROUP':
            case 'ORDER':
            case 'LIMIT':
            case 'OFFSET':
            case 'EOF':
                this.parsed.where = stack.pop();
                this.index--;
                return;
            default:
                let el = null;
                if (stack.length > 0) {
                    el = stack.pop();
                    if (token[0] === 'STRING') {
                        token[1] = `'${token[1]}'`;
                    }
                    if (token[0] === 'DBLSTRING') {
                        token[1] = `"${token[1]}"`;
                    }
                    if (!lastParen && token[1] !== '(' && token[1] !== ')' && token[1] !== ',' && token[1] !== '.'  && token[1] !== '*') {
                        el.value += ' ' + token[1];
                    } else {
                        if (token[1] === '('){
                            lastParen = true;
                        } else {
                            lastParen = false;
                        }
                        el.value += token[1];
                    }
                } else  {
                    el = {
                        value: token[1],
                        alias: null,
                        type: 'literal'
                    }
                }
                stack.push(el);
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
                stack.push(this.parseFunction(token[1]));
                stack[stack.length - 1].direction = null;
                break;
            case 'DIRECTION':
                stack[stack.length - 1].direction = token[1];
                break;
            case 'SEPARATOR':
                break;
            case 'DBLSTRING':
                stack.push({
                    value: `"${token[1]}"`,
                    alias: null,
                    type: 'string',
                    direction: null
                });
                break;
            case 'NUMBER':
                stack.push({
                    value: parseFloat(token[1]),
                    type: 'number',
                    alias: null,
                    direction: null
                });
                break;
            case 'MATH_MULTI':
            case 'MATH':
                stack.push(this.parseMath(token[1], stack.pop()));
                break;
            default:
                this.parsed.orderBy = stack;
                this.index--;
                return;

        }
    }
};

sql2json.prototype.parseOrderExperimental = function () {
    const stack = [];
    let lastParen = false;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'BY':
                break;

            case 'LIMIT':
            case 'OFFSET':
            case 'EOF':
            case 'GROUP':
                this.parsed.orderBy = stack;
                this.index--;
                return;
            default:
                let el = null;
                if (stack.length > 0) {
                    el = stack.pop();
                    if (token[0] === 'STRING') {
                        token[1] = `'${token[1]}'`;
                    }
                    if (token[0] === 'DBLSTRING') {
                        token[1] = `"${token[1]}"`;
                    }
                    if (!lastParen && token[1] !== '(' && token[1] !== ')' && token[1] !== ',' && token[1] !== '.'  && token[1] !== '*') {
                        el.value += ' ' + token[1];
                    } else {
                        if (token[1] === '('){
                            lastParen = true;
                        } else {
                            lastParen = false;
                        }
                        el.value += token[1];
                    }
                } else {
                    el = {
                        value: token[1],
                        alias: null,
                        type: 'literal'
                    };
                }
                stack.push(el);


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
            case 'NUMBER':
                stack.push({
                    type: 'number',
                    value: parseFloat(token[1])
                });
                break;
            default:
                this.parsed.group = stack;
                this.index--;
                return;

        }
    }
};
sql2json.prototype.parseGroupExperimental = function () {
    const stack = [];
    let lastParen = false;
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'BY':
                break;
            case 'LIMIT':
            case 'OFFSET':
            case 'EOF':
            case 'ORDER':
                this.parsed.group = stack;
                this.index--;
                return;
            default:
                let el = null;
                if (stack.length > 0) {
                    el = stack.pop();
                    if (token[0] === 'STRING') {
                        token[1] = `'${token[1]}'`;
                    }
                    if (token[0] === 'DBLSTRING') {
                        token[1] = `"${token[1]}"`;
                    }
                    if (!lastParen && token[1] !== '(' && token[1] !== ')' && token[1] !== ',' && token[1] !== '.'  && token[1] !== '*') {
                        el.value += ' ' + token[1];
                    } else {
                        if (token[1] === '('){
                            lastParen = true;
                        } else {
                            lastParen = false;
                        }
                        el.value += token[1];
                    }
                } else {
                    el = {
                        value: token[1],
                        alias: null,
                        type: 'literal'
                    };
                }
                stack.push(el);

        }
    }
};

sql2json.prototype.parse = function () {
    while (this.hasNext()) {
        const token = this.next();
        switch (obtainType(token)) {

            case 'SELECT':
                if (this.experimental) {
                    this.parseSelectExperimental();
                } else {
                    this.parseSelect();
                }
                break;
            case 'DELETE':
                this.parseDelete();
                break;
            case 'FROM':
                this.parseFrom();
                break;
            case 'WHERE':
                if (this.experimental) {
                    this.parseWhereExperimental();
                } else {
                    this.parseWhere();
                }
                break;
            case 'GROUP':
                if (this.experimental) {
                    this.parseGroupExperimental();
                } else {
                    this.parseGroup();
                }
                break;
            case 'ORDER':
                if (this.experimental) {
                    this.parseOrderExperimental();
                } else {
                    this.parseOrder();
                }
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
