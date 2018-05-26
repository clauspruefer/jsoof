//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2016                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Reactor"                                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysReactor"
//------------------------------------------------------------------------------

function sysEvent(ID, Object, Type) {
	this.ID = ID;
	this.ObjectRef = Object;
	this.Type = Type;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysReactor"
//------------------------------------------------------------------------------

function sysReactor() {
	this.Events = new Array();
}


//------------------------------------------------------------------------------
//- METHOD "registerEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.registerEvent = function(Attributes, Object, Type='ServiceConnector') {

	//console.log('sysReactor.registerEvent() Attributes:%o Object:%o, Type:%s', Attributes, Object, Type);

	if (Attributes.OnEvent !== undefined) {
		for (EventKey in Attributes.OnEvent.Events) {
			var EventID = Attributes.OnEvent.Events[EventKey];
			var Event = new sysEvent(EventID, Object, Type);
			this.Events.push(Event);
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "dispatchEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.dispatchEvent = function(EventID) {

	//console.log('Reactor Dispatch Event. EventID:%s Events Object::%o', EventID, this.Events);

	for (EventKey in this.Events) {

		var EventObj = this.Events[EventKey];

		if (EventObj.ID == EventID) {

			var ProcessObj = EventObj.ObjectRef;

			//console.log('Reactor Dispatch Event. EventObject::%o', EventObj);

			switch (EventObj.Type) {

				case "ServiceConnector":

					//console.log('Reactor Dispatch Event. ServiceConnector Object:%o', ProcessObj.ServiceConnector);

					var BaseObject = ProcessObj.RootObject.BaseObject;
					BaseObject.processSourceObjects();
					BaseObject.DataURL = ProcessObj.ServiceConnector.Attributes.OnEvent.ServiceCall;

					//- add backend service identifier
					BaseObject.PostRequestData.addServiceProperty('BackendServiceID', ProcessObj.ServiceConnector.Attributes.OnEvent.ServiceID);
					BaseObject.getData();
	
					break;

				case "Dynpulldown":

					//console.log('Reactor Dispatch Event. Dynpulldown:%o', ProcessObj);
					ProcessObj.updateValue();

					break;

			}

		}

	}

}


//------------------------------------------------------------------------------
//- METHOD "fireEvents"
//------------------------------------------------------------------------------
sysReactor.prototype.fireEvents = function(FireEvents) {
	//console.log('Reactor Fire Events. Events Array:%o', FireEvents);
	for (EventKey in FireEvents) {
		var Event = FireEvents[EventKey];
		sysFactory.Reactor.dispatchEvent(Event);
	}
}
