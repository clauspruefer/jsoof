//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Menu" Object                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Menu Object                                                              -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysMenuItem"
//------------------------------------------------------------------------------

function sysMenuItem()
{
	this.ObjectID		= null;		//- menu item object id
	this.RefID		= null;		//- parent item id
	this.TextID		= null;		//- display text id
	this.ScreenID		= null;		//- screen (link) id

	this.TableRowObject	= null;		//- system table row object/div container
	this.OpenCloseObject	= null;		//- system open close object/div container

	this.MenuLevel		= null;		//- menu hierarchy level

	this.OnClickEvents	= null;		//- on click raise events array

	this.disabled		= false;	//- item disabled/invisible
	this.closed		= false;	//- node closed

	this.ActiveOnFormID	= null;		//- disabled on undefined referenced form field value

	this.ChildObjects	= Object(); 	//- recursive child menu items
}

//- inherit sysBaseObject
sysMenuItem.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerOpenClose"
//------------------------------------------------------------------------------
sysMenuItem.prototype.EventListenerOpenClose = function(Event)
{

	//------------------------------------------------------------------------------
	//- toggle row object recursive
	//------------------------------------------------------------------------------
	this.toggleItem();

	//------------------------------------------------------------------------------
	//- update row positions
	//------------------------------------------------------------------------------
	var MenuObj = new sysMenu();
	var topPositionGenerator = MenuObj.topPositionGenerator();

	sysFactory.MenuRootItem.updateDisplay(topPositionGenerator);

	//------------------------------------------------------------------------------
	//- switch open close div style
	//------------------------------------------------------------------------------
	this.switchOpenCloseState();

}


//------------------------------------------------------------------------------
//- METHOD "toggleItem"
//------------------------------------------------------------------------------
sysMenuItem.prototype.toggleItem = function(init=true, recurse=true)
{
	//- do not process clicked (first) item
	if (init == false) {
		if (this.disabled == true) {
			this.disabled = false;
			this.TableRowObject.activate();
		}
		else if (this.disabled == false) {
			this.disabled = true;
			this.TableRowObject.deactivate();
		}
	}

	//- do not recurse on already closed node child items
	if (recurse == true) {
		for (ChildObj in this.ChildObjects) {
			var ChildItem = this.ChildObjects[ChildObj];

			var dorecurse = true;
			if (ChildItem.closed == true) { dorecurse = false; }

			ChildItem.toggleItem(false, dorecurse);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "logState"
//------------------------------------------------------------------------------
sysMenuItem.prototype.logState = function()
{
	//console.log('### ITEM ObjectID:' + this.ObjectID + ' disabled:' + this.disabled + ' closed:' + this.closed);

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.logState();
	}
}


//------------------------------------------------------------------------------
//- METHOD "switchOpenCloseState"
//------------------------------------------------------------------------------
sysMenuItem.prototype.switchOpenCloseState = function()
{
	if (this.closed == true) {
		this.OpenCloseObject.removeDOMElementStyle('sysMenuOpenCloseImageClosed');
		this.OpenCloseObject.addDOMElementStyle('sysMenuOpenCloseImageOpened');
		this.closed = false;
	}
	else if (this.closed == false) {
		this.OpenCloseObject.removeDOMElementStyle('sysMenuOpenCloseImageOpened');
		this.OpenCloseObject.addDOMElementStyle('sysMenuOpenCloseImageClosed');
		this.closed = true;
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplay"
//------------------------------------------------------------------------------
sysMenuItem.prototype.updateDisplay = function(topPositionGenerator, init=true)
{
	if (init == false && this.disabled == false) {
		this.TableRowObject.DOMStyleTop = topPositionGenerator.next().value;
		this.TableRowObject.setDOMElementStyleAttributes();
	}

	for (ChildObj in this.ChildObjects) {
		var ChildItem = this.ChildObjects[ChildObj];
		ChildItem.updateDisplay(topPositionGenerator, false);
	}

}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysMenu"
//------------------------------------------------------------------------------

function sysMenu()
{
	this.MenuRootItem	= new sysMenuItem();
	this.MenuRootObject	= new sysObjBaseDiv();
}

//- base sync loader
sysMenu.prototype = new sysXMLRPCBaseSyncLoader();


//------------------------------------------------------------------------------
//- METHOD "addMenuItemsRecursive"
//------------------------------------------------------------------------------

sysMenu.prototype.addMenuItemsRecursive = function(ItemID, ItemObj, HierarchyLevel=0)
{

	var MenuItems = this.getRefMenuItemsByItemId(ItemID);

	for (MenuItemKey in MenuItems) {

		var MenuItem = MenuItems[MenuItemKey];
		var AddMenuItem = new sysMenuItem();

		AddMenuItem.ObjectID		= MenuItemKey;
		AddMenuItem.RefID		= MenuItem.RefID;
		AddMenuItem.TextID		= MenuItem.TextID;
		AddMenuItem.ScreenID		= MenuItem.ScreenID;
		AddMenuItem.IconStyle		= 'sysMenuIcon' + MenuItem.IconStyle;
		AddMenuItem.MenuLevel		= HierarchyLevel;
		AddMenuItem.OnClickEvents	= MenuItem.OnClickEvents;
		AddMenuItem.ActiveOnFormID	= MenuItem.ActiveOnFormID;

		//console.log('Add to Item.ObjectID:'+ ItemObj.ObjectID + ' ' + AddMenuItem.ObjectID);
		ItemObj.addObject(AddMenuItem);

		HierarchyLevel +=1;
		this.addMenuItemsRecursive(MenuItemKey, AddMenuItem, HierarchyLevel);
		HierarchyLevel -=1;

	}

}


//------------------------------------------------------------------------------
//- METHOD "getRefMenuItemsByItemId"
//------------------------------------------------------------------------------

sysMenu.prototype.getRefMenuItemsByItemId = function(ItemId)
{
	//console.log('getRefMenuItemsByItemId ItemId:' + ItemId);

	var RefMenuItems = new Object();

	for (MenuItemKey in this.XMLRPCResultData) {
		var MenuItemObj = this.XMLRPCResultData[MenuItemKey];
		if (MenuItemObj.RefID == ItemId) {
			RefMenuItems[MenuItemKey] = MenuItemObj;
		}
	}

	return RefMenuItems;
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysMenu.prototype.init = function()
{

	//------------------------------------------------------------------------------
	//- set root menu attributes
	//------------------------------------------------------------------------------

	this.MenuRootItem.ObjectID = 'MenuRoot';
	this.addMenuItemsRecursive('MenuRoot', this.MenuRootItem);

	sysFactory.MenuRootItem = this.MenuRootItem;

	//------------------------------------------------------------------------------
	//- set menu root object/element div, add menu table object
	//------------------------------------------------------------------------------

	this.MenuRootObject.ObjectID = 'sysMenu';

	var MenuTableObj = new sysObjBaseDiv();
	MenuTableObj.ObjectID = 'sysMenuTable';
	MenuTableObj.DOMStyle = 'sysMenuTable';

	//------------------------------------------------------------------------------
	//- init top position generator for menu y position
	//------------------------------------------------------------------------------
	var topPosGenerator = this.topPositionGenerator();

	//------------------------------------------------------------------------------
	//- process menu child objects recursive
	//------------------------------------------------------------------------------
	MenuItems = this.MenuRootItem.getObjects();
	for (MenuItemKey in MenuItems) {

		MenuItem = MenuItems[MenuItemKey];
		MenuTableRowObj = this.addRow(MenuItem, topPosGenerator);
		MenuTableObj.addObject(MenuTableRowObj);

	}

	this.MenuRootObject.addObject(MenuTableObj);


	//------------------------------------------------------------------------------
	//- "render()" root object/child objects
	//------------------------------------------------------------------------------
	this.MenuRootObject.renderObject(null);

	//------------------------------------------------------------------------------
	//- add event listeners (menuclick)
	//------------------------------------------------------------------------------

	for (MenuItemKey in MenuItems) {
		var MenuItem = MenuItems[MenuItemKey];
		var LinkObj = this.MenuRootObject.getObjectByID('sysMenuTableRow' + MenuItem.ObjectID + 'ColLinkLink');
		LinkObj.RaiseEvents = MenuItem.OnClickEvents;
		LinkObj.addEventListener('click', LinkObj.EventListener.bind(LinkObj));
	}

	//------------------------------------------------------------------------------
	//- add event listeners (openclose)
	//------------------------------------------------------------------------------

	for (MenuItemKey in MenuItems) {
		var MenuItem = MenuItems[MenuItemKey];
		if (MenuItem.getObjectCount() > 0) {
			var OpenCloseObj = this.MenuRootObject.getObjectByID('sysMenuTableRow' + MenuItem.ObjectID + 'ColOpenCloseImage');
			OpenCloseObj.addEventListener('click', MenuItem.EventListenerOpenClose.bind(MenuItem));
		}
	}

	//------------------------------------------------------------------------------
	//- generate breadcrumb nav object
	//------------------------------------------------------------------------------
	

}


//------------------------------------------------------------------------------
//- METHOD "topPositionGenerator"
//------------------------------------------------------------------------------

sysMenu.prototype.topPositionGenerator = function*()
{
	topPosition = -18;

	while(true) {
		topPosition += 21;
		yield topPosition.toString() + 'px';
	}
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysMenu.prototype.addRow = function(MenuItem, PosGenerator)
{

	//- set "table" object row id
	var RowID = MenuItem.ObjectID;
	var RowBaseName = 'sysMenuTableRow' + RowID;

	//- get next y position from generator
	var TopPosition = PosGenerator.next().value;

	//- setup base table object/div element
	var MenuTableRowObj = new sysObjBaseDiv();
	MenuTableRowObj.ObjectID = RowBaseName;
	MenuTableRowObj.DOMStyle = 'sysMenuTableRow';
	MenuTableRowObj.DOMStyleTop = TopPosition;

	//- setup container columns (hierarchy, openclose, icon, link)
	var MenuTableColHierarchyObj = new sysObjBaseDiv();
	MenuTableColHierarchyObj.ObjectID = RowBaseName + 'ColHierarchyLevel';
	MenuTableColHierarchyObj.DOMStyle = 'sysMenuTableRowColHierarchyLevel';

	var MenuTableColOpenCloseObj = new sysObjBaseDiv();
	MenuTableColOpenCloseObj.ObjectID = RowBaseName + 'ColOpenClose';
	MenuTableColOpenCloseObj.DOMStyle = 'sysMenuTableRowColOpenClose';

	var MenuTableColIconObj = new sysObjBaseDiv();
	MenuTableColIconObj.ObjectID = RowBaseName + 'ColIcon';
	MenuTableColIconObj.DOMStyle = 'sysMenuTableRowColIcon';

	var MenuTableColLinkObj = new sysObjBaseDiv();
	MenuTableColLinkObj.ObjectID = RowBaseName + 'ColLink';
	MenuTableColLinkObj.DOMStyle = 'sysMenuTableRowColLink';

	//- setup hierarchy object (image)
	var MenuTableColHierarchyImageObj = new sysObjImage();
	MenuTableColHierarchyImageObj.ObjectID = RowBaseName + 'ColHierarchyLevelImage';
	MenuTableColHierarchyImageObj.DOMStyle = 'sysMenuHierarchyLevelImage';
	MenuTableColHierarchyImageObj.DOMStyleLeft = ((MenuItem.MenuLevel*2)+6).toString() + 'px';

	//- setup open close icon object (image)
	var MenuTableColOpenCloseImageObj = new sysObjImage();
	MenuTableColOpenCloseImageObj.ObjectID = RowBaseName + 'ColOpenCloseImage';
	if (MenuItem.getObjectCount() > 0) {
		MenuTableColOpenCloseImageObj.DOMStyle = 'sysMenuOpenCloseImageOpened';
	}

	//- add objects to menu item, so it can be referenced by event handler(s)
	MenuItem.TableRowObject = MenuTableRowObj;
	MenuItem.OpenCloseObject = MenuTableColOpenCloseImageObj;

	//- setup icon object (image)
	var MenuTableColIconImageObj = new sysObjImage();
	MenuTableColIconImageObj.ObjectID = RowBaseName + 'ColIconImage';
	MenuTableColIconImageObj.DOMStyle = MenuItem.IconStyle;

	//- setup link object (link)
	var MenuTableColLinkLinkObj = new sysObjLink();
	MenuTableColLinkLinkObj.ObjectID = RowBaseName + 'ColLinkLink';
	MenuTableColLinkLinkObj.DOMStyle = 'sysMenuTableLink';
	MenuTableColLinkLinkObj.TextID = MenuItem.TextID;
	MenuTableColLinkLinkObj.ScreenID = MenuItem.ScreenID;
	MenuTableColLinkLinkObj.ActiveOnFormID = MenuItem.ActiveOnFormID;
	MenuTableColLinkLinkObj.init();

	MenuTableColLinkLinkObj.DOMStylePaddingLeft = ((MenuItem.MenuLevel*4)+4).toString() + 'px';

	//- add objects to parent objects
	MenuTableColHierarchyObj.addObject(MenuTableColHierarchyImageObj);
	MenuTableColOpenCloseObj.addObject(MenuTableColOpenCloseImageObj);
	MenuTableColIconObj.addObject(MenuTableColIconImageObj);
	MenuTableColLinkObj.addObject(MenuTableColLinkLinkObj);

	MenuTableRowObj.addObject(MenuTableColHierarchyObj);
	MenuTableRowObj.addObject(MenuTableColOpenCloseObj);
	MenuTableRowObj.addObject(MenuTableColIconObj);
	MenuTableRowObj.addObject(MenuTableColLinkObj);

	return MenuTableRowObj;
}
