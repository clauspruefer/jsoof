//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 -2015                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Dispatcher                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysObjectDispatcher(ConfigObject) {
	this.ConfigObject = ConfigObject;
}


//------------------------------------------------------------------------------
//- METHOD "dispatch"
//------------------------------------------------------------------------------

sysObjectDispatcher.prototype.dispatch = function()
{

	//- if config object is not set, return false
	if (this.ConfigObject.Object == null || this.ConfigObject.Object === undefined) {
		//console.log('Dispatcher Object null or undefined ObjectID:' + this.ConfigObject.ObjectID);
		return false;
	}

	//- container object
	if (this.ConfigObject.Object.Type == 'Container') {
		//console.log('Dispatcher Object Type:Container');
		//console.log(this);
		var ContainerObj = new sysContainer();
		this.setObjectConfigObject(ContainerObj);
		ContainerObj.process();
		return ContainerObj.RootObject;
	}

	//- tab container object
	if (this.ConfigObject.Object.Type == 'TabContainer') {
		//console.log('Dispatcher Object Type:TabContainer');
		//console.log(this);
		var TabContainerObj = new sysTabContainer();
		this.setObjectConfigObject(TabContainerObj);
		TabContainerObj.init();
		return TabContainerObj.RootObject;
	}

	//- sys image object
	if (this.ConfigObject.Object.Type == 'ImageObj') {
		var ImageObj = new sysObjImage();
		this.setObjectConfigObject(ImageObj);
		ImageObj.init();
		return ImageObj.RootObject;
	}

	//- sys sql text obj
	if (this.ConfigObject.Object.Type == 'SQLText') {
		var SQLTextObj = new sysObjSQLText();
		SQLTextObj.ObjectID = this.ObjectID;
		SQLTextObj.TextID = this.ConfigObject.Object.Attributes.TextID;
		SQLTextObj.init();
		return SQLTextObj;
	}

	//- form field list
	if (this.ConfigObject.Object.Type == 'FormFieldList') {
		var FormFieldListObj = new sysFormFieldList();
		this.setObjectConfigObject(FormFieldListObj);
		this.ConfigObject.setServiceConnectorConfig(FormFieldListObj);
		this.ConfigObject.ConnectorObject = FormFieldListObj;
		FormFieldListObj.process();

		FormFieldListObj.RootObject.BaseObject = FormFieldListObj;

		return FormFieldListObj.RootObject;
	}

	//- list
	if (this.ConfigObject.Object.Type == 'List') {
		var ListObj = new sysList();
		this.setObjectConfigObject(ListObj);
		this.ConfigObject.setServiceConnectorConfig(ListObj);
		ListObj.init();
		ListObj.RootObject.BaseObject = ListObj;

		return ListObj.RootObject;
	}

	//- button
	if (this.ConfigObject.Object.Type == 'Button') {
		var ButtonObj = new sysObjButton();
		this.setObjectConfigObject(ButtonObj);
		ButtonObj.init();
		return ButtonObj.RootObject;
	}

	//- button internal
	if (this.ConfigObject.Object.Type == 'ButtonInternal') {
		var ButtonObj = new sysObjButtonInternal();
		this.setObjectConfigObject(ButtonObj);
		ButtonObj.init();
		return ButtonObj.RootObject;
	}

	//- button dst table
	if (this.ConfigObject.Object.Type == 'ButtonResultDstTable') {
		var ButtonObj = new sysObjButtonResultDstTable();
		this.setObjectConfigObject(ButtonObj);
		ButtonObj.init();
		return ButtonObj.RootObject;
	}

	return false;
}


//------------------------------------------------------------------------------
//- METHOD "setObjectConfigObject"
//------------------------------------------------------------------------------

sysObjectDispatcher.prototype.setObjectConfigObject = function(DispatchObject)
{
	DispatchObject.ConfigObject	= this.ConfigObject;
	DispatchObject.Config		= this.ConfigObject.Object;
	DispatchObject.ConfigAttributes	= this.ConfigObject.Object.Attributes;
}
