function renderLollipop() {
  const stateTotals  = {};
  const statePrivate = {};

  ALL_DATA.forEach(d => {
    const s = d["State"];
    if (!stateTotals[s]) { stateTotals[s] = 0; statePrivate[s] = 0; }
    stateTotals[s]++;
    if (d["School Sector"] !== "Government") statePrivate[s]++;
  });

  const values = Object.keys(stateTotals).map(state => ({
    State:    state,
    Pct:      parseFloat(((statePrivate[state] / stateTotals[state]) * 100).toFixed(1)),
    PctLabel: ((statePrivate[state] / stateTotals[state]) * 100).toFixed(1) + "%",
    Zero:     0
  }));

  const totalSchools   = ALL_DATA.length;
  const privateSchools = ALL_DATA.filter(d => d["School Sector"] !== "Government").length;
  const nationalAvg    = parseFloat(((privateSchools / totalSchools) * 100).toFixed(1));

  fetch("vega/lollipop.json")
    .then(r => r.json())
    .then(spec => {
      spec.data.values = values;
      spec.layer[3].data.values = [{ avg: nationalAvg }];
      spec.layer[4].data.values = [{ avg: nationalAvg, label: "National avg. " + nationalAvg + "%" }];
      return vegaEmbed("#vis-lollipop", spec, { actions: false });
    })
    .then(() => {
      const container = document.getElementById("vis-lollipop");
      document.querySelectorAll("#vis-lollipop .map-annotation").forEach(el => el.remove());

      const div = document.createElement("div");
      div.className  = "map-annotation map-annotation--up";
      div.style.left = "62%";
      div.style.top  = "12%";
      div.innerHTML  = `<div class="map-annotation-bubble">ACT leads all states with the highest share<br><span style="font-size:0.62rem;opacity:0.8">More than 1 in 3 ACT schools are non-government</span></div>`;
      container.appendChild(div);
    });
}