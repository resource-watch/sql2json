# 2.0.6
- Fix issue with json2sql conversion of DOT tokens on SELECT clauses

# 2.0.5
- Fix issue with arguments with column and table name

# 2.0.4
- Fix BC break on exposed parsing functions

# 2.0.3
- Add support for `NOT LIKE` clauses
- Add support for `DOT` tokens
- Update `sql-parser` - now `rw-sql-parser`
- Add tests for `WHERE x LIKE y` clauses containing string wildcards

# 2.0.2
- Table names not surrounded by quotes now support slashes in them

# 2.0.1
- JSON2SQL - Revert changes to query output format, matching it to ES SQL instead of PostrgreSQL spec

# 2.0.0
- SQL2JSON - functions with no arguments are now parsed as functions, not literals
- SQL2JSON - `string` types are now stored without quotes/double quotes
- SQL2JSON - Unsupported query types now throw an exception when parsing
- SQL2JSON - Escaping errors in queries are now detected are result in an exception
- JSON2SQL - `literal` types are now wrapped in double quotes  when query is generated
- JSON2SQL - `string` types are now wrapped in single quotes when query is generated  
- Added support for named arguments in `GROUP BY` function calls
- Wrap literals in double quotes on `GROUP BY` clauses
