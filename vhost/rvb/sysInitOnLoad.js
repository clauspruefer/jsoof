//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Init On Load                                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Set Global Namespace Variables
//------------------------------------------------------------------------------

var sysFactory;


//------------------------------------------------------------------------------
//- Disable Global Browser based Context Menu
//------------------------------------------------------------------------------

document.oncontextmenu = function() {
	return false;
}


//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function Init() {

	//----------------------------------------------------------------------------
	//- Construct Global Object Factory (Main Object Handler)
	//----------------------------------------------------------------------------

	sysFactory = new sysFactory();
	sysFactory.DisplayDefaultScreen = 'ShipmentHistory';

	sysObjLoader = new sysObjectLoader(sysFactory);

	sysFactory.ObjText = new sysText();
	sysFactory.ObjMenu = new sysMenu();
	sysFactory.DataObject = new sysJSONData();
	sysFactory.DataSkeleton = new sysJSONData();

	sysObjLoader.add(sysFactory.ObjText);
	sysObjLoader.add(sysFactory.ObjMenu);
	sysObjLoader.add(sysFactory.DataObject);
	sysObjLoader.add(sysFactory.DataSkeleton);

	sysFactory.ObjText.setLoaderObj(sysObjLoader);
	sysFactory.ObjMenu.setLoaderObj(sysObjLoader);
	sysFactory.DataObject.setLoaderObj(sysObjLoader);
	sysFactory.DataSkeleton.setLoaderObj(sysObjLoader);

	sysFactory.ObjText.requestXMLRPCData('python/getText.py');
	sysFactory.ObjMenu.requestXMLRPCData('static/menu.json');
	sysFactory.DataObject.requestXMLRPCData('static/object.json');
	sysFactory.DataSkeleton.requestXMLRPCData('static/skeleton.json');


	//----------------------------------------------------------------------------
	//- Set System Vars
	//----------------------------------------------------------------------------

	sysFactory.SysDebugLevel	= 10;
	sysFactory.SysSessionID		= 'RVB_WEBAPP_SESSION';
	sysFactory.SysSessionValue	= 'abababababababababababababababababababababababababababababababab';

	sysFactory.MsgServerURL		= 'http://rvb.lan.cb.kw.webcodex.de/msg';


	//----------------------------------------------------------------------------
	//- Set Environment Vars
	//----------------------------------------------------------------------------

	sysFactory.EnvUserLanguage	= 'de';


	//----------------------------------------------------------------------------
	//- Set Global Validate Regex Object
	//----------------------------------------------------------------------------

	sysFactory.ObjFormValidate = new sysFormFieldValidate();


	//----------------------------------------------------------------------------
	//- Set Global Reactor Object
	//----------------------------------------------------------------------------

	sysFactory.Reactor = new sysReactor();


	//----------------------------------------------------------------------------
	//- Construct Global Async Notify Indicator
	//----------------------------------------------------------------------------

	sysFactory.GlobalAsyncNotifyIndicator = new sysObjAsyncNotifyIndicator();
	sysFactory.GlobalAsyncNotifyIndicator.initLayer();


	//----------------------------------------------------------------------------
	//- Start Async Notify Message Handler
	//----------------------------------------------------------------------------

	sysFactory.sysGlobalAsyncNotifyHandler = new sysAsyncNotifyMsgHandler();

}
