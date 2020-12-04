define(["qlik", "./properties", "./plotly-latest.min", "text!./style.css", "./locale/plotly-locale-it"   //20201201 cvh 3: including italy locations
],


	function (qlik, properties, Plotly, cssContent, localeIt) {

		$("<style>").html(cssContent).appendTo("head");

		return {
			initialProperties: {
				refLineList: [],
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
			definition: properties,

			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ($element, layout) {


				try {

					var self = this,
						id = layout.qInfo.qId,
						morebutton = false,
						hypercube = layout.qHyperCube,
						rowcount = hypercube.qDataPages[0].qMatrix.length,
						colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length,
						dimTitle = hypercube.qDimensionInfo[0].qFallbackTitle,

						meaX = hypercube.qMeasureInfo[0].qFallbackTitle,
						meaXFormatType = hypercube.qMeasureInfo[0].qNumFormat.qType,
						meaXFormatFmt = hypercube.qMeasureInfo[0].qNumFormat.qFmt,
						

						meaY = hypercube.qMeasureInfo[1].qFallbackTitle,
						meaYFormatType = hypercube.qMeasureInfo[1].qNumFormat.qType,
						meaYFormatFmt = hypercube.qMeasureInfo[1].qNumFormat.qFmt,
						
						app = qlik.currApp(this),
						extensionNamespace = "object.High-Density Scatter";


					var lastrow = 0
					var X = [],
						Y = [];

					var pointMap = new Map();


					$element.html('<div id=' + 'T_' + id + ' style="width:100%;height:100%;"><div class="center" >rendering....</span></div>');


					//return;

					createPlot();




					function getTheme() {
						return new Promise(resolve => {
							app.theme.getApplied().then(function (qtheme) {


								//	countToTen().then(() => console.log("i ended up at: " + i));

								resolve(qtheme);

							});
						});
					}

					async function createPlot() {

						var TESTER = document.getElementById('T_' + id);

						var qtheme = await getTheme();

						addtoArray();

						await getMoreData(); //.then(() => {



						$('#' + 'T_' + id).text('');

						//console.info('Rendered: ' + self.backendApi.getRowCount());

						var tooltipData = [];
						
						self.backendApi.eachDataRow(function (rownum, row) {
							var coords;
							var key;



							// Color

							if (layout.coloring.type == 'single') {
								key = layout.prop.singleColor.color;

							} else if (layout.coloring.type == 'exp') {

								if (row[3] != null && row[3].qText != null) {
									key = row[3].qText;
								} else {
									key = "#f1f2f3";
								}

							} else if (layout.coloring.type == 'dim') {

								if (row[0].qText != null) {
									key = row[0].qText;
								} else {
									key = "-";
								}

							}





							if (pointMap.get(key) != null) {
								coords = pointMap.get(key)
							} else {
								coords = [[], [], [], []];
								pointMap.set(key, coords)
							}


							// Date conversion X
							if (layout.xAxisSettings.type == 'date' && row[1].qNum != 'NaN') {
								// Qlik Date Date(0) = 30.12.1899 > Java Script data Date(0) = 01.01.1970
								var qlikDateMillis = (row[1].qNum - 25569) * 24 * 60 * 60 * 1000;
								// remove the calculation in local time
								qlikDateMillis = qlikDateMillis + new Date().getTimezoneOffset() * 60 * 1000;
								
								coords[0].push(qlikDateMillis);

							} else {
								if (row[1].qNum != 'NaN') {
									coords[0].push(row[1].qNum);
								} else {
									coords[0].push(row[1].qText);
								}
							}

							// Date conversion Y
							if (layout.yAxisSettings.type == 'date' && row[2].qNum != 'NaN') {
								// Qlik Date Date(0) = 30.12.1899 > Java Script data Date(0) = 01.01.1970
								var qlikDateMillis = (row[2].qNum - 25569) * 24 * 60 * 60 * 1000;
								// remove the calculation in local time
								qlikDateMillis = qlikDateMillis + new Date().getTimezoneOffset() * 60 * 1000;

								coords[1].push(qlikDateMillis);
							} else {
								if (row[2].qNum != 'NaN') {
									coords[1].push(row[2].qNum);
								} else {
									coords[1].push(row[2].qText);
								}
							}

							//20201201 cvh 4: adding custom tooltip
							//Tooltip
							var tmpTooltipArray = [];
							
							//Loop on my attribute expressions
							hypercube.qDimensionInfo[0].qAttrExprInfo.forEach(function (callback, key) {
								
								//Use tmp array for pushing array into another array
								tmpTooltipArray.push(row[0].qAttrExps.qValues[key].qText);
								
							});
							

							//Final array
							tooltipData.push(tmpTooltipArray);
							//20201201 cvh 4: end
						

							// add labels
							coords[2].push(row[0].qText);
							// add qElemNumber for selection
							coords[3].push(row[0].qElemNumber);

						});

						//20201201 cvh 2: add dynamic x axis (min and max)
						var minValxAxis;
						var maxValxAxis;
						if (!layout.xAxisSettings.fixedDynamicInterval) {
							minValxAxis = layout.xAxisSettings.minInterval;
							maxValxAxis = layout.xAxisSettings.maxInterval;
						}
						//20201201 cvh 2: end

						//20201201 cvh 4: adding custom tooltip
						//------ Below code works from Sep 2020 onwards (not for Feb 2020, don't know realeases bwtween Feb and Sep 2020)
						// var tooltipLables = "";
						// hypercube.qDimensionInfo[0].qAttrExprInfo.forEach(function (callback, key) {
								
						// 	//TooltipLables
						// 	tooltipLables += '<br><b>' + callback.qFallbackTitle + ':</b> %{customdata['+ key + ']}';
							
						// });

						//------- Below code works for Feb 2020
						var tooltipLables = "";
						var tooltipLabelsArray = [];
						var i = 0;

						//convert layout into array in order to check how many lables we have
						tooltipLabelsArray = Object.keys(layout);

						tooltipLabelsArray.forEach(function (callback, key) {
							if(callback.includes('tooltip')) {
								if(layout[callback].label.length > 0) {
									tooltipLables += '<br><b>' + layout[callback].label + ':</b> %{customdata['+ i + ']}';
									i++;
								}
							}
						});

						//20201201 cvh 4: end


						var graph_layout = {
							hovermode: "closest",
							dragmode: "pan",
							automargin: true,
							margin: {
								t: 50
							},
							/*margin: {
								l: 20,
								r: 20,
								b: 50,
								t: 50,
								pad: 5
							  },*/
							font: {
								family: qtheme.properties.fontFamily
							},
							showlegend: layout.generalSettings.showLegend,
							xaxis: {
								type: layout.xAxisSettings.type,
								tickformat: layout.xAxisSettings.tickFormat,
								showline: layout.xAxisSettings.showLine,
								showgrid: layout.xAxisSettings.showGrid,
								showticklabels: layout.xAxisSettings.showTicklabels,
								zeroline: layout.xAxisSettings.showZeroLine,
								linecolor: 'rgb(204,204,204)',
								tickangle: 'auto',
								title: {
									text: layout.xAxisSettings.xTitle,
									font: {
										color: qtheme.getStyle('object', 'axis.title', 'color'),
										size: qtheme.getStyle('object', 'axis.title', 'fontSize')
									}
								},
								font: {
									color: qtheme.getStyle('object', 'axis.label.name', 'color'),
									size: qtheme.getStyle('object', 'axis.label.name', 'fontSize')
								},
								//20201201 cvh 2: add dynamic x axis (min and max)
								range: [minValxAxis, maxValxAxis]
								//20201201 cvh 2: end
							},
							yaxis: {
								type: layout.yAxisSettings.type,
								tickformat: layout.yAxisSettings.tickFormat,
								showline: layout.yAxisSettings.showLine,
								showgrid: layout.yAxisSettings.showGrid,
								showticklabels: layout.yAxisSettings.showTicklabels,
								zeroline: layout.yAxisSettings.showZeroLine,
								linecolor: 'rgb(204,204,204)',
								tickangle: 'auto',
								title: {
									text: layout.yAxisSettings.yTitle,
									font: {
										color: qtheme.getStyle('object', 'axis.title', 'color'),
										size: qtheme.getStyle('object', 'axis.title', 'fontSize')
									}
								},
								title: layout.yAxisSettings.yTitle,
								font: {
									color: qtheme.getStyle('object', 'axis.label.name', 'color'),
									size: qtheme.getStyle('object', 'axis.label.name', 'fontSize')
								}
							}
						};

						var datas = [];



						var i = 0;
						var color;
						pointMap.forEach(function (coords, key) {
							if (layout.coloring.type == 'exp' || layout.coloring.type == 'single') {
								color = key;
								if (layout.coloring.type == 'exp' && layout.prop.colorCode == false) {
									var palette;
									if (layout.prop.colorPalette != null && layout.prop.colorPalette != '') {
										palette = layout.prop.colorPalette.split(",");
									} else {
										palette = qtheme.properties.palettes.data[0].scale;
										// qtheme.properties.palettes.data[0].scale; //qtheme.properties.palettes.data.length - 1
									}
									// palette > data > scale can be an array
									if (Array.isArray(palette[0])) {
										palette = palette[Math.min(pointMap.size - 1, palette.length - 1)];
									}


									color = palette[i % palette.length].trim();
								}
							} else if (layout.coloring.type == 'dim') {
								color = palette[i % palette.length];
							}
							
							
							var data = {
								type: "scattergl",

								//mode: "markers",
								mode: 'markers',
								name: key,
								marker: {
									color: color,
									size: layout.prop.markerSize,
									opacity: layout.prop.markerOpacity,
									symbol: layout.prop.markerType,
									//20201201 cvh 1: commented due to border outside marker
									//line: {
									//	width: 1,
									//	color: layout.prop.lineColor.color
									//}//qtheme.properties.dataColors.primaryColor
									//20201201 cvh 1: end
								},
								x: coords[0],
								y: coords[1],
								text: coords[2],
								// numero di array = numero di punti x y
								//all'interno di ogni array tante voci quanti sono i tooltip
								//customdata: [['tooltip 1', 'tooltip 2'], ['tooltip 10']], //20201201 cvh 4: adding custom tooltip
								customdata: tooltipData,
								qElementNumber: coords[3],
								textposition: "middle center",

								hoverlabel: { bgcolor: "#535353", font: { color: "#ffffff" } },
								hovertemplate: '<b>' + dimTitle + ':</b> %{text}' +
									'<br><b>' + meaX + ':</b> %{x}' +
									'<br><b>' + meaY + ':</b> %{y}' +
									tooltipLables										//20201201 cvh 4: adding custom tooltip
							}

							datas.push(data);
							i++;

							//console.log(key + " = " + value);
						});



						layout.refLineList.forEach(function (lineData) {

							var lineArray = JSON.parse('[' + lineData.line.geometry + ']');
							var x = [];
							var y = [];
							var i = 0;

							lineArray.forEach(function (coord) {
								x.push(coord[0]);
								y.push(coord[1]);
								i++;
							});

							var line = {
								x: x,
								y: y,
								mode: lineData.line.mode,
								type: 'scattergl',
								name: lineData.line.label,
								showlegend: lineData.line.showLegend,

								line: {
									dash: lineData.line.lineStyle,
									width: lineData.line.width,
									color: lineData.line.lineColor.color,
									shape: lineData.line.shape

								}
							};

							datas.push(line);


						});

						let modeBarButtons = [["pan2d", "select2d", "lasso2d", "zoom2d", "resetScale2d"]];

						//20201201 cvh 3: including locations
						//Defualt language
						var lang = "en-US";
						//Browser language
						var userLang = (navigator.language || navigator.userLanguage).substring(0,2);

						if (userLang != "en") {
							//Getting browser language. You need to include your language plotly js (e.g. plotly-locale-it.js)
							lang = userLang;
						}
						
						var config = {
							scrollZoom: true,
							displaylogo: false,
							modeBarButtons: modeBarButtons,
							locale: lang
						};
						//20201201 cvh 3: end
						

						Plotly.newPlot(TESTER, datas, graph_layout, config);

						// select on click
						TESTER.on('plotly_click', function (eventData) {
							select(eventData);

						});
						// select with rectangle and lasso
						TESTER.on('plotly_selected', function (eventData) {

							select(eventData);

						});



						function select(data) {

							var select = [];

							data.points.forEach(function (pt) {
								var elements = pt.data.qElementNumber;
								select.push(elements[pt.pointIndex]);
							});

							self.selectValues(0, select, true);
						}

						/*TESTER.on('plotly_hover', function (eventdata) {
							
							var points = eventdata.points[0],
							pointNum = points.pointNumber;
	
							alert(points);
	
							var xyField = $('.hovertext .nums').first(),
										  commaIndex = xyField.html().indexOf(','),
										  x = xyField.html().slice(1, commaIndex);
							xyField.html(x);
							
						  })*/


						
						//});	
					}





					//loop through the rows we have and render
					function addtoArray() {
						//console.info("getRowCount" + self.backendApi.getRowCount());
						self.backendApi.eachDataRow(function (rownum, row) {
							//console.info("rownum " + rownum);
							lastrow = rownum;
							//do something with the row..

						});

					}




					function getMoreData() {


						return new Promise(resolve => {


							if (self.backendApi.getRowCount() > lastrow + 1 && lastrow <= layout.maxRecord) {

								//we havent got all the rows yet, so get some more, 1000 rows
								var requestPage = [{
									qTop: lastrow + 1,
									qLeft: 0,
									qWidth: 5, //should be # of columns
									qHeight: Math.min(2000, self.backendApi.getRowCount() - lastrow)
								}];
								self.backendApi.getData(requestPage).then(function (dataPages) {

									//console.log(" Page  lastrow........... "  + lastrow);
									//when we get the result trigger paint again
									addtoArray();
									resolve(getMoreData());

								});

							} else {
								resolve();
							}
						});
					}




				}
				catch (err) {
					console.info(err);
				}

			
				//needed for export
				return qlik.Promise.resolve();
			}
		};

	});



