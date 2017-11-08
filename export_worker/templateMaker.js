/* returns the string of the package.json file */

const package = () => {
  return '{\n'
    + '  "name": "your-kit-n-client",\n'
    + '  "version": "0.1.0",\n'
    + '  "scripts": {},\n'
    + '  "author": "YOU with a little help from redux-kit-n",\n'
    + '  "license": "MIT",\n'
    + '  "dependencies" : {\n'
    + '    "babel-core": "^6.24.1",\n'
    + '    "babel-loader": "^7.0.0",\n'
    + '    "babel-plugin-transform-es2015-modules-commonjs": "^6.24.0",\n'
    + '    "babel-preset-latest": "^6.24.0",\n'
    + '    "babel-preset-react": "^6.23.0",\n'
    + '    "css-loader": "^0.28.7",\n'
    + '    "lodash": "^4.17.4",\n'
    + '    "prop-types": "^15.5.10",\n'
    + '    "react": "^15.4.2",\n'
    + '    "react-dom": "^15.4.2",\n'
    + '    "react-redux": "^5.0.6",\n'
    + '    "redux": "^3.7.2",\n'
    + '    "style-loader": "^0.18.2",\n'
    + '    "webpack": "^2.3.2"\n'
    + '  },\n'
    + '  "devDependencies": {},\n'
    + '  "babel": {\n'
    + '    "plugins": [\n'
    + '      "transform-es2015-modules-commonjs"\n'
    + '    ]\n'
    + '  }\n'
    + '}';
};

/* maker for webpack babel config file */

const webpackConfig = () => {
  return `import webpack from 'webpack';\n`
    + `import path from 'path';\n`
    + `\n`
    + `const config = {\n`
    + `  devtool: 'source-map',\n`
    + `  entry: './client/src/App.jsx',\n`
    + `  output: {\n`
    + `    path: path.join(__dirname, 'public/dist'),\n`
    + `    filename: 'bundle.js'\n`
    + `  },\n`
    + `  module: {\n`
    + `    rules: [\n`
    + `      { test: /\.(js|jsx)$/,\n`
    + `        include: path.join(__dirname, 'client/src'),\n`
    + `        exclude: ['node_modules'],\n`
    + `        use: [\n`
    + `          { loader: 'babel-loader',\n`
    + `            options: {\n`
    + `              presets: ['react', 'latest']\n`
    + `            }\n`
    + `          }\n`
    + `        ]\n`
    + `      },\n`
    + `      {\n`
    + `        test: /\.css$/,\n`
    + `        include: path.join(__dirname, 'client/src/styles'),\n`
    + `        exclude: ['node_modules'],\n`
    + `        use: [ 'style-loader', 'css-loader']\n`
    + `      }\n`
    + `    ]\n`
    + `  }\n`
    + `};\n`
    + `\n`
    + `export default config;`;
};

const styleCss = () => {
  return '/* put your style modules in this folder */';
};

const indexHtml = () => {
  return '<!DOCTYPE html>\n'
    + '<html>\n'
    + '<head>\n'
    + '  <title>Redux-Kit-N</title>\n'
    + '  <meta charset="utf-8">\n'
    + '  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n'
    + '</head>\n'
    + '<body>\n'
    + '  <div id="root">\n'
    + '  </div>\n'
    + '  <script type="text/javascript" src="dist/bundle.js"></script>\n'
    + '</body>\n'
    + '</html>';
};

module.exports = {
  package,
  webpackConfig,
  styleCss,
  indexHtml,
};
