define([], function () {
    'use strict';

    return {
        type: "scatter",

                    /*data: {
                uses: "data"
            }, */
            dimensions: {
                min: 1,
                max: 1
            },

            measures: {
                min: 2,
                max: 2
            },


            presentation: {
                modeOptions:  [{
                    value: "markers",
                    label: "Data points"
                }/*, {
                    value: "lines+markers",
                    label: "Lines+Data points"
                }*/, {
                    value: "markers+text",
                    label: "Data points+Text"
                }],
                modeDefaultValue: "markers",
                showLineProps: false,
                showMarkerPops: true

            
            },
            color: {
                colorMode: 
                [{
                    value: "primary",
                    translation: "properties.colorMode.primary"
                }, {
                    value: "byDimension",
                    translation: "properties.colorMode.byDimension"
                }, {
                    value: "byMeasure",
                    translation: "properties.colorMode.byMeasure"
                }, {
                    value: "byExpression",
                    translation: "properties.colorMode.byExpression"
                }]
            }



            
        }
});