// Caminho para o CSV no repositório
const csvFile = "https://peevoo.github.io/grelhasTV/data/grelha.csv";

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
  // Normaliza as chaves para remover espaços em branco
  data = data.map(row => {
    const fixed = {};
    Object.keys(row).forEach(k => {
      fixed[k.trim()] = row[k];
    });
    return fixed;
  });

  // Extrair anos únicos da coluna "Data"
  const years = [...new Set(
    data
      .map(row => {
        if (!row["Data"]) return null;
        const parts = row["Data"].split("/");
        return parts.length === 3 ? parts[2] : null;
      })
      .filter(y => y !== null)
  )];

  years.sort();

  const yearSelect = document.getElementById("yearSelect");
  const dateSelect = document.getElementById("dateSelect");

  years.forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearSelect.appendChild(opt);
  });

  yearSelect.addEventListener("change", () => {
    updateDates(yearSelect.value);
  });

  dateSelect.addEventListener("change", () => {
    showTable(dateSelect.value);
  });

  if (years.length > 0) {
    updateDates(years[0]);
  }
}


function updateDates(year) {
  const dateSelect = document.getElementById("dateSelect");
  dateSelect.innerHTML = "";

  // Filtrar datas do ano escolhido
  const dates = [...new Set(
    data
      .filter(row => {
        if (!row["Data"]) return false;
        const parts = row["Data"].split("/");
        return parts.length === 3 && parts[2] === year;
      })
      .map(row => row["Data"])
  )];

  // Ordenar por data real
  dates.sort((a, b) => {
    const [d1, m1, y1] = a.split("/").map(Number);
    const [d2, m2, y2] = b.split("/").map(Number);
    return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
  });

  // Preencher o dropdown
  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    dateSelect.appendChild(opt);
  });

  // Mostrar logo a primeira tabela
  if (dates.length > 0) {
    showTable(dates[0]);
  } else {
    document.getElementById("tableContainer").innerHTML = `<p>Sem grelhas disponíveis para ${year}</p>`;
  }
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
