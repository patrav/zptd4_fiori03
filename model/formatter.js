sap.ui.define([], function () {
	"use strict";
	return {
		
		//--------------------------------------------------------------------------------
		//fmtDate
		//--------------------------------------------------------------------------------
		fmtDate: function (iDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd.MM.yyyy"});
			var datetx      = oDateFormat.format(iDate);
			return datetx;
		},
		//--------------------------------------------------------------------------------
		//fmtDate2
		//--------------------------------------------------------------------------------
		fmtDate2: function(oEvt){
			if(oEvt==undefined){return;};
			return oEvt.substring(6,8)+'.'+
			       oEvt.substring(4,6)+'.'+
			       oEvt.substring(0,4);
		},
		//--------------------------------------------------------------------------------
		//fmtAmt
		//--------------------------------------------------------------------------------
		fmtAmt: function(oEvt){
			if((oEvt=='')||(!oEvt))
				return '0.00';
			
			var n 	= oEvt.search('-');
			var amt = parseFloat(oEvt.replace(',',''));

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
		//fmtAmt
		//--------------------------------------------------------------------------------
		fmtTotal: function(oEvt){
			if((oEvt=="")||(!oEvt))
				return "Total: 0.00";
			
			var n 	= oEvt.search("-");
			var amt = parseFloat(oEvt.replace(",",""));

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
			return "Total: " + oNumberFormat.format(amt);
			
		},
	};
});