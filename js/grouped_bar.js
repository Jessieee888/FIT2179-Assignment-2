let selectedSchoolTypes = new Set(["Primary", "Secondary", "Combined"]);

const COLOR_MAP = { "Primary": "#008b8b", "Secondary": "#ca8d7f", "Combined": "#1c1d87" };

function toggleSchoolType(type, btn) {
  if (selectedSchoolTypes.has(type)) {
    if (selectedSchoolTypes.size === 1) return; // keep at least one selected
    selectedSchoolTypes.delete(type);
    btn.classList.remove("type-btn--active");
  } else {
    selectedSchoolTypes.add(type);
    btn.classList.add("type-btn--active");
  }
  renderGroupedBar();
}

function renderGroupedBar() {
  const filtered      = ALL_DATA.filter(d => selectedSchoolTypes.has(d["School Type"]));
  const activeDomain  = ["Primary", "Secondary", "Combined"].filter(t => selectedSchoolTypes.has(t));

  fetch("data/grouped_bar.json")
    .then(r => r.json())
    .then(spec => {
      // Inject live data and dynamic color scale
      spec.data.values                    = filtered;
      spec.encoding.color.scale.domain    = activeDomain;
      spec.encoding.color.scale.range     = activeDomain.map(t => COLOR_MAP[t]);

      return vegaEmbed("#vis-grouped-bar", spec, { actions: false });
    });
}