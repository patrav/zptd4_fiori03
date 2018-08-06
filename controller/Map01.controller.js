sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"zptd4_fiori03/model/formatter",
	"zptd4_fiori03/model/Peacht"
], function(Controller, formatter, Peacht) {
	"use strict";

	return Controller.extend("zptd4_fiori03.controller.Map01", {

		formatter 	: formatter,
		Peacht 		: Peacht,
		
		//--------------------------------------------------------------------------------
		//Initialize
		//--------------------------------------------------------------------------------
		onInit: function () {
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("to_map01").attachPatternMatched(this._onObjectMatched,this);

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
			
			var that		= this;
			var oCTX 		= Peacht.getContext(oController);
			var aFilters 	= [];
			
			aFilters.push(Peacht.filterEQ("Srvda",oCTX.SDash01.Srvda));
			aFilters.push(Peacht.filterEQ("Dcate","ORDSMAP"));
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
					
					that.setMap(that);
				},
			});
			
		},
		//--------------------------------------------------------------------------------
		//Set Google Maps Position
		//--------------------------------------------------------------------------------
		setMap: function(oController){
			
			var oCTX 	= Peacht.getContext(oController);
			var oMap 	= document.getElementById("map_canvas");
			var wInfo 	= new google.maps.InfoWindow();
			//var oLatLng = new google.maps.LatLng(lat,lng);
			var oMark;
			
			var oOption = {
				zoom 		: 6,
				center 		: new google.maps.LatLng(13.765465,100.538301),
				mapTypeId 	: google.maps.MapTypeId.ROADMAP,
			};
			
			gMap  = new google.maps.Map(oMap,oOption);
			for(var i=0;i<oCTX.TDash01.length;i++){
				
				//Marker
				var itm = oCTX.TDash01[i];
				var lat = parseFloat(itm.Latc);
				var lng = parseFloat(itm.Lngc);
				oMark = new google.maps.Marker({
					map			: gMap,
					title		: itm.Fkey,
					label		: itm.Fkey,
					position	: new google.maps.LatLng(lat,lng)
				});
				
				//Info Windows
			    google.maps.event.addListener(oMark, 'click', (function(marker) {
			        return function() {
			        	wInfo.setContent("<p>Order: " + itm.Fkey + "</p><p>Amount: " + itm.Fval01 + "</p>");
			        	wInfo.open(gMap, marker);
			        }
			     })(oMark));
			};
		},
		//--------------------------------------------------------------------------------
		//Initialize
		//--------------------------------------------------------------------------------
		onAfterRendering: function() {
			
			//this.setMap(this);
			
//			var oCTX 	= Peacht.getContext(this);
//			var oMap 	= document.getElementById("map_canvas");
//			var wInfo 	= new google.maps.InfoWindow();
//			//var oLatLng = new google.maps.LatLng(lat,lng);
//			var oMark;
//			
//			var oOption = {
//				zoom 		: 10,
//				center 		: new google.maps.LatLng(13.727684,100.532622),
//				mapTypeId 	: google.maps.MapTypeId.ROADMAP,
//			};
//			
//			gMap  = new google.maps.Map(oMap,oOption);
//			for(var i=0;i<oCTX.TDash01.length;i++){
//				
//				//Marker
//				oMark = new google.maps.Marker({
//					map			: gMap,
//					title		: "23,900",
//					label		: "23,900",
//					position	: new google.maps.LatLng(13.727684,100.532622)
//				});
//				
//				//Info Windows
//			    google.maps.event.addListener(oMark, 'click', (function(marker) {
//			        return function() {
//			        	wInfo.setContent("<p>Order : 10001</p><p>Amount : 23,900</p>");
//			        	wInfo.open(gMap, marker);
//			        }
//			     })(oMark));
//			};

			
//			var oLatLng = new google.maps.LatLng(lat,lng);
//			var oOption = {
//				zoom 		: 16,
//				center 		: oLatLng,
//				mapTypeId 	: google.maps.MapTypeId.ROADMAP,
//			};
//			wInfo = new google.maps.InfoWindow();
//			gMap  = new google.maps.Map(oMap,oOption);
//			gMark = new google.maps.Marker({map:gMap,title:"23,900",label:"23,900",position: new google.maps.LatLng(13.727684,100.532622)});
//		    google.maps.event.addListener(gMark, 'click', (function(marker) {
//		        return function() {
//		        	wInfo.setContent("<p>Order : 10001</p><p>Amount : 23,900</p>");
//		        	wInfo.open(gMap, marker);
//		        }
//		     })(gMark));
//		    
//			
//			gMark = new google.maps.Marker({map:gMap,title:"10,100",label:"10,100",position: new google.maps.LatLng(13.727684,100.537965)});
//		    google.maps.event.addListener(gMark, 'click', (function(marker) {
//		        return function() {
//		        	wInfo.setContent("<p>Order : 10002</p><p>Amount : 10,100</p>");
//		        	wInfo.open(gMap, marker);
//		        }
//		     })(gMark));

		},
	});

});