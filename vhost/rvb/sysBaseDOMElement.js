//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseDOMElement"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseDOMElement"
//------------------------------------------------------------------------------

function sysBaseDOMElement()
{

	this.DOMDivElement	= null;

	this.DOMValue		= null;
	this.DOMStyle		= null;

	this.DOMStyleTop	= null;
	this.DOMStyleLeft	= null;
	this.DOMStyleWidth	= null;
	this.DOMStyleHeight	= null;
	this.DOMStyleZIndex	= null;

}


//------------------------------------------------------------------------------
//- METHOD "createDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.createDOMElement = function()
{
	var divElement = document.createElement('div');
	divElement.setAttribute('id', this.DOMObjectID);
	this.DOMDivElement = divElement;
}


//------------------------------------------------------------------------------
//- METHOD "appendDOMParentElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.appendDOMParentElement = function()
{
	if (this.DOMParentID == null || this.DOMParentID === undefined) {
		document.body.appendChild(this.DOMDivElement);
	}
	else {
		var parentElement = document.getElementById(this.DOMParentID);
		parentElement.appendChild(this.DOMDivElement);
	}
}


//------------------------------------------------------------------------------
//- METHOD "removeDOMParentElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.removeDOMParentElement = function()
{
	if (this.DOMParentID == null || this.DOMParentID === undefined) {
		document.body.removeChild(this.DOMDivElement);
	}
	else {
		var parentElement = document.getElementById(this.DOMParentID);
		parentElement.removeChild(this.DOMDivElement);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementValue"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementValue = function()
{
	if (this.DOMValue != null) {
		var divElement = document.getElementById(this.DOMObjectID);
		divElement.innerHTML = this.DOMValue;
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementStyle = function()
{
	if (this.DOMStyle != null) {
		var divElement = document.getElementById(this.DOMObjectID);
		divElement.setAttribute('class', this.DOMStyle);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementStyleAttributes"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementStyleAttributes = function()
{

	var divElement = document.getElementById(this.DOMObjectID);

	if (this.DOMStyleTop != null) {		divElement.style.top		= this.DOMStyleTop; }
	if (this.DOMStyleLeft != null) {	divElement.style.left		= this.DOMStyleLeft; }
	if (this.DOMStyleWidth != null) {	divElement.style.width		= this.DOMStyleWidth; }
	if (this.DOMStyleHeight != null) {	divElement.style.height		= this.DOMStyleHeight; }
	if (this.DOMStylePaddingLeft != null) {	divElement.style.paddingLeft	= this.DOMStylePaddingLeft; }
	if (this.DOMStyleZIndex != null) {	divElement.style.zIndex		= this.DOMStyleZIndex; }

}


//------------------------------------------------------------------------------
//- METHOD "addDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.addDOMElementStyle = function(StyleClass)
{
	var divElement = document.getElementById(this.DOMObjectID);
	divElement.classList.add('class', StyleClass);
}


//------------------------------------------------------------------------------
//- METHOD "removeDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.removeDOMElementStyle = function(StyleClass)
{
	var divElement = document.getElementById(this.DOMObjectID);

	if (divElement.classList.contains(StyleClass)) {
		divElement.classList.remove(StyleClass);
	}
}


//------------------------------------------------------------------------------
//- METHOD "checkDOMHasStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.checkDOMHasStyle = function(StyleClass)
{
	var divElement = document.getElementById(this.DOMObjectID);

	var containsStyle = (divElement.classList.contains(StyleClass)) ? true:false;
	return containsStyle;

}


//------------------------------------------------------------------------------
//- METHOD "checkDOMElementExists"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.checkDOMElementExists = function(ElementID)
{
	var divElement = document.getElementById(ElementID);
	if (divElement == null || divElement === undefined) { return false; }
	else { return true; }
}


//------------------------------------------------------------------------------
//- METHOD "setDOMVisibleState"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMVisibleState = function(VisibleState)
{
	//console.log('VisibleState: ' + VisibleState);
	if (VisibleState == "visible" || VisibleState == "hidden") {
		document.getElementById(this.DOMObjectID).style.visibility = VisibleState;
	}
	else {
		console.log("wrong visible style given");
	}

}


//------------------------------------------------------------------------------
//- METHOD "switchDOMVisibleState"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.switchDOMVisibleState = function()
{
	var VisibleState = document.getElementById(this.DOMObjectID).style.visibility;
	//console.log('VisibleState:' + VisibleState);
	if (VisibleState == "hidden") {
		this.setDOMVisibleState("visible");
	}
	if (VisibleState == '' || VisibleState == 'visible') {
		this.setDOMVisibleState("hidden");
	}
}


//------------------------------------------------------------------------------
//- METHOD "enableDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.enableDOMElement = function()
{
	document.getElementById(this.DOMObjectID).disabled = false;
}


//------------------------------------------------------------------------------
//- METHOD "disableDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.disableDOMElement = function()
{
	document.getElementById(this.DOMObjectID).disabled = true;
}


//------------------------------------------------------------------------------
//- METHOD "getDOMValue"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getDOMValue = function()
{
	var ElementID = document.getElementById(this.DOMObjectID);
	return (ElementID == null) ? '':ElementID.value;
}


//------------------------------------------------------------------------------
//- METHOD "addEventListener"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.addEventListener = function(Type, Destination)
{
	var divElement = document.getElementById(this.DOMObjectID);
	divElement.addEventListener(Type, Destination);
}
