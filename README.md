# async-dom
Asynchronously call a method after the DOM has changed.
It is useful when animating with css classes.

## Installation
```bash
npm install async-dom
```

## Usage
```javascript
import async, { cancel } from 'async-dom';

const element = document.querySelector('.my-node');

element.classList.add('will-show');
async(() => {
  element.classList.remove('will-show');
  element.classList.add('did-show');
});
```
