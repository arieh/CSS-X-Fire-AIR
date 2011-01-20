(function(){
	
var sql = "UPDATE `variables` SET `installed`=1 WHERE `version` LIKE '0.4.%'";
var stmt = new air.SQLStatement();
stmt.sqlConnection = __db__;
stmt.text = sql;
stmt.execute();

})();
