var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var PluginError = gutil.PluginError;

//consts
const PLUGIN_NAME = 'gulp-html-to-ts';

function html2Ts(){
	return through.obj( function( file, enc, done ) {
		if (file.isNull()) {
			done(null, file); //empty file
			return;
		}

		var templateContent = 'module $fileName { export var html = "$fileContent";}';
		var fileName = path.basename(file.path, '.html');
		
		if(!fileName){
			this.emit('error', new PluginError(PLUGIN_NAME, 'file <'+ file.path +'> not supported!'));
			return done();
		}
		
		var content = templateContent.replace('$fileName', fileName).replace('$fileContent', file.contents.toString());
		
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