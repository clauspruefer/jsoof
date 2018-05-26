//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "List"                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Global Lists                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysListColItem"
//------------------------------------------------------------------------------

function sysListColItem(ColItem)
{

	this.ColItem		= ColItem;

	this.ID			= null;

	this.ConfigObject	= null;

	this.ParentObject	= null;

	this.FormFieldItem	= null;
	this.ButtonInternal	= null;

}


//------------------------------------------------------------------------------
//- METHOD "setParentObject"
//------------------------------------------------------------------------------
sysListColItem.prototype.setParentObject = function(object)
{
	this.ParentObject = object;
}


//------------------------------------------------------------------------------
//- METHOD "addFormfield"
//------------------------------------------------------------------------------
sysListColItem.prototype.addFormfield = function()
{

	//- setup new formfield item
	this.FormFieldItem = new sysFormFieldItem();

	//- set item attributes
	var ScreenID = this.ParentObject.ScreenObject.ScreenID;
	var FormID = ScreenID + '_' + this.ParentObject.Index + '_' + this.ID;

	this.FormFieldItem.DOMObjectID = FormID;
	this.FormFieldItem.ID = FormID;

	this.FormFieldItem.setAttributes(this.ColItem.FormFieldAttributes);

}


//------------------------------------------------------------------------------
//- METHOD "addButtonInternal"
//------------------------------------------------------------------------------
sysListColItem.prototype.addButtonInternal = function()
{
	this.ButtonInternal = new sysObjButtonInternalTableRow();
	this.ButtonInternal.setAttributes(this.ColItem.ButtonInternalAttributes);
	this.ButtonInternal.ParentObject = this;
	this.ButtonInternal.init();
	this.ConfigObject.addObject(this.ButtonInternal.RootObject);
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------
sysListColItem.prototype.getValue = function()
{
	if (this.FormFieldItem != null && this.FormFieldItem !== undefined) {
		return this.FormFieldItem.getDOMValue();
	}
	else {
		if (this.ColItem.DBPrimaryKeyID !== undefined) {
			return this.ParentObject.DBPrimaryKeyValue;
		}
		else {
			return this.ConfigObject.DOMValue;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------
sysListColItem.prototype.setValue = function(Value)
{
	this.ConfigObject.DOMValue = Value;
}


//------------------------------------------------------------------------------
//- METHOD "validateFormItem"
//------------------------------------------------------------------------------
sysListColItem.prototype.validateFormItem = function()
{
	if (this.FormFieldItem != null && this.FormFieldItem !== undefined) {
		return this.FormFieldItem.validate();
	}
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysListRow"
//------------------------------------------------------------------------------

function sysListRow(ConfigObject)
{

	this.DBPrimaryKeyID	= null;
	this.DBPrimaryKeyValue	= null;

	this.ScreenObject	= null;
	this.SourceObject	= null;

	this.ContextMenuItems	= null;

	this.Index		= null;

	this.SetupData		= null;

	this.ColItems		= new Object();

}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------
sysListRow.prototype.EventListenerRightClick = function(Event)
{
	var ContextMenuItems = this.SourceObject.Config.Attributes.ContextMenuItems;

	//- check for right click on mousedown
	if (Event.button == 2 && ContextMenuItems !== undefined) {

		//console.log('##### EVENT LISTENER ROW RIGHT CLICK ##### DBKeyValue:' + this.DBPrimaryKeyValue);

		var ContextMenu = new sysContextMenu();

		ContextMenu.ID 			= this.SourceObject.ConfigObject.ObjectID;
		ContextMenu.ItemConfig 		= this.ContextMenuItems;
		ContextMenu.ScreenObject 	= this.ScreenObject;
		ContextMenu.SourceObject 	= this.SourceObject;
		ContextMenu.DBPrimaryKeyID 	= this.DBPrimaryKeyID;
		ContextMenu.DBPrimaryKeyValue 	= this.DBPrimaryKeyValue;
		ContextMenu.pageX 		= Event.pageX;
		ContextMenu.pageY 		= Event.pageY;

		ContextMenu.RowData 		= this.getValues();
		ContextMenu.RowDataIndex 	= this.Index;

		ContextMenu.init();
	}

}


//------------------------------------------------------------------------------
//- METHOD "addColumns"
//------------------------------------------------------------------------------
sysListRow.prototype.addColumns = function()
{

	var Columns = this.SourceObject.ConfigAttributes.Columns;
	var ColumnLeftPosition = -2;

	for (ColomnKey in Columns) {

		var ColItem = Columns[ColomnKey];
		var ColDOMValue = '';

		this.ColItems[ColomnKey] = new sysListColItem(ColItem);
		var ColItemObj = this.ColItems[ColomnKey];
		ColItemObj.ID = ColomnKey;

		ColItemObj.setParentObject(this);

		if (ColItem.FormFieldAttributes !== undefined && ColItem.FormFieldAttributes != null) {
			ColItemObj.addFormfield();
			ColDOMValue = ColItemObj.FormFieldItem.generateHTML();
			this.SetupData = null;
		}

		//- set db primary key container
		if (ColItem.DBPrimaryKey == true) {
			this.DBPrimaryKeyID = ColItem.DBPrimaryKeyID;
			this.DBPrimaryKeyValue = this.SetupData[ColItem.DBPrimaryKeyID];
			//console.log('######## SET ROW PRIMARY KEY ######## ID:' + this.DBPrimaryKeyID + ' Value:' + this.DBPrimaryKeyValue);
		}

		if (ColItem.visible != false) {

			var ColObj = new sysObjBaseDiv();

			ColObj.ObjectID = 'ListContentTableCol' + ColomnKey;
			ColObj.DOMStyle = this.SourceObject.Config.Style + 'ContentCol';

			ColObj.DOMStyleLeft = ColumnLeftPosition.toString() + 'px';
			ColObj.DOMStyleWidth = ColItem.Width.toString() + 'px';

			if (this.SetupData != null) {
				ColDOMValue = this.SetupData[ColomnKey];
			}

			ColObj.DOMValue = ColDOMValue;

			ColItemObj.ConfigObject = ColObj;

			this.ConfigObject.addObject(ColObj);

			ColumnLeftPosition += ColItem.Width;

		}

		if (ColItem.visible != true) {
			if (this.SetupData != null) {
				var ColumnValue = this.SetupData[ColomnKey];
				//console.log(ColomnKey);
				if (ColumnValue !== undefined) {
					ColItemObj.Value = ColumnValue;
				}
			}
		}

		if (ColItem.ButtonInternalAttributes !== undefined && ColItem.ButtonInternalAttributes != null) {
			ColItemObj.addButtonInternal();
		}

	}

}


//------------------------------------------------------------------------------
//- METHOD "getValues"
//------------------------------------------------------------------------------
sysListRow.prototype.getValues = function()
{
	var Result = new Object();

	for (ColumnKey in this.ColItems) {
		var ColItemObj = this.ColItems[ColumnKey];
		Result[ColumnKey] = ColItemObj.getValue();
	}

	return Result;

}


//------------------------------------------------------------------------------
//- METHOD "getColObject"
//------------------------------------------------------------------------------
sysListRow.prototype.getColObjectById = function(ColumnID)
{
	return this.ColItems[ColumnID];
}


//------------------------------------------------------------------------------
//- METHOD "validateFormItems"
//------------------------------------------------------------------------------
sysListRow.prototype.validateFormItems = function()
{
	var ValidateStatus = true;

	for (ColumnKey in this.ColItems) {
		var ColItemObj = this.ColItems[ColumnKey];
		var Result = ColItemObj.validateFormItem();
		if (Result == false) { ValidateStatus = false; }
	}

	return ValidateStatus;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysListPage"
//------------------------------------------------------------------------------

function sysListPage()
{
	this.Data = new Object();
}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------
sysListPage.prototype.getData = function()
{
	return this.Data;
}


//------------------------------------------------------------------------------
//- METHOD "addData"
//------------------------------------------------------------------------------
sysListPage.prototype.addData = function(Key, Data)
{
	this.Data[Key] = Data;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysListRow"
//------------------------------------------------------------------------------

function sysListNavItem()
{
	this.PageIndex	= null;
	this.ListObject	= null;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------
sysListNavItem.prototype.EventListenerClick = function(Event)
{
	this.ListObject.NavigatePageIndex(this.PageIndex);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysList"
//------------------------------------------------------------------------------

function sysList()
{

	this.DisplayRows		= 10;				//- Display Row Count

	this.Navigation			= true;				//- Navigation active|inactive
	this.NavigationPosition		= 0				//- Navigation Position

	this.DBRowLock			= false;			//- Database Row Lock
	this.DBBackendUpdates		= false;			//- Backend Triggered Updates

	this.RootObject			= new sysObjBaseDiv();		//- Root Object

	this.DataURL			= null;				//- getData XMLRPC URL
	this.DataURLParams		= '';				//- getData XMLRPC URL Params

	this.RowItems			= new Object();			//- Row Items

	this.RuntimeGetDataFunc		= this.getRuntimeData		//- get Table Data for Service Call

	this.PostRequestData		= new sysRequestDataHandler();	//- Request Data Handler

	this.Data			= new Object();			//- Data Object
	this.DataPointer		= 1;				//- Data Object Index

	this.NavPageIndex		= 0;				//- Selected Page/Navigation Index
	this.NavRowPointer		= 0;				//- Navigation Generation Row Pointer Increment
	this.NavPageEnd			= null;				//- Last Navigation Page
	this.NavOrderColumn		= null;				//- Selected OrderBy Column
	this.NavOrderMethod		= null;				//- OrderBy Method (ASC | DESC)

	this.Pages			= new Object();			//- Page Container

}

//- inherit sysBaseObject
sysList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "appendData"
//------------------------------------------------------------------------------

sysList.prototype.appendData = function(DataObj)
{

	//console.log('List appenData:%o DataPointer:%i', DataObj, this.DataPointer);
	this.Data[this.DataPointer.toString()] = DataObj;
	this.DataPointer++;
	//console.log('Data:%o DataPointer:%d', this.Data, this.DataPointer);

}


//------------------------------------------------------------------------------
//- METHOD "removeData"
//------------------------------------------------------------------------------

sysList.prototype.removeData = function(Index)
{
	//console.log('Before remove. Index:%s Data:%o', Index, this.Data);
	console.log('Deleting index:%d', Index);
	delete this.Data[Index.toString()];
	//console.log('After remove. Data:%o', this.Data);

}


//------------------------------------------------------------------------------
//- METHOD "reindex"
//------------------------------------------------------------------------------

sysList.prototype.reindex = function()
{
	
	var CopyData = this.Data;

	delete this.Data;
	this.Data = new Object();

	var NewIndex = 1;
	for (OldIndex in CopyData) {
		this.Data[NewIndex] = CopyData[OldIndex];
		NewIndex++;
	}

	this.DataPointer = NewIndex;

	if (NewIndex == 1) {
		this.reset();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysList.prototype.getData = function()
{
	RPC = new sysCallXMLRPC(this.DataURL, this.DataURLParams);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysList.prototype.callbackXMLRPCAsync = function()
{
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysList.prototype.update = function()
{
	this.resetData();
	this.setUpdateResult();
	this.rerender();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysList.prototype.reset = function()
{
	this.resetData();
	this.rerender();
}


//------------------------------------------------------------------------------
//- METHOD "rerender"
//------------------------------------------------------------------------------

sysList.prototype.rerender = function()
{
	this.calculatePages();
	this.updateNavigationIndex();
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysList.prototype.init = function()
{
	//----------------------------------------------------------------------
	//- set default values
	//----------------------------------------------------------------------

	if (this.ConfigAttributes.RowCount != null && this.ConfigAttributes.RowCount !== undefined) {
		this.DisplayRows = this.ConfigAttributes.RowCount;
	}
	
	//----------------------------------------------------------------------
	//- reset position generators
	//----------------------------------------------------------------------

	this.resetPositionGenerators();

	//----------------------------------------------------------------------
	//- set root object attributes
	//----------------------------------------------------------------------

	this.RootObject.ObjectID = 'ListRoot' + this.ConfigObject.ObjectID;

	this.setupHeader();
	this.setupNavigation();

	this.ResultContainerObj = new sysObjBaseDiv();
	this.ResultContainerObj.ObjectID = 'ListContentTable' + this.ConfigObject.ObjectID;
	this.ResultContainerObj.DOMStyle = this.Config.Style + 'ContentTable';

	this.IndexContainerObj = new sysObjBaseDiv();
	this.IndexContainerObj.ObjectID = 'ListIndexContainer' + this.ConfigObject.ObjectID;
	this.IndexContainerObj.DOMStyle = this.Config.Style + 'IndexContainer';

	this.RootObject.addObject(this.ResultContainerObj);
	this.RootObject.addObject(this.TableHeaderObj);
	this.RootObject.addObject(this.NavObjLeft);
	this.RootObject.addObject(this.NavObjRight);
	this.RootObject.addObject(this.IndexContainerObj);

	//----------------------------------------------------------------------
	//- check for single row container table type
	//----------------------------------------------------------------------

	if (this.Config.SubType == 'SingleRowContainer') {
		this.addRow(null);
	}

}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysList.prototype.setupHeader = function()
{
	this.TableHeaderObj = new sysObjBaseDiv();
	this.TableHeaderObj.ObjectID = 'ListHeaderTable';
	this.TableHeaderObj.DOMStyle = this.Config.Style + 'HeaderTable';

	this.TableHeaderRowObj = new sysObjBaseDiv();
	this.TableHeaderRowObj.ObjectID = 'ListHeaderTableRow';
	this.TableHeaderRowObj.DOMStyle = this.Config.Style + 'HeaderTableRow';

	var Columns = this.ConfigAttributes.Columns;
	var ColumnLeftPosition = 0;

	for (ColomnKey in Columns) {

		ColItem = Columns[ColomnKey];

		if (ColItem.visible != false) {

			var ColObj = new sysObjBaseDiv();

			ColObj.ObjectID = 'ListHeaderTableCol' + ColomnKey;
			ColObj.DOMStyle = this.Config.Style + 'HeaderCol';
			ColObj.DOMStyleLeft = ColumnLeftPosition.toString() + 'px';

			var ColDisplayObj = new sysObjSQLText();
			ColDisplayObj.ObjectID = 'ListHeaderDisplayText';
			ColDisplayObj.TextID = ColItem.HeaderTextID;
			//console.log(ColItem.HeaderTextID);
			ColDisplayObj.init();

			ColObj.addObject(ColDisplayObj);

			this.TableHeaderRowObj.addObject(ColObj);

			ColumnLeftPosition += ColItem.Width;

		}

	}

	this.TableHeaderObj.addObject(this.TableHeaderRowObj);

}


//------------------------------------------------------------------------------
//- METHOD "setupNavigation"
//------------------------------------------------------------------------------

sysList.prototype.setupNavigation = function()
{

	this.NavObjLeft = new sysObjBaseDiv();
	this.NavObjLeft.ObjectID = 'TableNavLeft';
	this.NavObjLeft.DOMStyle = this.Config.Style + 'TableNavLeft';
	this.NavObjLeft.EventListeners = new Object();

	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'click';
	EventListenerObj['Element'] = this.navigatePageLeft.bind(this);

	this.NavObjLeft.EventListeners['NavLeftClick'] = EventListenerObj;

	this.NavObjRight = new sysObjBaseDiv();
	this.NavObjRight.ObjectID = 'TableNavRight';
	this.NavObjRight.DOMStyle = this.Config.Style + 'TableNavRight';
	this.NavObjRight.EventListeners = new Object();

	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'click';
	EventListenerObj['Element'] = this.navigatePageRight.bind(this);

	this.NavObjRight.EventListeners['NavRightClick'] = EventListenerObj;

	if (this.Config.Attributes.Navigation.Type != 'None') {
		this.NavObjLeft.DOMValue = '<<';
		this.NavObjRight.DOMValue = '>>';
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetData"
//------------------------------------------------------------------------------

sysList.prototype.resetData = function()
{
	delete this.Data;
	this.Data = new Object();
	
	this.DataPointer = 1;

	delete this.Pages;
	this.Pages = new Object();

	this.NavPageIndex = 0;
}


//------------------------------------------------------------------------------
//- METHOD "updateNavigationIndex"
//------------------------------------------------------------------------------

sysList.prototype.updateNavigationIndex = function()
{
	if (this.Config.Attributes.Navigation.Type != 'None') {

		this.IndexPosition = this.IndexElementPositionGenerator();

		this.IndexContainerObj.removeDOMParentElement();
		this.IndexContainerObj.DOMValue = '';

		delete this.IndexContainerObj.ChildObjects;
		this.IndexContainerObj.ChildObjects = new Object();

		for (PageIndex in this.Pages) {

			var IndexBaseObj = new sysObjBaseDiv();
			var LeftPosition = this.IndexPosition.next().value;

			//console.log(LeftPosition);

			IndexBaseObj.ObjectID = 'Index' + PageIndex + this.ConfigObject.ObjectID;
			IndexBaseObj.DOMStyle = this.Config.Style + 'IndexElement';
			IndexBaseObj.DOMStyleLeft = LeftPosition;
			IndexBaseObj.DOMValue = PageIndex;

			IndexBaseObj.EventListeners = new Object();

			var NavObject = new sysListNavItem();
			NavObject.PageIndex = PageIndex;
			NavObject.ListObject = this; 

			var EventListenerObj = Object();
			EventListenerObj['Type'] = 'click';
			EventListenerObj['Element'] = NavObject.EventListenerClick.bind(NavObject);

			IndexBaseObj.EventListeners["NavigateIndex"] = EventListenerObj;

			//console.log(IndexBaseObj);

			this.IndexContainerObj.addObject(IndexBaseObj);
		}

		this.IndexContainerObj.renderObject();
		this.IndexContainerObj.processEventListener();

	}

}


//------------------------------------------------------------------------------
//- METHOD "IndexElementPositionGenerator"
//------------------------------------------------------------------------------

sysList.prototype.IndexElementPositionGenerator = function*()
{
	var LeftPosition = -40;

	while(true) {
		LeftPosition += 40;
		yield LeftPosition.toString() + 'px';
	}
}


//------------------------------------------------------------------------------
//- METHOD "navigatePageLeft"
//------------------------------------------------------------------------------
sysList.prototype.navigatePageLeft = function()
{
	//console.log('Nav Left');
	if (this.NavPageIndex > 0) {
		this.NavPageIndex--;
		this.renderPage();
	}
}


//------------------------------------------------------------------------------
//- METHOD "navigatePageRight"
//------------------------------------------------------------------------------
sysList.prototype.navigatePageRight = function()
{
	//console.log('Nav Right NavPageIndex:%s NavPageEnd:%s', this.NavPageIndex, this.NavPageEnd);
	if (this.NavPageIndex < this.NavPageEnd) {
		this.NavPageIndex++;
		this.renderPage();
	}
}


//------------------------------------------------------------------------------
//- METHOD "navigatePageIndex"
//------------------------------------------------------------------------------
sysList.prototype.NavigatePageIndex = function(Index)
{
	//console.log(Index);
	this.NavPageIndex = Index;
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "setUpdateResult"
//------------------------------------------------------------------------------
sysList.prototype.setUpdateResult = function()
{

	for (ResultKey in this.XMLRPCResultData) {
		var DataItemIndex = this.DataIndex.next().value;
		this.Data[DataItemIndex] = this.XMLRPCResultData[ResultKey];
	}

}


//------------------------------------------------------------------------------
//- METHOD "calculatePages"
//------------------------------------------------------------------------------

sysList.prototype.calculatePages = function()
{
	switch (this.Config.Attributes.Navigation.Type) {

		case "Page.Index":
			this.calculatePagesIndex();
			break;

		case "Column.Grouped":
			this.calculatePagesGrouped();
			break;

		case "None":
			this.calculatePagesSingle();
			break;

	}
}


//------------------------------------------------------------------------------
//- METHOD "calculatePagesGrouped"
//------------------------------------------------------------------------------

sysList.prototype.calculatePagesGrouped = function()
{
	var GroupedCompareValue = '<NULL>';

	var PagePointer = -1;
	for (ResultKey in this.Data) {

		var GroupedColumn = this.Config.Attributes.Navigation.GroupedColumn;
		var ProcessValue = this.Data[ResultKey];

		console.log('PagePointer:%s', PagePointer);

		if (ProcessValue[GroupedColumn] != GroupedCompareValue[GroupedColumn]) {
			PagePointer++;
			//console.log('New Page Object PagePointer:%s', PagePointer);
			this.Pages[PagePointer] = new sysListPage();
			//console.log(this.Pages);
		}

		//console.log('Add Page Data PagePointer:%s Key:%s Data:', PagePointer, ResultKey, this.Data[ResultKey]);
		this.Pages[PagePointer].addData(ResultKey, this.Data[ResultKey]);

		GroupedCompareValue = this.Data[ResultKey];
	}

	this.NavPageEnd = PagePointer;
}


//------------------------------------------------------------------------------
//- METHOD "calculatePagesIndex"
//------------------------------------------------------------------------------

sysList.prototype.calculatePagesIndex = function()
{
	this.NavRowPointer = 0;

	var PagePointer = 0;
	for (ResultKey in this.Data) {

		//console.log('NavRowPointer:%s PagePointer:%s', this.NavRowPointer, PagePointer);

		if (this.NavRowPointer == 0) {
			//console.log('New Page Object NavRowPointer:%s PagePointer:%s', this.NavRowPointer, PagePointer);
			this.Pages[PagePointer] = new sysListPage();
		}

		this.Pages[PagePointer].addData(ResultKey, this.Data[ResultKey]);

		if (this.NavRowPointer == (this.DisplayRows-1)) {
			this.NavRowPointer = -1;
			PagePointer++;
		}

		this.NavRowPointer++;
	}

	this.NavPageEnd = PagePointer;
}


//------------------------------------------------------------------------------
//- METHOD "calculatePagesSingle"
//------------------------------------------------------------------------------

sysList.prototype.calculatePagesSingle = function()
{
	this.Pages[0] = new sysListPage();

	var MaxRows = this.Config.Attributes.Navigation.MaxRows;

	var Counter = 0;
	for (ResultKey in this.Data) {
		if (MaxRows !== undefined && Counter <= MaxRows) {
			this.Pages[0].addData(ResultKey, this.Data[ResultKey]);
		}
		else {
			break;
		}
		Counter++;
	}

	this.NavPageEnd = 0;
}


//------------------------------------------------------------------------------
//- METHOD "renderPage"
//------------------------------------------------------------------------------

sysList.prototype.renderPage = function()
{
	//- reset position generators
	this.resetPositionGenerators();

	//- remove rows (reset)
	delete this.RowItems;
	this.RowItems = new Object();

	//- reset child DOM objects (rows)
	delete this.ResultContainerObj.ChildObjects;
	this.ResultContainerObj.ChildObjects = new Object();

	//- remove parent dom element
	this.ResultContainerObj.removeDOMParentElement();
	this.ResultContainerObj.DOMValue = '';

	//- get page
	var Page = this.Pages[this.NavPageIndex];

	if (Page !== undefined) {

		var Data = Page.getData();

		for (ResultKey in Data) {
			this.addRow(Data[ResultKey]);
		}

	}

	this.ResultContainerObj.renderObject();
	this.ResultContainerObj.processEventListener();

	this.updateRefFormItems();
}


//------------------------------------------------------------------------------
//- METHOD "updateRefFormItems"
//------------------------------------------------------------------------------

sysList.prototype.updateRefFormItems = function()
{
	var FormFields = this.Config.Attributes.Navigation.UpdateFormFields;

	if (FormFields !== undefined) {

		for (ElementKey in FormFields) {

			var ElementValue = FormFields[ElementKey];
			var FormFieldItem = sysFactory.getFormFieldObjectByID(ElementKey);

			var ColumnValue = this.RowItems[1].ColItems[ElementValue].Value;

			FormFieldItem.Value = ColumnValue;
			FormFieldItem.updateValue();
		}

	}
}


//------------------------------------------------------------------------------
//- METHOD "resetPositionGenerators"
//------------------------------------------------------------------------------

sysList.prototype.resetPositionGenerators = function()
{
	this.topPosition	= this.topPositionGenerator();
	this.RowIndex		= this.rowIndexGenerator();
	this.DataIndex		= this.DataIndexGenerator();
}


//------------------------------------------------------------------------------
//- METHOD "addRow"
//------------------------------------------------------------------------------

sysList.prototype.addRow = function(SetupData)
{
	//console.log('##### TABLE ADD ROW ##### ObjectID:' + this.ConfigObject.ObjectID);

	//- setup new row object
	var RowObj = new sysListRow();

	RowObj.ContextMenuItems = this.ConfigAttributes.ContextMenuItems;
	RowObj.ScreenObject = this.ConfigObject.ScreenObject;
	RowObj.SourceObject = this;
	RowObj.SetupData = SetupData;

	RowObj.Index = this.RowIndex.next().value;

	var RowTopPosition = this.topPosition.next().value;

	RowObj.ConfigObject = new sysObjBaseDiv();

	RowObj.ConfigObject.ObjectID = 'ListContentTableRow' + RowTopPosition;
	RowObj.ConfigObject.DOMStyle = this.Config.Style + 'ContentTableRow';
	RowObj.ConfigObject.DOMStyleTop = RowTopPosition;
	RowObj.ConfigObject.EventListeners = new Object();

	//- add event listener to row element
	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = RowObj.EventListenerRightClick.bind(RowObj);

	RowObj.ConfigObject.EventListeners["ContextMenuOpen"] = EventListenerObj;

	//- add columns
	RowObj.addColumns();

	this.ResultContainerObj.addObject(RowObj.ConfigObject);

	this.RowItems[RowObj.Index] = RowObj;

}


//------------------------------------------------------------------------------
//- METHOD "getRowByIndex"
//------------------------------------------------------------------------------

sysList.prototype.getRowByIndex = function(Index)
{
	return this.RowItems[Index];
}


//------------------------------------------------------------------------------
//- METHOD "topPositionGenerator"
//------------------------------------------------------------------------------

sysList.prototype.topPositionGenerator = function*()
{
	var topPosition = -26;

	while(true) {
		topPosition += 26;
		yield topPosition.toString() + 'px';
	}
}


//------------------------------------------------------------------------------
//- METHOD "rowIndexGenerator"
//------------------------------------------------------------------------------

sysList.prototype.rowIndexGenerator = function*()
{
	var Index = 0;

	while(true) {
		Index += 1;
		yield Index;
	}
}


//------------------------------------------------------------------------------
//- METHOD "DataIndexGenerator"
//------------------------------------------------------------------------------

sysList.prototype.DataIndexGenerator = function*()
{
	var Index = -1;

	while(true) {
		Index += 1;
		yield Index;
	}
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysList.prototype.getRuntimeData = function()
{
	var Result = new Object();

	for (Index in this.RowItems) {
		Result[Index] = this.RowItems[Index].getValues();
	}

	return Result;
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeColObjects"
//------------------------------------------------------------------------------

sysList.prototype.getRuntimeColObjects = function(ColumnID)
{
	var Result = new Object();

	for (Index in this.RowItems) {
		Result[Index] = this.RowItems[Index].getColObjectById(ColumnID);
	}

	return Result;
}


//------------------------------------------------------------------------------
//- METHOD "setColumnValue"
//------------------------------------------------------------------------------

sysList.prototype.setColumnValue = function(RowIndex, ColumnID, Value)
{
	var ColItem = this.RowItems[RowIndex].ColItems[ColumnID];
	ColItem.setValue(Value);
}
