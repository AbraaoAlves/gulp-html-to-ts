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

function fillConfig(config, folderName, fileName){
	for (var key in config) {
		if (config.hasOwnProperty(key)) {
			config[key] = config[key].replace('{$folderName}', folderName).replace('{$fileName}', fileName);
		}
	}
}

function html2Ts(appPrefixOrConfig){
	var config = appPrefixOrConfig || {moduleName:'{$fileName}', propertyName:'html'};
	
	if(typeof(config) == "string"){
		config = {moduleName:appPrefixOrConfig+'.{$folderName}', propertyName:'html'};
	}	
	
	return through.obj( function( file, enc, done ) {
		if (file.isNull()) {
			done(null, file); //empty file
			return;
		}

		var templateContent = "module $moduleName { export var $propertyName = \'$fileContent\';}";
		var fileName = path.basename(file.path, '.html');
		
		if(!fileName){
			this.emit('error', new PluginError(PLUGIN_NAME, 'file <'+ file.path +'> not supported!'));
			return done();
		}

		var dirName = path.dirname(file.path);
		var folderName = path.basename(dirName);
		var content = stripBOM(escapeContent(file.contents.toString()));
		
		fillConfig(config, folderName, fileName);
		content = templateContent
			.replace('$moduleName', config.moduleName)
			.replace("$propertyName", config.propertyName)
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

		file.path += ".ts";
		this.push( file );
		
		return done();
	});	
}

module.exports = html2Ts;
