let fileswatch   = 'html,woff,scss,js'

import pkg from 'gulp'

// Определяем константы Gulp
const { gulp, src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import babel         from 'gulp-babel'
import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
const  sass          = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import uglifier      from 'gulp-uglify'
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
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('app.min.js'))
		.pipe(uglifier())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`app/styles/*.*`, `!app/styles/_*.*`])
		.pipe(sass().on('error', sass.logError))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('app.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['app/images/src/**/*'])
		.pipe(changed('app/images/dist'))
		.pipe(imagemin())
		.pipe(dest('app/images/dist'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		'{app/js,app/css}/*.min.*',
		'app/images/**/*.*',
		'!app/images/src/**/*',
		'app/fonts/**/*',
		'app/*.html'
	], { base: 'app/' })
	.pipe(dest('dist'))
}

async function cleandist() {
	del('dist/**/*', { force: true })
}

function startwatch() {
	watch(`app/styles/*`, { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('app/images/src/**/*', { usePolling: true }, images)

	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

export { scripts, styles, images }
export let assets = series(scripts, styles, images)
export let build = series(cleandist, images, scripts, styles, buildcopy)
export default series(scripts, styles, images, parallel(browsersync, startwatch))