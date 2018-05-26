//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseDOMFormElement"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseDOMFormElement"
//------------------------------------------------------------------------------

function sysBaseDOMFormElement() {
}

//- inherit sysBaseDOMElement
sysBaseDOMFormElement.prototype = new sysBaseDOMElement();


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownAddOption"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownAddOption = function(Var, Value) {

	var PulldownObj = document.getElementById(this.DOMObjectID);
	var PulldownOption = document.createElement("option");

	PulldownOption.text = Var;
	PulldownOption.value = Value;
	PulldownObj.options.add(PulldownOption);

}


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownReset"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownReset = function() {

	var PulldownObj = document.getElementById(this.DOMObjectID);
	var PulldownObjItemCount = PulldownObj.length;

	for (var i=0; i<PulldownObjItemCount; i++) {
		PulldownObj.options.remove(i);
	}

}


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownSetValue"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownSetValue = function() {

	//console.log('DomPulldownSetValue Value:' + Value);

	//- cast to string
	var SetValue = this.DOMValue.toString();

	//- get pulldown dom object
	var PulldownObj = document.getElementById(this.DOMObjectID);

	//- iterate on pulldown options, compare values
	for (var i=0; i < PulldownObj.options.length; i++) {
		if (PulldownObj.options[i].value == SetValue) {
			PulldownObj.selectedIndex = i;
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "setDOMFormValue"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMFormSetValue = function()
{
	if (this.DOMValue != null) {
		//console.log('##### SET FORM VALUE ##### Value:' + this.DOMValue);
		var FormElement = document.getElementById(this.DOMObjectID);
		FormElement.value = this.DOMValue;
	}
}
