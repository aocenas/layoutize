# Create simple layouts fast

Example:

```bash
layoutize -i "o3,2,2|3,4"
```
Will create this output:
```
.row
  .span2.offset3
  .span2
.row
  .span3
  .span4
```

Or if you like plain html more:
```
layoutize -F html -i "o3,2,2|3,4"

<div class="row">
  <div class="span2 offset3"></div>
  <div class="span2"></div>
</div>
  <div class="row">
  <div class="span3"></div>
  <div class="span4"></div>
```

Or in javascript:
```javascript
var layoutize = require('layoutize');
var layout = layoutize('o3,2,2|3,4').jade();
layout.html();
layout.jade();
```
