function renderAreaChart() {
  const data = [
    {year:2001,sector:"Government",count:6941},{year:2002,sector:"Government",count:6949},
    {year:2003,sector:"Government",count:6930},{year:2004,sector:"Government",count:6938},
    {year:2005,sector:"Government",count:6929},{year:2006,sector:"Government",count:6902},
    {year:2007,sector:"Government",count:6851},{year:2008,sector:"Government",count:6833},
    {year:2009,sector:"Government",count:6802},{year:2010,sector:"Government",count:6743},
    {year:2011,sector:"Government",count:6705},{year:2012,sector:"Government",count:6697},
    {year:2013,sector:"Government",count:6661},{year:2014,sector:"Government",count:6651},
    {year:2015,sector:"Government",count:6639},{year:2016,sector:"Government",count:6634},
    {year:2017,sector:"Government",count:6639},{year:2018,sector:"Government",count:6646},
    {year:2019,sector:"Government",count:6659},{year:2020,sector:"Government",count:6675},
    {year:2021,sector:"Government",count:6692},{year:2022,sector:"Government",count:6699},
    {year:2023,sector:"Government",count:6712},{year:2024,sector:"Government",count:6727},
    {year:2025,sector:"Government",count:6737},

    {year:2001,sector:"Catholic",count:1697},{year:2002,sector:"Catholic",count:1697},
    {year:2003,sector:"Catholic",count:1698},{year:2004,sector:"Catholic",count:1695},
    {year:2005,sector:"Catholic",count:1698},{year:2006,sector:"Catholic",count:1703},
    {year:2007,sector:"Catholic",count:1703},{year:2008,sector:"Catholic",count:1705},
    {year:2009,sector:"Catholic",count:1705},{year:2010,sector:"Catholic",count:1708},
    {year:2011,sector:"Catholic",count:1710},{year:2012,sector:"Catholic",count:1713},
    {year:2013,sector:"Catholic",count:1717},{year:2014,sector:"Catholic",count:1722},
    {year:2015,sector:"Catholic",count:1737},{year:2016,sector:"Catholic",count:1738},
    {year:2017,sector:"Catholic",count:1744},{year:2018,sector:"Catholic",count:1753},
    {year:2019,sector:"Catholic",count:1756},{year:2020,sector:"Catholic",count:1762},
    {year:2021,sector:"Catholic",count:1762},{year:2022,sector:"Catholic",count:1766},
    {year:2023,sector:"Catholic",count:1764},{year:2024,sector:"Catholic",count:1759},
    {year:2025,sector:"Catholic",count:1758},

    {year:2001,sector:"Independent",count:957},{year:2002,sector:"Independent",count:966},
    {year:2003,sector:"Independent",count:979},{year:2004,sector:"Independent",count:982},
    {year:2005,sector:"Independent",count:996},{year:2006,sector:"Independent",count:1007},
    {year:2007,sector:"Independent",count:1025},{year:2008,sector:"Independent",count:1024},
    {year:2009,sector:"Independent",count:1022},{year:2010,sector:"Independent",count:1017},
    {year:2011,sector:"Independent",count:1020},{year:2012,sector:"Independent",count:1017},
    {year:2013,sector:"Independent",count:1015},{year:2014,sector:"Independent",count:1016},
    {year:2015,sector:"Independent",count:1028},{year:2016,sector:"Independent",count:1042},
    {year:2017,sector:"Independent",count:1061},{year:2018,sector:"Independent",count:1078},
    {year:2019,sector:"Independent",count:1088},{year:2020,sector:"Independent",count:1105},
    {year:2021,sector:"Independent",count:1127},{year:2022,sector:"Independent",count:1149},
    {year:2023,sector:"Independent",count:1153},{year:2024,sector:"Independent",count:1167},
    {year:2025,sector:"Independent",count:1178}
  ];

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 380,
    "background": "#f2ece0",
    "data": { "values": data },
    "layer": [
      {
        "mark": { "type": "area", "opacity": 0.85, "line": { "strokeWidth": 1.5 } },
        "encoding": {
          "x": {
            "field": "year", "type": "ordinal",
            "axis": {
              "title": null,
              "labelColor": "#3a2a10",
              "labelAngle": -45,
              "labelFontSize": 10,
              "gridColor": "#d8ccb0",
              "gridDash": [3, 3],
              "tickCount": 5,
              "labelExpr": "datum.value % 5 === 1 ? datum.value : ''"
            }
          },
          "y": {
            "field": "count", "type": "quantitative",
            "stack": "zero",
            "axis": {
              "title": "Number of Schools",
              "titleColor": "#3a2a10",
              "labelColor": "#3a2a10",
              "gridColor": "#d8ccb0",
              "gridDash": [3, 3],
              "labelFontSize": 10,
              "titleFontSize": 11
            }
          },
          "color": {
            "field": "sector", "type": "nominal",
            "sort": ["Government", "Catholic", "Independent"],
            "scale": {
              "domain": ["Government", "Catholic", "Independent"],
              "range":  ["#5a3e8a", "#e03e1a", "#1a6a40"]
            },
            "legend": {
              "title": "Sector",
              "titleColor": "#3a2a10",
              "labelColor": "#3a2a10",
              "titleFontSize": 11,
              "labelFontSize": 11,
              "orient": "top-right"
            }
          },
          "order": {
            "field": "sector",
            "sort": ["Government", "Catholic", "Independent"]
          },
          "tooltip": [
            { "field": "year",   "title": "Year" },
            { "field": "sector", "title": "Sector" },
            { "field": "count",  "title": "Schools", "type": "quantitative", "format": "," }
          ]
        }
      },
      {
        "mark": { "type": "rule", "color": "#1a1209", "strokeWidth": 1, "strokeDash": [4, 2], "opacity": 0.5 },
        "data": { "values": [{ "year": 2016 }] },
        "encoding": { "x": { "field": "year", "type": "ordinal" } }
      },
      {
        "mark": { "type": "text", "align": "left", "dx": 4, "dy": -60,
                  "fontSize": 9, "fontStyle": "italic", "color": "#5a4a30" },
        "data": { "values": [{ "year": 2016, "label": "Independent growth\naccelerates post-2015" }] },
        "encoding": {
          "x": { "field": "year", "type": "ordinal" },
          "text": { "field": "label" }
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis-area", spec, { actions: false });
}