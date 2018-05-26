//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Button"                                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButton"
//------------------------------------------------------------------------------

function sysObjButton() {

	this.RootObject		= new sysObjBaseDiv();
	this.TextID		= null;

	this.PostRequestData	= new sysRequestDataHandler();

	this.CallURL		= null;
	this.CallService	= false;

	this.FormValidate	= false;

}

//- inherit sysBaseObject
sysObjButton.prototype = new sysBaseObject();

//- inherit methods
sysObjButton.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;
sysObjButton.prototype.processResetObjects = sysResetObjectHandler.prototype.processResetObjects;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysObjButton.prototype.EventListenerClick = function(Event)
{

	this.CallURL = this.ConfigObject.Object.Attributes.OnClick;
	this.CallService = false;

	//console.log('sysObjButton.EventListenerClick() Config.Attributes:%o', this.Config.Attributes);

	//- reset post request data
	this.PostRequestData.reset();

	//- process connected source objects
	this.processSourceObjects();

	//- process filter
	this.processFilter();

	//- if no source objects connected, process formlistobjects
	this.processFormFieldListObjects();

	//- process reset objects
	this.processResetObjects();

}


//------------------------------------------------------------------------------
//- METHOD "processFormFieldListObjects"
//------------------------------------------------------------------------------
sysObjButton.prototype.processFormFieldListObjects = function()
{

	var ValidateResult = this.validateForm();
	console.log('sysObjButton ValidateResult:%s', ValidateResult);

	//- if validate ok, setup get params, call service
	if (ValidateResult == true) {
		/*
		console.log('##### BUTTON FORM VALIDATION OK #####');
		console.log(this.ConfigObject);
		console.log(this.PostRequestData);
		*/
		this.callService();
	}

}


//------------------------------------------------------------------------------
//- METHOD "processFilter"
//------------------------------------------------------------------------------
sysObjButton.prototype.processFilter = function()
{
	var FilterObject = new RequestDataFilter(this);
	FilterObject.process();
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------
sysObjButton.prototype.callService = function()
{
	if (this.CallURL != null && this.CallURL !== undefined) {

		//- add async notify handler item
		this.addNotifyHandler();

		//- trigger async service request
		RPC = new sysCallXMLRPC(this.CallURL);
		RPC.Request(this);

	}
}


//------------------------------------------------------------------------------
//- METHOD "addNotifyHandler"
//------------------------------------------------------------------------------
sysObjButton.prototype.addNotifyHandler = function()
{
	var NotifyAttributes = this.ConfigObject.Object.Attributes.Notify;
 
	sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(
		NotifyAttributes
	);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysObjButton.prototype.callbackXMLRPCAsync = function()
{

	var MsgHandler = sysFactory.sysGlobalAsyncNotifyHandler;
	var XMLRPCStatus = this.XMLRPCResultData.error;
	var NotifyStatus = 'ERROR';

	//- check error
	if (XMLRPCStatus === undefined) {

		var ConfigAttributes = this.ConfigObject.Object.Attributes;
		var SwitchScreen = ConfigAttributes.SwitchScreen;
		var SwitchTabContainer = ConfigAttributes.SwitchTabContainer;
		var SwitchTabID = ConfigAttributes.SwitchTabID;

		//- switch screen
		if (SwitchScreen !== undefined && SwitchScreen != false) {

			var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.SwitchScreen);
			var ScreenRootObj = ScreenObj.ConfigRootObject;

			//- get primary key value from service result
			if (ConfigAttributes.ServiceResultKeyColumn !== undefined) {
				ScreenObj.DBPrimaryKeyValue = this.XMLRPCResultData[ConfigAttributes.ServiceResultKeyColumn];
				console.log(ScreenObj.DBPrimaryKeyValue);
			}

			//- switch screen
			sysFactory.switchScreen(ConfigAttributes.SwitchScreen);

			//- reset form field styles
			sysFactory.clearFormStylesByScreenID(this.ConfigObject.ScreenObject.ScreenID);

			//- reset form field values
			sysFactory.resetFormValuesByScreenID(this.ConfigObject.ScreenObject.ScreenID);

		}

		//- switch tab
		if (SwitchTabContainer !== undefined && SwitchTabID !== undefined) {
			var TabObj = sysFactory.getObjectByID(SwitchTabContainer);
			TabObj.TabContainerObject.switchTab(SwitchTabID);
		}

		//- fire events
		sysFactory.Reactor.fireEvents(this.Config.Attributes.FireEvents);

		//- set notify status
		NotifyStatus = 'SUCCESS';
	}

	//- set notify status
	var IndicatorID = this.ConfigObject.Object.Attributes.Notify.ID;
	if (IndicatorID !== undefined) {
		var Message = 'SYS__'+IndicatorID+'__'+NotifyStatus;
		MsgHandler.processMsg(Message);
	}

}


//------------------------------------------------------------------------------
//- METHOD "validateForm"
//------------------------------------------------------------------------------
sysObjButton.prototype.validateForm = function(Obj)
{

	var FormListObjs = sysFactory.getFormFieldListObjectsByScreenObj(this.ConfigObject.ScreenObject);

	//- validate form fields
	for (ObjKey in FormListObjs) {

		var FormListConfigObj = FormListObjs[ObjKey];

		if (this.Config.Attributes.FormValidate == true) {
			FormListConfigObj.ConnectorObject.validate();
		}

		this.PostRequestData.merge(FormListConfigObj.ConnectorObject.getFormFieldItemData());

	}

	//- add screen id to request data
	var IdObj = Object();
	IdObj['BackendServiceID'] = this.ConfigObject.Object.Attributes.ServiceID;
	this.PostRequestData['ServiceData'] = IdObj;
	
	//console.log(this.PostRequestData);

	if (this.Config.Attributes.FormValidate == true) {

		//- if validate fails, switch to containing tab
		for (ObjKey in FormListObjs) {

			var FormListConfigObj = FormListObjs[ObjKey];

			if (FormListConfigObj.ConnectorObject.validate() == false) {
				FormListConfigObj.ConnectorObject.switchContainingTab();
				return false;
			}

		}
	}

	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.clearStyle();
	}

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjButton.prototype.init = function()
{
	this.render();
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------
sysObjButton.prototype.render = function()
{

	var PositionTop = this.ConfigAttributes.PositionTop.toString() + 'px';
	var PositionLeft = this.ConfigAttributes.PositionLeft.toString() + 'px';

	this.RootObject.ObjectID = 'ButtonTable' + this.ConfigObject.ObjectID;
	this.RootObject.DOMStyle = this.Config.Style + 'Table';
	this.RootObject.DOMStyleTop = PositionTop;
	this.RootObject.DOMStyleLeft = PositionLeft;

	var RowObj = new sysObjBaseDiv();
	RowObj.EventListeners = Object();
	RowObj.ObjectID = 'ButtonTableRow' + this.ConfigObject.ObjectID;
	RowObj.DOMStyle = this.Config.Style + 'TableRow';

	this.addEventListenerClick(RowObj);

	var ColObjDescription = new sysObjBaseDiv();
	ColObjDescription.ObjectID = 'ButtonDescriptionCol' + this.ConfigObject.ObjectID;
	ColObjDescription.DOMStyle = this.Config.Style + 'Description';

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = this.ConfigAttributes.TextID;
	SQLTextObj.TextID = this.ConfigAttributes.TextID;
	SQLTextObj.init();

	var ColObjImage = new sysObjBaseDiv();
	ColObjImage.ObjectID = 'ButtonImage' + this.ConfigObject.ObjectID;
	ColObjImage.DOMStyle = this.Config.Style + 'Image';

	ColObjDescription.addObject(SQLTextObj);
	RowObj.addObject(ColObjDescription);
	RowObj.addObject(ColObjImage);

	this.RootObject.addObject(RowObj);

}


//------------------------------------------------------------------------------
//- METHOD "addEventListenerClick"
//------------------------------------------------------------------------------
sysObjButton.prototype.addEventListenerClick = function(Obj)
{

	//- add event listener to row element
	var EventListenerObj = Object();
	EventListenerObj['Type'] = 'click';
	EventListenerObj['Element'] = this.EventListenerClick.bind(this);

	Obj.EventListeners["ButtonClick"] = EventListenerObj;

}
