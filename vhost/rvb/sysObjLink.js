//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Link"                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLink"
//------------------------------------------------------------------------------

function sysObjLink() {

	this.ChildObjects	= Object(); //- recursive child items
	this.EventListerners	= Object(); //- event listeners

	this.ScreenID		= null;
	this.TextID		= null;

	this.RaiseEvents	= null;

	this.ActiveOnFormID	= null;

}

//- inherit sysBaseObject
sysObjLink.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjLink.prototype.init = function()
{
	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText';
	SQLTextObj.TextID = this.TextID;
	SQLTextObj.init();
	this.addObject(SQLTextObj);
}


//------------------------------------------------------------------------------
//- METHOD "EventListener"
//------------------------------------------------------------------------------
sysObjLink.prototype.EventListener = function(Event)
{
	//console.log('Link EventListener ScreenID:' + this.ScreenID);

	var SwitchScreen = true;

	if (this.ActiveOnFormID != null) {
		var FormItem = sysFactory.getFormFieldObjectByID(this.ActiveOnFormID);
		var FormValue = FormItem.getDOMValue();
		//console.log('FormValue:%s', FormValue);
		if (FormValue === undefined || FormValue.length == 0) {
			SwitchScreen = false;
		}
	}

	if (SwitchScreen == true) {

		console.log('SwitchScreen:true');

		if (this.RaiseEvents != null) {
			sysFactory.Reactor.fireEvents(this.RaiseEvents);
		}

		sysFactory.switchScreen(this.ScreenID);
	}

}
