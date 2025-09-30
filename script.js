// Caminho para o CSV no repositório
const csvFile = "data/grelha.csv";

let data = []; // array com os registos

// Carregar o CSV
Papa.parse(csvFile, {
  download: true,
  header: true,
  complete: function(results) {
    data = results.data;
    init();
  }
});

function init() {
  // Extrair anos únicos da coluna "Data"
  const years = [...new Set(data.map(row => row["Data"].split("/")[2]))];
  years.sort();

  const yearSelect = document.getElementById("yearSelect");
  const dateSelect = document.getElementById("dateSelect");

  // Preencher dropdown de anos
  years.forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearSelect.appendChild(opt);
  });

  // Atualizar datas quando mudar o ano
  yearSelect.addEventListener("change", () => {
    updateDates(yearSelect.value);
  });

  // Atualizar tabela quando mudar a data
  dateSelect.addEventListener("change", () => {
    showTable(dateSelect.value);
  });

  // Inicializar com o primeiro ano
  updateDates(years[0]);
}

function updateDates(year) {
  const dateSelect = document.getElementById("dateSelect");
  dateSelect.innerHTML = "";

  // Filtrar datas do ano escolhido
  const dates = [...new Set(
    data.filter(row => row["Data"].endsWith(year))
        .map(row => row["Data"])
  )];
  
  dates.sort((a, b) => {
    const [d1, m1, y1] = a.split("/").map(Number);
    const [d2, m2, y2] = b.split("/").map(Number);
    return new Date(y1, m1-1, d1) - new Date(y2, m2-1, d2);
  });

  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    dateSelect.appendChild(opt);
  });

  // Mostrar logo a primeira data
  showTable(dates[0]);
}

function showTable(date) {
  const rows = data.filter(row => row["Data"] === date);
  const container = document.getElementById("tableContainer");

  let html = `<h2>Grelha de ${date}</h2>`;
  html += "<table><tr>";
  Object.keys(rows[0]).forEach(col => {
    html += `<th>${col}</th>`;
  });
  html += "</tr>";

  rows.forEach(row => {
    html += "<tr>";
    Object.values(row).forEach(val => {
      html += `<td>${val || ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  container.innerHTML = html;
}
