# Expression expression design

# Supported usages

`'{{ value }}'` '100'

`'{{ value.toUppercase() }}'` 'ABC'

`'Hello, {{ value }}!'` 'Hello, world'

`'{{ $listItem.name }} is {{ $listItem.age }} years old'` 'Tom is 10 years old'

`'{{ $listItem.name }} is in {{ root.listTitle }} list'` 'Tom is in UserList list'

# nested expressions

Expressions support nesting, which is useful in the context of lists and modules. E.g:

`'{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!'`

The parser will `eval` and concatenate strings from the inside out.

# some wrong usages

`{{ [1,2,3] }}string` (result will be `'[Object Object]'`).

# special keywords

`$i` `$listItem` and `$moduleId` are keywords, used in lists and modules.

# error handling

When the expression cannot be parsed or an error is reported during the parsing process, the expression itself will be returned directly.