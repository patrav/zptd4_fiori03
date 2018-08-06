sap.ui.define([
	"sap/m/Input",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/m/BusyDialog",
	"sap/m/StandardListItem",
	], function (Input, Msgbox, MsgToast, History, BusyDialog, StandardListItem) {
	"use strict";
	return {
		//--------------------------------------------------------------------------------
		//getContext: Get View Context 
		//--------------------------------------------------------------------------------
		getContext: function(oController){
			
			var oDataEx = {
				oModelM 	: this.getModel(oController),
				oModelV		: oController.getView().getModel("view"),
				i18n		: oController.getView().getModel("i18n"),
				that    	: oController,
				Router		: sap.ui.core.UIComponent.getRouterFor(oController),
				AppTitle	: oController.getView().getModel("i18n").getResourceBundle().getText("title"),
				Tech		: oController.getView().getModel("view").getProperty("/Tech"),
				TBapiret2	: oController.getView().getModel("view").getProperty("/TBapiret2"),
				SDash01		: oController.getView().getModel("view").getProperty("/SDash01"),
				TDash01		: oController.getView().getModel("view").getProperty("/TDash01"),
				SBapiret2	: {},
			};
			return oDataEx;

		},
		//--------------------------------------------------------------------------------
		//oData Dispatch
		//--------------------------------------------------------------------------------
		odataDispatch: function (oParm) {
			
			var that   = this;
			
			if(!oParm.silent){
				this.popBusy().open();
			};
			
			//Read Begin
			if(oParm.mode === "READ"){
				oParm.oModelM.read(oParm.path,{
					filters 		: oParm.filter,
					urlParameters	: oParm.parm,
					success	: function(oDataIn, oResponseIn){
						that.odataDispatchsuc({
							oParm		: oParm, 
							oDataIn		: oDataIn, 
							oResponseIn	: oResponseIn
						});
					},
					error: function(oError){
						that.odataDispatcherr({
							oParm		: oParm, 
							oError		: oError
						});
					}
				});
			};
			//Read End
			
			//Create Begin
			if(oParm.mode === "CREATE"){
				oParm.oModelM.create(oParm.path,oParm.oDataEx,{
					groupId	: oParm.groupId,
					success	: function(oDataIn, oResponseIn){
						that.odataDispatchsuc({
							oParm		: oParm, 
							oDataIn		: oDataIn, 
							oResponseIn	: oResponseIn
						});
					},
					error: function(oError){
						that.odataDispatcherr({
							oParm		: oParm, 
							oError		: oError
						});
					}
				});
			};
			//Create End
			
			
			//Remove Begin
			if(oParm.mode === "REMOVE"){
				oParm.oModelM.remove(oParm.path,{
					success	: function(oDataIn, oResponseIn){
						that.odataDispatchsuc({
							oParm		: oParm, 
							oDataIn		: oDataIn, 
							oResponseIn	: oResponseIn
						});
					},
					error: function(oError){
						that.odataDispatcherr({
							oParm		: oParm, 
							oError		: oError
						});
					}
				});
			};
			//Remove End
			
			
			//Function Begin
			if(oParm.mode === "FUNC"){
				oParm.oModelM.callFunction(oParm.path,{
					method			: "GET",
					urlParameters	: oParm.parm,
					success	: function(oDataIn, oResponseIn){
						that.odataDispatchsuc({
							oParm		: oParm, 
							oDataIn		: oDataIn, 
							oResponseIn	: oResponseIn
						});
					},
					error: function(oError){
						that.odataDispatcherr({
							oParm		: oParm, 
							oError		: oError
						});
					}
				});
			};
			//Function End
		},
		//--------------------------------------------------------------------------------
		//oData Dispatch Success
		//--------------------------------------------------------------------------------
		odataDispatchsuc: function(evt){
			
			this.popBusy().close();
			if(this.isODataErr(evt.oResponseIn)){ return; };
			if(evt.oParm.success){ 
				evt.oParm.oDataIn 		= evt.oDataIn; 
				evt.oParm.oResponseIn 	= evt.oResponseIn; 
				evt.oParm.success(evt.oParm); 
			};
		},
		//--------------------------------------------------------------------------------
		//oData Dispatch Error
		//--------------------------------------------------------------------------------
		odataDispatcherr: function(evt){
			
			this.popBusy().close();
			if(evt.oParm.error){ 
				evt.oParm.oError = evt.oError; 
				evt.oParm.ErrMsg = this.getODataErrMsg(evt.oError);
				evt.oParm.error(evt.oParm); 
			}
		},
		//--------------------------------------------------------------------------------
		//Helper: set oData Table Result
		//--------------------------------------------------------------------------------
		oDataSetResult: function(oModelV,path,oData){
			var Dummy = [];
			oModelV.setProperty(path,Dummy);
			if(oData){
				oModelV.setProperty(path,oData.results);
			}
		},
		//--------------------------------------------------------------------------------
		//Helper: Push Filter (EQ)
		//--------------------------------------------------------------------------------
		filterEQ: function(path,value){
			return new sap.ui.model.Filter({
		    	 path		: path, 
		    	 operator	: sap.ui.model.FilterOperator.EQ, 
		    	 value1		: value
		    });
		},
		//--------------------------------------------------------------------------------
		//popConfirm
		//--------------------------------------------------------------------------------
		popConfirm: function(sMsg,oController,fncOK,fncCC){
			
			var oCTX	= this.getContext(oController);			
			Msgbox.confirm(sMsg, {
		          title		: oCTX.AppTitle,
		          onClose	: function(evt){
		        	  if(evt === Msgbox.Action.OK){
		        	  	if(fncOK) { fncOK(evt,oController); }
		        	  }else{ 
		        	  	if(fncCC) { fncCC(evt,oController); }
		        	  }
		        	}
				});		
		},
		//--------------------------------------------------------------------------------
		//popMsgbox
		//--------------------------------------------------------------------------------
		popMsgbox: function (sMsg,oController) {
			
			var oCTX 	= this.getContext(oController);	
			Msgbox.show(sMsg, {title: oCTX.AppTitle});
			
		},
		//--------------------------------------------------------------------------------
		//popMsgToast
		//--------------------------------------------------------------------------------
		popMsgToast: function (sMsg) {
			MsgToast.show(sMsg, {title: ""});
		},
		//--------------------------------------------------------------------------------
		//popBusy
		//--------------------------------------------------------------------------------
		popBusy: function(){
			//var vTitle  = Component.getMetadata().getManifestEntry("sap.app").title;
        	var oDialog = this.getControl("a000Busy");
        	if(!oDialog){
				oDialog = new BusyDialog({
					id					: "a000Busy",
					text				: "Processing...",
					showCancelButton	: true,
					title				: ""
				});
        	};
        	return oDialog;
		},
		//--------------------------------------------------------------------------------
		//Log Viewer
		//--------------------------------------------------------------------------------
		popLog: function(oController){
			
			var oDialog = this.getControl("a000Log");
			
			if(!oDialog){
				var oItm = new sap.m.MessageItem({
					type		: "{view>Type}",
					title		: "{view>Title}",
					description	: "{view>Desp}",
				});
				var a000msgV = new sap.m.MessageView({
					id			: "a000msgV",
					items		: {path:"view>/TBapiret2",template:oItm}
				});
				a000msgV.setModel(oController.getView().getModel("view"),"view");
				var oDialog = new sap.m.Dialog({
					id				: "a000Log",
					resizable		: true,
					contentHeight	: "300px",
					contentWidth	: "500px",
					verticalScrolling: false,
					customHeader	: new sap.m.Bar({contentLeft	:[new sap.m.Label({text:"Message"})],
					 				             	contentMiddle	:	[],
					 				             	contentRight	:	[this.getDiaClsBtn("a000Log")]}),
					content			: a000msgV,
			});}
			return oDialog;
		},
//		//--------------------------------------------------------------------------------
//		//getBundle
//		//--------------------------------------------------------------------------------
//		getBundle: function(evt,txt){
//			return evt.getModel("i18n").getResourceBundle().getText(txt);
//		},
		//--------------------------------------------------------------------------------
		//getControl
		//--------------------------------------------------------------------------------
		getControl: function(sName){
			return sap.ui.getCore().getControl(sName);
		},
		//--------------------------------------------------------------------------------
		//getDatePicker
		//--------------------------------------------------------------------------------
		getDatePicker: function(id,val){
			return new sap.m.DatePicker({
				id				: id,
				displayFormat	: "dd.MM.yyyy",
				valueFormat		: "YYYYMMdd",
				value			: {path: val}
			});
		},
		//--------------------------------------------------------------------------------
		//getTblCel
		//--------------------------------------------------------------------------------
		getTblCel: function(typ,path,path2){
			switch(typ){ 
				
				case "IMG":
					return new sap.m.Image({
						src		: {path:path},
						width	: "200px"
					});
					
				case "DAT":
					return new sap.m.Text({
						text: {path:path, type: new sap.ui.model.type.Date({pattern: "dd.MM.yyyy"})}
					});
					
				case "TXT":
					return new sap.m.Text({text:{path:path}});
					
				case "ICO":
					return new sap.ui.core.Icon({src:"sap-icon://{" + path + "}",size:"16px"});
					
				case "ICF": //Fix Icon
					return new sap.ui.core.Icon({src:"sap-icon://" + path,size:"16px"});
					
				case "OBJ":
					return new sap.m.ObjectIdentifier({title : {path:path},
			     		   						       text  : {path:path2}});
			    case "OBS":
					return new sap.m.ObjectStatus({text : {path:path},
			     		   						   text : {state:path2}}); 
			}
			
		},
		//--------------------------------------------------------------------------------
		//getTblCol
		//--------------------------------------------------------------------------------
		getTblCol: function(typ,txt){
			switch(typ){ 
				case "TXT": 
					return new sap.m.Column({header: new sap.m.Label({text:txt,design:"Bold"})});
					
				case "ICO": 
					return new sap.m.Column({width:"40px", header: new sap.m.Label({text:txt,design:"Bold"})});
			}
		},
		//--------------------------------------------------------------------------------
		//getForm
		//--------------------------------------------------------------------------------
		getForm: function(lbl,col){
			return new sap.ui.layout.form.SimpleForm({
				layout          : "ResponsiveGridLayout",
				editable        : true,
				adjustLabelSpan : false,
				labelSpanXL		: lbl,
				labelSpanL		: lbl,
				labelSpanM		: lbl,
				labelSpanS		: 12,
				columnsXL  		: col,
				columnsL   		: col,
				columnsM   		: col,
				emptySpanXL		: 0,
				emptySpanL		: 0,
				emptySpanM		: 0,
				emptySpanS		: 0,
				breakpointM		: 350,
				singleContainerFullSize : false
			});
		},
		//--------------------------------------------------------------------------------
		//navBack
		//--------------------------------------------------------------------------------
		navBack: function(evt){
			var oHistory 		= History.getInstance();
			var sPreviousHash 	= oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(evt);
				oRouter.navTo("to_home", {}, true);
			}
		},
		//--------------------------------------------------------------------------------
		//chkInp
		//--------------------------------------------------------------------------------
		chkInp: function(id,msg){
			if (sap.ui.getCore().getControl(id).getValue() === "") {
				this.popMsgbox(msg);
				return false;
			}else{
				return true;
			}
		},
		//--------------------------------------------------------------------------------
		//chkDdl
		//--------------------------------------------------------------------------------
		chkDdl: function(id,msg){
			if (sap.ui.getCore().getControl(id).getSelectedKey() === "") {
				this.popMsgbox(msg);
				return false;
			}else{
				return true;
			}
		},
//		//--------------------------------------------------------------------------------
//		//getDate: External Format
//		//--------------------------------------------------------------------------------
//		getDate: function(){
//			var date        = new Date();
//			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd.MM.yyyy"});
//			var datetx      = oDateFormat.format(date);
//			return datetx;
//		},
//		//--------------------------------------------------------------------------------
//		//getDateIn: Internal Format
//		//--------------------------------------------------------------------------------
//		getDateIn: function(days){
//			
//			var date        = new Date();
//			var vDate		= date.getDate().toString();
//			var vMonth		= String(date.getMonth() + 1);
//			var vYear		= date.getFullYear().toString();
//			
//			return vYear + vMonth.padStart(2,"0") + vDate.padStart(2,"0");
//		},
//		//--------------------------------------------------------------------------------
//		//getTstmp: SAP Timestamp Like 
//		//--------------------------------------------------------------------------------
//		getTstmp: function(days){
//			
//			var date        = new Date();
//			var vDate		= date.getDate().toString();
//			var vMonth		= String(date.getMonth() + 1);
//			var vYear		= date.getFullYear().toString();
//			var vHour		= date.getHours().toString();
//			var vMin		= date.getMinutes().toString();
//			var vSec		= date.getSeconds().toString();
//			
//			return vYear 					+ 
//				   vMonth.padStart(2,"0") 	+ 
//				   vDate.padStart(2,"0") 	+
//				   vHour.padStart(2,"0") 	+  
//				   vMin.padStart(2,"0") 	+  
//				   vSec.padStart(2,"0") ;
//		},
		//--------------------------------------------------------------------------------
		//getSAPDate: Get Date for SAP Like Format
		//--------------------------------------------------------------------------------
		getSAPDate: function(fmt){
			
			var date        = new Date();
			var vDate		= date.getDate().toString();
			var vMonth		= String(date.getMonth() + 1);
			var vYear		= date.getFullYear().toString();
			var vHour		= date.getHours().toString();
			var vMin		= date.getMinutes().toString();
			var vSec		= date.getSeconds().toString();
			
			if(fmt === "OS"){ //Output: Time Stamp
				return vDate.padStart(2,"0") 	+ "." +
					   vMonth.padStart(2,"0") 	+ "." + 
					   vYear 					+ " " +
					   vHour.padStart(2,"0") 	+ ":" +  
					   vMin.padStart(2,"0") 	+ ":" +
					   vSec.padStart(2,"0") ;
			};
			if(fmt === "IS"){ //Input: Time Stamp
				return vYear 					+ 
				   vMonth.padStart(2,"0") 	+ 
				   vDate.padStart(2,"0") 	+
				   vHour.padStart(2,"0") 	+  
				   vMin.padStart(2,"0") 	+  
				   vSec.padStart(2,"0") ;
			};
			if(fmt === "ID"){ // Input: Date
				return vYear + vMonth.padStart(2,"0") + vDate.padStart(2,"0");
			};
			if(fmt === "OT"){ // Input: Date
				return  vHour.padStart(2,"0") 	+ ":" +  
				   		vMin.padStart(2,"0") 	+ ":" +
				   		vSec.padStart(2,"0") ;
			};
		},
		//--------------------------------------------------------------------------------
		//isSelected
		//--------------------------------------------------------------------------------
		isSelected: function(iTbl){
			if(!sap.ui.getCore().getControl(iTbl).getSelectedItem()){
				this.popMsgbox("Please select an item");
				return false;
			}else{
				return true;
			}
		},
		//--------------------------------------------------------------------------------
		//getProperty
		//--------------------------------------------------------------------------------
		getProperty: function(sName,sProp,sModel){
			var oItm = sap.ui.getCore().getControl(sName).getSelectedItem();
			if(oItm){
				return sap.ui.getCore().getControl(sName).getSelectedItem().getBindingContext(sModel).getProperty(sProp);
			};
		},
//		//--------------------------------------------------------------------------------
//		//iconTabSetDefault
//		//--------------------------------------------------------------------------------
//		iconTabSetDefault: function(id){
//			var oTab = sap.ui.getCore().getControl(id);
//			for(var i=0;i<oTab.getItems().length;i++){
//				var oItm = oTab.getItems()[i];
//				if(oItm.getVisible()){
//					oTab.setSelectedKey(oItm.sId);
//					break;
//				};
//			};
//		},
		//--------------------------------------------------------------------------------
		//set1stTab:
		//--------------------------------------------------------------------------------
		set1stTab: function(id){
			var oTab = this.getControl(id);
			for(var i=0;i<oTab.getItems().length;i++){
				var oItm = oTab.getItems()[i];
				if(oItm.getVisible()){
					oTab.setSelectedKey(oItm.sId);
					break;
				};
			};
		},
		//--------------------------------------------------------------------------------
		//getDiaClsBtn
		//--------------------------------------------------------------------------------
		getDiaClsBtn: function(oDia){
			return new sap.m.Button({
				icon	:"sap-icon://decline",
				press	:function(){sap.ui.getCore().getControl(oDia).close();}
			});
		},
		//--------------------------------------------------------------------------------
		//getBtnBack
		//--------------------------------------------------------------------------------
		getBtnBack: function(oController){
			var that = this;
			return new sap.m.Button({
				icon	: "sap-icon://nav-back",
				press	: function(){that.navBack(oController); }
			});	
		},
		//--------------------------------------------------------------------------------
		//getBtnMulti: List Toggle Button
		//--------------------------------------------------------------------------------
		getBtnMulti: function(lstId){
			
			var that = this;
			return new sap.m.Button({
				icon	: "sap-icon://multi-select",
				press	: function(){
					
					var oList = that.getControl(lstId);
					if(oList.getMode() === sap.m.ListMode.MultiSelect){
						oList.setMode(sap.m.ListMode.SingleSelectMaster);
					}else{
						oList.setMode(sap.m.ListMode.MultiSelect);
						oList.selectAll();
					}
				}
			});	
		},
		//--------------------------------------------------------------------------------
		//getItemsByMode: List Toggle Button
		//--------------------------------------------------------------------------------
		getItemsByMode: function(lstId){
			
			var oList 	= this.getControl(lstId);

			if(oList.getMode() === sap.m.ListMode.MultiSelect){
				return oList.getSelectedItems();
			}else{
				return oList.getItems();
			};

		},
		//--------------------------------------------------------------------------------
		//getPopOvrBtn
		//--------------------------------------------------------------------------------
		getPopOvrBtn: function(iPopovr){
			
			var oButton = new sap.m.Button({icon:"sap-icon://grid"});
	
			oButton.attachPress(function(){
				if(!iPopovr.isOpen()){
					jQuery.sap.delayedCall(0, this, function () {
						iPopovr.openBy(oButton);
					});
				}else{
					iPopovr.close();
				}//if
			});
			return oButton;
		},
		//--------------------------------------------------------------------------------
		//getSchMain
		//--------------------------------------------------------------------------------
		getSchMain: function(id,tab,columns){
			var that = this;
			var schMain = new sap.m.SearchField({
				width 		: '100%',
			});
			schMain.attachLiveChange(function(){
				for(var i = 0;i < columns.length; i++){
					//oCon.liveSearchMulti(id+'schMain',tab,columns[i],i.toString());
					that.liveSearch(schMain.getValue(),tab,columns[i]);
				};
			});
			return schMain;

		},
		//--------------------------------------------------------------------------------
		//liveSearch
		//--------------------------------------------------------------------------------
		liveSearch: function(sQuery,sTab,sField){
			
		    // add filter for search
		    var aFilters = [];
		    if (sQuery && sQuery.length > 0) {
		      var filter = new sap.ui.model.Filter(sField, sap.ui.model.FilterOperator.Contains, sQuery);
		      aFilters.push(filter);
		    }
	
		    // update list binding
		    var list    = this.getControl(sTab);
		    var binding = list.getBinding("items");
		    if(binding)
		    	binding.filter(aFilters, sap.ui.model.FilterType.Control);
		
		},
		//--------------------------------------------------------------------------------
		//onModelError
		//--------------------------------------------------------------------------------
//		onModelErr1 : function(evt){
//			try{
//				//this.popBusy().close();
//				var oErr = JSON.parse(evt.responseText);
//				this.popMsgToast(oErr.error.message.value);
//			}catch(err){
//				this.popMsgToast(evt.responseText);
//			};
//		},
//		onModelErr2: function(evt,oCon){
//			try{
//				//this.popBusy().close();
//				var oErr = JSON.parse(evt.responseText);
//				this.popMsgToast(oErr.error.message.value);
//				//this.setMsg("Error occurs", oCon)
//			}catch(err){
//				this.popMsgToast(evt.responseText);
//			};
//		},
		//--------------------------------------------------------------------------------
		//getGenericTile
		//--------------------------------------------------------------------------------
		getGenericTile: function(iHeader,iSubHeader,icon,idesp){
			var oTxt = new sap.m.Text({
				text	: idesp,
			});
			var oCont = new sap.m.TileContent({
				content		: [oTxt]
			});
			return new sap.m.GenericTile({
				header				: iHeader,
				subheader			: iSubHeader,
				headerImage			: "sap-icon://" + icon,
				tileContent			: [oCont]
			}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop");
		},
//		//--------------------------------------------------------------------------------
//		//getGenericTile2
//		//--------------------------------------------------------------------------------
//		getGenericTile2: function(iHeader,iSubHeader,icon,iDesp){
//			var oTxt = new sap.m.Text({
//				text	: iDesp,
//			});
//			var oCont = new sap.m.TileContent({
//				content		: [oTxt]
//			});
//			return new sap.m.GenericTile({
//				//frameType			: sap.m.FrameType.TwoByOne,
//				header				: iHeader,
//				subheader			: iSubHeader,
//				headerImage			: "sap-icon://" + icon,
//				tileContent			: [oCont]
//			}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop");
//		},
		//--------------------------------------------------------------------------------
		//getListItem
		//--------------------------------------------------------------------------------
		getListItem: function(iTitle,iDesp,icon){
			return new StandardListItem({
				title			: iTitle,
				description		: iDesp,
				iconInset		: true,
				showUnread		: true,
				highlight		: sap.ui.core.MessageType.Information,
				icon			: "sap-icon://" + icon,
				type 			: sap.m.ListType.Navigation,
			});	
		},
		//--------------------------------------------------------------------------------
		//getDddl
		//--------------------------------------------------------------------------------
		getDddl: function(id,path,select){
			var Itm  = new sap.ui.core.ListItem({
				key				: {path: "view>Key"},
				text			: {path: "view>Text"},
				additionalText	: {path: "view>Addi"}
			});
			return new sap.m.Select({
				id					: id,
				showSecondaryValues : true,
				//enabled				: {path: enb},
				selectedKey			: {path: select},
				items				: {path:path,template:Itm},
			})
		},
		getDddl: function(id,path,select,width){
			var Itm  = new sap.ui.core.ListItem({
				key				: {path: "view>Key"},
				text			: {path: "view>Text"},
				additionalText	: {path: "view>Addi"}
			});
			return new sap.m.Select({
				id					: id,
				showSecondaryValues : true,
				width				: width,
				selectedKey			: {path: select},
				items				: {path:path,template:Itm},
			})
		},
		//--------------------------------------------------------------------------------
		//getItmHdr:
		//--------------------------------------------------------------------------------
		getItmHdr: function(h1,h2,h3,h4,h5){
			return new sap.m.CustomListItem({
				highlight	: sap.ui.core.MessageType.Information,
				content	: [
					new sap.m.HBox({items: [
						new sap.ui.core.Icon({
							size		: "24px",
							src			: ""
						}), 
						new sap.m.VBox({
							items		: [
								new sap.m.HBox({items:[
									new sap.m.Label({text:h1,width:"104px",design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd"),
									new sap.m.Label({text:h2,width:"110px",design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd"),
									new sap.m.Label({text:h3,width:"80px",design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd"),
									//new sap.m.Label({text:h4,width:"110px",design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd"),
									new sap.m.Label({text:h4,design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd")
								]}),
								new sap.m.HBox({items:[
									new sap.m.Label({text:h5,design:sap.m.LabelDesign.Bold}).addStyleClass("sapUiSmallMarginEnd")
								]})
							]
						}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTopBottom")
					]})//HBox
			]});	
		},
		//--------------------------------------------------------------------------------
		//scanCam
		//--------------------------------------------------------------------------------
		scanCam: function(iInput){
			var that = this;
			cordova.plugins.barcodeScanner.scan(
					function (result) {
						that.getControl(iInput).setValue(result.text);					
					},
					function (error)  {that.popMsgToast("Scanning failed: " + error);},
					{
						preferFrontCamera : false, // iOS and Android
						showFlipCameraButton : true, // iOS and Android
						showTorchButton : true, // iOS and Android
						torchOn: true, // Android, launch with the torch switched on (if available)
						prompt : "Place a barcode inside the scan area", // Android
						resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
						//formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
						orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
						disableAnimations : true, // iOS
						disableSuccessBeep: false // iOS
					}
				);
		},
		//--------------------------------------------------------------------------------
		//getGPSLoc: Read Location from Mobile
		//--------------------------------------------------------------------------------
		getGPSLoc: function(oController){
			
			var oModelV 	= oController.getView().getModel("view");
			var bHybrid		= oModelV.getProperty("/Tech/Hybrid");

			if(bHybrid){
			    navigator.geolocation.getCurrentPosition(
			    	function(position){
			    		oModelV.setProperty("/SGps/Latlngc",position.coords.latitude + "," + position.coords.longitude);
				    	oModelV.setProperty("/SGps/Latc",position.coords.latitude);
				    	oModelV.setProperty("/SGps/Lngc",position.coords.longitude);
				    	oModelV.setProperty("/SGps/Altc",position.coords.altitude);
				    	oModelV.setProperty("/SGps/Acuc",position.coords.accuracy);
				    	oModelV.setProperty("/SGps/Timestamp",position.timestamp);		
			    	}, 
			    	function (error){
			    		Peachtree.popMsgToast(error.code + " " + error.message)
			    	}
			    );
			};
			
		},
		//--------------------------------------------------------------------------------
		//openGoogleMaps: Google Maps
		//--------------------------------------------------------------------------------
		openGoogleMaps: function(oController,mode){

			var oCTX	= this.getContext(oController);
			
			//iOS
			if(oCTX.Tech.Dplat === "iOS"){
				if(mode === "S"){
					window.open("maps://?q=" + oCTX.SVbakMob.Lats + "," + oCTX.SVbakMob.Lngs, "_system");
				}else{
					window.open("maps://?q=" + oCTX.SVbakMob.Latk + "," + oCTX.SVbakMob.Lngk, "_system");
				};
				return;
			};
			
			//Android
			if(mode === "S"){
				window.open("geo:0,0?q=" + oCTX.SVbakMob.Lats + "," + oCTX.SVbakMob.Lngs + "(" + oCTX.SVbakMob.Kunnra + ")", "_system");
			}else{
				window.open("geo:0,0?q=" + oCTX.SVbakMob.Latk + "," + oCTX.SVbakMob.Lngk + "(" + oCTX.SVbakMob.Kunnra + ")", "_system");
			};
			
		},
		//--------------------------------------------------------------------------------
		//Local Storage
		//--------------------------------------------------------------------------------
		putStore: function(iField,iValue){
			$.sap.require("jquery.sap.storage");
			var UI5Storage = $.sap.storage(jQuery.sap.storage.Type.local);
			UI5Storage.put(iField,iValue);
		},
		getStore: function(iField){
			$.sap.require("jquery.sap.storage");
			var UI5Storage = $.sap.storage(jQuery.sap.storage.Type.local);
			var r = UI5Storage.get(iField);	
			return r;
		},
		//--------------------------------------------------------------------------------
		//getModel: Get Model URL
		//--------------------------------------------------------------------------------
		getModel: function(oController){
			
			var oModelV 	= oController.getView().getModel("view");
			var Tech		= oModelV.getProperty("/Tech");
			var oModelM		= oModelV.getProperty("/oModelM");
			var oParms		= { "uuid" : Tech.UUID };
			
			if(!oModelM){
				oModelM =  new sap.ui.model.odata.v2.ODataModel({
					serviceUrl			: Tech.Sapsrv,
					user	  			: Tech.Sapusr,
					password  			: Tech.Sappwd,
					headers				: oParms,
				});
				oModelM.setSizeLimit(1000);
				oModelV.setProperty("/oModelM",oModelM);
			}
			return oModelM;
		},
		//--------------------------------------------------------------------------------
		//getModel: Get Model URL
		//--------------------------------------------------------------------------------
		imageUpload: function(oController,oDataIn){
			
			var that	= this;
			var oCTX   	= this.getContext(oController);
			var	Tech	= oCTX.oModelV.getProperty("/Tech");
			var ft 		= new FileTransfer();
			var options = new FileUploadOptions();
			
			options.fileKey 	= "file"; 
			options.fileName 	= oDataIn.Fname;
			options.mimeType 	= "image/jpeg";
			options.chunkedMode = false; // for oData hybrid/native set = false, json http = true
			options.headers = { "x-csrf-token" 	: oCTX.oModelM.getHeaders()["x-csrf-token"],
								"uuid" 			: Tech.UUID,
								"vbeln"			: oDataIn.Vbeln,
								"bezei"			: oDataIn.Latlngc,
								"slug"			: options.fileName };
		    ft.upload(oDataIn.Path , Tech.Sapsrv + "/MediaSet", 
		    	function(oEvt){
		    		that.popMsgToast("Upload OK: " + options.fileName)
			    },
			    function(oEvt){
			       	that.popMsgToast("Uploade error: " + oEvt);
			    },
			    options
			);
		},
//		//--------------------------------------------------------------------------------
//		//isInitial: Check field is Initial or Not
//		//--------------------------------------------------------------------------------
//		isInitial: function(iVal){
//			
//			if (iVal != "DUMMY" && iVal != undefined && iVal != "" ){
//				return false;
//			}else{
//				return true;
//			}
//		},
		//--------------------------------------------------------------------------------
		//isInitial: Check field is Initial or Not
		//--------------------------------------------------------------------------------
		getInpAmt: function(id,value,desp){
			
			var oInp = new Input({
				id			: id,
				value		: {path: value, formatter:this.fmtAmt},
				editable	: false,
                description	: {path: desp},
                fieldWidth	: "80%",
                textAlign	: sap.ui.core.TextAlign.Right,
                //type		: sap.m.InputType.Number,
              });
			return oInp;
		},
		//--------------------------------------------------------------------------------
		//fmtAmt
		//--------------------------------------------------------------------------------
		fmtAmt: function(oEvt){
			if((oEvt=='')||(!oEvt))
				return '0.00';
			
			var iEvt = oEvt.toString();
			var n 	= iEvt.search('-');
			var amt = parseFloat(iEvt.replace(',',''));

			if(n>=0){
				amt = Math.abs(amt) * -1;
			};
			
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits 	: 2,
				minFractionDigits   : 2,
				groupingEnabled		: true,
				groupingSeparator	: ",",
				decimalSeparator	: ".",
				minusSign           : "-",
			}); 
			return oNumberFormat.format(amt);
		},
		//--------------------------------------------------------------------------------
		//getBtnStatus
		//--------------------------------------------------------------------------------
		getBtnStatus: function(iMode, oController){
			
			var Btn 	= [];
			
			if(iMode === "1"){
				Btn[0] = new sap.m.Button({icon:"sap-icon://away"				,type:"{view>/SVbakMob/Stat1}"});
				Btn[1] = new sap.m.Button({icon:"sap-icon://locate-me"			,type:"{view>/SVbakMob/Stat2}"});
				Btn[2] = new sap.m.Button({icon:"sap-icon://camera"				,type:"{view>/SVbakMob/Stat3}"});
				Btn[3] = new sap.m.Button({icon:"sap-icon://add-equipment"		,type:"{view>/SVbakMob/Stat4}"});
				Btn[4] = new sap.m.Button({icon:"sap-icon://monitor-payments"	,type:"{view>/SVbakMob/Stat5}"});
				return Btn;
			}
			
			if(iMode === "2"){
				Btn[0] = new sap.m.Button({icon:"sap-icon://away"				,type:"{view>Stat1}"});
				Btn[1] = new sap.m.Button({icon:"sap-icon://locate-me"			,type:"{view>Stat2}"});
				Btn[2] = new sap.m.Button({icon:"sap-icon://camera"				,type:"{view>Stat3}"});
				Btn[3] = new sap.m.Button({icon:"sap-icon://add-equipment"		,type:"{view>Stat4}"});
				Btn[4] = new sap.m.Button({icon:"sap-icon://monitor-payments"	,type:"{view>Stat5}"});
				return Btn;
			}
		},
		//--------------------------------------------------------------------------------
		//isODataErr: Check Application Return error
		//--------------------------------------------------------------------------------
		isODataErr: function(oResponseIn){
			if(oResponseIn.headers["ret-type"] === "E"){
				this.popMsgToast(oResponseIn.headers["ret-message"]);
				return true;
			}else{
				return false;
			}
				
		},
		//--------------------------------------------------------------------------------
		//getODataErrMsg: Get Applicaton Error Text
		//--------------------------------------------------------------------------------
		getODataErrMsg: function(evt){
			try{
				var oErr = JSON.parse(evt.responseText);
				return oErr.error.message.value;
			}catch(err){
				return evt.responseText;
			};
		},
		//--------------------------------------------------------------------------------
		//buildTImage: BuildTImage
		//--------------------------------------------------------------------------------
		buildTImage: function(iVbeln,oCTX){
			
			var Posnr		= 0;
			var TImageMob 	= [];
			var TFname		= [];
			var TBezei		= [];
			
			TFname[0]	= oCTX.i18n.getResourceBundle().getText("txt_fname1");
			TFname[1]	= oCTX.i18n.getResourceBundle().getText("txt_fname2");
			TFname[2]	= oCTX.i18n.getResourceBundle().getText("txt_fname3");
			TFname[3]	= oCTX.i18n.getResourceBundle().getText("txt_fname4");
			
			TBezei[0]	= oCTX.i18n.getResourceBundle().getText("txt_fdesp1");
			TBezei[1]	= oCTX.i18n.getResourceBundle().getText("txt_fdesp2");
			TBezei[2]	= oCTX.i18n.getResourceBundle().getText("txt_fdesp3");
			TBezei[3]	= oCTX.i18n.getResourceBundle().getText("txt_fdesp4");
			
			for(var i = 0; i < TFname.length; i++){
				Posnr = i + 1;
				TImageMob.push({
					Vbeln	: iVbeln,
					Posnr	: Posnr.toString().padStart(6,"0"),
					Fname	: TFname[i] + ".jpg",
					Bezei	: TBezei[i],
					Path	: "",
					Upload	: "",
					Latlngc	: ""
				});
			};
			return TImageMob;
		},
		//--------------------------------------------------------------------------------
		//addMsg: Add Message to Data
		//--------------------------------------------------------------------------------
		addMsg: function(oCTX){
			var TBapiret2 = oCTX.oModelV.getProperty("/TBapiret2");
			TBapiret2.unshift({
				Type	: oCTX.SBapiret2.Type,
				Title	: this.getSAPDate("OT") + ": " + oCTX.SBapiret2.Title,
				Desp	: oCTX.SBapiret2.Desp });
			oCTX.oModelV.setProperty("/TBapiret2",oCTX.TBapiret2);
		},
	};
});