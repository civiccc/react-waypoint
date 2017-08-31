const context = require.context('./test', true, /_test\.js$/);
context.keys().forEach(context);
