# SQL2JSON

[![Build Status](https://travis-ci.org/resource-watch/sql2json.svg?branch=master)](https://travis-ci.org/resource-watch/sql2json)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1999d7d2910273c0c7f4/test_coverage)](https://codeclimate.com/github/resource-watch/sql2json/test_coverage)

Library that serves two main purposes:
- Converts SQL queries to JSON representation of the query.
- Converts JSON representation of the query to SQL (as supported by [ElasticSearch's SQL plugin](https://github.com/NLPchina/elasticsearch-sql)

Example:

With this SQL
`SELECT * FROM tablename WHERE a > 2 and b < 3 or c = 2`

Return this object:

```json
{  
   "select":[  
      {  
         "value":"*",
         "alias":null,
         "type":"wildcard"
      }
   ],
   "from":"tablename",
   "where":{  
      "type":"conditional",
      "value":"or",
      "left":{  
         "type":"conditional",
         "value":"and",
         "left":{  
            "type":"operator",
            "value":">",
            "left":{  
               "value":"a",
               "type":"literal"
            },
            "right":{  
               "value":2,
               "type":"number"
            }
         },
         "right":{  
            "type":"operator",
            "value":"<",
            "left":{  
               "value":"b",
               "type":"literal"
            },
            "right":{  
               "value":3,
               "type":"number"
            }
         }
      },
      "right":{  
         "type":"operator",
         "value":"=",
         "left":{  
            "value":"c",
            "type":"literal"
         },
         "right":{  
            "value":2,
            "type":"number"
         }
      }
   }
}
```

## SQL support

#### Supported
- `select` queries
- `delete` queries
- field alias
- `*` in select clause
- functions with and without arguments
- basic math operators
- constants

#### Unsupported
- Anything other than `select` and `delete` queries
- Subqueries
- Joins
- conditionals
- pretty much everything that's not covered in the tests


## Installation

```
npm install --save sql2json
```

## Use

To convert sql to json:

```javascript
const Sql2json = require('sql2json').sql2json;
new Sql2json(<sql>).toJSON()
```

The library has a function that it convert json object to sql

To convert json to sql:

```javascript
const Json2sql = require('sql2json').json2sql;
Json2sql.toSQL(<object>)
```
