//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "TabContainer"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Tab Container Connector Object                                           -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysTab"
//------------------------------------------------------------------------------

function sysTab()
{

	this.ObjectID		= null;		//- ObjectID
	this.TabID		= null;		//- TabID

	this.Default		= false;	//- false | true

	this.TextID		= null;		//- TextID

	this.Active		= false;	//- false | true

	this.StyleRemove	= null;		//- Remove Style
	this.Style		= null;		//. Set Style

	this.TabContainer	= null;		//- TabContainer Object

	this.PositionLeft	= null;		//- Left Tab Start Position
	this.Width		= null;		//- Tab Width (Pixel)

	this.StyleActive	= null;		//- Active Style
	this.StyleInactive	= null;		//- Inactive Style

	this.ObjLeft		= null;		//- System Object Left Tab Part
	this.ObjMiddle		= null;		//- System Object Middle Tab Part
	this.ObjRight		= null;		//- System Object Right Tab Part
	this.ObjText		= null;		//- System Object SQL Text Tab Part

}


//- inherit sysBaseObject
sysTab.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysTab.prototype.EventListenerClick = function(Event)
{
	//console.log('TabClick TabID:' + this.TabID);
	this.TabContainer.switchTab(this.TabID);
}


//------------------------------------------------------------------------------
//- METHOD "switchStyle"
//------------------------------------------------------------------------------
sysTab.prototype.switchStyle = function()
{

	//- remove style
	this.ObjLeft.removeDOMElementStyle(this.StyleRemove + 'Left');
	this.ObjMiddle.setDOMElementStyle(this.StyleRemove + 'Middle');
	this.ObjRight.setDOMElementStyle(this.StyleRemove + 'Right');
	this.ObjText.setDOMElementStyle(this.StyleRemove + 'Text');

	//- set style
	this.ObjLeft.DOMStyle	= this.Style + 'Left';
	this.ObjMiddle.DOMStyle	= this.Style + 'Middle';
	this.ObjRight.DOMStyle	= this.Style + 'Right';
	this.ObjText.DOMStyle	= this.Style + 'Text';

	this.ObjLeft.setDOMElementStyle();
	this.ObjMiddle.setDOMElementStyle();
	this.ObjRight.setDOMElementStyle();
	this.ObjText.setDOMElementStyle();

}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysTabContainer"
//------------------------------------------------------------------------------

function sysTabContainer()
{

	this.Tabs		= Object();			//- Tab sys Objects

	this.StyleActive	= null;				//- Style Ref Active
	this.StyleInactive	= null;				//- Style Ref Inactive

	this.RootObject		= new sysObjBaseDiv();		//- Hierarchical Root Object(s)

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysTabContainer.prototype.init = function()
{

	//- set config object attributes
	this.ContainerAttributes = this.ConfigObject.Object.Attributes;

	//- connect tab container object for switching tabs from "outside"
	this.RootObject.TabContainerObject = this;

	//- setup container elements
	this.ContainerTable = new sysObjBaseDiv();
	this.ContainerTable.ObjectID = 'TabTable';
	this.ContainerTable.DOMStyle = 'sysTabTable';
	this.ContainerTable.DOMStyleTop = this.ContainerAttributes.PositionTop + 'px';
	this.ContainerTable.DOMStyleLeft = this.ContainerAttributes.PositionLeft + 'px';

	this.ContainerTableRow = new sysObjBaseDiv();
	this.ContainerTableRow.ObjectID = 'TabTableRow';
	this.ContainerTableRow.DOMStyle = 'sysTabTableRow';

	this.ContainerContent = new sysObjBaseDiv();
	this.ContainerContent.ObjectID = 'TabContent';
	this.ContainerContent.DOMStyle = 'sysTabContentContainer';

	//- connect base elements
	this.ContainerTable.addObject(this.ContainerTableRow);

	this.RootObject.addObject(this.ContainerTable);
	this.RootObject.addObject(this.ContainerContent);

	//- set base attributes
	this.StyleActive = this.ContainerAttributes.StyleActive;
	this.StyleInactive = this.ContainerAttributes.StyleInactive;

	//- add tabs from configurtaion
	this.addTabs();

}


//------------------------------------------------------------------------------
//- METHOD "addTabs"
//------------------------------------------------------------------------------

sysTabContainer.prototype.addTabs = function()
{

	var Tabs = this.ContainerAttributes.Tabs;
	var TabLeftPosition = 0;

	for (TabKey in Tabs) {

		TabConfigElement = Tabs[TabKey];

		var TabElement = new sysTab();
		var TabAttributes = TabConfigElement.Attributes;

		TabElement.TabID		= TabKey;
		TabElement.ObjectID		= 'Tab' + TabKey;
		TabElement.Default		= TabAttributes.Default;
		TabElement.TextID		= TabAttributes.TextID;
		TabElement.Width		= TabAttributes.Width;
		TabElement.StyleActive		= this.ContainerAttributes.StyleActive;
		TabElement.StyleInactive	= this.ContainerAttributes.StyleInactive;

		TabElement.PositionLeft		= TabLeftPosition;

		TabElement.TabContainer		= this;

		if (TabAttributes.Default == true) {
			TabElement.Active	= true;
			TabElement.Style	= this.ContainerAttributes.StyleActive;
		}
		if (TabAttributes.Default == false || TabAttributes.Default === undefined) {
			TabElement.Active	= false;
			TabElement.Style	= this.ContainerAttributes.StyleInactive;
		}

		TabLeftPosition += TabElement.Width+4;

		this.Tabs[TabKey] = TabElement;
		this.appendTabObject(TabElement);

	}

}


//------------------------------------------------------------------------------
//- METHOD "appendTabObject"
//------------------------------------------------------------------------------

sysTabContainer.prototype.appendTabObject = function(TabElement)
{

	var TabLeft = new sysObjBaseDiv();
	TabLeft.ObjectID = 'TabLeft' + TabElement.ObjectID;
	TabLeft.DOMStyle = TabElement.Style + 'Left';
	TabLeft.DOMValue = '<img border="0" src="/images/spacer.png" width="4" height="4">';
	TabLeft.DOMStyleLeft = TabElement.PositionLeft + 'px';

	var TabMiddle = new sysObjBaseDiv();
	TabMiddle.ObjectID = 'TabMiddle' + TabElement.ObjectID;
	TabMiddle.DOMStyle = TabElement.Style + 'Middle';
	TabMiddle.DOMStyleLeft = TabElement.PositionLeft + 4 + 'px';
	TabMiddle.DOMStyleWidth = TabElement.Width + 'px';

	var TabRight = new sysObjBaseDiv();
	TabRight.ObjectID = 'TabRight' + TabElement.ObjectID;
	TabRight.DOMStyle = TabElement.Style + 'Right';
	TabRight.DOMValue = '<img border="0" src="/images/spacer.png" width="4" height="4">';
	TabRight.DOMStyleLeft = TabElement.PositionLeft + TabElement.Width + 'px';

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText'  + TabElement.ObjectID;
	SQLTextObj.TextID = TabElement.TextID;
	SQLTextObj.DOMStyle = TabElement.Style + 'Text';
	SQLTextObj.init();

	TabMiddle.addObject(SQLTextObj);
	TabMiddle.addObject(TabElement);

	//- add tab elements to container table row element
	this.ContainerTableRow.addObject(TabLeft);
	this.ContainerTableRow.addObject(TabMiddle);
	this.ContainerTableRow.addObject(TabRight);

	//- setup tab content div
	var Content = new sysObjBaseDiv();
	Content.ObjectID = TabElement.TabID;
	Content.DOMStyle = 'sysTabContent';
	Content.DOMStyleTop = this.ContainerAttributes.PositionTop + 34 + 'px';
	Content.DOMStyleLeft = this.ContainerAttributes.PositionLeft + 'px';

	//- setup object type for initial deactivation
	if (TabElement.Default == true)  { Content.ObjectType = 'Tab.Default'; }
	if (TabElement.Default == false) { Content.ObjectType = 'Tab'; }

	//- add event listener to sql text element (destination tab element)
	var EventListenerObj = Object();
	EventListenerObj['Type'] = 'click';
	EventListenerObj['Element'] = TabElement.EventListenerClick.bind(TabElement);

	SQLTextObj.EventListeners["ClickTab"] = EventListenerObj;

	//- connect container element to root object
	this.ContainerContent.addObject(Content);

	//- connect container element to root object
	TabElement.ObjLeft	= TabLeft;
	TabElement.ObjMiddle	= TabMiddle;
	TabElement.ObjRight	= TabRight;
	TabElement.ObjText	= SQLTextObj;

}


//------------------------------------------------------------------------------
//- METHOD "switchTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.switchTab = function(TabID)
{
	var Tabs = this.Tabs;

	//- do not process click on active tab
	for (TabKey in Tabs) {
		TabElement = Tabs[TabKey];
		if (TabElement.TabID == TabID && TabElement.Active == true) { return; }
	}

	//- switch styles for old active tab, clicked tab
	for (TabKey in Tabs) {
		TabElement = Tabs[TabKey];

		if (TabElement.Active == true) {
			TabElement.Active = false;
			TabElement.StyleRemove = TabElement.StyleActive;
			TabElement.Style = TabElement.StyleInactive;
		}

		if (TabElement.TabID == TabID ) {
			TabElement.Active = true;
			TabElement.StyleRemove = TabElement.StyleInactive;
			TabElement.Style = TabElement.StyleActive;
		}

		TabElement.switchStyle();
	}

	//- activate deactivate child objects
	for (TabKey in Tabs) {
		TabElement = Tabs[TabKey];
		if (TabElement.Active == true) {
			this.RootObject.getObjectByID(TabElement.TabID).activate();
		}
		if (TabElement.Active == false) {
			this.RootObject.getObjectByID(TabElement.TabID).deactivate();
		}
	}

}
