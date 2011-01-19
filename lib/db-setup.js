version = "0.4";
(function(){
	
var create_sites = "CREATE  TABLE IF NOT EXISTS `sites` ("
  +"`url` VARCHAR(255) NOT NULL ,"
  +"`dir` VARCHAR(255) NOT NULL ,"
  +"PRIMARY KEY (`url`) )";

var create_settings = "CREATE TABLE IF NOT EXISTS `settings` ("
    +"`port` VARCHAR(3) NOT NULL ,"
	+"`host` VARCHAR(255) NOT NULL ,"
	+"`start` INT(2) NOT NULL )";
	
var settings_count = "SELECT COUNT(`port`) as `c` FROM `settings`";
var settings_default = "INSERT INTO `settings`(`port`,`host`,`start`) VALUES ('6776','127.0.0.1',0)";

var create_vars = "CREATE TABLE IF NOT EXISTS `variables`("
    +"`version` VARCHAR(6) NOT NULL, "
	+"`installed` INT(2) DEFAULT 0"
    +")";
    

var first_install_check = "SELECT COUNT(`version`) as `c` FROM `variables` WHERE `version`='"+version+"'";
var insert_version = "INSERT INTO `variables`(`version`) VALUES('"+version+"')";

var dbFile = air.File.applicationStorageDirectory.resolvePath('css-x-fire1.db');
var __db__ = this.__db__ = new air.SQLConnection();
__db__.open(dbFile);

var stmt = new air.SQLStatement();
stmt.sqlConnection = __db__;
stmt.text = create_sites;
stmt.execute();

stmt.text = create_settings;
stmt.execute();

stmt.text = settings_count;

stmt.addEventListener(air.SQLEvent.RESULT,function create_settings(event){
	var res = stmt.getResult().data;
	stmt.removeEventListener(air.SQLEvent.RESULT,create_settings);
	if (res[0] && 'c' in res[0] && res[0].c == 0){
		stmt.text = settings_default;
		stmt.execute();
	}
});
stmt.execute();

stmt.text = create_vars;
stmt.execute();

stmt.text = first_install_check;
stmt.execute();
var res = stmt.getResult().data[0];
if (res.c ==0){
    stmt.text = insert_version;
	stmt.execute();    
}

})();