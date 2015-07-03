var gulp = require('gulp');
var html2ts = require('./index');

gulp.task('template', function() {
	return gulp.src( 'samples/template.html' )
	.pipe(html2ts())
	.pipe(gulp.dest( './samples' ));
});

gulp.task('template:withPrefix', function() {
	return gulp.src( 'samples/template.html' )
	.pipe(html2ts('app'))
	.pipe(gulp.dest( './samples' ));
});

gulp.task('template:config', function() {
	return gulp.src( 'samples/template.html' )
		.pipe(html2ts({
			moduleName: 'app.{$folderName}', //or '$fileName' or 'stringFixed'
			propertyName: '{$fileName}Html'
		}))
		.pipe(gulp.dest( './samples' ));
});