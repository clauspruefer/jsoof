//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldItem" Object                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldItem Object                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldItem"
//------------------------------------------------------------------------------

function sysFormFieldItem() {

	this.ID					= null;			//- Base ID

	this.DOMObjectID			= null;			//- DOM ObjectID
	this.DOMValue				= null;			//- DOM Value

	this.ContainerObject			= null;			//- Container Sys Object

	this.ConfigObject			= null;			//- ConfigObject

	this.Type				= null;			//- text | password | textarea | pulldown
	this.DescriptionTextID			= null;			//- Description TextID

	this.DBColumn				= null;			//- Database Column Reference, if Data from DB

	this.ValidateRef			= null;			//- Validate Regex Reference ID
	this.ValidateNullable			= false;		//- If set true, Form Value can be null (validate will not fail)

	this.FormFieldRefScreen			= null;			//- Form Field Value Reference ID Screen
	this.FormFieldRefContainer		= null;			//- Form Field Value Reference ID Container
	this.FormFieldRef			= null;			//- Form Field Value Reference ID FormField

	this.StyleClass				= null;			//- Style Class
	this.StyleClassOnFocus			= null;			//- Style Class On Focus
	this.StyleClassValidateOk		= null;			//- Style Class Validate Ok
	this.StyleClassValidateFail		= null;			//- Style Class Validate Fail

	this.Disabled				= false;		//- Form Field Disabled
	this.ReadOnly				= false;		//- Form Field ReadOnly

	this.Value				= null;			//- Value

	this.PulldownOptions			= Object();		//- Pulldown Options
	this.DynPulldownURL			= null;			//- Dyn Pulldown Service URL
	this.PulldownDynLoaded			= false;		//- Dyn Pulldown Loaded Indicator

	this.FormFieldHTML			= '';			//- Rendered FormField HTML

	this.UpdatePulldown			= null;			//- Referenced Pulldown Object ID
	this.UpdatePulldownValueSplitChar	= null;			//- Split Array Character
	this.UpdatePulldownValueStartIndex	= null;			//- Generation Start Source Array Index
	this.UpdatePulldownValueEndIndex	= null;			//- Generation End Source Array Index
	this.UpdatePulldownPrependIndex		= null;			//- Generation Prepend Source Array Index
	this.UpdatePulldownPrependRegex		= null;			//- Generation Prepend Regular Expression

	this.AddNoneItem			= false;		//- Add additional None Item

	this.RuntimeGetDataFunc			= this.getRuntimeData	//- Runtime Get Data Value/Function

	this.OnChange				= null;			//- OnChange Type
	this.OnChangeDstObject			= null;			//- OnChange Dest Object
	this.OnChangeCompareObject		= null;			//- OnChange Compare Object (Value)
	this.OnChangeDstMatchColumn		= null;			//- OnChange Dest Object Match Column
	this.OnChangeDstUpdateColumn		= null;			//- OnChange Dest Update Column
	this.OnChangeDstUpdateValue		= null;			//- OnChange Dest Update Value
	this.OnChangeDstUpdateValueSrcObject	= null;			//- OnChange Dest Update Value Source Object
	this.OnChangeDstUpdateRowStyle		= null;			//- OnChange Dest Update Row Style

}

//- inherit sysBaseDOMFormElement
sysFormFieldItem.prototype = new sysBaseDOMFormElement();

//- add BaseObject functions
sysFormFieldItem.prototype.getObjectData = sysBaseObject.prototype.getObjectData;
sysFormFieldItem.prototype.getObjectDataStringified = sysBaseObject.prototype.getObjectDataStringified;

//- add BaseDOMElement functions
sysFormFieldItem.prototype.getDOMValue = sysBaseDOMElement.prototype.getDOMValue;
sysFormFieldItem.prototype.addEventListener = sysBaseDOMElement.prototype.addEventListener;


//------------------------------------------------------------------------------
//- METHOD "setAttributes"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setAttributes = function(Attributes) {

	this.Type				= Attributes.Type;
	this.DescriptionTextID			= Attributes.TextID;

	this.DBColumn				= Attributes.DBColumn;

	this.ValidateRef			= Attributes.ValidateRef;
	this.ValidateNullable			= Attributes.ValidateNullable;

	this.FormFieldRefScreen			= Attributes.FormFieldRefScreen;
	this.FormFieldRefContainer		= Attributes.FormFieldRefContainer;
	this.FormFieldRef			= Attributes.FormFieldRef;

	this.StyleClass				= Attributes.Style;
	this.StyleClassOnFocus			= Attributes.StyleOnFocus;
	this.StyleClassValidateOk		= Attributes.StyleValidateOk;
	this.StyleClassValidateFail		= Attributes.StyleValidateFail;

	this.PulldownOptions			= Attributes.Options;
	this.DynPulldownURL			= Attributes.ServiceURL;
	this.DynPulldownServiceID               = Attributes.ServiceID;

	this.Disabled				= Attributes.Disabled;
	this.ReadOnly				= Attributes.ReadOnly;

	this.Value				= Attributes.Value;

	this.OnChange				= Attributes.OnChange;
	this.OnChangeDstObject			= Attributes.DstObject;
	this.OnChangeCompareObject		= Attributes.CompareObject;
	this.OnChangeDstMatchColumn		= Attributes.DstMatchColumn;
	this.OnChangeDstUpdateColumn		= Attributes.DstUpdateColumn;
	this.OnChangeDstUpdateValue		= Attributes.DstUpdateValue;
	this.OnChangeDstUpdateValueSrcObject	= Attributes.DstUpdateValueSrcObject;
	this.OnChangeDstUpdateRowStyle		= Attributes.DstUpdateRowStyle;

	this.Height				= Attributes.Height;

	this.UpdatePulldown			= Attributes.UpdatePulldown;
	this.UpdatePulldownValueSplitChar	= Attributes.UpdatePulldownValueSplitChar;
	this.UpdatePulldownValueStartIndex	= Attributes.UpdatePulldownValueStartIndex;
	this.UpdatePulldownValueEndIndex	= Attributes.UpdatePulldownValueEndIndex;
	this.UpdatePulldownPrependIndex		= Attributes.UpdatePulldownPrependIndex;
	this.UpdatePulldownPrependRegex		= Attributes.UpdatePulldownPrependRegex;

	this.AddNoneItem			= Attributes.AddNoneItem;

	this.UpdateOnEvent			= Attributes.UpdateOnEvent;

}


//------------------------------------------------------------------------------
//- METHOD "setAttributes"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setupEvents = function() {

	if (this.UpdateOnEvent !== undefined) {
		//console.log('sysFormFieldItem setupEvents() Events:%o', this.UpdateOnEvent.Events);
		var Attributes = new Object;
		Attributes.OnEvent = this.UpdateOnEvent;
		sysFactory.Reactor.registerEvent(Attributes, this, 'Dynpulldown');
	}
}


//------------------------------------------------------------------------------
//- METHOD "generateHTML"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateHTML = function() {

	//------------------------------------------------------------------------------
	//- Calculate disabled, ReadOnly
	//------------------------------------------------------------------------------

	var FormDisabled = '';
	var FormReadOnly = '';

	if (this.Disabled == true)	{ FormDisabled = 'disabled'; }
	if (this.ReadOnly == true)	{ FormReadOnly = 'readOnly'; }

	if (this.Value === undefined)	{ this.Value = ''; }

	//------------------------------------------------------------------------------
	//- Generate Form Field HTML
	//------------------------------------------------------------------------------

	if (this.Type == 'text' || this.Type == 'password' || this.Type == 'file') {

		this.FormFieldHTML = '<input ';
		this.FormFieldHTML += 'type="' + this.Type + '" ';
		this.FormFieldHTML += 'id="' + this.DOMObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ';
		this.FormFieldHTML += 'value="' + this.Value + '" ';
		this.FormFieldHTML += FormDisabled + ' ' + FormReadOnly + '>';

	}

	if (this.Type == 'textarea') {

		this.FormFieldHTML = '<textarea ';
		this.FormFieldHTML += 'id="' + this.DOMObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ';
		this.FormFieldHTML += 'value="' + this.Value + '" ';
		this.FormFieldHTML += FormDisabled + ' ' + FormReadOnly + '>';
		this.FormFieldHTML += '</textarea>';

	}

	if (this.Type == 'pulldown' || this.Type == 'dynpulldown' || this.Type == 'pulldowndummy') {

		var PulldownOptions = this.generatePulldownOptions();

		var PulldownProperties = FormDisabled + ' ' + FormReadOnly;

		this.FormFieldHTML = '<select ';
		this.FormFieldHTML += 'id="' + this.DOMObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ' + PulldownProperties + '>';
		this.FormFieldHTML += PulldownOptions;
		this.FormFieldHTML += '</select>';

	}

	return this.FormFieldHTML;
}


//------------------------------------------------------------------------------
//- METHOD "generatePulldownOptions"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generatePulldownOptions = function() {

	var OptionsHTML = '';
	var Options = this.PulldownOptions;

	if (this.AddNoneItem == true && Options !== undefined) {
		Options['None'] = new Object();
		Options['None']['DisplayText'] = 'Nicht ausgewählt';
		Options['None']['Value'] = '<NULL>';
		Options['None']['Default'] = true;
	}

	for (OptionKey in Options) {
		OptionsHTML += this.generateOptionHTML(Options[OptionKey]);
	}

	return OptionsHTML;
}


//------------------------------------------------------------------------------
//- METHOD "generateOptionHTML"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateOptionHTML = function(Item) {

	var selected = '';

	if (Item.Default == true) { selected = ' selected'; }

	var DisplayText = this.getPulldownDisplayText(Item);

	return '<option value="' + Item.Value + '"' + selected + '>' + DisplayText + '</option>';
}


//------------------------------------------------------------------------------
//- METHOD "getPulldownDisplayText"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getPulldownDisplayText = function(OptionItem) {

	if (OptionItem.TextID !== undefined) {
		var DisplayTextObj = sysFactory.ObjText.getTextObjectByID(OptionItem.TextID);
		return DisplayTextObj[sysFactory.EnvUserLanguage];
	}

	else if (OptionItem.DisplayText !== undefined) {
		return OptionItem.DisplayText;
	}

	else if (OptionItem.Value !== undefined) {
		return OptionItem.Value;
	}

	return '';
}


//------------------------------------------------------------------------------
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.processSwitchScreen = function() {
	if (this.Type == 'dynpulldown' && this.PulldownDynLoaded == false) {
		this.updateValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.updateValue = function() {

	this.DOMValue = this.Value;

	if (this.Type == 'pulldown') {
		this.DOMPulldownSetValue();
	}

	else if (this.Type == 'dynpulldown') {
		this.getDynPulldownData();
	}

	else {
		this.DOMFormSetValue();
	}

}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setValue = function(value) {
	this.Value = value;
	this.updateValue();
}


//------------------------------------------------------------------------------
//- METHOD "updateRefValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.updateRefValue = function() {

	//console.log(this.FormFieldRef);

	if (this.FormFieldRef != null) {

		this.DOMValue = sysFactory.getFormFieldValueByID(
			this.FormFieldRefScreen,
			this.FormFieldRefContainer,
			this.FormFieldRef
		);

		this.DOMFormSetValue();

	}
}


//------------------------------------------------------------------------------
//- METHOD "getDynPulldownData"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getDynPulldownData = function() {

	if (this.DynPulldownServiceID !== undefined) {
		this.PostRequestData = new sysRequestDataHandler();
		this.PostRequestData.addServiceProperty('ServiceID', this.DynPulldownServiceID);
	}

	RPC = new sysCallXMLRPC(this.DynPulldownURL);
	RPC.Request(this);

}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.callbackXMLRPCAsync = function() {

	//console.log('sysFormFieldItem() DynPulldownData:', this.getRuntimeData());

	//- set actual selected value to default value
	//this.Value = this.getRuntimeData();

	//- generate pulldown options/render
	this.generateDynPulldownOptions(this.XMLRPCResultData);

	//- update referenced
	this.setReferencedUpdateHandler();

	//- deprecated when dynpulldown loading will be completely event driven
	this.PulldownDynLoaded = true;

}


//------------------------------------------------------------------------------
//- METHOD "PulldownIndexGenerator"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.PulldownIndexGenerator = function*() {

	Index = 0;

	while(true) {
		Index += 1;
		yield Index.toString();
	
	}

}


//------------------------------------------------------------------------------
//- METHOD "setReferencedUpdateHandler"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setReferencedUpdateHandler = function() {

	//- set onchange event handler
	if (this.UpdatePulldown != null) {
		this.addEventListener('change', this.processReferencedUpdate.bind(this));
		this.processReferencedUpdate();
		this.ContainerObject.processEventListener();
	}

}


//------------------------------------------------------------------------------
//- METHOD "processReferencedUpdate"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.processReferencedUpdate = function() {

	//- get referenced object
	RefObject = sysFactory.getFormFieldObjectByID(this.UpdatePulldown);

	//- get actual pulldown selected value
	var SelectedValue = this.getRuntimeData();

	//- split value into array
	var SplittedArray = SelectedValue.split(this.UpdatePulldownValueSplitChar);

	//- split value into array
	var StartValue = parseInt(SplittedArray[this.UpdatePulldownValueStartIndex]);
	var EndValue = parseInt(SplittedArray[this.UpdatePulldownValueEndIndex]);
	var RegexReplaceString = SplittedArray[this.UpdatePulldownPrependIndex];
	var RegexString = this.UpdatePulldownPrependRegex;

	//- generate referenced object pulldown options
	var Counter = StartValue;
	var PulldownOptions = new Object();

	//console.log('sysFormFieldItem() SelectedValue:%s StartValue:%s EndValue:%s PrependIndex:%s RegexString:%s RegexReplaceString:%s', SelectedValue, StartValue, EndValue, this.UpdatePulldownPrependIndex, RegexString, RegexReplaceString);

	while (Counter <= EndValue) {

		var PulldownItem = new Object();

		var re = new RegExp(RegexString);
		var PrependString = re.exec(RegexReplaceString);

		PulldownItem.value = Counter;
		PulldownItem.display = PrependString[0] + Counter;

		PulldownOptions[Counter] = PulldownItem;

	Counter += 1;
	}

	//console.log('sysFormFieldItem() Pulldown Options:%o', PulldownOptions);

	//- generate pulldown in referenced object
	RefObject.generateReferencedPulldownOptions(PulldownOptions);

}


//------------------------------------------------------------------------------
//- METHOD "generateReferencedPulldownOptions"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateReferencedPulldownOptions = function(PulldownOptions) {

	this.PulldownOptions = undefined;
	this.generateDynPulldownOptions(PulldownOptions);
}


//------------------------------------------------------------------------------
//- METHOD "generateDynPulldownOptions"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateDynPulldownOptions = function(PulldownOptions) {

	if (this.PulldownOptions === undefined) { this.PulldownOptions = Object(); }

	var IndexGenerator = this.PulldownIndexGenerator();

	for (OptionKey in PulldownOptions) {

		var OptionItem = PulldownOptions[OptionKey];
		var PulldownIndex = IndexGenerator.next().value;

		this.PulldownOptions[PulldownIndex] = new Object();
		this.PulldownOptions[PulldownIndex]['DisplayText'] = OptionItem.display;
		this.PulldownOptions[PulldownIndex]['Value'] = OptionItem.value;

		if (this.Value == OptionItem.value) {
			this.PulldownOptions[PulldownIndex]['Default'] = true;
		}

	}

	this.ContainerObject.DOMValue = this.generateHTML();
	this.ContainerObject.setDOMElementValue();

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.validate = function() {

	//- ignore pulldown type
	if (this.Type == 'pulldown') { return true; }

	//- ignore form field without validate regex set
	if (this.ValidateRef == null || this.ValidateRef === undefined) { return true; }

	//- check if nullable and value length = 0
	if (this.ValidateNullable == true && this.getDOMValue().length == 0) {

		this.removeDOMElementStyle(this.StyleClassValidateFail);
		this.addDOMElementStyle(this.StyleClassValidateOk);

		return true;
	}

	var Result = sysFactory.ObjFormValidate.validate(this.ValidateRef, this.getDOMValue());

	if (Result == -1) {
		this.removeDOMElementStyle(this.StyleClassValidateOk);
		this.addDOMElementStyle(this.StyleClassValidateFail);
		return false;
	}
	else {
		this.removeDOMElementStyle(this.StyleClassValidateFail);
		this.addDOMElementStyle(this.StyleClassValidateOk);
		return true;
	}

}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.clearStyle = function()
{
	this.removeDOMElementStyle(this.StyleClassValidateOk);
	this.removeDOMElementStyle(this.StyleClassValidateFail);
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.disable = function()
{
	if (this.Disabled == false || this.Disabled === undefined) {
		var Element = document.getElementById(this.DOMObjectID);
		if (Element != null && Element !== undefined) {
			Element.disabled = true;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.enable = function()
{
	if (this.Disabled == false || this.Disabled === undefined) {
		var Element = document.getElementById(this.DOMObjectID);
		if (Element != null && Element !== undefined) {
			Element.disabled = false;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getRuntimeData = function()
{
	//console.log('getRuntimeData:' + this.ID);
	return this.getDOMValue();
}


//------------------------------------------------------------------------------
//- METHOD "processUpdateTableRowColObject"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.processUpdateTableRowColObject = function()
{
	//console.log('onChange');
	sysFormFieldOnChangeHandler.dispatch(this);
}
