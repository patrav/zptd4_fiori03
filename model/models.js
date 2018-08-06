sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
		//--------------------------------------------------------------------------------
		//createDeviceModel
		//--------------------------------------------------------------------------------
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		//--------------------------------------------------------------------------------
		//createViewModel
		//--------------------------------------------------------------------------------
		createViewModel: function() {
			var oModel = new JSONModel({
				oModelM			: null,
				Fcode			: "",
				dbErr			: {},
				SBapiret2		: {
					Type	: "",
					Title		: "",
				},
				TBapiret2		: [],
				Tech			: {
					Sapsrv		: "/sap/opu/odata/sap/zdp_gwsrv003_srv",
					Admpwd		: "",
					Count 		: "",
					Message		: "",
					UUID		: "WEB",
					Duuid		: "WEB",
					Dsernr		: "WEB",
					Dname		: "WEB",
					Dmanu		: "WEB",
					Dmodel		: "WEB",
					Dplat		: "WEB",
					Hybrid		: false,
					Bluetooth	: false
				},	
				SDash01			: {
					Engine	: "CS",
					Srvda	: "",
				},
				TDash01			: [],
				F4DTyp			: [],
				F4Srvda			: [],
			});
			return oModel;
		}

	};
});