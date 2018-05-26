//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FormFieldList"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldList"
//------------------------------------------------------------------------------

function sysFormFieldList() {

	this.FormFieldItems	= Object();			//- Form Field Items
	this.RootObject		= new sysObjBaseDiv();		//- Root Object
	this.PostRequestData	= new sysRequestDataHandler();	//- Post Request Data Handler

}

//- inherit sysBaseObject
sysFormFieldList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.process = function() {

	//- set base table element
	this.RootObject.ObjectID = 'sysFormList' + this.ConfigObject.ObjectID;

	//- set style
	this.Style = this.ConfigObject.Object.Style;
	this.PositionLeft = this.ConfigObject.Object.PositionLeft;
	this.Height = this.ConfigObject.Object.Height;

	this.FormListTableObj = new sysObjBaseDiv();
	this.FormListTableObj.ObjectID = 'sysFormListTable' + this.ConfigObject.ObjectID;
	this.FormListTableObj.DOMStyle = this.Style + 'Table';

	this.setTableStyle();

	//- setup form item objects
	this.setupFormItems();

	//- render form field list
	this.render();

	//- connect objects
	this.RootObject.addObject(this.FormListTableObj);

}


//------------------------------------------------------------------------------
//- METHOD "setTableStyle"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.setTableStyle = function() {

	if (this.PositionLeft != null) {
		this.FormListTableObj.DOMStyleLeft = this.PositionLeft.toString() + 'px';
	}
	if (this.Height != null) {
		this.FormListTableObj.DOMStyleHeight = this.Height.toString() + 'px';
	}

}


//------------------------------------------------------------------------------
//- METHOD "setupFormItems"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.setupFormItems = function() {

	var ChildObjects = this.ConfigObject.ChildObjects;

	for (ObjKey in ChildObjects) {

		var FormConfigObject = ChildObjects[ObjKey];
		var FormItemAttributes = FormConfigObject.Object.Attributes;

		var FormFieldItem = new sysFormFieldItem();

		FormFieldItem.DOMObjectID = this.ConfigObject.ScreenObject.ScreenID + '_' + ObjKey;
		FormFieldItem.ID = ObjKey;

		FormFieldItem.ConfigObject = FormConfigObject;

		FormFieldItem.setAttributes(FormItemAttributes);

		FormFieldItem.setupEvents();

		//- add formfield item to formfield items array
		this.FormFieldItems[ObjKey] = FormFieldItem;

	}

}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.render = function() {

	var FormObjects = this.FormFieldItems;
	var FormStyleTop = 0;

	//- loop on config object
	for (ObjKey in FormObjects) {

		var FormFieldItem = FormObjects[ObjKey];
		var FormStyleTopPixel = FormStyleTop.toString() + 'px';

		var FormListRowObj = new sysObjBaseDiv();
		FormListRowObj.ObjectID = 'sysFormListTableRow' + ObjKey;
		FormListRowObj.DOMStyle = this.Style + 'TableRow';

		var FormListRowObjColDescr = new sysObjBaseDiv();
		FormListRowObjColDescr.ObjectID = 'sysFormListTableColDescr' + ObjKey;
		FormListRowObjColDescr.DOMStyle = this.Style + 'ColDescription';
		FormListRowObjColDescr.DOMStyleTop = FormStyleTopPixel;

		var FormListRowObjColSpacer = new sysObjBaseDiv();
		FormListRowObjColSpacer.ObjectID = 'sysFormListTableColSpacer' + ObjKey;
		FormListRowObjColSpacer.DOMStyle = this.Style + 'ColSpacer';
		FormListRowObjColSpacer.DOMStyleTop = FormStyleTopPixel;

		var FormListRowObjColForm = new sysObjBaseDiv();
		FormListRowObjColForm.ObjectID = 'sysFormListTableColForm' + ObjKey;
		FormListRowObjColForm.DOMStyle = this.Style + 'ColForm';
		FormListRowObjColForm.DOMValue = FormFieldItem.generateHTML();
		FormListRowObjColForm.DOMStyleTop = FormStyleTopPixel;

		//- setup event listener on change
		if (FormFieldItem.OnChange != null) {

			if (FormFieldItem.OnChange == 'UpdateTableRowColObject') {
				var EventListenerObj = new Object();
				EventListenerObj['Type'] = 'change';
				EventListenerObj['Element'] = FormFieldItem.processUpdateTableRowColObject.bind(FormFieldItem);
				FormListRowObjColForm.EventListeners = new Object();
				FormListRowObjColForm.EventListeners['FormFieldOnChange'] = EventListenerObj;
			}
		}

		//- set item dom container id for dynamic pulldown updates
		FormFieldItem.ContainerObject = FormListRowObjColForm;

		var FormDescriptionObj = new sysObjSQLText();
		FormDescriptionObj.ObjectID = 'SQLText';
		FormDescriptionObj.TextID = FormFieldItem.DescriptionTextID;
		FormDescriptionObj.DOMStyle = this.Style + 'Description';
		FormDescriptionObj.init();

		FormListRowObjColDescr.addObject(FormDescriptionObj);

		FormListRowObj.addObject(FormListRowObjColDescr);
		FormListRowObj.addObject(FormListRowObjColSpacer);
		FormListRowObj.addObject(FormListRowObjColForm);

		this.FormListTableObj.addObject(FormListRowObj);

		FormStyleTop += FormFieldItem.Height;

	}

}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.getData = function() {
	RPC = new sysCallXMLRPC(this.DataURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.callbackXMLRPCAsync = function() {
	console.log('FormList XMLRPCResultData:%o', this.XMLRPCResultData);
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.update = function() {

	for (ItemKey in this.FormFieldItems) {

		FormItem = this.FormFieldItems[ItemKey];
		if (FormItem.DBColumn != null) {

			//console.log(this.XMLRPCResultData);
			var RowData = this.XMLRPCResultData[0];
			var DBValue = RowData[FormItem.DBColumn];
			if (DBValue == null) { DBValue = ''; }

			FormItem.Value = DBValue;
			FormItem.updateValue();
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.validate = function() {

	var ValidateStatus = true;

	for (ItemKey in this.FormFieldItems) {

		FormItem = this.FormFieldItems[ItemKey];
		var FormItemValidate = FormItem.validate();

		if (FormItemValidate == false) { ValidateStatus = false; }

	}

	return ValidateStatus;

}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.clearStyle = function() {
	var FormItem;

	//- loop on form field items
	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		FormItem.clearStyle();
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetFormElementsDefault"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.resetFormElementsDefault = function() {
	var FormItem;

	//- loop on form field items
	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		FormItem.updateValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetValidateStatus"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.resetValidateStatus = function() {
	this.ValidateStatus = false;
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.disable = function() {

	var FormItem;

	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		FormItem.disable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.enable = function() {

	var FormItem;

	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		FormItem.enable();
	}
	
}


//------------------------------------------------------------------------------
//- METHOD "switchContainingTab"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.switchContainingTab = function() {

	var FoundObjectType = null;
	var ProcessObject = this.RootObject;

	// ---------------------------------------------------------------------
	// - should be moved to global space
	x=1;
	while (FoundObjectType != 'Tab') {
		FoundObjectType = ProcessObject.ObjectType;
		if (FoundObjectType != 'Tab') {
			ProcessObject = ProcessObject.ParentObject;
		}
		x+=1;
		if (x>1000) { break; }

	}
	// ---------------------------------------------------------------------

	var ScreenObject = this.ConfigObject.ScreenObject;
	var TabContainerID = ProcessObject.ParentObject.ParentObject.ObjectID;
	var TabID = ProcessObject.ObjectID;

	var TabObject = ScreenObject.RootObject.getObjectByID(TabContainerID);

	if (TabObject !== undefined) {
		TabObject.TabContainerObject.switchTab(TabID);
	}

}


//------------------------------------------------------------------------------
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.processSwitchScreen = function() {
	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		FormItem.processSwitchScreen();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemData"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.getFormFieldItemData = function() {

	var ResultData = new Object();

	for (ItemKey in this.FormFieldItems) {
		FormItem = this.getFormFieldItemByID(ItemKey);
		ResultData[FormItem.ID] = FormItem.getObjectData();
	}

	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemByID"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.getFormFieldItemByID = function(ObjectID) {
	return this.FormFieldItems[ObjectID];
}
