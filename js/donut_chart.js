function renderDonutChart() {
  const SECTOR_DOMAIN = ["Government", "Catholic", "Independent"];

  // Aggregate counts from ALL_DATA
  const counts = SECTOR_DOMAIN.map(sector => ({
    sector,
    count: ALL_DATA.filter(d => d["School Sector"] === sector).length
  }));
  const total = counts.reduce((s, d) => s + d.count, 0);

  fetch("data/donut_chart.json")
    .then(r => r.json())
    .then(spec => {
      // Inject live aggregated data into the spec
      spec.data.values = counts;
      return vegaEmbed("#vis-donut", spec, { actions: false });
    })
    .then(() => {
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