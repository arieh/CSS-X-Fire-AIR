(function(){


	
var params = {
    Implements : [Options,Events]
	, table : null
	, db : null
	, stream : null
	, file : null
	, ongoing : false
	, currentData : {}
	, stack  : []
	, initialize : function initialize(table,db,options){
		this.setOptions(options);
		this.db = db;
		this.table = table;
		this.handleResponse = this.handleResponse.bind(this);
		this.stream = new air.FileStream;
		this.file = new air.File;
	}	
	, handleResponse : function handleResponse(data){
		var url_parts = data.href.replace('http:/','').split('/')
		  , url = ''
		  , $this = this;
	   
	   if (this.ongoing){
	   	   this.stack.push(data);
		   return;
	   }
	   
	   
	   
	   this.currentData = data;
       this.ongoing = true;
	   url_parts.unshift('http:/');
	   url_parts.some(function findUrl(part){
		   if (!part.length) return;
		   url += part +'/';
		   if ($this.table.siteOn(url)){	
			  $this.openCSS(data,url);
			  return true;
		   }
		   return false;
	   });
	}
	, openCSS : function openCSS(data,url){
		var loc = this.table.sites[url].dir + data.href.split(url)[1].replace(/\//,air.File.sperator)
		  , content = '';
		  
		this.file.nativePath = loc;
		this.currentData.src = loc;
        if (this.file.exists && !this.file.isDirectory){
			this.stream.open(this.file,air.FileMode.UPDATE);
			content = this.stream.readUTFBytes(this.stream.bytesAvailable);
			this.handleCSS(data,content);
		}
	}
	, handleCSS : function handleCSS(data,content){
		var esSelector = data.selector.escapeRegExp().replace(/\s/,'\\s*')
		  , pattern = '('+esSelector+'\\s*\\{[\\w\\s:\\-;\\(\\)\\#]*)(?:'+data.property.escapeRegExp()+'\\s*:)(?:[^;\\}]+)(;|\\})?'
		  , regex = new RegExp(pattern,'i')
		  , replace = (data.deleted === 'true') ? ('$1') : ("$1" + data.property + " : " + data.value + "$2")
	      , result = content.replace(regex,replace);
		
		this.currentData.action =(data.deleted === 'true') ? 'deleted' : 'updated';
		
		if (result != content){
			this.writeFile(result);
			return;
		} 
		
		this.currentData.action = 'new';
		
		pattern ='('+esSelector+ '\s*\{)(\\s*)';
		regex = new RegExp(pattern);
		
		this.writeFile(content.replace(regex,"$1$2"+data.property+" : "+data.value+";$2"));
	}
	, writeFile : function writeFile(content){
		this.stream.position = 0;
		this.stream.truncate();
		this.stream.writeUTFBytes(content);
		this.stream.close();
		this.ongoing = false;
        this.fireEvent('write',[this.currentData]);
        this.currentData = {};
		this.handleStack();
	}
	, handleStack : function handleStack(){
		var data;
		while (data = this.stack.pop()){
			this.handleResponse(data);
		} 
	}
}    
, CSSHandler = this.CSSHandler = new Class(params);	
	
})();
