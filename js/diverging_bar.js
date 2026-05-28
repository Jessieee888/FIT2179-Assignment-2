function renderDivergingBar() {
  const ABBR = {
    "New South Wales": "NSW", "Victoria": "VIC", "Queensland": "QLD",
    "Western Australia": "WA", "South Australia": "SA", "Tasmania": "TAS",
    "Australian Capital Territory": "ACT", "Northern Territory": "NT"
  };

  Promise.all([
    fetch("data/student_numbers_dataset.csv").then(r => r.text()),
    fetch("vega/diverging_bar.json").then(r => r.json())
  ]).then(([text, spec]) => {
    const lines   = text.trim().split("\n");
    const headers = lines[0].split(";");

    const rows = lines.slice(1).map(line => {
      const cols = line.split(";");
      const obj  = {};
      headers.forEach((h, i) => obj[h.trim()] = (cols[i] || "").trim());
      return obj;
    });

    const filtered = rows.filter(r =>
      r["Calendar year"] === "2025" &&
      r["School sector"] === "All" &&
      r["School level"] === "All" &&
      r["Aboriginal or Torres Strait Islander status"] === "All" &&
      r["Full-time/part-time status"] === "All" &&
      ["Male", "Female"].includes(r["Sex/gender"]) &&
      ABBR[r["State/territory"]]
    );

    const stateCounts = {};
    filtered.forEach(r => {
      const abbr = ABBR[r["State/territory"]];
      if (!stateCounts[abbr]) stateCounts[abbr] = { male: 0, female: 0 };
      const count = +r["Student count"].replace(/,/g, "");
      if (r["Sex/gender"] === "Male")   stateCounts[abbr].male   += count;
      if (r["Sex/gender"] === "Female") stateCounts[abbr].female += count;
    });

    const flat       = [];
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

    spec.data.values              = flat;
    spec.layer[0].encoding.y.sort = stateOrder;

    return vegaEmbed("#vis-diverging-bar", spec, { actions: false });
  }).then(() => {
    setTimeout(() => {
      const container = document.getElementById("vis-diverging-bar");
      document.querySelectorAll("#vis-diverging-bar .map-annotation").forEach(el => el.remove());

      const annotations = [
        { left: "80%", top: "10%", text: "The ACT has the widest gap" },
        { left: "80%", top: "88%", text: "Tasmania has the narrowest gap" }
      ];

      annotations.forEach(a => {
        const div = document.createElement("div");
        div.className  = "map-annotation";
        div.style.left = a.left;
        div.style.top  = a.top;
        div.innerHTML  = `<div class="map-annotation-bubble">${a.text}</div>`;
        container.appendChild(div);
      });
    }, 300);
  });
}