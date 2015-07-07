var gulp = require('gulp');
var html2ts = require('./index');

gulp.task('template', function() {
	//Default values
	return gulp.src( 'samples/template.html' )
		.pipe(html2ts())
		.pipe(gulp.dest( './samples' ));
});

gulp.task('template:configureTSTemplate', function() {
	//A different TS template
	return gulp.src( 'samples/template.html' )
		.pipe(html2ts({
			tsTemplate: "//AUTO GENERATED DO NOT MODIFIED HERE \n namespace app.$folderName { export var $fileName = \'$fileContent\';}"
		}))
		.pipe(gulp.dest( './samples' ));
});

gulp.task('template:configureSrcType', function() {
	//Different source file type (if not all *.HTML files are template to transform)
	return gulp.src( 'samples/template.htm' )   //source stream is different .HTM vs .HTML
		.pipe(html2ts({
			fileSrcType: ".htm",
			tsTemplate: "module mySPA { export var template = \'$fileContent\';}"
		}))
		.pipe(gulp.dest( './samples' ));
});

gulp.task('template:configureDestType', function() {
	//Why not produce javascript files either?
	return gulp.src( 'samples/template.html' )
		.pipe(html2ts({
			fileDestType: ".js",
			tsTemplate: "var app = exports = module.exports = { template:\'$fileContent\'}"
		}))
		.pipe(gulp.dest( './samples' ));
});