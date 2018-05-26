//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Image"                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjImage"
//------------------------------------------------------------------------------

function sysObjImage() {
	this.ChildObjects		= Object();		//- recursive child menu items
	this.RootObject			= new sysObjBaseDiv();
}

//- inherit sysBaseObject
sysObjImage.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjImage.prototype.init = function() {
	this.RootObject.DOMStyle = this.Config.Style;
}
