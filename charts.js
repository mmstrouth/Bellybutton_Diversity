function init() {
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    //console.log(samplesArray);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeData = data.metadata;
    var resultArray = gaugeData.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var sampleResult1 = samplesArray[0];
   
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0]

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleResult1.otu_ids;
    var otuLabels = sampleResult1.otu_labels;
    var sampleValues = sampleResult1.sample_values;
    //console.log(otuIds);


    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    gaugeNumber = parseFloat(result.wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
 

    var yticks = otuIds.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();

    //console.log(yticks);

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    };
    
    var barData = [trace1];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 bacterial species (OTUs)",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "Bacterial Species (OTU IDs)"}
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Portland" 
      }
    };
    var bubbleData = [trace2];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      automargin: true,
      hovermode: "closest",
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU IDs"}     
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var trace3 = {
      value: gaugeNumber,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week"},
      delta: {reference: 400, increasing: {color: "black"}},
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          {range: [0, 2], color: "lightpink"},
          {range: [2, 4], color: "palevioletred"},
          {range: [4, 6], color: "mediumvioletred"},
          {range: [6, 8], color: "darkmagenta"},
          {range: [8, 10], color: "indigo"}
        ],
      }
    }
    var gaugeChartData = [trace3];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeChartLayout = { width: 500, height: 400, margin: { t: 0, b: 0 }};
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeChartData, gaugeChartLayout);
  });
}
