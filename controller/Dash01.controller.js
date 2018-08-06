sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"zptd4_fiori03/model/formatter",
	"zptd4_fiori03/model/Peacht"
], function(Controller, formatter, Peacht) {
	"use strict";

	return Controller.extend("zptd4_fiori03.controller.Dash01", {

		formatter 	: formatter,
		Peacht 		: Peacht,
		
		//--------------------------------------------------------------------------------
		//Initialize
		//--------------------------------------------------------------------------------
		onInit: function () {
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("to_dash01").attachPatternMatched(this._onObjectMatched,this);

		},
		//--------------------------------------------------------------------------------
		//Load order from SAP
		//--------------------------------------------------------------------------------
		_onObjectMatched: function (evt){
			
			this.listData(this);
			
			this.f4DTyp(this);
			
		},
		//--------------------------------------------------------------------------------
		//Get F4 Report Engine
		//--------------------------------------------------------------------------------
		f4DTyp: function(oController){
			
			var oCTX 		= Peacht.getContext(oController);
			
			//F4 Type
			Peacht.odataDispatch({
				oModelM		: oCTX.oModelM,
				oModelV		: oCTX.oModelV,
				oController	: oController,
				mode		: "FUNC",
				path		: "/F4Request",
				parm		: {"Cate" : "DASH_TYPE"},
				success		: function(evt){ Peacht.oDataSetResult(oCTX.oModelV,"/F4DTyp",evt.oDataIn); },
			});	
		},
		//--------------------------------------------------------------------------------
		//Load order from SAP
		//--------------------------------------------------------------------------------
		listData: function(oController){

			var oCTX 		= Peacht.getContext(oController);
			var aFilters 	= [];
			
			aFilters.push(Peacht.filterEQ("Engine",oCTX.SDash01.Engine));
			aFilters.push(Peacht.filterEQ("Dcate","ORDOVW"));
			
			Peacht.odataDispatch({
				oModelM		: oCTX.oModelM,
				oModelV		: oCTX.oModelV,
				oController	: oController,
				mode		: "READ",
				path		: "/Dash01Set",
				filter		: aFilters,
				error		: function(evt){},
				success		: function(evt){ Peacht.oDataSetResult(oCTX.oModelV,"/TDash01",evt.oDataIn); },
			});
			
		},

	});

});