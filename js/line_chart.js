function renderLineChart() {
  fetch("data/school_numbers_dataset.csv")
    .then(r => r.text())
    .then(text => {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(";");

      const rows = lines.slice(1).map(line => {
        const cols = line.split(";");
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = (cols[i] || "").trim());
        return obj;
      });

      // Filter: Australia total, All school types, 3 sectors only
      const data = rows
        .filter(r =>
          r["State/territory"] === "Australia" &&
          r["School type"] === "All" &&
          ["Government", "Catholic", "Independent"].includes(r["School sector"])
        )
        .map(r => ({
          year:   +r["Calendar year"],
          sector: r["School sector"],
          count:  +r["School count"].replace(/,/g, "")
        }));

      const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 380,
        "background": "#f2ece0",
        "data": { "values": data },
        "layer": [
          {
            "mark": { "type": "line", "strokeWidth": 2.5 },
            "encoding": {
              "x": {
                "field": "year", "type": "ordinal",
                "axis": {
                  "title": null,
                  "labelColor": "#3a2a10",
                  "labelAngle": 0,
                  "labelFontSize": 10,
                  "gridColor": "#d8ccb0",
                  "gridDash": [3, 3],
                  "labelExpr": "datum.value % 5 === 1 ? datum.value : ''"
                }
              },
              "y": {
                "field": "count", "type": "quantitative",
                "axis": {
                  "title": "Number of Schools",
                  "titleColor": "#3a2a10",
                  "labelColor": "#3a2a10",
                  "gridColor": "#d8ccb0",
                  "gridDash": [3, 3],
                  "labelFontSize": 10,
                  "titleFontSize": 11,
                  "format": ",.0f",
                  "formatType": "number"
                }
              },
              "color": {
                "field": "sector", "type": "nominal",
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
              "tooltip": [
                { "field": "year",   "title": "Year" },
                { "field": "sector", "title": "Sector" },
                { "field": "count",  "title": "Schools", "type": "quantitative", "format": "," }
              ]
            }
          },
          {
            "mark": { "type": "rule", "color": "#8a4a00", "strokeWidth": 1, "strokeDash": [4, 2], "opacity": 0.6 },
            "data": { "values": [{ "year": 2016 }] },
            "encoding": { "x": { "field": "year", "type": "ordinal" } }
          },
          {
            "mark": { "type": "text", "align": "left", "baseline": "top",
                      "dx": 5, "dy": 5, "fontSize": 9, "fontStyle": "italic", "color": "#8a4a00" },
            "data": { "values": [{ "year": 2016, "label": "Independent growth accelerates" }] },
            "encoding": {
              "x": { "field": "year", "type": "ordinal" },
              "text": { "field": "label" }
            }
          }
        ],
        "config": { "view": { "stroke": null } }
      };

      vegaEmbed("#vis-line-chart", spec, { actions: false });
    });
}