function renderSmallMultiples() {
  const ABBR = {
    "New South Wales": "NSW", "Victoria": "VIC",
    "Queensland": "QLD", "Western Australia": "WA",
    "South Australia": "SA", "Tasmania": "TAS",
    "Australian Capital Territory": "ACT", "Northern Territory": "NT"
  };

  // Fetch CSV and spec in parallel
  Promise.all([
    fetch("data/school_numbers_dataset.csv").then(r => r.text()),
    fetch("vega/small_multiples.json").then(r => r.json())
  ]).then(([text, spec]) => {
    const lines   = text.trim().split("\n");
    const headers = lines[0].split(";");

    const rows = lines.slice(1).map(line => {
      const cols = line.split(";");
      const obj  = {};
      headers.forEach((h, i) => obj[h.trim()] = (cols[i] || "").trim());
      return obj;
    });

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

    spec.data.values = data;
    return vegaEmbed("#vis-small-multiples", spec, { actions: false });
  });
}