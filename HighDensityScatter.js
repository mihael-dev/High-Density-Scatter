define(["qlik", "./definition", "./HighDensityChartBase", "./lib/plotly-latest.min", "text!./style.css"
],


	function (qlik, definition, highDensityChartBase, Plotly, cssContent) {

		$("<style>").html(cssContent).appendTo("head");

		return {
			initialProperties: {
				refLineList: [],
				shapes: [],
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 5,
						qHeight: 2000
					}]
				},
				selectionMode: "CONFIRM"
			},
			//template: template,	
			definition: definition,

			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			controller: ['$scope', function ($scope) {

				$scope.selectedElements = new Map();

			}],

			paint: function ($element, layout) {

				
				var self = this;
				var id = layout.qInfo.qId;

				
				if (document.getElementById('T_' + id) == null) {
                    //let html = '<div id=' + 'T_' + id + ' style="width:100%;height:100%;"></div>';

                    let html = '<div id=' + 'T_' + id + ' style="width:100%;height:100%;">'
                        + '<div class="render-highdensity" id=' + 'Render_' + id + '><div class="center"><b>Rendering...</b></div></div></div>';

                        
                    /*if (rowcount > layout.maxRecord) {
                        html += '<div class="render-message">* Currently showing a limited data set. Add-Ons > Max Records</div>';
                    } */   
                    $element.html(html);
                } else {
                    $('#' + 'Render_' + id).show();

                }

                var TESTER = document.getElementById('T_' + id);


				highDensityChartBase.createPlot($element, layout, self, TESTER, "scatter").then(function() {

					//needed for export
					$('#' + 'Render_' + id).hide();

					return qlik.Promise.resolve();
				});


				
			},

			resize: function($element, layout) {

				//paint($element, layout);
				//return;
				
				var id = layout.qInfo.qId;
				var TESTER = document.getElementById('T_' + id);
				
				if (TESTER.data != null) {
					Plotly.Plots.resize(TESTER);
				}
			}
			
		};

	});



