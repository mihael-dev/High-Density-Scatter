# High-Density Scatter Plot for Qlik Sense

With this Qlik Sense extension a high-density scatter plot with several tousands data points can be created. 


![High-Density-Scatter.gif](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/HighDensityScatter.gif)

The extension is based on https://plotly.com/javascript/.
The library supports WebGL for rendering.

<br /><br />	

**Tips for configuration:**

Add-Ons > "Max Records": Default 5000. Increase the number to see more points in the chart.

Add-Ons > "Reference lines": Add line here. The line geometry expects a set of coordinates.
	e.g. [x1, y1],[x2, y2] creates a straight line. Further  examples are in the attached Qlik Sense app.  

X Axis/Y Axis > "Tick Label Format-D3.js": Defines the date format for the acix. D3 formats are used.
	e.g. "YYYY-MM-DD hh:mm" > D3: "%Y-%d-%m %H:%M" 
	e.g. "#,##0.00" > ",.2f"
	Date Format: https://github.com/d3/d3-time-format
	Number Format: https://github.com/d3/d3-format/blob/master/README.md#locale_format
	
	
<br /><br />	

**Reference Lines / Rects:**
![Reference Line&Rect.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/Reference%20Line%26Rect.PNG)

<br /><br />

**Dimensional Lines Examples:**
e.g. Regression, Median
<br />
![Dimensional Lines.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/Dimensional%20Lines.PNG)

<br /><br />

**Distribution Plot Examples:**
![RefLines.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/distributionPlot.PNG)

<br /><br />

**Color Options:**
![ColorOptions.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/ColorOptions.PNG)


<br /><br />

**Tooltip:**
![Tooltip.png](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/Tooltip.png)

<br /><br />

**Experimental: Max Performance Mode**
- showcases how to create a scatter plot render with 100k+ points
![MaxPerformanceMode.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/MaxPerformanceMode.PNG)

**Known Limitations:**
- The extension is tested with  ~100k data points.
- Number formats in the measures are ignored. Use Tick Format in the X Axis/Y Axis configuration instead. 
- No support for colors in Master measures and dimensions.
- No support for selections on axis and legend.
- Printing of the high-density scatter should work up to 50k points.
