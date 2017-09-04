We love pull requests. Here's a quick guide:

1. Fork the repo.
2. Run the tests. We only take pull requests with passing tests, and it's great
   to know that you have a clean slate: `npm install && npm test`.
3. Add a test for your change. Only refactoring and documentation changes
   require no new tests. If you are adding functionality or fixing a bug, we
   need a test!
4. Make the test pass.
5. Push to your fork and submit a pull request.

## Testing performance

To test scroll performance when having multiple waypoints on a page, run `npm run
performance-test:watch`, then open `test/performance-test.html`. Scroll around
and use your regular performance profiling tools to see the effects of your
changes.

## Publishing a new version

1. Add list of changes to CHANGELOG.md. Do not commit them yet.
2. Run `npm version major`, `npm version minor`, or `npm
   version patch`.

This will handle the rest of the process for you, including running tests,
cleaning out the previous build, building the package, bumping the version,
committing the changes you've made to CHANGELOG.md, tagging the version, pushing
the changes to GitHub, pushing the tags to GitHub, and publishing the new
version on npm.

## Code of conduct

This project adheres to the [Open Code of Conduct][code-of-conduct]. By
participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/brigade/code-of-conduct
