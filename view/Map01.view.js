sap.ui.jsview("zptd4_fiori03.view.Map01", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf Map01
	 */
	getControllerName: function() {
		return "zptd4_fiori03.controller.Map01";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.App
	 */
	createContent: function(oController) {
		var pt 	= oController.Peacht;
		var fmt	= oController.formatter;
		//-------------------------------------------------------------------------------
		//Login Form: iOrder URL
		//-------------------------------------------------------------------------------
		var b001Map = new sap.ui.core.HTML({
		      id: "map_canvas",
		      content:[
		        '<div id="map_canvas" '+
		        'style="float:left;min-width:300px;'+
		        'width:100%;min-height:500px;height:100%;"></div>'+
		        '<div style="float:right;width:100%;'+
		        'height:100%;overflow:auto"></div>'
		                 ]
		   });
		

		//-------------------------------------------------------------------------------
		//Page & App
		//-------------------------------------------------------------------------------
		var b001selSrvda = pt.getDddl("b001selSrvda","view>/F4Srvda","view>/SDash01/Srvda").attachChange(function(){
			oController.listData(oController);
		});
		var b001Page = new sap.m.Page({
			id				: "b001Page",
			customHeader	: new sap.m.Bar({contentLeft:	[b001selSrvda],
											 contentMiddle:	[new sap.m.Label({text:"{i18n>title}"})],
											 contentRight:	[]}),
			content			: [b001Map]
		});	
		return b001Page;
	}

});