var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#svg-area3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
// d3.csv("college.csv")
//   .then(function(collegeData) {

d3.json("/data/bubble").then(function (data) {
  console.log(data)
})


    // Step 1: Parse Data/Cast as numbers
    // ==============================
    collegeData.forEach(function(data) {
      data.med_sat_value  = +data.med_sat_value;
      data.retain_value  = +data.retain_value;
    });

    // Step 2: Create scale
    

    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(collegeData, d => d.med_sat_value)])
      .range([20, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([-5, d3.max(collegeData, d => d.retain_value)])
      .range([height, 20]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(collegeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.med_sat_value))
    .attr("cy", d => yLinearScale(d.retain_value))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("stroke", "darkpink") 
    .attr("opacity", ".5");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.chronname}<br>Medium SAT Value: ${d.med_sat_value}<br>Freshmen Retention: ${d.retain_value}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Med SAT Value");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Retention Value");
  });

