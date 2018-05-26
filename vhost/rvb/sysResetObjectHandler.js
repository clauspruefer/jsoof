//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2015                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "sysResetObjectHandler"                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysResetObjectHandler"
//------------------------------------------------------------------------------

function sysResetObjectHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "processResetObjects"
//------------------------------------------------------------------------------

sysResetObjectHandler.prototype.processResetObjects = function() {

	var Objects = this.Config.Attributes.ResetObjects;

	/*
	console.log('**** ResetObjectHandler ****');
	console.log(Objects);
	*/

	if (Objects != null && Objects !== undefined) {

		for (ResetObjectID in Objects) {

			//console.log('ResetObjectHandler');
			//console.log(ResetObjectID);

			var ResetObject = Objects[ResetObjectID];
			//console.log(ResetObject);

			var ScreenID = ResetObject.ScreenID;
			//console.log(ScreenID);

			var ScreenObj = (ScreenID != null && ScreenID !== undefined) ? sysFactory.getScreenByID(ScreenID):this.ConfigObject.ScreenObject;
			//console.log(ScreenObj);

			switch (ResetObjectID) {

				case "List":

					var ProcessObject = ScreenObj.RootObject.getObjectByID(ResetObject.ID).BaseObject;
					//console.log(ProcessObject);

					break;

			}

			ProcessObject.reset();

			//console.log(ProcessObject);

		}

	}

}
