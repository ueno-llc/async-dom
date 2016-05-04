/**
 * Asyncronous method that adds callbacks to microtask queue.
 * - uses textNode's textContent to detect repaints.
 */
class Async {

  constructor() {
    this._twiddle = document.createTextNode('');
    this._currVal = 0;
    this._lastVal = 0;
    this._callbacks = [];
    this._twiddleContent = 0;

    new window.MutationObserver(() => {
      this._atEndOfMicrotask();
    })
    .observe(this._twiddle, {
      characterData: true,
    });
  }

  run(cb, waitTime) {
    if (waitTime > 0) {
      return ~setTimeout(cb, waitTime);
    }
    this._twiddle.textContent = this._twiddleContent++;
    this._callbacks.push(cb);
    return this._currVal++;
  }

  cancel(handle) {
    if (handle < 0) {
      clearTimeout(~handle);
    } else {
      const idx = handle - this._lastVal;
      if (idx >= 0) {
        if (!this._callbacks[idx]) {
          throw new Error(`invalid async handle: ${handle}`);
        }
        this._callbacks[idx] = null;
      }
    }
  }

  _atEndOfMicrotask() {
    const len = this._callbacks.length;
    for (let i = 0; i < len; i++) {
      const cb = this._callbacks[i];
      if (cb) {
        try {
          cb();
        } catch (e) {
          i++;
          this._callbacks.splice(0, i);
          this._lastVal += i;
          this._twiddle.textContent = this._twiddleContent++;
          throw e;
        }
      }
    }
    this._callbacks.splice(0, len);
    this._lastVal += len;
  }
}


const async = new Async();
const run = async.run.bind(async);
export default run;
export const cancel = async.cancel.bind(async);
module.exports = run;
