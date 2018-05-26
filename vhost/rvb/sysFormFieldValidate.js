//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2016                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldValidate" Object                                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldValidate Object                                                 -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldValidate"
//------------------------------------------------------------------------------

function sysFormFieldValidate() {

	//- set validate regex
	this.ValidateRegex =
	{
		'DefaultString':		'^[a-zA-Z\u00e4\u00f6\u00fc\u00df0-9 \\.\\-:,=\\!\\?\\(\\)]+$',
		'DefaultAtoZ':			'^[a-zA-Z]+$',
		'DefaultAtoZPlusNumbers':	'^[a-zA-Z0-9]+$',
		'DefaultAtoZUpper':		'^[A-Z]+$',
		'DefaultDate':			'^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\-[0-9][0-9]$',
		'ZipCode':			'^[0-9][0-9][0-9][0-9][0-9]$',
		'UserName':			'^[a-zA-Z0-9_]+$',
		'RealName':			'^[a-zA-Z0-9äöüÄÖÜ ]+$',
		'UserPass':			'^[a-zA-Z0-9!?_#]+$',
		'UserGroup':			'^[a-zA-Z0-9_]+$',
		'MailAddress':			'^[a-zA-Z0-9\\-\\.]+\@[a-zA-Z0-9\\-\\.]+$',
		'PhoneNr':			'^\\+[0-9][0-9] \\([0-9]{2,6}\\) [0-9]{6,12}$',
		'Quantity':			'^[0-9]+$',
		'Country':			'^(DE|EN)$'
	};

	//- set validate functions
	this.ValidateFunc =
	{
		'IPAddress':			this.IPAddress,
		'IPAddressSubnet':		this.IPAddressSubnet,
		'IPPort':			this.IPPort,
	};

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validate = function(ValidateID, Value) {

	var RegexString = this.ValidateRegex[ValidateID];

	if (RegexString !== undefined) {
		var Regex = new RegExp(RegexString, 'g');
		return Value.search(Regex);
	}

	var ValidateFunc = this.ValidateFunc[ValidateID];

	if (ValidateFunc !== undefined) {
		return ValidateFunc(Value);
	}

}


//------------------------------------------------------------------------------
//- METHOD "IPAddress"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddress = function(Value) {

	var IPArray = Value.split('.');

	//- check correct octet count
	if (IPArray.length != 4) { return -1; }

	//- first octet should not start with 0
	if (parseInt(IPArray[0]) == 0) { return -1; }

	for (Index in IPArray) {
		IPOctet = IPArray[Index];
		var checkNumber = parseInt(IPOctet);
		if (checkNumber < 0 || checkNumber > 255) { return -1; }
	}

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPAddressSubnet"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddressSubnet = function(Value) {

	var NetArray = Value.split('/');

	//- check correct octet count
	if (NetArray.length != 2) { return -1; }

	//- check correct ip address
	var IPCheck = sysFactory.ObjFormValidate.IPAddress(NetArray[0]);
	if (IPCheck == -1) { return -1; }

	//- check subnet mask
	var MaskBits = parseInt(NetArray[1]);
	if (MaskBits < 1 || MaskBits > 32) { return -1; }

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPPort"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPPort = function(Value) {

	//- check empty string given
	if (Value.length == 0) { return -1; }

	//- cast/check numerical value
	var Port = parseInt(Value);
	if (Port < 1 || Port > 65535) { return -1; }

	return true;
}
