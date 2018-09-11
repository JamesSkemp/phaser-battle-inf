const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser/')
const phaser = path.join(phaserModule, 'src/phaser.js')

module.exports = {
	entry: {
		app: './src/ts/Game.ts'
	},
	module: {
		rules: [
		{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/
		}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: "source-map",
	plugins: [
		new CopyWebpackPlugin([{
			from: './node_modules/phaser/dist/phaser.min.js',
			to: 'lib'
		}]),
		new CopyWebpackPlugin([{
			from: './src/*.html',
			to: path.resolve(__dirname, 'dist'),
			flatten: true
		}]),
		new CopyWebpackPlugin([{
			from: './src/*.css',
			to: path.resolve(__dirname, 'dist'),
			flatten: true
		}]),
		new CopyWebpackPlugin([{
			from: './src/*.ico',
			to: path.resolve(__dirname, 'dist'),
			flatten: true
		}]),
		new CopyWebpackPlugin([{
			from: './src/assets',
			to: 'assets',
			ignore: [ '*.md' ]
		}])
	  ]
};
