import pkg from 'gulp'

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
import inject        from 'gulp-inject'
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
	return src(['app/styles/*.*', '!app/styles/_*.*', '!app/styles/*.min.css'])
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