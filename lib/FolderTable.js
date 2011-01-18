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
		
		for (i=0,l=this.data.length; i<l;i++) this.sites[this.data[i].url] = this.data[i].dir;
		
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
   , populateData : function populateData(){
   	    var tbody = this.table.getElement('tbody');
		tbody.empty();
		Object.each(this.data,function(site){
			var tr = new Element('tr')
			     .adopt(
				    new Element('td').set('html',site.url).addClass('url')
					, new Element('td').set('html',site.dir).addClass('dir')
					, new Element('td').set('html','<a href=\'#\'>remove</a>').addClass('remove')
				 );
			tbody.adopt(tr);	 
		});
   }
}	
var FolderTable = this.FolderTable = new Class(params);

})(this,document.id);
