export default function debugLog(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args); // eslint-disable-line no-console
  }
}
