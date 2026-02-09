let chartData;
let statsData;
let profileData;
const stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];
let selectedStock = stocks[0];
let myChart;
let selectedRange = "1mo";

async function loadData() {
  // chart data
  const chartRes = await fetch(
    "https://stock-market-api-k9vl.onrender.com/api/stocksdata",
  );
  chartData = await chartRes.json();

  // stats data (profit/bookvalue)
  const statsRes = await fetch(
    "https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata",
  );
  statsData = await statsRes.json();

  // profile/summary
  const profileRes = await fetch(
    "https://stock-market-api-k9vl.onrender.com/api/profiledata",
  );
  profileData = await profileRes.json();

  renderStockList();
  renderChart(selectedStock);
  renderDetails(selectedStock);

  document.getElementById("loadingScreen").style.display = "none";

}

loadData();

function renderStockList() {
  const divStockList = document.getElementById("stockList");
  divStockList.innerHTML = "";

  stocks.forEach((symbol) => {
    const stockInfo = statsData.stocksStatsData[0][symbol];
    const profit = stockInfo.profit.toFixed(2);
    const bookValue = stockInfo.bookValue.toFixed(3);

    const div = document.createElement("div");
div.classList.add("stock-item");

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.margin = "10px 0";
    div.style.padding = "8px";
    div.style.border = "1px solid #1e293b";
    div.style.borderRadius = "6px";
    div.style.cursor = "pointer";

    const profitColor = profit > 0 ? "lime" : "red";

    div.innerHTML = `
      <span>${symbol}</span>
      <span>$${bookValue}</span>
      <span style="color:${profitColor}">${profit}%</span>
    `;

    div.addEventListener("click", () => {
        document.querySelectorAll(".stock-item").forEach(el=>{
    el.classList.remove("active-stock");
});

// add highlight to clicked
div.classList.add("active-stock");
      selectedStock = symbol;
          renderChart(selectedStock);  
          renderDetails(selectedStock);

    });
    divStockList.appendChild(div);
  });
}

document.getElementById("btn1m").onclick = ()=>{
  selectedRange = "1mo";
  renderChart(selectedStock);
  renderDetails(selectedStock);
  setActiveButton("btn1m");
}

document.getElementById("btn3m").onclick = ()=>{
  selectedRange = "3mo";
  renderChart(selectedStock);
  renderDetails(selectedStock);
  setActiveButton("btn3m");
}

document.getElementById("btn1y").onclick = ()=>{
  selectedRange = "1y";
  renderChart(selectedStock);
  renderDetails(selectedStock);
  setActiveButton("btn1y");
}

document.getElementById("btn5y").onclick = ()=>{
  selectedRange = "5y";
  renderChart(selectedStock);
  renderDetails(selectedStock);
  setActiveButton("btn5y");
}


function renderChart(stock){

    const stockObj = chartData.stocksData[0][stock];


    const labels = stockObj[selectedRange].timeStamp;
    const prices = stockObj[selectedRange].value;

    const ctx = document.getElementById("stockChart").getContext("2d");

    if(myChart){
        myChart.destroy();
    }

    myChart = new Chart(ctx,{
 type:"line",
 data:{
  labels:labels,
  datasets:[{
    label: stock,
    data:prices,
    borderColor:"lime",
    borderWidth:2,
    tension:0.4,
    pointRadius:0,
    fill:false
  }]
 },
 options:{
  responsive:true,
  interaction:{
    mode:'index',
    intersect:false
  },
  plugins:{
    legend:{display:false},
    tooltip:{
      callbacks:{
        label:function(context){
          return "$" + context.parsed.y;
        }
      }
    }
  },
  scales:{
    x:{
      ticks:{color:"#94a3b8"},
      grid:{color:"#1e293b"}
    },
    y:{
      ticks:{color:"#94a3b8"},
      grid:{color:"#1e293b"}
    }
  }
 }
});

}


function renderDetails(stock){

    const stats = statsData.stocksStatsData[0][stock];
    const profile = profileData.stocksProfileData[0][stock];

    const stockObj = chartData.stocksData[0][stock];
    const prices = stockObj[selectedRange].value;

    const maxPrice = Math.max(...prices).toFixed(2);
    const minPrice = Math.min(...prices).toFixed(2);

    const detailsDiv = document.getElementById("details");

    const profitColor = stats.profit >= 0 ? "lime" : "red";

    detailsDiv.innerHTML = `
        <h2>${stock}</h2>
        <p>Book Value: $${stats.bookValue}</p>
        <p style="color:${profitColor}">
            Profit: ${stats.profit.toFixed(2)}%
        </p>

        <p>High: $${maxPrice}</p>
        <p>Low: $${minPrice}</p>

        <br>
        <p>${profile.summary}</p>
    `;
}

function setActiveButton(buttonId){

  document.querySelectorAll(".range-btn").forEach(btn=>{
    btn.classList.remove("active-range");
  });

  document.getElementById(buttonId).classList.add("active-range");
}
