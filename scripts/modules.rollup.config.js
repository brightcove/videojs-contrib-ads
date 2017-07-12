/**
 * Rollup configuration for packaging the plugin in a module that is consumable
 * by either CommonJS (e.g. Node or Browserify) or ECMAScript (e.g. Rollup).
 *
 * These modules DO NOT include their dependencies as we expect those to be
 * handled by the module system.
 */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  moduleName: 'videojsContribAds',
  entry: 'src/plugin.js',
  external: [
    'global/document',
    'global/window',
    'video.js'
  ],
  globals: {
    'video.js': 'videojs'
  },
  legacy: true,
  plugins: [
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        'es3',
        ['es2015', {
          loose: true,
          modules: false
        }]
      ],
      plugins: [
        'external-helpers',
        'transform-object-assign'
      ]
    })
  ],
  targets: [
    {dest: 'dist/videojs-contrib-ads.cjs.js', format: 'cjs'},
    {dest: 'dist/videojs-contrib-ads.es.js', format: 'es'}
  ]
};
