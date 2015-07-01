var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var PluginError = gutil.PluginError;

//consts
var PLUGIN_NAME = 'gulp-html-to-ts';

// html -> js processing functions:
// Originally from karma-html2js-preprocessor
var escapeContent = function (content, quoteChar) {
    quoteChar = quoteChar || '\'';
	
	var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '';
    
	return content.replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
};

// Remove bom when reading utf8 files
function stripBOM(str) {
    return 0xFEFF === str.charCodeAt(0)
        ? str.substring(1)
        : str;
}

function html2Ts(appPrefix){
	appPrefix = appPrefix || "";
	
	return through.obj( function( file, enc, done ) {
		if (file.isNull()) {
			done(null, file); //empty file
			return;
		}

		//console.log("file:" + JSON.stringify(file));
// 		file:{
// 	history:["<fullFileName>"],
// 	cwd:"<project root path>",
// 	base: "<folder root path>"
// }
		
		var templateContent = "module $appPrefix$folderName { export var $fileNameTemplate = \'$fileContent\';}";
		var fileName = path.basename(file.path, '.htm');
		
		var dirName = path.dirname(file.path);
		console.log("dirName:"+dirName);

		//!!!! does not support 2 levels un root
		//RL ...
		var folderName = path.basename(dirName);
		console.log("foldername:" + folderName);
		
		if(!fileName){
			this.emit('error', new PluginError(PLUGIN_NAME, 'file <'+ file.path +'> not supported!'));
			return done();
		}
		
		var content = stripBOM(escapeContent(file.contents.toString()));
		content = templateContent
			.replace('$fileName', fileName)
			.replace('$fileContent', content)
			.replace('$appPrefix',appPrefix)
			.replace("$folderName",folderName);
		
		if( file.isStream() ) {
			var stream = through();
			stream.write(content);
			
			stream.on('error', this.emit.bind(this, 'error'));
		      
			file.contents = stream;
		}
		
		if( file.isBuffer() ) {
			file.contents = new Buffer( content );
		}

		file.path += ".ts";
		this.push( file );
		
		return done();
	});	
}

module.exports = html2Ts;
