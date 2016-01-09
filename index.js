var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var PluginError = gutil.PluginError;

//consts
var PLUGIN_NAME = 'gulp-html-to-ts';

// html -> js processing functions:
// Originally from karma-html2js-preprocessor
var escapeContent = function (content) {
    var singleQuoteChar = '\'';
	var singleQuoteRegexp = new RegExp('\\' + singleQuoteChar, 'g');

    var doubleQuoteChar = '\"';
	var doubleQuoteRegexp = new RegExp('\\' + doubleQuoteChar, 'g');
	
	return content
		.replace(singleQuoteRegexp, '\\' + singleQuoteChar)
		.replace(doubleQuoteRegexp, '\\' + doubleQuoteChar)
		.replace(/\r?\n/g, " ");
};

// Remove bom when reading utf8 files
function stripBOM(str) {
    return 0xFEFF === str.charCodeAt(0)
        ? str.substring(1)
        : str;
}

function html2Ts(config){
	var param = {};
	config = config || {};
	
	param.fileSrcType = config.fileSrcType || '.html';
	param.fileDestType = config.fileDestType || '.ts';
	param.tsTemplate =  config.tsTemplate || "module $folderName { export var $fileName = \'$fileContent\';}";
		
	return through.obj( function( file, enc, done ) {
		if (file.isNull()) {
			done(null, file); //empty file
			return;
		}
		
		
		var fileName = path.basename(file.path, param.fileSrcType);
		if(!fileName){
			this.emit('error', new PluginError(PLUGIN_NAME, 'file <'+ file.path +'> not converted!'));
			return done();
		}

		var dirName = path.dirname(file.path);
		var folderName = path.basename(dirName);
		var content = stripBOM(escapeContent(file.contents.toString()));
		
		content = param.tsTemplate
			.replace("$folderName", folderName)
			.replace("$fileName", fileName)
			.replace('$fileContent', content);
		
		if( file.isStream() ) {
			var stream = through();
			stream.write(content);
			
			stream.on('error', this.emit.bind(this, 'error'));
		      
			file.contents = stream;
		}
		
		if( file.isBuffer() ) {
			file.contents = new Buffer( content );
		}

		file.path += param.fileDestType;
		this.push( file );
		
		return done();
	});	
}

module.exports = html2Ts;
