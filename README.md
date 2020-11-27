# High-Density Scatter Plot for Qlik Sense

With this Qlik Sense extension a high-density scatter plot with several tousands data points can be created. 


![High-Density-Scatter.gif](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/HighDensityScatter.gif)

The extension is based on https://plotly.com/javascript/.
The library supports WebGL for rendering.



**Tips for configuration:**

Add-Ons > "Max Records": Default 5000. Increase the number to see more points in the chart.

Add-Ons > "Reference lines": Add line here. The line geometry expects a set of coordinates.
	e.g. [x1, y1],[x2, y2] creates a straight line. Further  examples are in the attached Qlik Sense app.  

X Axis/Y Axis > "Tick Label Format-D3.js": Define the date format. D3 formats are uses for formatting.
	e.g. "YYYY-MM-DD hh:mm" > D3: "%Y-%d-%m %H:%M" 
	e.g. "#,##0.00" > ",.2f"
	Dates: https://github.com/d3/d3-time-format
	Numbers: https://github.com/d3/d3-format/blob/master/README.md#locale_format
	
	
<br /><br />	



**Reference Lines Examples:**
![RefLines.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/RefLines.PNG)

<br /><br />

**Distribution Plot Examples:**
![RefLines.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/distributionPlot.PNG)

<br /><br />

**Known Limitations:**
- The extension is tested with  ~100k data points.
- Number formats in the measure are ignored. Use Tick format at the X Axis/Y Axis configuration instead. Format D3.js
