//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "AsyncNotifyIndicator"                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Notification Layer                                               -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjAsyncNotifyIndicator"
//------------------------------------------------------------------------------

function sysObjAsyncNotifyIndicator() {
	this.ObjectID	= 'SYSGlobalAsyncNotifyIndicator';	// Object DOM ID
	this.ID		= this.ObjectID;			// Object ID
	this.MsgItem	= new Array();				// Msg Items Array
}


//------------------------------------------------------------------------------
//- METHOD "getObjectID"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.getObjectID = function() {
	return this.ObjectID;
}


//------------------------------------------------------------------------------
//- METHOD "getDomValue"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.getDomValue = function() {
	var tmpObjectID = this.getObjectID();
	return document.getElementById(tmpObjectID).value;
}


//------------------------------------------------------------------------------
//- METHOD "addMsgItem"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.addMsgItem = function(NotifyConfig)
{

	//- if no conifg given return
	if (NotifyConfig === undefined) { return; }

	//- if item already exists, do not process
	if (this.getMsgItemByName(NotifyConfig.ID) !== undefined) { return; }

	var tmpMsgItem = new sysObjAsyncNotifyIndicatorItem(
		NotifyConfig,
		this.MsgItem.length
	)

	this.MsgItem.push(tmpMsgItem);

	tmpMsgItem.addDIV();
	tmpMsgItem.updateProcessStatus();

}


//------------------------------------------------------------------------------
//- METHOD "getMsgItemByName"
//------------------------------------------------------------------------------
sysObjAsyncNotifyIndicator.prototype.getMsgItemByName = function( MsgItemID )
{

	for (MsgItemIndex in this.MsgItem) {
		if (this.MsgItem[MsgItemIndex].ID == MsgItemID) {
			return this.MsgItem[MsgItemIndex];
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "removeMsgItem"
//------------------------------------------------------------------------------
sysObjAsyncNotifyIndicator.prototype.removeMsgItem = function( MsgItemID )
{

	var MsgItem = this.getMsgItemByName(MsgItemID);

	if (MsgItem !== undefined) {
		MsgItem.removeDIV();
		var MsgItemIndex = MsgItem.DisplayIndex;
		this.update(MsgItemIndex);
	}

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.init = function()
{
	this.initLayer();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.update = function( MsgIndexDelItem )
{

	//- count display index of relevant objects -1
	for (MsgIndex in this.MsgItem) {
		var MsgItem = this.MsgItem[MsgIndex];
		if (MsgItem.DisplayIndex > MsgIndexDelItem) {
			MsgItem.DisplayIndex -= 1;
		}
	}

	//- remove item from items array
	this.MsgItem.splice(MsgIndexDelItem, 1);

	//- update position
	for (MsgIndex in this.MsgItem) {
		var MsgItem = this.MsgItem[MsgIndex];
		MsgItem.updateDIVposition();
	}

}


//------------------------------------------------------------------------------
//- METHOD "initLayer"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.initLayer = function()
{

	//- Construct DIV html
	var tmpdiv;

	tmpdiv = document.createElement('div');

	tmpdiv.setAttribute('id', this.ObjectID);

	tmpdiv.style.right     = '10px';
	tmpdiv.style.top       = '10px';
	tmpdiv.style.width     = '300px';
	tmpdiv.style.zIndex    = 20000;

	tmpdiv.style.position  = 'absolute';

	tmpdiv.style.padding   = '0px';

	tmpdiv.style.opacity   = 0.9;

	tmpdiv.innerHTML       = '';

	//- Append DIV to DOM body
	document.body.appendChild(tmpdiv);

}
