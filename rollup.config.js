import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/waypoint.jsx',
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        plugins: [getBabelOutputPlugin({
          presets: [['airbnb', {
            modules: false,
            runtimeVersion: '7.12.5',
            runtimeHelpersUseESModules: false,
          }]],
        })],
      },
      {
        file: pkg.module,
        format: 'es',
        plugins: [getBabelOutputPlugin({
          presets: [['airbnb', {
            modules: false,
            runtimeVersion: '7.12.5',
            runtimeHelpersUseESModules: true,
          }]],
        })],
      },
    ],
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
