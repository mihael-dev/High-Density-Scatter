# High-Density Scatter Plot for Qlik Sense

With this Qlik Sense extension a high-density scatter plot with several tousands data points can be created. 


![High-Density-Scatter.gif](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/HighDensityScatter.gif)

The extension is based on https://plotly.com/javascript/.
The library supports WebGL for rendering.


**Tips for configuration:**

Add-Ons > "Max Records": Default 5000. Increase the number to see more points in the chart.

Add-Ons > "Reference lines": Add line here. The line geometry expects a set of coordinates.
	e.g. [x1, y1],[x2, y2] creates a straight line. Further  examples are in the attached Qlik Sense app.  


**Referenence Lines Examples**
![RefLines.PNG](https://raw.githubusercontent.com/mihael-dev/High-Density-Scatter/main/demo/RefLines.PNG)


**Known Limitations:**
- Only one high-density scatter plot per sheet is supported by the underlying JS library.
- The extension is tested for less than 50k data points.
