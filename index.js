const dataSet = {};

const button = document.querySelector("button");
const onTheScreen = document.querySelector(".time-stamp");
const table = document.querySelector(".table");

button.addEventListener("click", async () => {
  formatDataSet(await fecthFn());
  sorting();
  renderTable();
});

const fecthFn = async () => {
  const response = await fetch("https://run.mocky.io/v3/9f469bc3-06fa-472d-b0ed-66eb65a12a18");
  if (response) onTheScreen.textContent = new Date(Date.now()).toLocaleString();
  const json = await response.json();

  return (dataSet.data = json);
};

const formatDataSet = async () => {
  await dataSet.data.map((el) => {
    const timestamp = el.record.rtime * 1;
    const date = new Date(timestamp);
    const result = date.toLocaleString().split(",");
    const [day, month, year] = result[0].split(".");
    const fullDate = [year, month, day].join("-");
    const finalDateFormat = [fullDate, result[1]].join(" ");
    el.record.rtime = finalDateFormat;
    if (el.record.v1 === "") el.record.v1 = "--no data--";
    if (el.record.v2 === "") el.record.v2 = "--no data--";
    if (el.record.v3 === "") el.record.v3 = "--no data--";
  });
};

const sorting = () => {
  dataSet.data.sort((a, b) => a.record.ecent - b.record.ecent);
};

const renderTable = async () => {
  dataSet.data.sort((a, b) => a.record.ecent - b.record.ecent);
  dataSet.data.forEach((el) => {
    const { rtime, ecent, status, v1, v2, v3 } = el.record;
    table.insertAdjacentHTML(
      "beforeend",
      ` <div class="rtime">${rtime}</div>
    <div class="ecent" >${ecent}</div>
    <div class="v1" data-err="${status}">${v1}</div>
    <div class="v2" data-err="${status}">${v2}</div>
    <div class="v3" data-err="${status}">${v3}</div>
    <div class="error" data-value="${el.error}">${el.error === true ? "Awaria" : "Ok"}</div>`
    );
  });
};
