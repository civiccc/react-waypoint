const context = require.context('./test/browser', true, /_test\.jsx?$/);
context.keys().forEach(context);
