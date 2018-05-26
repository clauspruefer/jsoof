//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2016                                          -//
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
//- CONSTRUCTOR "sysObjButtonInternal"
//------------------------------------------------------------------------------

function sysObjButtonInternal() {

	this.RootObject		= new sysObjBaseDiv();
	this.ParentObject	= null;

	this.TextID		= null;

	this.FormValidate	= false;

	this.PostRequestData	= new sysRequestDataHandler();

}

//- inherit sysBaseObject
sysObjButtonInternal.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonInternal.prototype.render = sysObjButton.prototype.render;
sysObjButtonInternal.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;
sysObjButtonInternal.prototype.validateForm = sysObjButton.prototype.validateForm;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.EventListenerClick = function(Event) {

	this.PostRequestData.reset();

	//- reset validate result to true
	var ValidateResult = true;

	console.log(this.ConfigAttributes.FormValidate);
	//- validate form fields
	if (this.ConfigAttributes.FormValidate == true) {
		ValidateResult = this.validateForm();
	}

	if (ValidateResult == true) {

		//- copy object data
		if (this.ConfigAttributes.Action == 'copy') {
			this.copyData();
		}
		//- reset list
		if (this.ConfigAttributes.Action == 'reset') {
			var ObjType = this.ConfigAttributes.ActionAttributes.ObjectType;
			if (ObjType !== undefined && ObjType == 'List') {
				this.resetList();
			}
		}

		//- deselect list
		if (this.ConfigAttributes.Action == 'deselect') {
			var ObjType = this.ConfigAttributes.ActionAttributes.ObjectType;
			if (ObjType !== undefined && ObjType == 'List') {
				this.deselectList();
			}
		}

		//- fire events
		sysFactory.Reactor.fireEvents(this.Config.Attributes.FireEvents);

	}

}


//------------------------------------------------------------------------------
//- METHOD "copyData"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.copyData = function() {

	var ScreenObject = sysFactory.getScreenByID(this.ConfigAttributes.SrcScreen);

	if (this.ConfigAttributes.SrcObject !== undefined && this.ConfigAttributes.SrcType == 'List') {
		//console.log(sysFactory.getObjectByID(this.ConfigAttributes.SrcObject));
		var ListObject = sysFactory.getObjectByID(this.ConfigAttributes.SrcObject).BaseObject.RootObject.BaseObject;
		var SrcDataRows = ListObject.getRuntimeData();
		//console.log(SrcDataRows);
	}

	if (this.ConfigAttributes.SrcObject !== undefined && this.ConfigAttributes.SrcType == 'FormFieldList') {

		//console.log(this.ConfigAttributes.SrcObject);

		var FormListObject = sysFactory.getFormFieldListObjectByID(ScreenObject, this.ConfigAttributes.SrcObject).RootObject.BaseObject;

		var SrcDataRow = new Object();

		var SrcObjects = this.ConfigAttributes.SrcObjects;

		for (SrcObjectKey in SrcObjects) {
			var DestinationColumn = SrcObjects[SrcObjectKey];
			//console.log(DestinationColumn);
			var FormFieldItem = FormListObject.getFormFieldItemByID(SrcObjectKey);
			SrcDataRow[DestinationColumn] = FormFieldItem.getRuntimeData();
		}

	}

	if (this.ConfigAttributes.DstObject !== undefined && this.ConfigAttributes.DstType == 'List') {

		var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.DstScreen);
		var ListObj = ScreenObj.RootObject.getObjectByID(this.ConfigAttributes.DstObject).BaseObject;
		var CriterionColumn = this.ConfigAttributes.SrcCriterionColumn;

		//- process src list type
		if (this.ConfigAttributes.SrcType == 'List') {
			for (RowIndex in SrcDataRows) {
				if (CriterionColumn === undefined) {
					ListObj.appendData(SrcDataRows[RowIndex]);
				}
				if (CriterionColumn !== undefined) {
					RowObject = SrcDataRows[RowIndex];
					if (RowObject[CriterionColumn] == "true") {
						ListObj.appendData(RowObject);
					}
				}
			}
		}

		//- process src form field list type
		if (this.ConfigAttributes.SrcType == 'FormFieldList') {
			ListObj.appendData(SrcDataRow);
		}

		//- re render list
		ListObj.rerender();

	}

}


//------------------------------------------------------------------------------
//- METHOD "resetList"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.resetList = function() {
	var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.ActionAttributes.ScreenID);
	ScreenObj.RootObject.getObjectByID(this.ConfigAttributes.ActionAttributes.ObjectID).BaseObject.reset();
}


//------------------------------------------------------------------------------
//- METHOD "deselectList"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.deselectList = function() {
	var ActionAttributes = this.ConfigAttributes.ActionAttributes;
	var ScreenObject = sysFactory.getScreenByID(ActionAttributes.ScreenID);
	var ListObject = ScreenObject.RootObject.getObjectByID(ActionAttributes.ObjectID).BaseObject;
	var ConstraintColumn = ActionAttributes.ConstraintColumn;
	var CheckValue = ActionAttributes.ConstraintCheckValue;
	var SrcDataRows = ListObject.getRuntimeData();

	//console.log(SrcDataRows);

	for (RowIndex in SrcDataRows) {
		//console.log(RowIndex);
		console.log(SrcDataRows[RowIndex]);
		if (SrcDataRows[RowIndex][ConstraintColumn] == CheckValue) {
			ListObject.removeData(RowIndex);
		}
	}

	ListObject.rerender();
	ListObject.reindex();
	console.log(ListObject.Data);
}



//------------------------------------------------------------------------------
//- METHOD "setDstObjectPostRequestData"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.setDstObjectPostRequestData = function() {

	var DstScreen = this.ConfigAttributes.DstScreen;
	var DstObject = this.ConfigAttributes.DstObject;

	if (DstScreen !== undefined && DstObject !== undefined) {
		var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.DstScreen);
		var DestinationObj = ScreenObj.RootObject.getObjectByID(this.ConfigAttributes.DstObject).BaseObject;
		DestinationObj.PostRequestData = this.PostRequestData;
	}

	var DynValues = this.ConfigAttributes.DynamicValues;
	for (ValueKey in DynValues) {
		Value = DynValues[ValueKey];
		DestinationObj.PostRequestData.add(Value, ValueKey);
	}

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.init = function() {
	this.render();
}
