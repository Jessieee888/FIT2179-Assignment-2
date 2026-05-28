function renderLineChart() {
  Promise.all([
    fetch("data/school_numbers_dataset.csv").then(r => r.text()),
    fetch("data/line_chart.json").then(r => r.json())
  ]).then(([text, spec]) => {
    const lines   = text.trim().split("\n");
    const headers = lines[0].split(";");

    const rows = lines.slice(1).map(line => {
      const cols = line.split(";");
      const obj  = {};
      headers.forEach((h, i) => obj[h.trim()] = (cols[i] || "").trim());
      return obj;
    });

    // Filter: Australia total, all school types, 3 sectors only
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

    spec.data.values = data;
    return vegaEmbed("#vis-line-chart", spec, { actions: false });
  });
}