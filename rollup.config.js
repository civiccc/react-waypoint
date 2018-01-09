import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/waypoint.jsx',
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
];
