# 2.0

- SQL2JSON - functions with no arguments are now parsed as functions, not literals
- SQL2JSON - `string` types are now stored without quotes/double quotes
- SQL2JSON - Unsupported query types now throw an exception when parsing
- SQL2JSON - Escaping errors in queries are now detected are result in an exception
- JSON2SQL - `literal` types are now wrapped in double quotes  when query is generated
- JSON2SQL - `string` types are now wrapped in single quotes when query is generated  
- Added support for named arguments in `GROUP BY` function calls
