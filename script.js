let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';


let educationData 
let countyData 

let width = 960
let height = 600
let padding = 60
let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCounty =() => {
    svg.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d',d3.geoPath())
        .attr('class','county')
        .attr('fill', (d) => {
            let id = d['id']
            let county = educationData.find((d)=>{
                return d['fips'] === id 
            })
            percentage = county['bachelorsOrHigher']

            if (percentage <= 15){
                return 'beige'
            } else if (percentage <= 30){
                return 'rosybrown'
            } else if (percentage <= 45){
                return 'yellow'
            } else {return 'salmon'}
        })
        .attr('data-fips', (d) => {
            return d['id']
        })
        .attr('data-education', (d) => {
            let id = d['id']
            let county = educationData.find((d)=>{
                return d['fips'] === id 
            })
            return county['bachelorsOrHigher']
        })
        .on ('mouseover',(d, event )=>{
            tooltip.transition()
                    .style('visibility', 'visible')
                    let id = d['id']
                    let county = educationData.find((d)=>{
                        return d['fips'] === id 
                    })

            tooltip.text(county['area_name']+ "  | " + county['bachelorsOrHigher'] + '%')
                    .attr ( 'data-education', county['bachelorsOrHigher'])

        })
    
        .on ('mouseout', (d) => {
            tooltip.transition()
            .style('visibility', 'hidden')
        })

}

d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log (error)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log (countyData)
            
            d3.json(educationURL).then(
                (data, error) => {
                    if(error) {
                        console.log (error)
                    } else {
                        educationData = data
                        console.log (educationData)

                        drawCounty()
                    }
                }
            )
        }
    }
)
