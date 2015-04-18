const context = require.context('./spec', true, /_spec\.js$/);
context.keys().forEach(context);
