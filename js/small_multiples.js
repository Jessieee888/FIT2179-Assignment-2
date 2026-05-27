function renderSmallMultiples() {
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

      const ABBR = {
        "New South Wales": "NSW", "Victoria": "VIC",
        "Queensland": "QLD", "Western Australia": "WA",
        "South Australia": "SA", "Tasmania": "TAS",
        "Australian Capital Territory": "ACT", "Northern Territory": "NT"
      };

      const STATE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

      const data = rows
        .filter(r =>
          r["State/territory"] !== "Australia" &&
          r["School type"] === "All" &&
          ["Government", "Catholic", "Independent"].includes(r["School sector"]) &&
          ABBR[r["State/territory"]]
        )
        .map(r => ({
          state:  ABBR[r["State/territory"]],
          year:   +r["Calendar year"],
          sector: r["School sector"],
          count:  +r["School count"].replace(/,/g, "")
        }));

      const colorScale = {
        "domain": ["Government", "Catholic", "Independent"],
        "range":  ["#5a3e8a", "#e03e1a", "#1a6a40"]
      };

      const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "background": "#f2ece0",
        "data": { "values": data },
        "facet": {
          "field": "state",
          "type": "nominal",
          "sort": STATE_ORDER,
          "header": {
            "title": null,
            "labelFontSize": 13,
            "labelFontStyle": "italic",
            "labelFont": "Playfair Display, serif",
            "labelColor": "#1a1209",
            "labelPadding": 6
          }
        },
        "columns": 4,
        "spec": {
          "width": 160,
          "height": 120,
          "encoding": {
            "x": {
              "field": "year", "type": "quantitative",
              "scale": { "domain": [2001, 2025] },
              "axis": {
                "labelColor": "#6a5a40",
                "labelFontSize": 8,
                "values": [2001, 2010, 2025],
                "format": "d",
                "grid": false,
                "domain": true,
                "domainColor": "#c8b89a",
                "title": null,
                "labelAngle": 0,
                "tickColor": "#c8b89a",
                "tickSize": 4
              }
            }
          },
          "layer": [
            {
              "mark": { "type": "line", "strokeWidth": 2 },
              "encoding": {
                "y": {
                  "field": "count", "type": "quantitative",
                  "stack": null,
                  "axis": {
                    "labelColor": "#6a5a40",
                    "labelFontSize": 8,
                    "tickCount": 3,
                    "format": ",.0f",
                    "grid": true,
                    "gridColor": "#d8ccb0",
                    "gridDash": [2, 2],
                    "domain": false,
                    "title": null
                  }
                },
                "color": {
                  "field": "sector", "type": "nominal",
                  "scale": colorScale,
                  "legend": {
                    "title": "Sector",
                    "titleColor": "#3a2a10",
                    "labelColor": "#3a2a10",
                    "titleFontSize": 11,
                    "labelFontSize": 10,
                    "orient": "right",
                    "direction": "vertical"
                  }
                },
                "tooltip": [
                  { "field": "state",  "title": "State" },
                  { "field": "sector", "title": "Sector" },
                  { "field": "year",   "title": "Year",    "type": "quantitative" },
                  { "field": "count",  "title": "Schools", "type": "quantitative", "format": "," }
                ]
              }
            },
            {
              "mark": { "type": "area", "opacity": 0.12 },
              "encoding": {
                "y": {
                  "field": "count", "type": "quantitative",
                  "stack": null,
                  "axis": null
                },
                "color": {
                  "field": "sector", "type": "nominal",
                  "scale": colorScale,
                  "legend": null
                }
              }
            }
          ]
        },
        "resolve": { "scale": { "y": "independent" } },
        "spacing": { "row": 24, "column": 16 },
        "config": {
          "view": { "stroke": "#e0d4bc" },
          "background": "#f2ece0",
          "axisX": { "disable": false }
        }
      };

      vegaEmbed("#vis-small-multiples", spec, { actions: false });
    });
}