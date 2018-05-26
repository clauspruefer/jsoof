//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2016                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonResultDstTable"                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButtonResultDstTable"
//------------------------------------------------------------------------------

function sysObjButtonResultDstTable()
{

	this.RootObject		= new sysObjBaseDiv();
	this.ParentObject	= null;

	this.TextID		= null;

	this.PostRequestData	= new sysRequestDataHandler();

}

//- inherit sysBaseObject
sysObjButtonResultDstTable.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonResultDstTable.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;
sysObjButtonResultDstTable.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;
sysObjButtonResultDstTable.prototype.validateForm = sysObjButton.prototype.validateForm;
sysObjButtonResultDstTable.prototype.render = sysObjButton.prototype.render;
sysObjButtonResultDstTable.prototype.callService = sysObjButton.prototype.callService;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysObjButtonResultDstTable.prototype.EventListenerClick = function(Event)
{

	//- reset post request data
	this.PostRequestData.reset();

	//- process connected source objects
	this.processSourceObjects();

	//- set call url from config
	this.CallURL = this.Config.Attributes.OnClick;

	//- process async service call
	this.callService();

}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysObjButtonResultDstTable.prototype.callbackXMLRPCAsync = function()
{

	var ServiceResult = this.XMLRPCResultData;

	var ConfigDstList = this.Config.Attributes.DstList;


	var ScreenObj = sysFactory.getScreenByID(ConfigDstList.ScreenID);
	var ListObj = ScreenObj.RootObject.getObjectByID(ConfigDstList.ID).BaseObject;

	var ResultCol = ConfigDstList.ResultCol;
	var ResultRef = ConfigDstList.ResultRef;
	var LstColDst = ConfigDstList.LstColDst;
	var LstColRef = ConfigDstList.LstColRef;

	var ProcessObjects = new Array();

	for (ResultKey in ServiceResult) {

		var ResultObj = ServiceResult[ResultKey];
		var ResultData = new Object();

		var ColCheckItems = ListObj.getRuntimeColObjects(LstColRef);
		var ColSetItems = ListObj.getRuntimeColObjects(LstColDst);

		for (ColCheckItemIndex in ColCheckItems) {

			ColCheckObj = ColCheckItems[ColCheckItemIndex];

			if (ColCheckObj.ConfigObject.DOMValue == ResultObj[ResultRef]) {

				var ColSetObj = ColSetItems[ColCheckItemIndex];

				//- write result into DOM
				var SetElement = document.getElementById(ColSetObj.ConfigObject.DOMObjectID);
				var SetValue = ResultObj[ResultCol];
				SetElement.innerHTML = SetValue;

				//- save value in table/column object for later service processing
				ListObj.setColumnValue(ColCheckItemIndex, LstColDst, SetValue);
			}

		}

	}

	//- fire events
	sysFactory.Reactor.fireEvents(this.Config.Attributes.FireEvents);

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjButtonResultDstTable.prototype.init = function()
{
	this.render();
}
