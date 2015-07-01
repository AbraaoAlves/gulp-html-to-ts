var gulp = require('gulp');
var html2ts = require('./index');

gulp.task('template', function() {
	return gulp.src( 'samples/template.html' )
	.pipe(html2ts())
	.pipe(gulp.dest( './samples' ));
});