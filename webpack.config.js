/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, 'src');
  return path.posix.join(src.replace(/\\/g, '/'), filePath);
};

const replaceCss = (content) => {
  const regexCss = /<link[/\s\w="\d]*href=['"]([.\d\w\\/-]*)['"][\s\w="'/]*>/;
  let match = null;
  let file = null;
  let value = content;

  do {
    match = value.match(regexCss);
    if (!match) break;
    file = match[1].split('/').pop().replace('.css', '');
    value = value.replace(regexCss, `<?!= Include.css(['${file}']); ?>`);
  } while (match);

  return value;
};

const replaceJs = (content) => {
  const regexJs = /<script[/\s\w="\d]*src=['"]([.\d\w\\/-]*)['"][\s\w="'/]*><\/script>/;
  let match = null;
  let file = null;
  let value = content;

  do {
    match = value.match(regexJs);
    if (!match) break;
    file = match[1].split('/').pop().replace('.js', '');
    value = value.replace(regexJs, `<?!= Include.js(['${file}']); ?>`);
  } while (match);

  return value;
};

const replaceProd = (content) => {
  let value = content;

  value = value.replace('.dev.js', '.prod.js');

  return value;
};

module.exports = {
  mode: 'none', // production, none
  context: __dirname,
  entry: getSrcPath('/index.js'),
  output: {
    filename: `code.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js$/i,
        extractComments: false,
        exclude: /\/js/,
        terserOptions: {
          ecma: 2020,
          compress: true,
          mangle: {
            reserved: ['global'],
            keep_fnames: true, // Easier debugging in the browser
          },
          format: {
            comments: /@customfunction/i,
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  watchOptions: {
    ignored: ['**/dist', '**/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            plugins: [['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }]],
          },
        },
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getSrcPath('**/*.html'),
          to: '[name][ext]',
          transform(content) {
            return replaceJs(replaceCss(replaceProd(content.toString())));
          },
        },
        {
          from: getSrcPath('../appsscript.json'),
          to: '[name][ext]',
        },
        {
          from: getSrcPath('**/*.gs'),
          to: '[name][ext]',
        },
        {
          from: getSrcPath('**/*.css'),
          to: '[name].css.html',
          transform(content) {
            return `<style>${content.toString()}</style>`;
          },
        },
        {
          from: getSrcPath('js/*.js'),
          to: '[name].js.html',
          filter: (filepath) => {
            return !filepath.includes('.dev.js');
          },
          transform(content) {
            return `<script>${content.toString()}</script>`;
          },
        },
      ],
    }),
    new GasPlugin({
      comments: false,
      source: 'digitalinspiration.com',
    }),
  ],
};
