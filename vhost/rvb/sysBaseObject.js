//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseObject"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseObject"
//------------------------------------------------------------------------------

function sysBaseObject() {

	this.ObjectID		= null;			//- Object ID
	this.ObjectType		= null;			//- Object Type
	this.ParentObject	= null;			//- Parent Object
	this.ChildObjects	= Object();		//- Child Objects

	this.DOMObjectID	= null;			//- DOM Object ID - set recursive
	this.DOMParentID	= null;			//- Parent DOM Object ID - set recursive

}

//- inherit sysBaseDOMElement
sysBaseObject.prototype = new sysBaseDOMElement();


//------------------------------------------------------------------------------
//- METHOD "addObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.addObject = function(ChildObject)
{
	var ObjectID = ChildObject.ObjectID;
	ChildObject.ParentObject = this;
	this.ChildObjects[ObjectID] = ChildObject;
}


//------------------------------------------------------------------------------
//- METHOD "logObjects"
//------------------------------------------------------------------------------

sysBaseObject.prototype.logObjects = function()
{
	//console.log(this);

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.logObjects();
	}
}


//------------------------------------------------------------------------------
//- METHOD "renderObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.renderObject = function(Prefix)
{

	//- set dom object/parent ids
	if (Prefix == null) {
		this.DOMObjectID = this.ObjectID;
	}
	else {
		this.DOMObjectID = Prefix + '_' + this.ObjectID;
		this.DOMParentID = Prefix;
	}

	//- create element, connect to parent element
	this.createDOMElement(this.DOMObjectID);
	this.appendDOMParentElement();

	//- set element value if given
	this.setDOMElementValue();

	//- set element style if given
	this.setDOMElementStyle();

	//- set element style attributes
	this.setDOMElementStyleAttributes();

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.renderObject(this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "processEventListener"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processEventListener = function()
{

	//console.log('### PROCESS EVENT LISTENER ### DOMObjectID:'+this.DOMObjectID)
	if (this.EventListeners != null || this.EventListeners !== undefined) {
		var ListenerKeys = Object.keys(this.EventListeners);

		if (ListenerKeys.length > 0) {
			for (ListenerKey in this.EventListeners) {
				EventListener = this.EventListeners[ListenerKey];
				this.addEventListener(EventListener.Type, EventListener.Element);
			}
		}
	}

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.processEventListener();
	}
}


//------------------------------------------------------------------------------
//- METHOD "deactivateTab"
//------------------------------------------------------------------------------

sysBaseObject.prototype.deactivateTab = function()
{

	if (this.ObjectType == 'Tab') {
		this.deactivate();
	}

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.deactivateTab();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getObjectByID"
//------------------------------------------------------------------------------
sysBaseObject.prototype.getObjectByID = function(ObjectID) {

	var Objects = this.getObjects();
	for (ObjKey in Objects) {
		if (ObjKey == ObjectID) {
			return Objects[ObjKey];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getObjectByType"
//------------------------------------------------------------------------------
sysBaseObject.prototype.getObjectsByType = function(ObjectType) {

	var ResultObjects = Object();

	var Objects = this.getObjects();
	for (ObjKey in Objects) {
		var ObjectItem = Objects[ObjKey];
		if (ObjectItem.ObjectType == ObjectType) {
			ResultObjects[ObjKey] = Objects[ObjKey];
		}
	}

	return ResultObjects;
}


//------------------------------------------------------------------------------
//- METHOD "getObjects"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjects = function()
{

	var Items = Object();

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		RItems = ChildItem.getObjects();
		Items[ChildItem.ObjectID] = ChildItem;
		for (RItemKey in RItems) {
			RItem = RItems[RItemKey];
			Items[RItem.ObjectID] = RItem;
		}
	}

	return Items;
}


//------------------------------------------------------------------------------
//- METHOD "getObjectCount"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectCount = function()
{
	var ObjKeys = Object.keys(this.ChildObjects);
	return ObjKeys.length;
}


//------------------------------------------------------------------------------
//- METHOD "activate"
//------------------------------------------------------------------------------
sysBaseObject.prototype.activate = function()
{
	this.setDOMVisibleState("visible");

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.activate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "deactivate"
//------------------------------------------------------------------------------

sysBaseObject.prototype.deactivate = function()
{
	this.setDOMVisibleState("hidden");

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.deactivate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "toggle"
//------------------------------------------------------------------------------

sysBaseObject.prototype.toggle = function()
{
	this.switchDOMVisibleState();

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.toggle();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setZIndex"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setZIndex = function(ZIndex)
{
	this.DOMStyleZIndex = ZIndex;
	this.setDOMElementStyleAttributes();

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.setZIndex(ZIndex);
	}
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysBaseObject.prototype.remove = function()
{

	if (this.checkDOMElementExists(this.DOMObjectID)) {
		this.removeDOMParentElement()
	}

	var ParentObject = this.ParentObject;
	delete ParentObject.ChildObjects[this.ObjectID];
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectData = function()
{
	return this.RuntimeGetDataFunc();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectDataStringified"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectDataStringified = function()
{
	return JSON.stringify(this.RuntimeGetDataFunc());
}
