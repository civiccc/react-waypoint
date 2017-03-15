export default function debugLog() {
  if (process.env.NODE_ENV !== 'production') {
    console.log(arguments); // eslint-disable-line no-console
  }
}
