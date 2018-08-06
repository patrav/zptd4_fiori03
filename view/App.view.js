sap.ui.jsview("zptd4_fiori03.view.App", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.App
	 */
	getControllerName: function() {
		return "zptd4_fiori03.controller.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.App
	 */
	createContent: function(oController) {
		var app = new sap.m.App("myApp");
		return app;
	}

});