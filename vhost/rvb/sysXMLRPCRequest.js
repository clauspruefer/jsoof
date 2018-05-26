//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- XML_RPC_HANDLER                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Synchronous/Asynchronous XRPC Handler                                    -//
//-                                                                          -//
//- RPCType          SYNC | ASYNC                                            -//
//- URL              Request URL                                             -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- Constructor "sysCallXMLRPC"
//------------------------------------------------------------------------------

function sysCallXMLRPC(URL, URLParams = '')
{

	this.RandURLOption	= '?a__=';

	this.RPCType		= 'ASYNC';			//- SYNC | ASYNC (ASYNC 

	this.RequestType	= 'POST';			//- POST | GET
	this.RequestCache	= false;			//- Cache Request

	this.HTTPAuthBasic	= false;			//- HTTP Basic Authentication
	this.HTTPAuthBasicUser	= '';				//- HTTP Basic Authentication Username
	this.HTTPAuthBasicPass	= '';				//- HTTP Basic Authentication Password

	this.URL		= URL;				//- URL
	this.URLParams		= URLParams;			//- URL Params
	this.URLRandIndicator	= this.RandURLOption + '1';	//- Random URL Part

	this.PostData		= new Object();			//- Post Request Data Object

}


//------------------------------------------------------------------------------
//- METHOD "setRequestType"
//------------------------------------------------------------------------------

sysCallXMLRPC.prototype.setRequestType = function(Type)
{
	this.RequestType = Type;
}


//------------------------------------------------------------------------------
//- METHOD "Request"
//------------------------------------------------------------------------------

sysCallXMLRPC.prototype.Request = function(RequestObject)
{

	//console.log('**** XMLRPC Request ****');
	//console.log(RequestObject);

	if (RequestObject.ConfigObject !== undefined && RequestObject.ConfigObject.Object.Attributes !== undefined) {

		var DBPrimaryKeyID = RequestObject.ConfigObject.Object.Attributes.DBPrimaryKeyID;

		if (DBPrimaryKeyID != null && DBPrimaryKeyID !== undefined) {

			var DBPrimaryKeyValue = RequestObject.ConfigObject.ScreenObject.DBPrimaryKeyValue;
			//console.log(DBPrimaryKeyValue);

			RequestObject.PostRequestData.add(DBPrimaryKeyValue, 'DBPrimaryKeyValue');

		}
	}

	if (RequestObject.PostRequestData !== undefined) {
		this.PostData = RequestObject.PostRequestData;
	}

	var HeaderContentType = null;
	var HeaderAccept = null;

	//------------------------------------------------------------------------------
	//- REQUEST
	//------------------------------------------------------------------------------

	if (this.RPCType == 'ASYNC') {

		var request = new XMLHttpRequest();

		//- set callback function
		request.onreadystatechange = function() {

			//- if valid request, evaluate result json object
			if (request.readyState == 4 && request.status == 200) {

				if (this.RequestType == 'GET') {
					alert(request.responseText);
				}
				var ResultData = '';

				if (request.responseText.length > 0) {
					ResultData = JSON.parse(request.responseText);
				}

				RequestObject.XMLRPCResultData = ResultData;
				RequestObject.callbackXMLRPCAsync();

			}

		}

		//------------------------------------------------------------------------------
		//- CACHED REQUEST
		//------------------------------------------------------------------------------

		if (this.RequestCache == false) {

			var RandomNrObject;

			RandomNrObject = new sysRandomNr();
			RandomNrObject.generate(10);

			this.URLRandIndicator = this.RandURLOption + RandomNrObject.number;

		}

		//------------------------------------------------------------------------------
		//- PREPARE REQUEST
		//------------------------------------------------------------------------------

		var RequestURL = '';

		if (this.RequestType == 'GET') {

			RequestURL = this.URL + this.URLRandIndicator + this.URLParams;

			if (sysFactory.SysSessionValue != null) {
				RequestURL += '&' + sysFactory.SysSessionID + '=' + sysFactory.SysSessionValue;
			}

			HeaderContentType = 'text/plain; charset=UTF-8';
			HeaderAccept = 'application/json';

		}

		if (this.RequestType == 'POST') {

			RequestURL = this.URL + this.URLRandIndicator;

			if (sysFactory.SysSessionValue != null) {
				var SessionData = new Object();
				SessionData['ID'] = sysFactory.SysSessionID;
				SessionData['Value'] = sysFactory.SysSessionValue;
				this.PostData['SessionData'] = SessionData;
			}

			HeaderContentType = 'application/json; charset=UTF-8';
			HeaderAccept = 'application/json';

		}

		request.open(this.RequestType, RequestURL);

		//request.setRequestHeader('Upgrade-Insecure-Requests', 1);
		//request.setRequestHeader('Cache-Control', 'max-age=0');

		request.setRequestHeader('Content-Type', HeaderContentType);
		request.setRequestHeader('Accept', HeaderAccept);


		//------------------------------------------------------------------------------
		//- AUTHENTICATION
		//------------------------------------------------------------------------------

		if (this.HTTPAuthBasic == true) {

			var Base64Object;

			Base64Object = new sysBase64();
			Base64Object.encode( this.HTTPAuthBasicUser + ':' + this.HTTPAuthBasicPass);

			request.setRequestHeader('Authorization', 'Basic ' + Base64Object.encoded);

		}

		//------------------------------------------------------------------------------
		//- SEND REQUEST
		//------------------------------------------------------------------------------

		if (this.RequestType == 'GET') {
			request.send();

		}

		if (this.RequestType == 'POST') {
			request.send(JSON.stringify(this.PostData));
		}

	}

	//------------------------------------------------------------------------------
	//- SYNCHRONOUS REUQEST
	//------------------------------------------------------------------------------

	if (this.RPCType == 'SYNC') {
		console.log('Synchronous XMLRPC Requests are currently deprecated.');
	}

}
