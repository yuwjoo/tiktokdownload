const eventLoop = []; // 监听事件集合

plus.globalEvent.addEventListener("plusMessage", (msg) => {
  const { name, arg } = msg.data.args.data;
  if (name !== "postMessage") return;
  if (eventLoop[arg.type]) eventLoop[arg.type].forEach((cb) => cb(arg));
});

/**
 * @description: 监听事件
 * @param {String} eventName 事件名
 * @param {Function} callback 回调函数
 */
export function on(eventName, callback) {
  eventLoop[eventName] = (eventLoop[eventName] || []).concat([callback]);
}

/**
 * @description: 监听事件（仅触发一次）
 * @param {String} eventName 事件名
 * @param {Function} callback 回调函数
 */
export function once(eventName, callback) {
  function onceCallback() {
    callback.apply(null, arguments);
    off(eventName, callback);
  }
  onceCallback.callback = callback;
  eventLoop[eventName] = (eventLoop[eventName] || []).concat([onceCallback]);
}

/**
 * @description: 移除事件
 * @param {String} eventName 事件名
 * @param {Function} callback 回调函数
 */
export function off(eventName, callback) {
  if (!eventLoop[eventName]) return;
  const pos = eventLoop[eventName].findIndex(
    (cb) => (cb.callback || cb) === callback
  );
  if (pos !== -1) eventLoop[eventName].splice(pos, 1);
}
