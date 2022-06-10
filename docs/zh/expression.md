# Expression 表达式设计

# 支持的写法

`'{{ value }}'` '100'

`'{{ value.toUppercase() }}'` 'ABC'

`'Hello, {{ value }}!'` 'Hello, world'

`'{{ $listItem.name }} is {{ $listItem.age }} years old'` 'Tom is 10 years old'

`'{{ $listItem.name }} is in {{ root.listTitle }} list'` 'Tom is in UserList list'

# 嵌套的表达式

表达式支持嵌套，这在列表和模块的场景下比较有用。例如：

`'{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!'`

解析器将会按照从里到外的顺序逐级`eval` 和拼接字符串。

# 一些错误的用法

`{{ [1,2,3] }}string`（结果会是`'[Object Object]'` ）。

# 特殊关键字

`$i` `$listItem` 和 `$moduleId`是关键字，用在列表和模块中。

# 错误处理

当表达式无法解析表达式或者解析过程中报错时，会直接返回表达式本身。
