var CSSXFireAIR = {
	versions : ['0.4','0.4.1','0.4.2','0.4.3','0.4.4','0.5.0','0.5.1']
	, version : '0.5.1'
};

(function(){

var dbFile = air.File.applicationStorageDirectory.resolvePath('css-x-fire1.db');
var __db__ = this.__db__ = new air.SQLConnection();
__db__.open(dbFile);
var stmt = new air.SQLStatement();
stmt.sqlConnection = __db__;

/* CREATING SITE TABLE */	
var create_sites = "CREATE  TABLE IF NOT EXISTS `sites` ("
  +"`url` VARCHAR(255) NOT NULL ,"
  +"`dir` VARCHAR(255) NOT NULL ,"
  +"PRIMARY KEY (`url`) )";

stmt.text = create_sites;
stmt.execute();

/* CREATING SETTINGS TABLE */
var create_settings = "CREATE TABLE IF NOT EXISTS `settings` ("
    +"`port` VARCHAR(3) NOT NULL ,"
	+"`host` VARCHAR(255) NOT NULL ,"
	+"`start` INT(2) NOT NULL )";
	
stmt.text = create_settings;
stmt.execute();
	
/* CREATING DEFUALT SETTINGS IF NEEDED */
var settings_count = "SELECT COUNT(`port`) as `c` FROM `settings`";
var settings_default = "INSERT INTO `settings`(`port`,`host`,`start`) VALUES ('6776','127.0.0.1',0)";

stmt.text = settings_count;
stmt.execute();
var res = stmt.getResult().data;
if (res[0] && 'c' in res[0] && res[0].c == 0){
    stmt.text = settings_default;
    stmt.execute();
}

/* CREATING VARIBALES TABLE */
var create_vars = "CREATE TABLE IF NOT EXISTS `variables`("
    +"`version` VARCHAR(6) NOT NULL, "
	+"`installed` INT(2) DEFAULT 0"
    +")";
	
stmt.text = create_vars;
stmt.execute();
    
/* INSERTING ROWS FOR NEW VERSONS */
var get_versions = "SELECT `version` FROM `variables`";

var create_versions = "INSERT INTO `variables`(`version`) VALUES ";

stmt.text=get_versions;
stmt.execute();
res = stmt.getResult().data;

var inst_versions = [] ,data = [], sep='';

for (var key in res) inst_versions.push(res[key].version);

data = CSSXFireAIR.versions.filter(function(ver){
	return !(inst_versions.contains(ver));
})


if (data.length>0){
	data.forEach(function(ver){
	    create_versions += sep + "('"+ver+"')";
	    sep = ',';
	});
	stmt.text = create_versions;
    stmt.execute();
}

})();