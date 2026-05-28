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

  // Compute national average from ALL_DATA
  const totalSchools   = ALL_DATA.length;
  const privateSchools = ALL_DATA.filter(d => d["School Sector"] !== "Government").length;
  const nationalAvg    = parseFloat(((privateSchools / totalSchools) * 100).toFixed(1));

  fetch("data/lollipop.json")
    .then(r => r.json())
    .then(spec => {
      // Inject main data
      spec.data.values = values;

      // Inject national average into the rule and label layers (layers 3 and 4)
      spec.layer[3].data.values = [{ avg: nationalAvg }];
      spec.layer[4].data.values = [{ avg: nationalAvg, label: "National avg. " + nationalAvg + "%" }];

      return vegaEmbed("#vis-lollipop", spec, { actions: false });
    });
}