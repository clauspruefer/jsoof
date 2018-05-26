//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM AsyncNotifyMsgHandler Methods                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Handles Async Notify Messages                                            -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

function sysAsyncNotifyMsgHandler()
{
}


//------------------------------------------------------------------------------
//- METHOD "getMsg"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.getMsg = function()
{

	//- if session id exists, get next messages
	if (sysFactory.SysSessionID != null && sysFactory.SysSessionID !== undefined) {

		var RPCParams = '&Type=GET&Session='+sysFactory.SysSessionValue;

		var RPC = new sysCallXMLRPC(sysFactory.MsgServerURL, RPCParams);
		RPC.setRequestType('GET');
		RPC.Request(this);

	}

}


//------------------------------------------------------------------------------
//- CALLBACK "XMLRPCAsync"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.callbackXMLRPCAsync = function()
{

	console.log(this.XMLRPCResultData);

	for (MessageIndex in this.XMLRPCResultData.Messages) {
		var Message = this.XMLRPCResultData.Messages[MessageIndex];
		this.processMsg(Message);
	}

	//- get/wait for next messages
	this.getMsg();

}


//------------------------------------------------------------------------------
//- METHOD "processMsg"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.processMsg = function(Message)
{

	//- check for global message
	var Regex = /^SYS__PHONE_CALL\-([0-9]+)$/g;
	var RegexResult = Regex.exec(Message);

	//- if global message, add new global msg item
	if (RegexResult) {

		var sysID = 'SYS__GLOBAL_MSG';

		ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": SysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.INCOMINGPHONECALL')
		}

		var AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

		var CallingPhoneNr = RegexResult[1]
		var NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
		NotifyItem.setProcessStatus(0);
		NotifyItem.setDisplayText(CallingPhoneNr);
		NotifyItem.updateDisplay();

		sysFactory.switchScreen('ShipmentHistory');
		var PhoneFormList = sysFactory.getObjectByID('ShipmentHistoryReceiverPhoneFormfields').BaseObject.ConfigObject.RootObject.BaseObject;
		var PhoneFormItem = PhoneFormList.getFormFieldItemByID('ShipmentHistoryReceiverPhoneNr');

		PhoneFormItem.setValue(CallingPhoneNr);
		PhoneFormList.switchContainingTab();

		sysFactory.Reactor.fireEvents(['ShipmentHistoryPhoneSearch']);

		return;
	}

	//- check for global message
	var Regex = /^SYS__GLOBAL_MSG\-(.+)$/g;
	var RegexResult = Regex.exec(Message);

	//- if global message, add new global msg item
	if (RegexResult) {

		var sysID = 'SYS__GLOBAL_MSG';

		ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": SysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.SYSTEMMSG')
		}

		var AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

		var NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
		NotifyItem.setProcessStatus(1);
		NotifyItem.setDisplayText(RegexResult[1]);
		NotifyItem.updateDisplay();

		return;
	}

	//- update action notifier with id contained in msg
	var Regex = /^SYS__(.+)__(SUCCESS|ERROR)/g;
	var RegexResult = Regex.exec(Message);

	//- if message format is correct, process
	if (RegexResult) {

		var NotifyID = RegexResult[1];
		var NotifyStatus = RegexResult[2];

		//- get notify item from global async indicator
		var NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(NotifyID);

		//- start processing result
		if (NotifyItem != null && NotifyItem !== undefined) {
			NotifyItem.processResult(NotifyStatus);
		}

	}

}
