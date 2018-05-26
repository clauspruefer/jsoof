//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "SQLText"                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSQLText"
//------------------------------------------------------------------------------

function sysObjSQLText() {

	this.ChildObjects	= Object(); //- recursive child items
	this.EventListeners	= Object(); //- event listeners

	this.ContainerObject	= null

	this.Language		= 'de';
	this.TextID		= 'TXT.SYS.OBJECT.DEFAULT.TEXT';

}

//- inherit sysBaseObject
sysObjSQLText.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjSQLText.prototype.init = function() {

	this.ContainerObject = new sysObjBaseDiv();
	this.ContainerObject.ObjectID = 'ContainerDiv';

	this.setTextObj();
	this.setContainerValue();
	this.addObject(this.ContainerObject);

}


//------------------------------------------------------------------------------
//- METHOD "setTextObj"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.setTextObj = function() {
	this.TextObject = sysFactory.ObjText.getTextObjectByID(this.TextID);
}


//------------------------------------------------------------------------------
//- METHOD "setContainerValue"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.setContainerValue = function() {
	//console.log(this.TextID);
	this.ContainerObject.DOMValue = this.TextObject[this.Language];
}


//------------------------------------------------------------------------------
//- METHOD "getText"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.getText = function() {
	return this.TextObject[this.Language];
}


//------------------------------------------------------------------------------
//- METHOD "switchLanguage"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.switchLanguage = function(Language) {
	//- remove element from parent element

	//- set object value to actual language text

	//- add updated element to parent element
}
