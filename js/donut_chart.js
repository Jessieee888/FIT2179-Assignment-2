function renderDonutChart() {
  const sectorColors = {
    domain: ["Government", "Catholic", "Independent"],
    range:  ["#5a3e8a", "#e03e1a", "#1a6a40"]
  };

  // Aggregate counts from ALL_DATA
  const counts = sectorColors.domain.map(sector => ({
    sector,
    count: ALL_DATA.filter(d => d["School Sector"] === sector).length
  }));
  const total = counts.reduce((s, d) => s + d.count, 0);

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 260,
    "height": 260,
    "background": "transparent",
    "data": { "values": counts },
    "layer": [
      {
        "mark": {
          "type": "arc",
          "innerRadius": 72,
          "outerRadius": 120,
          "padAngle": 0.025,
          "cornerRadius": 3
        },
        "encoding": {
          "theta": {
            "field": "count",
            "type": "quantitative"
          },
          "color": {
            "field": "sector",
            "type": "nominal",
            "scale": {
              "domain": sectorColors.domain,
              "range":  sectorColors.range
            },
            "legend": null
          },
          "tooltip": [
            { "field": "sector", "title": "Sector" },
            { "field": "count",  "title": "Schools", "format": "," }
          ]
        }
      }
    ],
    "config": {
      "view": { "stroke": null }
    }
  };

  vegaEmbed("#vis-donut", spec, { actions: false }).then(() => {
    // Render centre text via plain DOM (Vega-Lite doesn't support layered text on arc)
    const container = document.getElementById("vis-donut");
    const existing  = container.querySelector(".donut-centre");
    if (existing) existing.remove();

    const centre = document.createElement("div");
    centre.className = "donut-centre";
    centre.innerHTML = `
      <span class="donut-total">${total.toLocaleString()}</span>
      <span class="donut-label">Schools</span>
    `;
    container.appendChild(centre);
  });
}