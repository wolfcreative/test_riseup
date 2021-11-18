import pkg from 'gulp'

const { gulp, src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
const  sass          = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import inject        from 'gulp-inject'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import del           from 'del'

function browsersync() {
	browserSync.init({
		server: { baseDir: 'app/' },
		ghostMode: false,
		notify: false
	})
}

function scripts() {
	return src(['app/js/*.js', '!app/js/*.min.js'])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									[
										"@babel/preset-env", 
										{
											"useBuiltIns": "usage",
											"corejs": 3,
										},
									]
								]
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat('app.min.js'))
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	let modules = [
		'node_modules/normalize.css/normalize.css',
		'app/styles/*.*',
		'!app/styles/*.min.css'
	];

	return src(modules)
		.pipe(sass().on('error', sass.logError))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('app.min.css'))
		.pipe(dest('app/styles'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['app/images/src/**/*'])
		.pipe(changed('app/images/dist'))
		.pipe(imagemin())
		.pipe(dest('app/images/dist'))
		.pipe(browserSync.stream())
}

function insertJsCss() {
	return src('app/*.html')
		.pipe(inject(src('app/**/*.min.{css,js}', {read: false}), {relative: true}))
		.pipe(dest('app'));
}

function buildCopy() {
	return src([
		'{app/js,app/styles}/*.min.*',
		'app/images/**/*.*',
		'!app/images/src/**/*',
		'app/fonts/**/*',
		'app/*.html'
	], { base: 'app/' })
	.pipe(dest('dist'))
}

async function cleanDist() {
	del('dist/**/*', { force: true })
}

function startWatch() {
	watch(['app/styles/*', '!app/styles/*.min.css'], { usePolling: true }, styles)

	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)

	watch('app/images/src/**/*', { usePolling: true }, images)

	watch(`app/**/*.{html, woff, js}`, { usePolling: true }).on('change', browserSync.reload)
}

export let build = series(cleanDist, images, scripts, styles, insertJsCss, buildCopy)
export default series(scripts, styles, images, insertJsCss, parallel(browsersync, startWatch))