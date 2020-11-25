define( [ "qlik", "./properties", "./plotly-latest.min", "text!./style.css"
],


function ( qlik, properties, Plotly, cssContent) {

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
			selectionMode : "CONFIRM"
		},
		definition: properties,
		
		support : {
			snapshot: true,
			export: true,
			exportData : false
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
				meaY = hypercube.qMeasureInfo[1].qFallbackTitle,
				app = qlik.currApp(this),
				extensionNamespace = "object.High-Density Scatter";
				

				var lastrow = 0
				var X = [],
					Y = [];

				var map = new Map();



				$element.html( '<div id='+ 'T_' + id +' style="width:100%;height:100%;"><div class="center" >rendering....</span></div>' );


				//return;

				TESTER = document.getElementById('T_' + id);

				
				addtoArray();

				app.theme.getApplied().then( function( qtheme ) {

					//	countToTen().then(() => console.log("i ended up at: " + i));
					getMoreData().then(() => {
					
						$('#'+ 'T_' + id).text('');

						self.backendApi.eachDataRow( function ( rownum, row ) {
							//console.info("rownum " + rownum);
							//lastrow = rownum;
							//do something with the row..
							var coords ;
							var key ;

							if (layout.coloring.type == 'single') {
								key = layout.prop.singleColor.color;
							
							} else  if (layout.coloring.type == 'exp') {
							
								if (row[3].qText != null) {
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

								/*if (typeof row[0].qAttrExps !== 'undefined' && row[0].qAttrExps.qValues !== null && typeof row[0].qAttrExps.qValues !== 'undefined'
									&& row[0].qAttrExps.qValues[0] !== null && row[0].qAttrExps.qValues[0].qText !== null) {
									key = row[0].qAttrExps.qValues[0].qText;
								} else {
									key = "undefined";

								}*/

							} 
						
						



							if (map.get(key) != null) {
								coords = map.get(key)
							} else {
								coords = [[],[],[],[]];
								map.set(key,coords)
							}

							coords[0].push(row[1].qText);
							coords[1].push(row[2].qText);
							coords[2].push(row[0].qText);
							coords[3].push(row[0].qElemNumber);





				});	



				var graph_layout = {
					hovermode: "closest", 
					dragmode: "pan",
					font:{
					  family: qtheme.properties.fontFamily
					},
					showlegend: layout.generalSettings.showLegend,					  
					xaxis: {
					  showline: layout.xAxisSettings.showLine,
					  showgrid: layout.xAxisSettings.showGrid,
					  showticklabels: layout.xAxisSettings.showTicklabels,
					  zeroline: layout.xAxisSettings.showZeroLine,
					  linecolor: 'rgb(204,204,204)',
					  tickangle: 'auto',
					  title: layout.xAxisSettings.xTitle
					},
					yaxis: {
					  showline: layout.yAxisSettings.showLine,
					  showgrid: layout.yAxisSettings.showGrid,
					  showticklabels: layout.yAxisSettings.showTicklabels,
					  zeroline: layout.yAxisSettings.showZeroLine,
					  linecolor: 'rgb(204,204,204)',
					  tickangle: 'auto',
					  title:layout.yAxisSettings.yTitle
					}
				};
					
				console.log("X " + X.length);
						var datas = [];


						
						var i = 0;
						var color;
						map.forEach(function(coords, key) {
							if (layout.coloring.type == 'exp' || layout.coloring.type == 'single') {
								color = key;	
								if (layout.coloring.type == 'exp' && layout.prop.colorCode == false) {
									var palette;
									if (layout.prop.colorPalette != null && layout.prop.colorPalette != '') {
										palette =  layout.prop.colorPalette.split(",");
									} else {
										palette = qtheme.properties.palettes.data[0].scale;
										// qtheme.properties.palettes.data[0].scale; //qtheme.properties.palettes.data.length - 1
									}
									// palette > data > scale can be an array
									if (Array.isArray(palette[0])) {
										palette = palette[Math.min(map.size-1, palette.length-1)];
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
									color : color,
									size: layout.prop.markerSize,
									opacity: layout.prop.markerOpacity,
									symbol: layout.prop.markerType,
									line: {
										width: 1,
										color: layout.prop.lineColor.color}//qtheme.properties.dataColors.primaryColor
								},
								x: coords[0],
								y: coords[1],
								text: coords[2],
								qElementNumber: coords[3],
								textposition: "middle center",
								
								hoverlabel: { bgcolor: "#535353", font:{color: "#ffffff"} },
								hovertemplate: '<b>' +dimTitle + ':</b> %{text}' +
									'<br><b>' + meaX + ':</b> %{x}' +
									'<br><b>' + meaY + ':</b> %{y}' 
							}

							datas.push(data);
							i++;

							//console.log(key + " = " + value);
						});

						console.log(Plotly.version)

						layout.refLineList.forEach( function ( lineData ) {

							var lineArray = JSON.parse('[' + lineData.line.geometry +  ']');
							var x = [];
							var y = [];
							var i = 0;

							lineArray.forEach( function ( coord ) {
								x.push(coord[0]);
								y.push(coord[1]);
								i++;
							});

							/*var x = lineData.xLineCoord.split(",").map(function(item) {
								return item.trim();
							  });

							var y = lineData.yLineCoord.split(",").map(function(item) {
								return item.trim();
							  });*/


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
									color : lineData.line.lineColor.color,
									shape: lineData.line.shape 
								
								}
							  };
	
							datas.push(line);
						
						
						});
						
					

						/*var data = [{
							type: "scattergl",
							mode: "markers",
							marker: {
								color : 'rgb(152, 0, 0)',
								line: {
									width: 1,
									color: 'rgb(0,0,0)'}
							},
							x: X,
							y: Y
						}];*/

						let modeBarButtons = [[  "pan2d","select2d", "lasso2d", "zoom2d", "resetScale2d"  ]];


						var config = {
							scrollZoom: true,
							displaylogo: false,
							modeBarButtons: modeBarButtons
						};
						
						Plotly.newPlot( TESTER, datas, graph_layout, config );


						TESTER.on('plotly_click', function(eventData) {
							select(eventData);
						
						});
						TESTER.on('plotly_selected', function(eventData) {
							
							select(eventData);
							
						});


						function select(data) {

						var select = [];
							
						data.points.forEach(function(pt) {
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


						console.log( Plotly.BUILD );
					});

				});
				
			
				
				/*async function loadAllData() {
				
					//addtoArray();
					
					getMoreData();




				} */
			
				
				
				//loop through the rows we have and render
				 function addtoArray() {
					//console.info("getRowCount" + self.backendApi.getRowCount());
					 self.backendApi.eachDataRow( function ( rownum, row ) {
								//console.info("rownum " + rownum);
								lastrow = rownum;
								//do something with the row..
								//X.push(row[1].qNum);
								//Y.push(row[2].qNum);

					 });

				 }
				 
				

				 
				 function getMoreData() {


					return new Promise(resolve => {	
						
						
						if(self.backendApi.getRowCount() > lastrow +1 && lastrow <= layout.maxRecord){
						
								//we havent got all the rows yet, so get some more, 1000 rows
								var requestPage = [{
										qTop: lastrow + 1,
										qLeft: 0,
										qWidth: 5, //should be # of columns
										qHeight: Math.min( 2000, self.backendApi.getRowCount() - lastrow )
									}];
									self.backendApi.getData( requestPage ).then( function ( dataPages ) {

										//console.log(" Page  lastrow........... "  + lastrow);
											//when we get the result trigger paint again
											//me.paint( $element );
											addtoArray();
											resolve(getMoreData());

								} );
							
						} else {
							resolve();
						}
					});
				}
				
							
				
				
			}
			catch(err) {
			  console.info(err);
			} 
			
			/* Current Plotly.js version */
		

	
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );



