//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "AsyncNotifyIndicatorItem"                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Async Notify Indicator Item                                              -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjAsyncNotifyIndicatorItem"
//------------------------------------------------------------------------------

function sysObjAsyncNotifyIndicatorItem(NotifyConfig, DisplayIndex) {

	this.ID			= NotifyConfig.ID;					// Object ID

	this.ObjectID		= 'SYSGlobalAsyncNotifyIndicatorItem__' + this.ID;	// Object DOM ID

	this.NotifyConfig	= NotifyConfig;						// Notify Object

	this.DisplayHeader	= NotifyConfig.DisplayHeader;				// Display Header
	this.DisplayText	= '';							// Display Text

	this.DisplayIndex	= DisplayIndex;						// Display Index

	this.ProcessStatus	= -1;							// -1: processing, 0: processed ok

}


//------------------------------------------------------------------------------
//- METHOD "setProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setProcessStatus = function(Status)
{
	this.ProcessStatus = Status;
}


//------------------------------------------------------------------------------
//- METHOD "setDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setDisplayText = function(Text)
{
	this.DisplayText = Text;
}


//------------------------------------------------------------------------------
//- METHOD "getNotifyObject"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.getNotifyObject = function()
{
	return this.NotifyObj;
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplay"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplay = function()
{
	this.updateDisplayText();
	this.updateProcessStatus();
}


//------------------------------------------------------------------------------
//- METHOD "processResult"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.processResult = function(status)
{

	var UpdateDisplayText = '';

	if (status == 'SUCCESS') {
		this.setProcessStatus(0);
		UpdateDisplayText = 'Aktion erfolgreich';
	}
	else if (status == 'ERROR') {
		this.setProcessStatus(1);
		UpdateDisplayText = 'Fehler aufgetreten';
	}
	else {
		this.setProcessStatus(2);
		UpdateDisplayText = 'Unbekannter Fehler aufgetreten';
	}

	//- update item display text
	this.setDisplayText(UpdateDisplayText);
	this.updateDisplay();

	//- on success, update given system object and switch screen if defined
	if (status == 'SUCCESS') {

		if (this.NotifyConfig.OnSuccess !== undefined) {
			//console.log(this.NotifyConfig.OnSuccess.FireEvents);
			//- fire events
			sysFactory.Reactor.fireEvents(this.NotifyConfig.OnSuccess.FireEvents);
		}

	}

}


//------------------------------------------------------------------------------
//- METHOD "updateProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateProcessStatus = function()
{

	var imgName;
	var tmpDIV = document.getElementById(this.ObjectID+'__ProcessStatusIcon');

	if (this.ProcessStatus == 0)  { imgName = 'Icon.AsyncIndicator.Success.png'; }
	if (this.ProcessStatus >  0)  { imgName = 'Icon.AsyncIndicator.Error.png'; }
	if (this.ProcessStatus == -1) { imgName = 'Icon.AjaxLoader.png'; }

	var tmpDIVinnerHTML = '<img src="/images/' + imgName + '">';

	tmpDIV.innerHTML = tmpDIVinnerHTML;

}


//------------------------------------------------------------------------------
//- METHOD "updateDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplayText = function()
{

	var tmpDIV = document.getElementById(this.ObjectID+'__BKGRDProcessStatus');
	tmpDIV.innerHTML = this.DisplayText;

}


//------------------------------------------------------------------------------
//- METHOD "addDIV"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.addDIV = function()
{

	var sysTextObj = sysFactory.ObjText;

	var imgCloseSrcPath = '/images';
	var imgClose = imgCloseSrcPath + '/Icon.AsyncIndicator.CloseTransaction.png';
	var imgCloseOnClick = 'sysFactory.GlobalAsyncNotifyIndicator.removeMsgItem(\'' + this.ID + '\');';

	var tmpDIV;
	var moveDIV;

	var rootDIV = document.getElementById('SYSGlobalAsyncNotifyIndicator');

	moveDIV = document.createElement('div');
	moveDIV.setAttribute('id', this.ObjectID + '__MovementDIV');
	moveDIV.style.top = (this.DisplayIndex*56)+'px';
	rootDIV.appendChild(moveDIV);

	tmpDIV = document.createElement('div');
	tmpDIV.setAttribute('id', this.ObjectID + '__BKGRDBorder');
	tmpDIV.setAttribute('class', 'SYSGlobalAsyncNotifyIndicatorItemBKGRDBorder');
	tmpDIV.style.top = (this.DisplayIndex*56)+'px';
	moveDIV.appendChild(tmpDIV);

	tmpDIV = document.createElement('div');
	tmpDIV.setAttribute('id', this.ObjectID + '__Close');
	tmpDIV.setAttribute('class', 'SYSGlobalAsyncNotifyIndicatorItemClose');
	tmpDIV.style.top = (this.DisplayIndex*56)+'px';
	tmpDIV.innerHTML = '<img src="' + imgClose + '" onclick="' + imgCloseOnClick + '">';
	moveDIV.appendChild(tmpDIV);

	tmpDIV = document.createElement('div');
	tmpDIV.setAttribute('id', this.ObjectID + '__Name');
	tmpDIV.setAttribute('class', 'SYSGlobalAsyncNotifyIndicatorItemName');
	tmpDIV.style.top = ((this.DisplayIndex*56)+4)+'px';
	tmpDIV.innerHTML = this.DisplayHeader;
	moveDIV.appendChild(tmpDIV);

	tmpDIV = document.createElement('div');
	tmpDIV.setAttribute('id', this.ObjectID + '__BKGRDProcessStatus');
	tmpDIV.setAttribute('class', 'SYSGlobalAsyncNotifyIndicatorItemBKGRDProcessStatus');
	tmpDIV.style.top = ((this.DisplayIndex*56)+28)+'px';
	tmpDIV.innerHTML = sysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.ACTIONPENDING');
	moveDIV.appendChild(tmpDIV);

	tmpDIV = document.createElement('div');
	tmpDIV.setAttribute('id', this.ObjectID + '__ProcessStatusIcon');
	tmpDIV.setAttribute('class', 'SYSGlobalAsyncNotifyIndicatorItemProcessStatusIcon');
	tmpDIV.style.top = ((this.DisplayIndex*56)+30)+'px';
	moveDIV.appendChild(tmpDIV);

	//- update DIV position
	this.updateDIVposition();

}


//------------------------------------------------------------------------------
//- METHOD "removeDIV"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.removeDIV = function()
{
 
	var tmpDIV = document.getElementById('SYSGlobalAsyncNotifyIndicator');

	tmpRMDIV = document.getElementById(this.ObjectID + '__MovementDIV');
	tmpDIV.removeChild(tmpRMDIV);

}


//------------------------------------------------------------------------------
//- METHOD "updateDIVposition"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDIVposition = function()
{
	var updatePosition = this.DisplayIndex*56;
	var tmpDIV;

	tmpDIV = document.getElementById(this.ObjectID + '__MovementDIV');
	tmpDIV.style.top = updatePosition+'px';

	tmpDIV = document.getElementById(this.ObjectID + '__BKGRDBorder');
	tmpDIV.style.top = updatePosition+'px';

	tmpDIV = document.getElementById(this.ObjectID + '__Close');
	tmpDIV.style.top = updatePosition+'px';

	tmpDIV = document.getElementById(this.ObjectID + '__Name');
	tmpDIV.style.top = updatePosition+4+'px';

	tmpDIV = document.getElementById(this.ObjectID + '__BKGRDProcessStatus');
	tmpDIV.style.top = updatePosition+28+'px';

	tmpDIV = document.getElementById(this.ObjectID + '__ProcessStatusIcon');
	tmpDIV.style.top = updatePosition+30+'px';

}
