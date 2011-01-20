(function($){
	
var params = {
    Implements : [Options,Events]
	, db : null
	, fields : ['port','host','start']
	, selectStmt : null
	, updateStmt : null
    , initialize : function initialize(db,options){
		this.setOptions(options);
		this.db = db;
		this.selectStmt = new air.SQLStatement();
		this.updateStmt = new air.SQLStatement();
		
		this.updateStmt.sqlConnection = this.selectStmt.sqlConnection = db;
		
		this.handleSelect = this.handleSelect.bind(this);
		
        this.selectStmt.addEventListener(air.SQLEvent.RESULT, this.handleSelect);
	}
	, get : function(fields,cb){
		var $this = this, sql;
		fields = Array.from(fields);
		//fields = fields.filter(function(v){return $this.fields.contains[v];});
		sql = "SELECT `"+ fields.join('`,`') +"` FROM `settings`";
		this.selectCB = cb;
		this.selectStmt.text = sql;
		this.selectStmt.execute();
	}
	, set : function(prop,value){
		if (false == this.fields.contains(prop)) return;
		var sql = "UPDATE `settings` SET `"+prop+"`='"+value+"'";
		this.updateStmt.text = sql;
		this.updateStmt.execute();
		this.fireEvent('update',[prop,value]);
	}
	, handleSelect : function(event){
		var data = this.selectStmt.getResult().data;
		this.selectCB.apply(null,[data[0]]);
		this.selectCB = null;
	}
	, populateSettings : function(target){
		target = $(target);
		var $this = this,html = 
		  "<form action='#'>"
		      +"<h3>Port:</h3>"
			  +"<input type='text' class='port'/>"
			  +"<h3>Host:</h3>"
			  +"<input type='text' class='host' />"
			  +"<dl class='radios'>"
			     +"<dt>Start listening when opened?</dt>"
				    +"<dd><label for='on-start-0'><input type='radio' value='0' name='on-start' id='on-start-0' />Don't start</label></dd>"
					+"<dd><label for='on-start-1'><input type='radio' value='1' name='on-start' id='on-start-1' />Start</label></dd>"
			  +"</dl>"
			  +"<input type='submit' value='save' />"
		  +"</form>"
		 , form
		 , values = this.get(this.fields, function(data){
		 	target.set('html',html);
            form = target.getElement('form');
			var port = form.getElement('.port')
			  , host = form.getElement('.host')
			  , checked = form.getElement('#on-start-'+data.start);
			  
			port.value = data.port;
			host.value = data.host;
			
			checked.set('checked','checked');
			form.addEvent('submit', function(){
				if (data.port != port.value) $this.set('port',port.value);
				if (data.host != host.value) $this.set('host',host.value);
				if (checked.get('checked')!= 'checked') $this.set('start', data.start ? 0 :1);
				form.destroy();
			});			
		 });
	}
}
, Settings = this.Settings = new Class(params);
	
})(document.id);
