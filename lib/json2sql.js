function json2sql() {
}


const parseFunction = (nodeFun) => {
    const args = [];
    if (nodeFun.arguments) {
        for (let i = 0, length = nodeFun.arguments.length; i < length; i++) {
            const node = nodeFun.arguments[i];
            switch (node.type) {

                case 'literal':
                    if (node.name) {
                        args.push(`${node.name ? ` '${node.name}'=` : ''}"${node.value}"`);
                    } else {
                        args.push(`${node.name ? ` '${node.name}'=` : ''}${node.value}`);
                    }
                    break;
                case 'string':
                    args.push(`${node.name ? ` '${node.name}'=` : ''}'${node.value}'`);
                    break;
                case 'wildcard':
                    args.push(`*`);
                    break;
                case 'number':
                    args.push(`${node.name ? ` '${node.name}'=` : ''}${node.value}`);
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
    }
    return `${nodeFun.value}(${args.join(',')})${nodeFun.alias ? ` AS ${nodeFun.alias}` : ''}`;
};

const parseMath = (nodeFun) => {
    const args = [];
    for (let i = 0, length = nodeFun.arguments.length; i < length; i++) {
        const node = nodeFun.arguments[i];
        switch (node.type) {

            case 'literal':
                args.push(`${node.value}`);
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
                    if (select[i - 1] && select[i - 1].type === 'dot') {
                        const functionObject = responses.pop();
                        responses.push(`${functionObject}${parseFunction(node)}`);
                    } else {
                        responses.push(parseFunction(node));
                    }
                    break;
                case 'number':
                    responses.push(`${node.value}${node.alias ? ` AS ${node.alias}` : ''}`);
                    break;
                case 'math':
                    responses.push(parseMath(node));
                    break;
                case 'dot':
                    const literalValue = responses.pop();
                    responses.push(`${literalValue}.`);
                    break;
                case 'distinct':
                    responses.push(`DISTINCT ${parseSelect(node.arguments)}`);
                    break;
                case 'boolean':
                    responses.push(`${node.value}${node.alias ? ` AS ${node.alias}` : ''}`);
                    break;
                default:
                    break;

            }
        }
    }
    return responses.join(', ');
};

const parseWhere = (where) => {
    const responses = [];
    if (where) {
        if (!Array.isArray(where)) {
            where = [where];
        }
        for (let i = 0, length = where.length; i < length; i++) {
            let args = [];
            const node = where[i];
            switch (node.type) {
                case 'literal':
                case 'number':
                    responses.push(node.value);
                    break;
                case 'string':
                    responses.push(`'${node.value}'`);
                    break;
                case 'operator':
                    responses.push(`${parseWhere(node.left)} ${node.value} ${parseWhere(node.right)}`);
                    break;
                case 'conditional':
                    responses.push(`${parseWhere(node.left)} ${node.value} ${parseWhere(node.right)}`);
                    break;
                case 'bracket':
                    responses.push(`(${parseWhere(node.value)})`);
                    break;
                case 'in':
                    args = [];
                    if (node.arguments) {
                        for (let i = 0, length = node.arguments.length; i < length; i++) {
                            args.push(parseWhere(node.arguments[i]));
                        }
                    }
                    responses.push(`${node.value} IN (${args.join(', ')})`);
                    break;
                case 'between':
                    args = [];
                    if (node.arguments) {
                        for (let i = 0, length = node.arguments.length; i < length; i++) {
                            args.push(parseWhere(node.arguments[i]));
                        }
                    }
                    responses.push(`${node.value} BETWEEN ${parseWhere(node.arguments[0])} AND ${parseWhere(node.arguments[1])}`);
                    break;
                case 'function':
                    args = [];
                    if (node.arguments) {
                        for (let i = 0, length = node.arguments.length; i < length; i++) {
                            args.push(parseWhere(node.arguments[i]));
                        }
                    }
                    responses.push(`${node.value}(${args.join(', ')})`);
                    break;
                case 'dot':
                    responses.push('.');
                    break;
                default:
                    responses.push(node.value);
                    break;
            }
        }
    }
    return responses.join('');
};

const parseOrderBy = (orderBy) => {
    if (!orderBy) {
        return '';
    }

    const responses = [];
    for (let i = 0, length = orderBy.length; i < length; i++) {
        const node = orderBy[i];
        switch (node.type) {
            case 'dot':
                const literalValue = responses.pop();
                responses.push(`${literalValue}.`);
                break;
            case 'function':
                const ascDesc = `${node.direction ? ` ${node.direction}` : ''}`;
                if (orderBy[i - 1] && orderBy[i - 1].type === 'dot') {
                    const functionObject = responses.pop();
                    responses.push(`${functionObject}${parseFunction(node)}${ascDesc}`);
                } else {
                    responses.push(`${parseFunction(node)}${ascDesc}`);
                }
                break;
            case 'literal':
                const directionString = `${node.direction ? ` ${node.direction}` : ''}`;
                if (orderBy[i - 1] && orderBy[i - 1].type === 'dot') {
                    responses.push(`${responses.pop()}${node.value}${directionString}`);
                } else {
                    responses.push(`${node.value}${directionString}`);
                }
                break;
            default:
                responses.push(`${node.value}${node.direction ? ` ${node.direction}` : ''}`);
        }
    }
    return `ORDER BY ${responses.join(', ')}`;
};

const parseGroupBy = (groupBy) => {
    if (!groupBy) {
        return '';
    }

    const result = [];
    for (let i = 0, length = groupBy.length; i < length; i++) {
        const node = groupBy[i];
        switch (node.type) {

            case 'literal':
                if (groupBy[i - 1] && groupBy[i - 1].type === 'dot') {
                    result.push(`${result.pop()}${node.value}`);
                } else {
                    result.push(`${node.value}`);
                }
                break;
            case 'number':
                result.push(`${node.value}`);
                break;
            case 'dot':
                const literalValue = result.pop();
                result.push(`${literalValue}.`);
                break;
            case 'function':
                if (groupBy[i - 1] && groupBy[i - 1].type === 'dot') {
                    const functionObject = result.pop();
                    result.push(`${functionObject}${parseFunction(node)}`);
                } else {
                    result.push(parseFunction(node));
                }
                break;
            default:
                break;
        }
    }
    return `GROUP BY ${result.join(', ')}`;
};

json2sql.toSQL = (data) => {
    if (!data) {
        throw new Error('JSON required');
    }
    if (!data.delete) {
        return `SELECT ${parseSelect(data.select)} FROM ${data.from}${data.where ? ` WHERE ${parseWhere(data.where)}` : ''}${data.group ? ` ${parseGroupBy(data.group)}` : ''}${data.orderBy ? ` ${parseOrderBy(data.orderBy)}` : ''}${data.limit ? ` LIMIT ${data.limit}` : ''}${data.offset ? ` OFFSET ${data.offset}` : ''}`.trim();
    } else {
        return `DELETE FROM ${data.from}${data.where ? ` WHERE ${parseWhere(data.where)}` : ''}${data.group ? ` ${parseGroupBy(data.group)}` : ''}${data.orderBy ? ` ${parseOrderBy(data.orderBy)}` : ''}${data.limit ? ` LIMIT ${data.limit}` : ''}${data.offset ? ` OFFSET ${data.offset}` : ''}`.trim();
    }
};

json2sql.parseWhere = parseWhere;
json2sql.parseFunction = parseFunction;
module.exports = json2sql;
