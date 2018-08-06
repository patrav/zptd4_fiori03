sap.ui.jsview("zptd4_fiori03.view.Dash02", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf zptd4_fiori03.view.Dash02
	 */
	getControllerName: function() {
		return "zptd4_fiori03.controller.Dash02";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf zptd4_fiori03.view.Home
	 */
	createContent: function(oController) {
		var pt 	= oController.Peacht;
		var fmt	= oController.formatter;
		//-------------------------------------------------------------------------------
		//Dashboard #1 
		//-------------------------------------------------------------------------------
		var a002DtsA = new sap.viz.ui5.data.FlattenedDataset({
			id			: "a002DtsA",
			data		: {path:"view>/TDash01"},
			dimensions	: [new sap.viz.ui5.data.DimensionDefinition({name:"Place",value:"{view>Bezei}"})],
			measures 	: [new sap.viz.ui5.data.MeasureDefinition({name:"Amount",value:"{view>Fval01}"}),
		           		   new sap.viz.ui5.data.MeasureDefinition({name:"No. Order",value:"{view>Fval02}"})],
			
		});	
		var a002VizA = new sap.viz.ui5.controls.VizFrame({
			id			: "a002VizA",
			//height		: "500px",
			width		: "100%",
			vizType		: "bar",
			vizProperties : {plotArea:{dataLabel:{visible:true},
							referenceLine:{line:{timeAxis:[{value:"10",visible:true,size:2,type:"solid",label:{text:"",visible:true}}]}},
                			},title:{text:"Service Day",visible:true}},
			dataset 	: a002DtsA,
			//selectData  : oCon.ui5Dispatch,
			feeds		: [new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"valueAxis",   type:"Measure",  values:["Amount"]}),
				           new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"valueAxis",   type:"Measure",  values:["No. Order"]}),
				           new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"categoryAxis",type:"Dimension",values:["Place"]})],
		});
		//-------------------------------------------------------------------------------
		//Page & App
		//-------------------------------------------------------------------------------
		var a002selSrvda = pt.getDddl("a002selSrvda","view>/F4Srvda","view>/SDash01/Srvda","300px").attachChange(function(){
			oController.listData(oController);
		});
		var a002Page = new sap.m.Page({
			id				: "a002Page",
			customHeader	: new sap.m.Bar({contentLeft:	[a002selSrvda],
											 contentMiddle:	[new sap.m.Label({text:"{i18n>title}"})],
											 contentRight:	[]}),
			content			: [a002VizA]
		});	
		return a002Page;
	}

});