function json2sql() {}


const parseFunction = (nodeFun) => {
    const args = [];
    for (let i = 0, length = nodeFun.arguments.length; i < length; i++) {
        const node = nodeFun.arguments[i];
        switch (node.type) {

            case 'literal':
                args.push(node.value);
                break;
            case 'string':
                args.push(`'${node.value}'`);
                break;
            case 'number':
                args.push(node.value);
                break;
            case 'math':
                args.push(parseMath(node));
                break;
            case 'function':
                args.push(parseFunction(node));
                break;
            default:
                break;

        }
    }
    return `${nodeFun.value}(${args.join(',')})${nodeFun.alias ? ` AS ${nodeFun.alias}` : ''}`;
};

const parseMath = (nodeFun) => {
    const args = [];
    for (let i = 0, length = nodeFun.arguments.length; i < length; i++) {
        const node = nodeFun.arguments[i];
        switch (node.type) {

            case 'literal':
                args.push(node.value);
                break;
            case 'string':
                args.push(`'${node.value}'`);
                break;
            case 'number':
                args.push(node.value);
                break;
            case 'function':
                args.push(parseFunction(node));
                break;
            default:
                break;

        }
    }
    return `${args[0]} ${nodeFun.value} ${args[1]}${nodeFun.alias ? ` AS ${nodeFun.alias}` : ''}`;
};

const parseSelect = (select) => {
    const responses = [];
    if (select) {
        for (let i = 0, length = select.length; i < length; i++) {
            const node = select[i];
            switch (node.type) {

                case 'wildcard':
                    responses.push(`*`);
                    break;
                case 'literal':
                    responses.push(`${node.value}${node.alias ? ` AS ${node.alias}` : ''}`);
                    break;
                case 'string':
                    responses.push(`'${node.value}'${node.alias ? ` AS ${node.alias}` : ''}`);
                    break;
                case 'function':
                    responses.push(parseFunction(node));
                    break;
                case 'math':
                    responses.push(parseMath(node));
                    break;
                case 'distinct':
                    responses.push(`DISTINCT ${parseSelect(node.arguments)}`);
                    break;
                default:
                    break;

            }
        }
    }
    return responses.join(', ');
};

const parseNodeWhere = (node) => {
    let args = [];
    switch (node.type) {

        case 'literal':
        case 'number':
            return node.value;
        case 'string':
            return `'${node.value}'`;
        case 'operator':
            return `${parseNodeWhere(node.left)} ${node.value} ${parseNodeWhere(node.right)}`;
        case 'conditional':
            return `${parseNodeWhere(node.left)} ${node.value} ${parseNodeWhere(node.right)}`;
        case 'bracket':
            return `(${parseNodeWhere(node.value)})`;
        case 'in':
            args = [];
            if (node.arguments) {
                for (let i = 0, length = node.arguments.length; i < length; i++) {
                    args.push(parseNodeWhere(node.arguments[i]));
                }
            }
            return `${node.value} IN (${args.join(', ')})`;
        case 'between':
            args = [];
            if (node.arguments) {
                for (let i = 0, length = node.arguments.length; i < length; i++) {
                    args.push(parseNodeWhere(node.arguments[i]));
                }
            }
            return `${node.value} BETWEEN ${parseNodeWhere(node.arguments[0])} AND ${parseNodeWhere(node.arguments[1])}`;
        case 'function':
            args = [];
            if (node.arguments) {
                for (let i = 0, length = node.arguments.length; i < length; i++) {
                    args.push(parseNodeWhere(node.arguments[i]));
                }
            }
            return `${node.value}(${args.join(', ')})`;
        default:
            return node.value;

    }
};

const parseWhere = (node) => {
    if (node) {
        return `WHERE ${parseNodeWhere(node)}`;
    }
    return '';
};

const parseOrderBy = (orderBy) => {
    if (orderBy) {
        const responses = [];
        for (let i = 0, length = orderBy.length; i < length; i++) {
            if (orderBy[i].type === 'function') {
                responses.push(`${parseFunction(orderBy[i])}${orderBy[i].direction ? ` ${orderBy[i].direction}` : ''}`)
            } else {
                responses.push(`${orderBy[i].value}${orderBy[i].direction ? ` ${orderBy[i].direction}` : ''}`);
            }
        }
        return `ORDER BY ${responses.join(', ')}`;
    }
    return '';
};


const parseGroupBy = (group) => {
    if (group) {
        const result = [];
        for (let i = 0, length = group.length; i < length; i++) {
            const node = group[i];
            switch (node.type) {

                case 'literal':
                    result.push(`${node.value}`);
                    break;
                case 'function':
                    result.push(parseFunction(node));
                    break;
                default:
                    break;

            }
        }
        return `GROUP BY ${result.join(', ')}`;
    }
    return '';
};

json2sql.toSQL = (data) => {
    if (!data) {
        throw new Error('JSON required');
    }
    if (!data.delete) {
        return `SELECT ${parseSelect(data.select)} FROM ${data.from}${data.where ? ` ${parseWhere(data.where)}` : ''}${data.group ? ` ${parseGroupBy(data.group)}` : ''}${data.orderBy ? ` ${parseOrderBy(data.orderBy)}` : ''}${data.limit ? ` LIMIT ${data.limit}` : ''}${data.offset ? ` OFFSET ${data.offset}` : ''}`.trim();
    } else {
        return `DELETE FROM ${data.from}${data.where ? ` ${parseWhere(data.where)}` : ''}${data.group ? ` ${parseGroupBy(data.group)}` : ''}${data.orderBy ? ` ${parseOrderBy(data.orderBy)}` : ''}${data.limit ? ` LIMIT ${data.limit}` : ''}${data.offset ? ` OFFSET ${data.offset}` : ''}`.trim();
    }
};

json2sql.parseNodeWhere = parseNodeWhere;
json2sql.parseFunction = parseFunction;
module.exports = json2sql;
