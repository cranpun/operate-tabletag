# operate-tabletag
Operate:sort, filter table maked html tag. Tthe td in table can include html tag(button, img...). The table css and style do not make changes.

Use with typescript.

# Installation

```javascript
npm install operate-tabletag
```

# Basic use

```html
<table id="selector-of-table">
    <thead>...</thead>
    <tbody>...</tbody>
</table>
```


```javascript
import { OperateTabletag } from "operate-tabletag";

window.addEventListener("load", () => {
    new OperateTabletag("#selector-of-table");
});
```
**REQUIRED : thead, tbody**


# Sort

First, set attribute ```operatetabletagcompare``` to each th. The value is ```number``` or ```text```.
Next, if you sort by a different value than td, set attribute ```operatetabletagval``` (**e.g. td has button tag, comma number**).

```html
<table id="selector-of-table">
    <thead>
        <tr>
            <th operatetabletagcompare="number">ID</th>
            <th operatetabletagcompare="text">Name</th>
            <th operatetabletagcompare="number">Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Michael</td>
            <td operatetabletagval="1000">1,000</td>
        </tr>
        <tr>
            <td>1</td>
            <td>Michel</td>
            <td operatetabletagval="10000">10,000</td>
        </tr>
        ...
    </tbody>
</table>
```

Operate-tabletag sort by clicking th tag. And add following class to th tag.

 * asc -> .operate-tabletag-th.asc
 * desc -> .operate-tabletag-th.desc
 * no sort -> .operate-tabletag-th

**Notice : For sorting, operaete-tabletag add eventlistener "click" to th.**

# Filter

First, make input tag for filter.

```html
<input type="text" id="selector-of-filter">
```

Then pass the selector of input for filter to the constructor.

```typescript
import { OperateTabletag } from "operate-tabletag";

window.addEventListener("load", () => {
    new OperateTabletag("#selector-of-table", "#selector-of-filter");
});
```

# Count

First, make place for showing count.

```html
<span id="selector-of-count"></span>
```

Then pass the selector of input for filter to the constructor. 

```typescript
import { OperateTabletag } from "operate-tabletag";

window.addEventListener("load", () => {
    new OperateTabletag("#selector-of-table", null, "#selector-of-count");
});
```

# API Reference

## constructor

```typescript
new OperateTabletag(selectoroftable: string, selectoroffilter: string|null, selectorofcount: string|null)
```

**if you do not need filter, count, set null.**

# Sample

```html
<input type="text" id="selector-of-filter">
<span id="selector-of-count"></span>
<table id="selector-of-table">
    <thead>
        <tr>
            <th operatetabletagcompare="number">ID</th>
            <th operatetabletagcompare="text">Name</th>
            <th operatetabletagcompare="number">Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Michael</td>
            <td operatetabletagval="1000">1,000</td>
        </tr>
        <tr>
            <td>1</td>
            <td>Michel</td>
            <td operatetabletagval="10000">10,000</td>
        </tr>
        ...
    </tbody>
</table>
```

```typescript
import { OperateTabletag } from "operate-tabletag";

window.addEventListener("load", () => {
    new OperateTabletag("#selector-of-table", "#selector-of-filter", "#selector-of-count");
});
```