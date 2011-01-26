(function(){
	
var params = {
    Implements : [Options,Events]
	, options : {
		port : 6776
		, host :'127.0.0.1'
	}	
	, socket : null
	, initialize : function initialize(options){
		this.setOptions(options);
	}
	, handleResponse: function handleResponse(e){
		var socket = e.target
		   , message = socket.readUTFBytes(socket.bytesAvailable)
		  , data = message.split('HTTP/1.1')[0].replace(/(:?GET|POST).*(\/\?)+/, '');
		this.fireEvent('response',data.parseQueryString());
	}
	, listen : function listen(){	
        var socket = this.socket = new air.ServerSocket(), handleResponse = this.handleResponse.bind(this);
        
		socket.addEventListener( air.Event.CONNECT, function(ev){
           ev.socket.addEventListener( air.ProgressEvent.SOCKET_DATA, handleResponse); 
        });
		
		this.socket.bind(this.options.port,this.options.host);	
		this.socket.listen();
	}
	, changeBindings : function(new_binds){
		this.socket.close();
		this.setOptions(new_binds);
	}
	, close : function close(){
		this.socket.close();
		delete this[socket];
	}
}
, SocketHandler = this.SocketHandler = new Class(params);
	
})();
