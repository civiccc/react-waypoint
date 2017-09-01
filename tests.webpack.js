const context = require.context('./test', true, /_test\.jsx?$/);
context.keys().forEach(context);
