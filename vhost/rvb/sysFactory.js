//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Factory                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysFactory() {
	this.Screens	= new Object();		//- Screen Instances (references)
	this.HideLayer	= new sysObjBaseDiv();	//- Hide Layer on z-Axis
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFactory.prototype.init = function() {

	//- --------------------------------------------------------------------------------
	//- setup screen switch hide layer
	//- --------------------------------------------------------------------------------
	this.setupHideLayer();

	//- --------------------------------------------------------------------------------
	//- loop on skeleton, create screen object, add to this.Screens
	//- --------------------------------------------------------------------------------
	//console.log(this.DataSkeleton);

	var SkeletonData = this.DataSkeleton.XMLRPCResultData;

	for(SkeletonKey in SkeletonData) {

		//- add screen object
		ScreenObj = this.addScreen(
			SkeletonKey,
			SkeletonData[SkeletonKey]
		)

		//- setup screen
		ScreenObj.setup();
	}

	//- ------------------------------------------------------
	//- Switch to Default Screen
	//- ------------------------------------------------------
	this.switchScreen(this.DisplayDefaultScreen);

	//- ------------------------------------------------------
	//- render menu
	//- ------------------------------------------------------
	this.ObjMenu.init();

	//----------------------------------------------------------------------------
	//- Raise InitSystem Event
	//----------------------------------------------------------------------------

	sysFactory.Reactor.dispatchEvent('InitSystem');

	//----------------------------------------------------------------------------
	//- Setup Base Divs for User Content
	//----------------------------------------------------------------------------

	new userInitLayerContent();

	//----------------------------------------------------------------------------
	//- Start processing async Messages
	//----------------------------------------------------------------------------

	sysFactory.sysGlobalAsyncNotifyHandler.getMsg();

}


//------------------------------------------------------------------------------
//- METHOD "setupHideLayer"
//------------------------------------------------------------------------------

sysFactory.prototype.setupHideLayer = function()
{

	this.HideLayer.ObjectID = 'sysScreenHideLayer';
	this.HideLayer.DOMStyle = 'sysScreenHideLayer';

	this.HideLayerTable = new sysObjBaseDiv();
	this.HideLayerTable.ObjectID = 'sysScreenHideLayerTable';
	this.HideLayerTable.DOMStyle = 'sysScreenHideLayerTable';

	this.HideLayerTableRow = new sysObjBaseDiv();
	this.HideLayerTableRow.ObjectID = 'sysScreenHideLayerTableRow';
	this.HideLayerTableRow.DOMStyle = 'sysScreenHideLayerTableRow';

	this.HideLayerTable.addObject(this.HideLayerTableRow);

	this.HideLayer.addObject(this.HideLayerTable);

	this.HideLayer.renderObject();

}


//------------------------------------------------------------------------------
//- METHOD "addScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.addScreen = function(ScreenID, SkeletonData) {

	//console.log('addScreen() - ScreenID:' + ScreenID + ' SkeletonData:');

	var ScreenObj = new sysScreen();

	ScreenObj.ScreenID = ScreenID;
	ScreenObj.SkeletonData = SkeletonData;

	this.Screens[ScreenID] = ScreenObj;

	return this.Screens[ScreenID];

}


//------------------------------------------------------------------------------
//- METHOD "getScreens"
//------------------------------------------------------------------------------

sysFactory.prototype.getScreens = function() {
	return this.Screens;
}


//------------------------------------------------------------------------------
//- METHOD "getScreenByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getScreenByID = function(ScreenID) {
	return this.Screens[ScreenID];
}


//------------------------------------------------------------------------------
//- METHOD "getObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectByID = function(ObjectID) {
	for (ScreenID in this.Screens) {
		var ScreenObj = this.Screens[ScreenID];
		var ResultObj = ScreenObj.RootObject.getObjectByID(ObjectID);
		if (ResultObj !== undefined && ResultObj != null) {
			return ResultObj;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "switchScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreen = function(ScreenID) {

	//console.log('#### SWITCH SCREEN #### ScreenID:' + ScreenID + ' ActualScreenID:' + sysFactory.ActualScreenID);
	//console.log(ScreenObj);

	//- if screen is not defined, do nothing
	if (ScreenID !== undefined) {

		//- get screen object by screen id
		var ScreenObj = this.getScreenByID(ScreenID);

		//- switch all screens to background
		this.switchScreensToBackground();

		//- set global ActualScreenID
		sysFactory.ActualScreenID = ScreenID;

		//- trigger dynamic pull down update
		this.processDynPulldown(ScreenObj);

		//- update dynamic form field refs
		this.updateFormItemRefValues(ScreenObj);

		//- switch selected screen to foreground
		this.switchScreenToForeground(ScreenObj);
	}

}


//------------------------------------------------------------------------------
//- METHOD "updateFormItemRefValues"
//------------------------------------------------------------------------------

sysFactory.prototype.updateFormItemRefValues = function(ScreenObj) {

	var Objects = sysFactory.getFormFieldListObjectsByScreenObj(ScreenObj);

	/*
	console.log('### updateFormItemRefValues ###');
	console.log(Objects);
	*/

	for (ObjectKey in Objects) {
		var FormFields = Objects[ObjectKey].ConnectorObject.FormFieldItems;
		for (FormfieldKey in FormFields) {
			FormFields[FormfieldKey].updateRefValue();
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldValueByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldValueByID = function(ScreenID, FormFieldContainer, FormFieldID) {

	var DstScreenObject = sysFactory.getScreenByID(ScreenID);
	var CfgRootObj = DstScreenObject.ConfigRootObject;
	var FormListObjs = CfgRootObj.getObjectsByType('FormFieldList');

	for (ObjKey in FormListObjs) {
		if (ObjKey == FormFieldContainer) {
			var FormFields = FormListObjs[ObjKey].ConnectorObject.FormFieldItems;
			for (FormfieldKey in FormFields) {
				if (FormfieldKey == FormFieldID) {
					return FormFields[FormfieldKey].getDOMValue();
				}
			}
			
		}
	}

	return 'NotFound';
}


//------------------------------------------------------------------------------
//- METHOD "switchScreensToBackground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreensToBackground = function() {

	for (ScreenKey in this.Screens) {
		ScreenObj = this.Screens[ScreenKey];
		ScreenObj.RootObject.setZIndex(-1);
	}

}


//------------------------------------------------------------------------------
//- METHOD "switchScreenToForeground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreenToForeground = function(ScreenObj) {
	ScreenObj.RootObject.setZIndex(1);
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByType"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectsByType = function(ScreenID, Type) {

	var DstScreenObject = sysFactory.getScreenByID(ScreenID);
	var CfgRootObj = DstScreenObject.ConfigRootObject;
	return CfgRootObj.getObjectsByType(Type);

}


//------------------------------------------------------------------------------
//- METHOD "processDynPulldown"
//------------------------------------------------------------------------------

sysFactory.prototype.processDynPulldown = function(ScreenObj) {

	var FormListObjs = ScreenObj.ConfigRootObject.getObjectsByType('FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.processSwitchScreen();
	}

}


//------------------------------------------------------------------------------
//- METHOD "clearFormStylesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.clearFormStylesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	//- validate form fields
	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.clearStyle();
	}

}


//------------------------------------------------------------------------------
//- METHOD "resetFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.resetFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	//- validate form fields
	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.resetFormElementsDefault();
	}

}


//------------------------------------------------------------------------------
//- METHOD "disableFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.disableFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	//- validate form fields
	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.disable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "enableFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.enableFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	//- validate form fields
	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.enable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldListObjectsByScreenObj"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldListObjectsByScreenObj = function(ScreenObject) {

	var CfgRootObject = ScreenObject.ConfigRootObject;
	var FormListObjects = CfgRootObject.getObjectsByType('FormFieldList');

	var ReturnObjects = new Object();

	for (ObjectKey in FormListObjects) {
		ReturnObjects[ObjectKey] = FormListObjects[ObjectKey];
	}

	return ReturnObjects;

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldListObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldListObjectByID = function(ScreenObject, ObjectID) {


	var FormListObjects = this.getFormFieldListObjectsByScreenObj(ScreenObject);

	for (ObjectKey in FormListObjects) {
		if (ObjectKey == ObjectID) {
			return FormListObjects[ObjectKey];
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldObjectByID = function(ObjectID) {
	for (ScreenObjKey in this.Screens) {

		var ScreenObj = this.Screens[ScreenObjKey];
		var FormObjects = this.getFormFieldListObjectsByScreenObj(ScreenObj);

		for (FormListObjKey in FormObjects) {
			var FormListObj = FormObjects[FormListObjKey];
			//console.log(FormListObj);
			var FormFieldObj = FormListObj.RootObject.BaseObject.getFormFieldItemByID(ObjectID);
			if (FormFieldObj !== undefined) { return FormFieldObj; }
		}
			
	}
}
