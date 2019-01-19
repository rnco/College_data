
// added
d3.json('/names').then(data => {
  console.log(data)
})
// .then(function (data) {
// This is what we have to do to use the DB!!!
// define some function that is tied to input/ select
// read in the value from that element
// using value request data from metadata/{state} route in flask
value = "Alabama"
d3.json(`/metadata/${value}`).then(data =>{
  console.log(data)
})
// })
////////////////////////////

////////////////////////////

//use script below

//d3.csv("dataTwo.csv")
//.then(function(data) { 
//  console.log(data);
//});

//submit button 
var submit = d3.select("#submit");
submit.on("click", function() {

// Prevent the page from refreshing
d3.event.preventDefault();

// I want the table rows that I created (within the "selection" variable) below to be cleared out each time
// the function is called 
d3.selectAll("tr").remove();
d3.selectAll("svg").remove();

// Select the input element and get the raw HTML node
var inputElement = d3.select("#patient-form-input");

// Get the value property of the input element
var inputValue = inputElement.property("value");
console.log(inputValue);

// Loop through school csv 
d3.csv("dataTwo.csv")
.then(function(data) { 
    // cast variables of interests to a number
    data.student_count = +data.student_count;
    data.med_sat_value = +data.med_sat_value;
    data.endow_value = +data.endow_value;
    data.aid_value = +data.aid_value;

    // filter the data; if input value is equal to "state" column... console and html log!

    var filteredData = data.filter(person => person.state === inputValue);
    var schools = filteredData.map(person => person.chronname);
    var studentCount = filteredData.map(person => person.student_count);
    var SAT = filteredData.map(person => person.med_sat_value);
    var endow = filteredData.map(person => person.endow_value);
    var aid = filteredData.map(person => person.aid_value);

    filteredData.aid_value = +filteredData.aid_value;

    console.log(schools);  
    console.log(studentCount);
    console.log(SAT);
    console.log(endow);
    console.log(aid);
   
    // once list of schools are gathered, print on html page
    var selection =  d3.select("tbody")
    .selectAll("tr")
    .data(filteredData)
    .enter()
    .append("tr")
    .html(function(d) {
        return `<td>${d.chronname}</td><td>${d.student_count}</td><td>${d.med_sat_value}</td>
        <td>${d.endow_value}</td><td>${d.retain_value}</td><td>${d.aid_value}</td>`    })



       ///////////////bar graph /////////////////

// set the dimensions and margins of the graph
// set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: 30, left: 300},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);

    

function GetTopThirty(arrayData){  //sorting to top 30 function
    arrayData.sort(function(a, b) {
                     return parseFloat(b.value) - parseFloat(a.value);
                   });
    return arrayData.slice(0, 30); 
  }

filteredData = GetTopThirty(filteredData);

filteredData.sort(function(a,b){
  return a.student_count-b.student_count
}) 
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain([0, d3.max(filteredData, function(d){ return +d.student_count; })])
  y.domain(filteredData.map(function(d) { return d.chronname; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  

 // create tooltip, assign it a class
  // =======================================================
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  //.offset([-10, 0])
  .offset([-10, 0])
  .style("opacity", .9)
  .style("background",'steelblue')
  .html(function(d) {
    return "<span style='color:Blue'>" + d.chronname + "</span>" +
    "<br>" + "Student Count" + ": " + d.student_count + 
    "<br>" + "Mediat SAT" + ": " + d.med_sat_value + 
    "<br>" + "Endowment" + ": " + d.endow_value + 
    "<br>" + "Retention" + ": " + d.retain_value + "%"
  })

  svg.call(tip)

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(filteredData)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.sales); })
      .attr("width", function(d) {return x(d.student_count); } )
      .attr("y", function(d) { return y(d.chronname); })
      .attr("height", y.bandwidth())
      //.attr("fill", "green")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));






})

});
