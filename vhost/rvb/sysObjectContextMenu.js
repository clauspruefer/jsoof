//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ContextMenu"                                              -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Context Menu                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysContextMenuItem"
//------------------------------------------------------------------------------

function sysContextMenuItem()
{

	this.PostRequestData		= new sysRequestDataHandler();

	this.ID				= null;
	this.TextID			= null;
	this.Icon			= null;

	this.DstScreenID		= null;
	this.DstScreenSrcObjFilter	= null;

	this.ServiceURL			= null;
	this.ServiceID			= null;
	this.Notify			= null;

	this.UpdateSrcObject		= false;

	this.DBPrimaryKeyID		= null;
	this.DBPrimaryKeyValue		= null;

	this.ScreenObject		= null;
	this.SourceObject		= null;

	this.ContextMenuObject		= null;

	this.FireEvents			= null;

	this.InternalFunction		= null;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysContextMenuItem.prototype.EventListenerClick = function(Event) {

	//console.log('##### CONTEXT MENU EVENT LISTENER CLICK #####');

	this.PostRequestData.reset();

	//- if no primary key exists, close
	if (this.DBPrimaryKeyValue === undefined || this.DBPrimaryKeyValue == null) {

		var sysTextObj = sysFactory.ObjText;
		var sysID = 'SYS__GLOBAL_MSG';
		var ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": sysTextObj.getTextBySystemLanguage('TXT.SYS.ERROR')
		}

		var AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);
		var NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
		NotifyItem.setProcessStatus(1);
		NotifyItem.setDisplayText(sysTextObj.getTextBySystemLanguage('TXT.SYS.EDITNOTALLOWED'));
		NotifyItem.updateDisplay();

		this.ContextMenuObject.close();
		return;
	}

	if (this.ServiceURL != null) {

		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(this.Notify);

		var Item = new Object();
		Item['DBPrimaryKeyValue'] = this.DBPrimaryKeyValue;

		if (this.ServiceID != null) {
			this.PostRequestData.addServiceProperty('BackendServiceID', this.ServiceID);
		}

		this.PostRequestData.merge(Item);

		this.callService();
	}

	if (this.DstScreenID != null) {

		console.log(this.SourceObject);
		//- set DB primary key attributes to screen object
		this.setDstScreenProperties();

		//- close context menu
		this.ContextMenuObject.close();

		//- clear form field styles
		this.clearFormStyles();

		//- switch screen
		sysFactory.switchScreen(this.DstScreenID);
	}

	// --------------------------------------------------
	// - FIX NEEDED, DOES NOT WORK!
	// --------------------------------------------------
	if (this.InternalFunction != null) {
		if (this.InternalFunction == 'remove' && this.InternalRemoveItemBy == 'RowIndex') {

			//console.log('RowDataIndex:%s DataPointer:%s', this.ContextMenuObject.RowDataIndex, this.SourceObject.DataPointer);

			//- check why RowDataIndex is -1 to ObjectIndex
			this.SourceObject.removeData(this.ContextMenuObject.RowDataIndex-1);
			this.SourceObject.calculatePages();
			this.SourceObject.updateNavigationIndex();
			this.SourceObject.renderPage();

			//- add check for DataPointer decrement (where?) or use iterator
			this.SourceObject.DataPointer--;

			this.ContextMenuObject.close();
		}
	}

	//- fire events
	sysFactory.Reactor.fireEvents(this.FireEvents);

}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------
sysContextMenuItem.prototype.callService = function() {

	if (this.ServiceURL != null && this.ServiceURL !== undefined) {
		RPC = new sysCallXMLRPC(this.ServiceURL);
		RPC.Request(this);
	}

}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysContextMenuItem.prototype.callbackXMLRPCAsync = function() {

	//console.log(this.XMLRPCResultData.error);

	var MsgHandler = sysFactory.sysGlobalAsyncNotifyHandler;
	var XMLRPCStatus = this.XMLRPCResultData.error;
	var NotifyStatus = 'ERROR';

	if (XMLRPCStatus === undefined) {
		NotifyStatus = 'SUCCESS';
	}

	var IndicatorID = this.Notify.ID;
	if (IndicatorID !== undefined) {
		var Message = 'SYS__'+IndicatorID+'__'+NotifyStatus;
		MsgHandler.processMsg(Message);
	}

	this.ContextMenuObject.close();


}


//------------------------------------------------------------------------------
//- METHOD "clearFormStyles"
//------------------------------------------------------------------------------
sysContextMenuItem.prototype.clearFormStyles = function(Event) {
	sysFactory.clearFormStylesByScreenID(this.DstScreenID);
}


//------------------------------------------------------------------------------
//- METHOD "setDstScreenProperties"
//------------------------------------------------------------------------------
sysContextMenuItem.prototype.setDstScreenProperties = function() {

	var DstScreenObject = sysFactory.getScreenByID(this.DstScreenID);

	//- set primary key id/value
	DstScreenObject.DBPrimaryKeyID = this.DBPrimaryKeyID;
	DstScreenObject.DBPrimaryKeyValue = this.DBPrimaryKeyValue;

	//- set source list data (matrix)
	DstScreenObject.SourceObject = this.SourceObject;

	//- process (filtered) row elements
	DstScreenObject.SourceObjectFilter = new Object();

	for (var RowIndex in this.SourceObject.Data) {
		var RowData = this.SourceObject.Data[RowIndex];
		if (RowData[this.DBPrimaryKeyID] == this.DBPrimaryKeyValue) {
			for (Index in this.DstScreenSrcObjFilter) {
				var Column = this.DstScreenSrcObjFilter[Index];
				DstScreenObject.SourceObjectFilter[Column] = RowData[Column];
			}
		}
	}

	//console.log(DstScreenObject.SourceObjectFilter);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysContextMenu"
//------------------------------------------------------------------------------

function sysContextMenu() {

	this.ID			= null;

	this.ItemConfig		= null;
	this.Items		= Object();

	this.pageX		= 0;
	this.pageY		= 0;

	this.ScreenObject	= null;
	this.SourceObject	= null;

	this.DBPrimaryKeyID	= null;
	this.DBPrimaryKeyValue	= null;

	this.RootObject		= new sysObjBaseDiv();	//- Root Object

}

//- inherit sysBaseDOMElement
sysContextMenu.prototype = new sysBaseDOMElement();


//------------------------------------------------------------------------------
//- METHOD "EventListenerClickClose"
//------------------------------------------------------------------------------
sysContextMenu.prototype.EventListenerClickClose = function(Event) {
	//console.log('##### CONTEXT MENU EVENT LISTENER CLICK CLOSE #####');
	this.close();
}


//------------------------------------------------------------------------------
//- METHOD "close"
//------------------------------------------------------------------------------
sysContextMenu.prototype.close = function(Event) {
	this.removeRootElement();
	delete this;
}


//------------------------------------------------------------------------------
//- METHOD "removeRootElement"
//------------------------------------------------------------------------------
sysContextMenu.prototype.removeRootElement = function(Event) {

	var ContextMenuRootElementID = 'ContextMenu' + this.ID;
	var ContextMenuRootObj = this.ScreenObject.RootObject.getObjectByID(ContextMenuRootElementID);

	if (ContextMenuRootObj !== undefined) {
		ContextMenuRootObj.remove();
	}

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysContextMenu.prototype.init = function() {

	//------------------------------------------------------------------------------
	//- remove root object from DOM
	//------------------------------------------------------------------------------

	this.removeRootElement();

	//------------------------------------------------------------------------------
	//- set root object ObjectID
	//------------------------------------------------------------------------------

	this.RootObject.ObjectID = 'ContextMenu' + this.ID;

	//------------------------------------------------------------------------------
	//- setup context menu header
	//------------------------------------------------------------------------------

	//console.log('###### SET CONTEXT MENU ###### x:' + this.pageX + ' y:' + this.pageY);

	this.setupHeader();

	//------------------------------------------------------------------------------
	//- add items, process
	//------------------------------------------------------------------------------

	this.addItems();
	this.processItems();

	//------------------------------------------------------------------------------
	//- add context menu root object to screen root object
	//------------------------------------------------------------------------------
	this.RootObject.addObject(this.TableObj);
	this.ScreenObject.RootObject.addObject(this.RootObject);

	//------------------------------------------------------------------------------
	//- render, process event listener
	//------------------------------------------------------------------------------

	this.RootObject.renderObject();
	this.RootObject.processEventListener();

}


//------------------------------------------------------------------------------
//- METHOD "addItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.addItems = function() {

	var ItemConfig = this.ItemConfig;

	for (ItemKey in ItemConfig) {

		var ProcessItem = ItemConfig[ItemKey];

		var ContextMenuItem = new sysContextMenuItem();

		ContextMenuItem.ID			= ItemKey;

		ContextMenuItem.TextID			= ProcessItem.TextID;
		ContextMenuItem.Icon			= ProcessItem.Icon;

		ContextMenuItem.DstScreenID		= ProcessItem.DstScreenID;
		ContextMenuItem.DstObjectID		= ProcessItem.DstObjectID;
		ContextMenuItem.DstObjectIDs		= ProcessItem.DstObjectIDs;
		ContextMenuItem.DstScreenSrcObjFilter	= ProcessItem.DstScreenSrcObjFilter;

		ContextMenuItem.ServiceURL		= ProcessItem.ServiceURL;
		ContextMenuItem.ServiceID		= ProcessItem.ServiceID;
		ContextMenuItem.Notify			= ProcessItem.Notify;

		ContextMenuItem.UpdateSrcObject		= ProcessItem.UpdateSrcObject;

		ContextMenuItem.FireEvents		= ProcessItem.FireEvents;

		ContextMenuItem.InternalFunction	= ProcessItem.InternalFunction;
		ContextMenuItem.InternalRemoveItemBy	= ProcessItem.InternalRemoveItemBy;

		ContextMenuItem.DBPrimaryKeyID		= this.DBPrimaryKeyID;
		ContextMenuItem.DBPrimaryKeyValue	= this.DBPrimaryKeyValue;

		ContextMenuItem.ScreenObject		= this.ScreenObject;
		ContextMenuItem.SourceObject		= this.SourceObject;

		ContextMenuItem.ContextMenuObject	= this;

		this.Items[ItemKey] = ContextMenuItem;

	}

}


//------------------------------------------------------------------------------
//- METHOD "processItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.processItems = function() {

	var topPosGenerator = this.topPositionGenerator();

	for (ItemKey in this.Items) {

		//console.log('#### ITEM KEY #### Key:' + ItemKey);

		var ItemObj = this.Items[ItemKey];

		//console.log(ItemObj);

		var ItemRowObj = new sysObjBaseDiv();
		ItemRowObj.ObjectID = 'ContextMenuTableItemRow' + ItemObj.ID;
		ItemRowObj.DOMStyle = 'sysContextMenuItemRow';
		ItemRowObj.DOMStyleTop = topPosGenerator.next().value;
		ItemRowObj.EventListeners = Object();

		//- add click event listener
		var EventListenerObj = Object();
		EventListenerObj['Type'] = 'click';
		EventListenerObj['Element'] = ItemObj.EventListenerClick.bind(ItemObj);

		ItemRowObj.EventListeners["ContextMenuItemClick"] = EventListenerObj;

		var ItemColDescrObj = new sysObjBaseDiv();
		ItemColDescrObj.ObjectID = 'ContextMenuTableItemDescription';
		ItemColDescrObj.DOMStyle = 'sysContextMenuItemColDescription';

		var ItemColDescrTextObj = new sysObjSQLText();
		ItemColDescrTextObj.ObjectID = 'ContextMenuTableItemDescriptionText';
		ItemColDescrTextObj.DOMStyle = 'sysContextMenuItemDescriptionText';
		ItemColDescrTextObj.TextID = ItemObj.TextID;
		ItemColDescrTextObj.init();

		ItemColDescrObj.addObject(ItemColDescrTextObj);

		var ItemColIconObj = new sysObjBaseDiv();
		ItemColIconObj.ObjectID = 'ContextMenuItemIcon';
		ItemColIconObj.DOMStyle = 'sysContextMenuItemIcon' + ItemObj.Icon;

		ItemRowObj.addObject(ItemColDescrObj);
		ItemRowObj.addObject(ItemColIconObj);

		this.TableObj.addObject(ItemRowObj);

	}

}


//------------------------------------------------------------------------------
//- METHOD "topPositionGenerator"
//------------------------------------------------------------------------------

sysContextMenu.prototype.topPositionGenerator = function*() {
	topPosition = 16;

	while(true) {
		topPosition += 24;
		yield topPosition.toString() + 'px';
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysContextMenu.prototype.setupHeader = function() {

	this.TableObj = new sysObjBaseDiv();
	this.TableObj.ObjectID = 'ContextMenuTable' + this.ID;
	this.TableObj.DOMStyle = 'sysContextMenuTable';
	this.TableObj.DOMStyleTop = this.pageY.toString() + 'px';
	this.TableObj.DOMStyleLeft = this.pageX.toString() + 'px';

	this.HeaderRowObj = new sysObjBaseDiv();
	this.HeaderRowObj.ObjectID = 'ContextMenuTableHeaderRow';
	this.HeaderRowObj.DOMStyle = 'sysContextMenuHeaderRow';

	this.HeaderColDescrObj = new sysObjBaseDiv();
	this.HeaderColDescrObj.ObjectID = 'ContextMenuTableHeaderDescription';
	this.HeaderColDescrObj.DOMStyle = 'sysContextMenuHeaderColDescription';

	this.HeaderColDescrTextObj = new sysObjSQLText();
	this.HeaderColDescrTextObj.ObjectID = 'ContextMenuTableHeaderDescription';
	this.HeaderColDescrTextObj.DOMStyle = 'sysContextMenuHeaderDescriptionText';
	this.HeaderColDescrTextObj.TextID = 'TXT.SYS.CONTEXTMENU.DISPLAY';
	this.HeaderColDescrTextObj.init();

	this.HeaderColDescrObj.addObject(this.HeaderColDescrTextObj);

	this.HeaderColCloseObj = new sysObjBaseDiv();
	this.HeaderColCloseObj.ObjectID = 'ContextMenuTableHeaderClose';
	this.HeaderColCloseObj.DOMStyle = 'sysContextMenuHeaderColClose';
	this.HeaderColCloseObj.EventListeners = Object();

	//- add close event listener
	var EventListenerObj = Object();
	EventListenerObj['Type'] = 'click';
	EventListenerObj['Element'] = this.EventListenerClickClose.bind(this);

	this.HeaderColCloseObj.EventListeners["ContextMenuClose"] = EventListenerObj;

	this.HeaderRowObj.addObject(this.HeaderColDescrObj);
	this.HeaderRowObj.addObject(this.HeaderColCloseObj);

	this.TableObj.addObject(this.HeaderRowObj);

}
