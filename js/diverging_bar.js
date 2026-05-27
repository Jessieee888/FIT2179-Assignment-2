function renderDivergingBar() {
  fetch("data/student_numbers_dataset.csv")
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
        "New South Wales": "NSW", "Victoria": "VIC", "Queensland": "QLD",
        "Western Australia": "WA", "South Australia": "SA", "Tasmania": "TAS",
        "Australian Capital Territory": "ACT", "Northern Territory": "NT"
      };

      // Filter: 2025, all sectors, all levels, all indigenous, all FT/PT, male/female only, no national total
      const filtered = rows.filter(r =>
        r["Calendar year"] === "2025" &&
        r["School sector"] === "All" &&
        r["School level"] === "All" &&
        r["Aboriginal or Torres Strait Islander status"] === "All" &&
        r["Full-time/part-time status"] === "All" &&
        ["Male", "Female"].includes(r["Sex/gender"]) &&
        ABBR[r["State/territory"]]
      );

      // Aggregate male/female counts per state
      const stateCounts = {};
      filtered.forEach(r => {
        const abbr = ABBR[r["State/territory"]];
        if (!stateCounts[abbr]) stateCounts[abbr] = { male: 0, female: 0 };
        const count = +r["Student count"].replace(/,/g, "");
        if (r["Sex/gender"] === "Male")   stateCounts[abbr].male   += count;
        if (r["Sex/gender"] === "Female") stateCounts[abbr].female += count;
      });

      // Compute percentages and build flat array for chart
      const flat = [];
      const stateOrder = [];

      Object.entries(stateCounts)
        .map(([state, d]) => {
          const total = d.male + d.female;
          return {
            state,
            male: d.male, female: d.female,
            male_pct:   Math.round(d.male   / total * 10000) / 100,
            female_pct: Math.round(d.female / total * 10000) / 100,
            deviation:  Math.round((d.male / total * 100 - 50) * 100) / 100
          };
        })
        .sort((a, b) => b.deviation - a.deviation)
        .forEach(d => {
          stateOrder.push(d.state);
          flat.push({ state: d.state, gender: "Male",   x1: 50,           x2: d.male_pct,   pct: d.male_pct,   count: d.male });
          flat.push({ state: d.state, gender: "Female", x1: d.female_pct, x2: 50,            pct: d.female_pct, count: d.female });
        });

      const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 320,
        "background": "#f2ece0",
        "data": { "values": flat },
        "layer": [
          {
            "mark": { "type": "bar", "height": 18 },
            "encoding": {
              "y": {
                "field": "state", "type": "ordinal",
                "sort": stateOrder,
                "axis": {
                  "labelColor": "#3a2a10", "titleColor": "#3a2a10",
                  "title": null, "labelFontSize": 12, "labelFontStyle": "italic"
                }
              },
              "x": {
                "field": "x1", "type": "quantitative",
                "scale": { "domain": [47.5, 52.5] },
                "axis": {
                  "title": "Share of enrolments (%)",
                  "titleColor": "#3a2a10", "labelColor": "#3a2a10",
                  "gridColor": "#d8ccb0", "tickCount": 6,
                  "labelExpr": "datum.value + '%'"
                }
              },
              "x2": { "field": "x2", "type": "quantitative" },
              "color": {
                "field": "gender", "type": "nominal",
                "scale": {
                  "domain": ["Female", "Male"],
                  "range":  ["#5a3e8a", "#e03e1a"]
                },
                "legend": {
                  "title": "Gender",
                  "titleColor": "#3a2a10", "labelColor": "#3a2a10",
                  "orient": "top-right", "labelFontSize": 11
                }
              },
              "opacity": { "value": 0.82 },
              "tooltip": [
                { "field": "state",  "title": "State" },
                { "field": "gender", "title": "Gender" },
                { "field": "pct",    "title": "Share (%)",     "type": "quantitative", "format": ".2f" },
                { "field": "count",  "title": "Student Count", "type": "quantitative", "format": "," }
              ]
            }
          },
          {
            "mark": { "type": "rule", "color": "#1a1209", "strokeWidth": 1.5, "strokeDash": [4, 2] },
            "encoding": { "x": { "datum": 50, "type": "quantitative" } }
          }
        ],
        "config": { "view": { "stroke": null }, "axis": { "domain": false } }
      };

      vegaEmbed("#vis-diverging-bar", spec, { actions: false });
    });
}