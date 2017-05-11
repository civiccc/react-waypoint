let timeout;
const timeoutQueue = [];

export default function onNextTick(cb) {
  timeoutQueue.push(cb);

  if (!timeout) {
    timeout = setTimeout(() => {
      timeout = null;

      // Drain the timeoutQueue
      let item;
      // eslint-disable-next-line no-cond-assign
      while (item = timeoutQueue.shift()) {
        item();
      }
    }, 0);
  }

  let isSubscribed = true;

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    isSubscribed = false;

    const index = timeoutQueue.indexOf(cb);
    if (index === -1) {
      return;
    }

    timeoutQueue.splice(index, 1);

    if (!timeoutQueue.length && timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
}
