//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "sysSourceObjectHandler"                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysSourceObjectHandler"
//------------------------------------------------------------------------------

function sysSourceObjectHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysSourceObjectHandler.prototype.processSourceObjects = function() {

	if (this.Config.Attributes === undefined) {
		return;
	}

	var Objects = this.Config.Attributes.SrcDataObjects;

	//console.log('**** SourceObjectHandler ****');
	//console.log(Objects);

	if (Objects != null && Objects !== undefined) {

		for (SrcObjectID in Objects) {

			//console.log('SourceObjectHandler');
			//console.log(SrcObjectID);

			var SourceObject = Objects[SrcObjectID];
			//console.log(SourceObject);

			var ScreenID = SourceObject.ScreenID;
			//console.log(ScreenID);

			var ScreenObj = (ScreenID != null && ScreenID !== undefined) ? sysFactory.getScreenByID(ScreenID):this.ConfigObject.ScreenObject;
			//console.log(ScreenObj);

			var ObjectResultData = new Object();

			switch (SrcObjectID) {

				case "DBPrimaryKey":

					var Item = new Object();
					Item['DBPrimaryKeyID'] = SourceObject.DBPrimaryKeyID;
					Item['DBPrimaryKeyValue'] = ScreenObj.DBPrimaryKeyValue;
					ObjectResultData = Item;

					break;

				case "SourceObject":

					var Item = new Object();
					Item['SourceObjectSelectedColumnId'] = SourceObject.FilterColumn;
					Item['SourceObjectSelectedColumnValue'] = ScreenObj.SourceObjectFilter[SourceObject.FilterColumn];
					ObjectResultData = Item;

					break;


				case "HardcodedValues":

					for (var Key in SourceObject) {
						var Value = SourceObject[Key];
						var Item = new Object();
						Item[Key] = Value;
						this.PostRequestData.merge(Item);
					}

					break;

				case "FormfieldList":

					/*
					console.log('#### FormfieldList');
					console.log(ScreenObj);
					console.log(SourceObject);
					console.log(SourceObject.FormListID);
					*/

					if (SourceObject.FormListIDs != null && SourceObject.FormListIDs !== undefined) {
						for (var Index in SourceObject.FormListIDs) {

							var TmpResultData;
							var ProcessID = SourceObject.FormListIDs[Index];

							if (ProcessID !== undefined) {
								var ProcessObject = ScreenObj.RootObject.getObjectByID(ProcessID).BaseObject;
								//console.log(ProcessObject);
								TmpResultData = ProcessObject.getFormFieldItemData();
								for (var ItemKey in TmpResultData) {
									ObjectResultData[ItemKey] = TmpResultData[ItemKey];
								}
							}
							else {
								console.log('sysSourceObjectHandler ProcessObject:'+ProcessID+' undefined.');
							}
						}
					}
					else {
						var ProcessObject = ScreenObj.RootObject.getObjectByID(SourceObject.FormListID).BaseObject;
						//console.log(ProcessObject);
						ObjectResultData = ProcessObject.getFormFieldItemData();
					}

					break;

				case "Formfield":

					var FormfieldItem = sysFactory.getFormFieldObjectByID(SourceObject.ID);
					//console.log(ProcessObject);

					var Item = new Object();
					Item[SourceObject.ID] = FormfieldItem.getObjectData();
					ObjectResultData = Item;

					break;

				case "List":

					var ListObject = ScreenObj.RootObject.getObjectByID(SourceObject.ID).BaseObject;
					var ListDataInternal = this.ConfigObject.Object.Attributes.SrcDataListInternal;
					if (ListDataInternal !== undefined && ListDataInternal == true) {
						ObjectResultData = ListObject.Data;
					}
					if (ListDataInternal === undefined || ListDataInternal == false) {
						ObjectResultData = ListObject.getObjectData();
					}
					
					break;

			}

			//console.log(ProcessObject);

			//console.log('ObjectResultData');
			//console.log(ObjectResultData);
			this.PostRequestData.merge(ObjectResultData);

		}

	}

}
