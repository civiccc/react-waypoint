import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const depsSet = new Set([
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
]);

/**
 * @param {'es' | 'cjs'} format
 */
function makeBuild(format) {
  return {
    input: 'src/waypoint.jsx',

    external: (id) => {
      if (id.startsWith('.') || id.startsWith('/')) {
        return false;
      }

      const packageName = id.startsWith('@')
        ? id.split('/').slice(0, 2).join('/')
        : id.split('/')[0];

      return depsSet.has(packageName);
    },

    output: [{ file: format === 'es' ? pkg.module : pkg.main, format }],

    plugins: [
      babel({
        babelHelpers: 'runtime',
        envName: format,
        exclude: ['node_modules/**'],
      }),
    ],
  };
}

export default [makeBuild('es'), makeBuild('cjs')];
