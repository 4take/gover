const Promise = require('es6-promise').Promise;
const DEBUG = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
const webpack = require('webpack');
const path = require('path');

/**
 * Require webpack plugins
 */
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Environment settings
 */
const devtool = DEBUG ? '#inline-source-map' : '#eval';
const fileName = DEBUG ? '[name]' : '[name]-[hash]';
const publicPath = DEBUG ? 'http://localhost:4500/assets/' : '/assets/';

/**
 *  Entries
 */
const entries = {
	application: ['./app/frontend/javascripts/application.ts']
}

/**
 * Add plugins
 */
const plugins = [
	new ExtractTextPlugin(fileName + '.css')
]

if (DEBUG) {
	plugins.push(new webpack.NoErrorsPlugin());
} else {
	plugins.push(new ManifestPlugin({fileName: 'webpack-manifest.json'}));
	plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
	plugins.push(new CleanWebpackPlugin(['assets'], {
		root: __dirname + '/public',
		verbose: true,
		dry: false
	}));
}

module.exports = {
	entry: entries,
	output: {
		path: __dirname + '/public/assets',
		filename: fileName + '.js',
		publicPath: publicPath
	},
	devtool: devtool,
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts',
				exclude: [/node_modules/]
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize')
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?minimize')
			},
			{
				test: /\.sass$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?minimize')
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?mimetype=image/svg+xml'
			},
			{
				test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?mimetype=application/font-woff'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?mimetype=application/font-woff'
			},
			{
				test: /\.(jpg|png|gif)$/,
				loader: DEBUG ? 'file-loader?name=[name].[ext]' : 'file-loader?name=[name]-[hash].[ext]'
			}
		]
	},
	resolve: {
		root: path.resolve(__dirname, 'app', 'frontend'),
		extensions: ['', '.js', '.ts', '.css', '.scss', '.sass'],
	},
	devServer: {
		headers: {
			"Access-Control-Allow-Origin": "http://localhost:4001",
			"Access-Control-Allow-Credentials": "true"
		}
	}
}
