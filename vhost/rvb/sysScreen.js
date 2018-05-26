//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Screen" Object                                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Screen Object                                                            -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreenConfigObj"
//------------------------------------------------------------------------------

function sysScreenConfigObj() {

	this.ObjectID			= null;			//- Object ID
	this.ObjectType			= null;			//- Object Type

	this.RefID			= null;			//- Parent Item ID
	this.ElementID			= null;			//- Connector Element ID (Parent Object ID)
	this.Level			= null;			//- Hierarchy Level
	this.Object			= null;			//- JSON Object Configuration

	this.ChildObjects		= Object(); 		//- Recursive Child Config Objects

	this.RootObject			= new sysObjBaseDiv();	//- Base Element
	this.RootObject.ObjectID	= 'Dummy';		//- Default Base Element Object ID

	this.ConfigRootObject		= null;			//- Config root Object Reference
	this.ScreenObject		= null;			//- Screen Object Reference

	this.ServiceConnector		= null;			//- ServiceConnector Configuration/Update Object

}


//- inherit sysBaseObject
sysScreenConfigObj.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "createSysObject"
//------------------------------------------------------------------------------
sysScreenConfigObj.prototype.createSysObject = function() {

	//console.log('createSysObject() ObjectID:' + this.ObjectID + ' RefID:' + this.RefID);

	//- call object dispatcher
	var Dispatcher = new sysObjectDispatcher(this);
	var DispatcherResult = Dispatcher.dispatch();

	if (DispatcherResult != false) {
		this.RootObject = DispatcherResult;
	}

	//- set root object default attributes
	if (this.Object != null) {
		this.RootObject.ObjectID	= this.ObjectID;
		this.RootObject.ObjectType	= this.Object.Type;
	}

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.createSysObject();
	}

}


//------------------------------------------------------------------------------
//- METHOD "connectSysObject"
//------------------------------------------------------------------------------
sysScreenConfigObj.prototype.connectSysObject = function() {

	//console.log('connectSysObject() ObjectID:' + this.ObjectID);
	//console.log(this);

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.connectSysObject();

		//- if container element id given
		if (ChildItem.ElementID != null) {
			//console.log('#### connect with object id ####');
			//console.log('ChildItem ElementID:' + ChildItem.ElementID);
			//console.log(this.RootObject);
			var ParentObject = this.RootObject.getObjectByID(ChildItem.ElementID);
			//console.log(ParentObject);
			ParentObject.addObject(ChildItem.RootObject);
		}
		else {
			this.RootObject.addObject(ChildItem.RootObject);
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "logSysObject"
//------------------------------------------------------------------------------
sysScreenConfigObj.prototype.logSysObject = function() {

	//console.log('#### LOG SYS OBJECT #### ObjectID:' + this.ObjectID);
	//console.log(this);

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.logSysObject();
	}

}


//------------------------------------------------------------------------------
//- METHOD "setServiceConnectorConfig"
//------------------------------------------------------------------------------
sysScreenConfigObj.prototype.setServiceConnectorConfig = function(UpdateObject) {

	var RefObj = this.ConfigRootObject.getObjectByID(this.RefID);

	if (RefObj !== undefined) {

		var RefObjType = RefObj.Object.Type;
		if (RefObjType == "ServiceConnector") {

			this.ServiceConnector = new ServiceConnector();
			this.ServiceConnector.Attributes = RefObj.Object.Attributes;
			this.ServiceConnector.UpdateObject = UpdateObject;

			sysFactory.Reactor.registerEvent(this.ServiceConnector.Attributes, this);

		}
	}

}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreen"
//------------------------------------------------------------------------------

function sysScreen() {

	//- DOM z-index
	this.ScreenID		= null;				//- ScreenID
	this.zIndex		= null;				//- Layer z-axis position

	this.DBPrimaryKeyID	= null;				//- DB Primary Key Identifier
	this.DBPrimaryKeyValue	= null;				//- DB Primary Key Value

	//- plain config objects
	this.SkeletonData	= null;				//- JSON Skeleton Data (configuration)

	//- config objects recursive
	this.ConfigRootObject	= new sysScreenConfigObj();	//- Screen Config Object (Item)

	//- system objects recursive
	this.RootObject		= new sysObjBaseDiv();		//- Screen Root Object

}


//------------------------------------------------------------------------------
//- METHOD "setup"
//------------------------------------------------------------------------------

sysScreen.prototype.setup = function() {

	//- set root object base name including screenid (unique)
	var RootObjName = this.ScreenID + 'Root';
	this.RootObject.ObjectID = RootObjName;

	//- construct config objects from skeleton/object json
	this.ConfigRootObject.ObjectID = 'Root';
	this.ConfigRootObject.RootObject = this.RootObject;
	this.addConfigObjectsRecursive('Root', this.ConfigRootObject);

	//- recursive generate/dispatch system objects
	this.ConfigRootObject.createSysObject();

	//- recursive "connect" generated objects
	this.ConfigRootObject.connectSysObject();

	//- render screen root object
	this.RootObject.renderObject();

	//- process event listeners
	this.RootObject.processEventListener();

	//- deactivate non default tabs
	this.RootObject.deactivateTab();

	//console.log('sysScreen.setup() RootObject:%o', this.RootObject);

}


//------------------------------------------------------------------------------
//- METHOD "addConfigObjectsRecursive"
//------------------------------------------------------------------------------

sysScreen.prototype.addConfigObjectsRecursive = function(ObjectID, Object, HierarchyLevel=0) {

	var ConfigObjects = this.getRefConfigObjectsByObjectId(ObjectID);

	for (ObjectKey in ConfigObjects) {

		var ObjectItem = ConfigObjects[ObjectKey];
		var AddConfigObj = new sysScreenConfigObj();

		console.log(ObjectKey);

		AddConfigObj.Object		= sysFactory.DataObject.XMLRPCResultData[ObjectKey];

		AddConfigObj.ObjectID		= ObjectKey;
		AddConfigObj.ObjectType		= AddConfigObj.Object.Type;

		AddConfigObj.RefID		= ObjectItem.RefID;
		AddConfigObj.ElementID		= ObjectItem.ElementID;
		AddConfigObj.Level		= HierarchyLevel;
		AddConfigObj.ConfigRootObject 	= this.ConfigRootObject;
		AddConfigObj.ScreenObject 	= this;

		Object.addObject(AddConfigObj);

		HierarchyLevel +=1;
		this.addConfigObjectsRecursive(ObjectKey, AddConfigObj, HierarchyLevel);
		HierarchyLevel -=1;

	}

}


//------------------------------------------------------------------------------
//- METHOD "getRefMenuItemsByItemId"
//------------------------------------------------------------------------------

sysScreen.prototype.getRefConfigObjectsByObjectId = function(ObjectId) {
	var RefObjects = new Object();

	for (ObjectKey in this.SkeletonData) {
		var ProcessObj = this.SkeletonData[ObjectKey];
		if (ProcessObj.RefID == ObjectId) {
			RefObjects[ObjectKey] = ProcessObj;
		}
	}

	return RefObjects;
}
