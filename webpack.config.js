const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./js/index.js', './css/main.css'],

  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
 
 module: {
   rules: [
     {
        test: /\.(m)?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader'
        ]
      },
     {
        test: /\.(s)?css$/,
        use: [
          { loader: 'file-loader', options: { name: 'bundle.css', outputPath: 'css/' } },
          'extract-loader',
          'css-loader',   // translates CSS into CommonJS modules 
          'postcss-loader', // Run post css actions
          'sass-loader'     // compiles Sass to CSS
        ]
      }, 
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/', publicPath: '../' } },
        ]
      },
	  {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
             options: { name: '[name].[ext]', outputPath: 'img/', publicPath: '../' }
          }
        ]
      }
	   
    ]
  },
	plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
			"window.jQuery": "jquery"
        }),
		new UglifyJsPlugin(),
    ]
}