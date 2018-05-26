//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonInternal"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButton"
//------------------------------------------------------------------------------

function sysObjButtonInternalTableRow() {

	this.RootObject		= new sysObjBaseDiv();
	this.SQLTextObj		= new sysObjSQLText();
	this.ParentObject	= null;

}

//- inherit sysBaseObject
sysObjButtonInternalTableRow.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonInternalTableRow.prototype.render = sysObjButton.prototype.render;
sysObjButtonInternalTableRow.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysObjButtonInternalTableRow.prototype.EventListenerClick = function(Event)
{

	if (this.ConfigAttributes.Action == 'copy' && this.ConfigAttributes.ActionDstType == 'list') {

		var valid = false;
		
		if (this.ConfigAttributes.ValidateForm == true && this.RowObj.validateFormItems()) {
			valid = true;
		}
		if (this.ConfigAttributes.ValidateForm === undefined || this.ConfigAttributes.ValidateForm == false) {
			valid = true;
		}

		if (valid) {
			var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.DstScreen);
			var ListObj = ScreenObj.RootObject.getObjectByID(this.ConfigAttributes.DstObject).BaseObject;
			var RowData = this.RowObj.getValues();

			ListObj.appendData(RowData);
			ListObj.calculatePages();
			ListObj.updateNavigationIndex();
			ListObj.renderPage();
		}

	}

	if (this.ConfigAttributes.Action == 'ExternalLink') {

		var ExternalLink = this.ConfigAttributes.ExternalURL;
		var AppendLinkColumn = this.ConfigAttributes.AppendLinkColumn;
		if (AppendLinkColumn !== undefined) {
			ExternalLink += this.RowObj.getValues()[AppendLinkColumn];
		}

		window.open(ExternalLink, '_blank');

	}

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjButtonInternalTableRow.prototype.init = function()
{
	this.RowObj = this.ParentObject.ParentObject;

	this.SQLTextObj.TextID = this.ConfigAttributes.TextID;
	this.SQLTextObj.setTextObj();

	var ButtonDisabled = '';
	var CheckColumn = this.ConfigAttributes.CheckColumnValueNull;

	if (CheckColumn !== undefined && this.RowObj.getValues()[CheckColumn] == null) {
		ButtonDisabled = ' disabled';
	}

	this.RootObject.ObjectID = 'ButtonInternal';
	this.RootObject.DOMValue = '<input type="button" value="'+this.SQLTextObj.getText()+'"'+ButtonDisabled+'>';
	this.RootObject.EventListeners = Object();

	this.addEventListenerClick(this.RootObject);
}


//------------------------------------------------------------------------------
//- METHOD "setAttributes"
//------------------------------------------------------------------------------
sysObjButtonInternalTableRow.prototype.setAttributes = function(Attributes)
{
	this.ConfigAttributes = Attributes;
}
