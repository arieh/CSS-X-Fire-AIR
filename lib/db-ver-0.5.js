(function(){
	
var sql = "UPDATE `variables` SET `installed`=1 WHERE `installed`=0 AND `version` LIKE '0.5.%'";
var stmt = new air.SQLStatement();
stmt.sqlConnection = __db__;
stmt.text = sql;
stmt.execute();

})();
