let selectedBarTypes = new Set(["Primary", "Secondary", "Combined"]);

function toggleBarType(type, btn) {
  if (selectedBarTypes.has(type)) {
    if (selectedBarTypes.size === 1) return;
    selectedBarTypes.delete(type);
    btn.classList.remove("type-btn--active");
  } else {
    selectedBarTypes.add(type);
    btn.classList.add("type-btn--active");
  }
  renderBar();
}

function renderBar() {
  const filtered = ALL_DATA.filter(d => selectedBarTypes.has(d["School Type"]));

  fetch("data/stacked_bar.json")
    .then(r => r.json())
    .then(spec => {
      spec.data.values = filtered;
      return vegaEmbed("#vis-bar", spec, { actions: false });
    });
}