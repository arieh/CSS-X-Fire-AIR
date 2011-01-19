(function(window,$){
var params = {
   Implements : [Options,Events]
   , options : {
   	    dbName : 'folder-list.db'
   }
   , db : null
   , table : null
   , dbOpen : false
   , data : []
   , sites : {}
   , initialize : function initialize(elem,db,options){
       this.setOptions(options);
	   this.db = db;
	   this.table = $(elem);
	   this.fetchData();
   }
   , fetchData : function fetchData(event){
   	   var sql = "SELECT * FROM `sites`"
	       , stmt = new air.SQLStatement()
		   , $this = this
		   , i,l;
		stmt.sqlConnection = this.db;
		stmt.text = sql; 
		stmt.addEventListener(air.SQLEvent.RESULT, function(event){
			$this.data = stmt.getResult().data || [];
		});
		
		stmt.execute();
		
		for (i=0,l=this.data.length; i<l;i++){
			this.sites[this.data[i].url] = {
	            dir : this.data[i].dir
	            , on  : this.data[i].on
	        }
		} 
		
		this.populateData();
   } 
   , addSite : function addSite(site,dir){
   	    if (site.substr(-1)!='/') site += '/';
		if (false == ['/','\\'].contains(dir.substr(-1))) dir+='/';
		
		var sql = "INSERT INTO `sites`(`url`,`dir`) VALUES ('"+site+"','"+dir+"')"
           , stmt = new air.SQLStatement()
           , $this = this;
        try {
			stmt.sqlConnection = this.db;
			stmt.text = sql;
			stmt.execute();
			this.fetchData();
		}catch(e){}
   }
   , removeSite : function removeSite(site){
   	    var sql = "DELETE FROM `sites` WHERE `url`='"+site+"'"
           , stmt = new air.SQLStatement()
           , $this = this;
        stmt.sqlConnection = this.db;
        stmt.text = sql; 
        stmt.execute();
		this.fetchData();
   }
   , siteOn : function siteOn(url){
   	    var exists = url in this.sites , on = false;
		if (exists) on = !!this.sites[url].on;
		return (exists && on);
   }      
   , populateData : function populateData(){
   	    var tbody = this.table.getElement('tbody');
		tbody.empty();
		Object.each(this.data,function(site){
			var tr = new Element('tr')
			     .adopt(
				    new Element('td').set('html',site.url).addClass('url')
					, new Element('td').set('html',site.dir).addClass('dir')
					, new Element('td').set('html',"<a href='#' class='toggle-on' data-state='"+site.on+"'>"+(site.on==0 ? "turn on" : "turn off")+"</a>").addClass('toggle-on')
					, new Element('td').set('html','<a href=\'#\' class=\'remove\'>remove</a>').addClass('remove')
				 );
			tbody.adopt(tr);	 
		});
   }
   , toggle : function toggle(url,state){
   	    
		var sql = "UPDATE `sites` SET `on` = "+state+" WHERE `url`='"+url+"'";
		var stmt = new air.SQLStatement;
        stmt.sqlConnection = this.db;
        stmt.text = sql; 
        stmt.execute();
		this.fetchData();
   }
}	
var FolderTable = this.FolderTable = new Class(params);

})(this,document.id);
