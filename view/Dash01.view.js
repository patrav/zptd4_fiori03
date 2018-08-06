sap.ui.jsview("zptd4_fiori03.view.Dash01", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf zptd4_fiori03.view.Dash01
	 */
	getControllerName: function() {
		return "zptd4_fiori03.controller.Dash01";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf zptd4_fiori03.view.Home
	 */
	createContent: function(oController) {
		var pt 	= oController.Peacht;
		var fmt	= oController.formatter;
		//-------------------------------------------------------------------------------
		//Dashboard #1 Department/Division/Section
		//-------------------------------------------------------------------------------
		var a001DtsA = new sap.viz.ui5.data.FlattenedDataset({
			id			: "a001DtsA",
			data		: {path:"view>/TDash01"},
			dimensions	: [new sap.viz.ui5.data.DimensionDefinition({name:"Date",value:"{view>Fkey}"})],
			measures 	: [new sap.viz.ui5.data.MeasureDefinition({name:"Amount",value:"{view>Fval01}"}),
		           		   new sap.viz.ui5.data.MeasureDefinition({name:"No. Order",value:"{view>Fval02}"})],
			
		});
		
		var a001VizA = new sap.viz.ui5.controls.VizFrame({
			id			: "a001VizA",
			//height		: '100%',
			height		: "500px",
			width		: "100%",
			vizType		: "column",
			vizProperties : {plotArea:{dataLabel:{visible:true},
							referenceLine:{line:{timeAxis:[{value:"10",visible:true,size:2,type:"solid",label:{text:"",visible:true}}]}},
                			},title:{text:"10 Days Order",visible:true}},
			dataset 	: a001DtsA,
			//selectData  : oCon.ui5Dispatch,
			feeds		: [new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"valueAxis",   type:"Measure",  values:["Amount"]}),
				           new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"valueAxis",   type:"Measure",  values:["No. Order"]}),
				           new sap.viz.ui5.controls.common.feeds.FeedItem({uid:"categoryAxis",type:"Dimension",values:["Date"]})],
		});
		//-------------------------------------------------------------------------------
		//Page & App
		//-------------------------------------------------------------------------------
		var a001selTyp = pt.getDddl("a001selTyp","view>/F4DTyp","view>/SDash01/Engine").attachChange(function(){
			oController.listData(oController);
		});
		var a001Page = new sap.m.Page({
			id				: "a001Page",
			customHeader	: new sap.m.Bar({contentLeft:	[a001selTyp],
											 contentMiddle:	[new sap.m.Label({text:"{i18n>title}"})],
											 contentRight:	[]}),
			content			: [a001VizA]
		});	
		return a001Page;
	}

});