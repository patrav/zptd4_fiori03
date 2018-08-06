sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"zptd4_fiori03/model/formatter",
	"zptd4_fiori03/model/Peacht"
], function(Controller, formatter, Peacht) {
	"use strict";

	return Controller.extend("zptd4_fiori03.controller.Dash02", {

		formatter 	: formatter,
		Peacht 		: Peacht,
		
		//--------------------------------------------------------------------------------
		//Initialize
		//--------------------------------------------------------------------------------
		onInit: function () {
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("to_dash02").attachPatternMatched(this._onObjectMatched,this);

		},
		//--------------------------------------------------------------------------------
		//Load order from SAP
		//--------------------------------------------------------------------------------
		_onObjectMatched: function (evt){
			
			this.listData(this);
			
			this.f4Srvda(this);
		},
		//--------------------------------------------------------------------------------
		//Get F4 Service Day Event
		//--------------------------------------------------------------------------------
		f4Srvda: function(oController){
			
			var oCTX 		= Peacht.getContext(oController);
			
			//F4 Type
			Peacht.odataDispatch({
				oModelM		: oCTX.oModelM,
				oModelV		: oCTX.oModelV,
				oController	: oController,
				mode		: "FUNC",
				path		: "/F4Request",
				parm		: {"Cate" : "SRVDA"},
				success		: function(evt){ Peacht.oDataSetResult(oCTX.oModelV,"/F4Srvda",evt.oDataIn); },
			});	
		},
		//--------------------------------------------------------------------------------
		//Load order from SAP
		//--------------------------------------------------------------------------------
		listData: function(oController){

			var oCTX 		= Peacht.getContext(oController);
			var aFilters 	= [];
			
			aFilters.push(Peacht.filterEQ("Srvda",oCTX.SDash01.Srvda));
			aFilters.push(Peacht.filterEQ("Dcate","ORDSDAY"));
			Peacht.odataDispatch({
				oModelM		: oCTX.oModelM,
				oModelV		: oCTX.oModelV,
				oController	: oController,
				mode		: "READ",
				path		: "/Dash01Set",
				filter		: aFilters,
				error		: function(evt){},
				success		: function(evt){ 
					
					Peacht.oDataSetResult(oCTX.oModelV,"/TDash01",evt.oDataIn); 
					if(evt.oDataIn){
						if(evt.oDataIn.results.length > 0){
						oCTX.SDash01.Srvda = evt.oDataIn.results[0].Srvda;
						oCTX.oModelV.setProperty("/SDash01",oCTX.SDash01);
					}};
				},
			});
			
		},

	});

});