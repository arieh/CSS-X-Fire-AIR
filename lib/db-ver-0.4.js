(function(){

var check_sql = "SELECT `installed` FROM `variables` WHERE `version`='0.4'";
var alter_sql =	"ALTER TABLE `sites` ADD COLUMN `on` INT(2) DEFAULT 1 ";
var set_install = "UPDATE `variables` SET `installed`=1 WHERE `version` = '0.4'";


var stmt = new air.SQLStatement();
stmt.sqlConnection = __db__;
stmt.text=check_sql;
stmt.execute();
var data =stmt.getResult().data;
 
if (data[0].installed != 1){
	stmt.text = alter_sql;
	stmt.execute();	
	stmt.text = set_install;
    stmt.execute();
}

})();
