//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldOnChangeHandler" Object                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldOnChangeHandler Object                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldOnChangeHandler"
//------------------------------------------------------------------------------

class sysFormFieldOnChangeHandler {

	static dispatch(FormObj) {
		if (FormObj.OnChange == 'UpdateTableRowColObject') {
			this.updateTableRowColObject(FormObj);
		}
	}

	//- scan table row for column/value match
	static updateTableRowColObject(FormObj) {

		//- get referenced table object
		var DstTableObj = sysFactory.getObjectByID(FormObj.OnChangeDstObject).BaseObject;

		//- get compare objects value
		var CompareObj = sysFactory.getObjectByID(FormObj.OnChangeCompareObject);
		var CompareObjValue = CompareObj.ParentObject.BaseObject.FormFieldItems[FormObj.OnChangeCompareObject].getRuntimeData();

		//- get table runtime data
		var TableData = DstTableObj.getRuntimeData();

		//- loop on list data
		for (var RowIndex in TableData) {

			var Row = TableData[RowIndex];
			var CompareValue = Row[FormObj.OnChangeDstMatchColumn];

			//console.log('CompareObj:'+CompareObjValue+' CompareValue:'+CompareValue);

			if (CompareObjValue == CompareValue) {

				var TableCols = DstTableObj.getRuntimeColObjects(FormObj.OnChangeDstUpdateColumn);
				var TableCol = TableCols[RowIndex];

				//console.log(TableCol);

				var UpdateValue;

				var SrcObjDef = FormObj.OnChangeDstUpdateValueSrcObject;

				if (SrcObjDef != null && SrcObjDef !== undefined) {
					var SrcObj = sysFactory.getObjectByID(SrcObjDef);
					UpdateValue = CompareObj.ParentObject.BaseObject.FormFieldItems[SrcObjDef].getRuntimeData();
				}
				else {
					UpdateValue = FormObj.OnChangeDstUpdateValue;
				}

				TableCol.FormFieldItem.Value = UpdateValue;
				TableCol.FormFieldItem.updateValue();

				//-- process table row style update
				this.updateTableRowStyle(FormObj, DstTableObj, RowIndex);

			}

		}

	}

	//- update table row style
	static updateTableRowStyle(FormObj, DstTableObj, RowIndex) {

		var ProcessObj = FormObj.OnChangeDstUpdateRowStyle;

		if (ProcessObj != null && ProcessObj !== undefined) {

			var MatchHandlerObj = new MatchHandler();

			for (var MatchIndex in ProcessObj.match) {

				var MatchObj =  ProcessObj.match[MatchIndex];
				var TableCols = DstTableObj.getRuntimeColObjects(MatchIndex);

				var Attributes = Object();

				MatchHandlerObj.addMatchItem(
					new MatchHandlerItem(TableCols[RowIndex], MatchObj)
				);

			}

			var ChangeObj = ProcessObj.change;
			var Result = MatchHandlerObj.checkResult();

			var setStyle = Result ? ChangeObj.positive : ChangeObj.negative;

			var TableRowObj = DstTableObj.RowItems[RowIndex];

			TableRowObj.ConfigObject.DOMDivElement.classList.remove(ChangeObj.positive);
			TableRowObj.ConfigObject.DOMDivElement.classList.remove(ChangeObj.negative);

			TableRowObj.ConfigObject.DOMDivElement.classList.add(setStyle);
		}

	}

}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "MatchHandler"
//------------------------------------------------------------------------------

function MatchHandler() {

	this.MatchItems = Array();				//- MatchItems

}


//------------------------------------------------------------------------------
//- METHOD "addMatchItem"
//------------------------------------------------------------------------------

MatchHandler.prototype.addMatchItem = function(Item) {
	this.MatchItems.push(Item);
	Item.process();
}


//------------------------------------------------------------------------------
//- METHOD "checkResult"
//------------------------------------------------------------------------------

MatchHandler.prototype.checkResult = function() {

	var CountPositive = 0;

	for (Index in this.MatchItems) {
		CountPositive += this.MatchItems[Index].MatchResult ? 1 : 0;
	}
	console.log(CountPositive);
	return CountPositive == this.MatchItems.length ? true : false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "MatchHandler"
//------------------------------------------------------------------------------

function MatchHandlerItem(TableCol, Attributes) {

	this.TableCol		= TableCol;			//- Table Column Object
	this.Type		= Attributes.Type;		//- Match Type
	this.Match		= Attributes.Match;		//- Match
	this.Operator		= Attributes.Operator;		//- Match Operator
	this.Value		= Attributes.Value;		//- Compare Value

	this.MatchResult	= false;			//- Match Result
}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

MatchHandlerItem.prototype.process = function() {

	var TableColValue = this.TableCol.FormFieldItem.getRuntimeData();

	if (this.Match == 'length' && this.Operator == '>') {
		this.MatchResult = TableColValue.length > this.Value ? true : false;
	}

	if (this.Match == 'string' && this.Operator == '==') {
		this.MatchResult = TableColValue == this.Value ? true : false;
	}

}
