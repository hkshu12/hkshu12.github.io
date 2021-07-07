---
title: setInterval在node和浏览器中的表现
tags: [Javascript]
mathjax: false
date: 2020-07-09 23:59:56
categories: Frontend
---
之前面试的时候被问到`setInterval(fn, 0)`的在浏览器上实际表现的间隔会是多少，当时凭印象和直觉回答应该是4、5毫秒。后来也一直没有亲自尝试过，今天记录一下`node`和浏览器端分别的测试结果。

<!-- more -->

## 环境

`node v12.16.1` `Microsoft Edge 83.0.478.61`（没有准备很多不同的浏览器环境）

## 测试代码

```javascript
function printTimestamp() {
  console.log(new Date().getTime());
}

setInterval(printTimestamp, 0);
```

## `node`测试结果

{% asset_img node测试结果.png node测试结果 %}

可以看到，`node`每次输出的时间间隔约为15毫秒。

## `Microsoft Edge`测试结果

{% asset_img 浏览器测试结果.png 浏览器测试结果 %}

可以看到，浏览器控制台每次输出的时间间隔约为4毫秒。

## More...

如果忽略实例化对象以及相关操作的时间代价，那么上面的测试结果即为最终结果。

如果需要考虑相关操作的时间代价，我在浏览器和`node`分别输出了5次当前时间。

```javascript
console.log(new Date().getTime());
console.log(new Date().getTime());
console.log(new Date().getTime());
console.log(new Date().getTime());
console.log(new Date().getTime());
```

结果分别如下：

{% asset_img node时间代价.png node时间代价 %}

{% asset_img 浏览器时间代价.png 浏览器时间代价 %}

## 一点发现

在查阅资料时，发现很多人提到了4ms这个时间，认为`setTimeout(fn,0)`或`setTimeout(fn,0)`的`delay`会被设置为4ms，这和上面的实验结果明显是不符合的，浏览器端的测试中出现过相邻两次输出的时间戳差为2、3。

我在所有的官方文档中也没有看到类似的说法，只有`nodejs`文档中有提到关于`delay`取值的问题：

> When delay is larger than 2147483647 or less than 1, the delay will be set to 1. Non-integer delays are truncated to an integer.

提到4ms这个值的，是在MDN关于`setInterval`的`Delay restrictions`中（参见相关资料《MDN对于setInterval的描述》），

> Attempts to specify a value less than 4 ms in deeply-nested calls to `setInterval()` will be pinned to 4 ms.

出于性能考虑，深层嵌套的调用中小于4ms的`delay`会被固定为4ms。

还有一些导致实际延时比设置值长的原因，参见相关资料中的《MDN: Reasons for delays longer than specified》。

除了以上原因之外，还有其它原因。事实上，由于`Javascript`是单线程并通过`EventLoop`来实现异步操作，它的定时器并不准确，不能保证函数准时执行。

```javascript
let start = new Date().getTime();
console.log("1");

setTimeout(() => console.log("half"), 1000);

while (new Date().getTime() - start < 3000) {}

console.log(2);
```

了解`Javascript`的人都能轻松说出上述代码的输出顺序是`1` `2` `half`而非`1` `half` `2`，定时1秒后的任务实际在3秒后才得以执行，就是因为`Javascript`的事件循环机制，具体不再详述。

## 相关资料

1. [nodejs文档中对setInterval的描述](https://nodejs.org/docs/latest-v12.x/api/timers.html#timers_setinterval_callback_delay_args)
2. [MDN对于setInterval的描述](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
3. [MDN: Reasons for delays longer than specified](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified)