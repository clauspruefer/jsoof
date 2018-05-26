//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM Authentication, Session Handling                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Handles Authentication, Session Managament                               -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysAuthSession"
//------------------------------------------------------------------------------

function sysAuthSession (LoginUser, LoginPass)
{

	this.LoginUser = LoginUser;
	this.LoginPass = LoginPass;

	this.startSession();

}


//------------------------------------------------------------------------------
//- METHOD "startSession"
//------------------------------------------------------------------------------

sysAuthSession.prototype.startSession = function()
{

	RPC = new sysCallXMLRPC('https://dev.webcodex.de/python/LoginSession.wsgi?LOGIN_USER='+this.LoginUser+'&LOGIN_PASS='+this.LoginPass);
	RPC.Request(this, 'GlobalData');

}


//------------------------------------------------------------------------------
//- CALLBACK "XMLRPCAsync"
//------------------------------------------------------------------------------

sysAuthSession.prototype.callbackXMLRPCAsync = function()
{

	//- Check Authentication
	if (this.CtResultData.Error == '') {

	//- On Authentication ok: Set System Session ID
	SYS_SessionID = this.CtResultData.SID;

	//- Start Processing Asynchronous Messages
	sysGlobalAsyncNotifyHandler.getMsg();

	}
	else {
		alert('Authentication Error!');
	}

}


//------------------------------------------------------------------------------
//- FUNCTION "authenticate" (called by Login Button)
//------------------------------------------------------------------------------

function authenticate(LoginUser, LoginPass) {

	//- Generate new Authentication Object Instance
	new sysAuthSession(LoginUser, LoginPass);

}
