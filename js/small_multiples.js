function renderSmallMultiples() {
  const ABBR = {
    "New South Wales": "NSW", "Victoria": "VIC",
    "Queensland": "QLD", "Western Australia": "WA",
    "South Australia": "SA", "Tasmania": "TAS",
    "Australian Capital Territory": "ACT", "Northern Territory": "NT"
  };

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
  })
  .then(() => {
    const container = document.getElementById("vis-small-multiples");
    document.querySelectorAll("#vis-small-multiples .map-annotation").forEach(el => el.remove());

    // Annotation 1: SA government decline row 2, col 1
    const a1 = document.createElement("div");
    a1.className  = "map-annotation";
    a1.style.left = "4%";
    a1.style.top  = "70%";
    a1.innerHTML  = `<div class="map-annotation-bubble">SA govt. schools fell<br><span style="font-size:0.62rem;opacity:0.8">Steepest government decline of any state</span></div>`;
    container.appendChild(a1);

    // Annotation 2: ACT Catholic spike row 2, col 3
    const a2 = document.createElement("div");
    a2.className  = "map-annotation";
    a2.style.left = "51%";
    a2.style.top  = "70%";
    a2.innerHTML  = `<div class="map-annotation-bubble">ACT Catholic schools nearly doubled after 2013<br><span style="font-size:0.62rem;opacity:0.8">Unique among all states and territories</span></div>`;
    container.appendChild(a2);
  });
}