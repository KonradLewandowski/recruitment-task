//zewnętrzna zmienna dla pobranych danych
const dataSet = {};

//selektory
const button = document.querySelector("button");
const onTheScreen = document.querySelector(".time-stamp");
const table = document.querySelector(".table");

//wydarzenie dla klikniecia przycisku
button.addEventListener("click", async () => {
  formatDataSet(await fecthFn());
  sorting();
  renderTable();
});

//pobranie danych z serwera
const fecthFn = async () => {
  const response = await fetch("https://run.mocky.io/v3/9f469bc3-06fa-472d-b0ed-66eb65a12a18");
  if (response) onTheScreen.textContent = new Date(Date.now()).toLocaleString(); //moja interpretacja onBringDate. Kiedy response się pojawia to wtedy zostaje to wydrukowane na ekranie
  const json = await response.json();

  return (dataSet.data = json);
};

//cała funkcja, która formatuje odpowiednio datę, a także sprawdza, czy pola v1, v2,v3 są null
const formatDataSet = async () => {
  await dataSet.data.map((el) => {
    const timestamp = el.record.rtime * 1;
    const date = new Date(timestamp);
    const result = date.toLocaleString().split(","); //najpierw przekonwertowałem do miłego dla oka formatu i podzieliłem na dwa elementry tabeli
    const [day, month, year] = result[0].split("."); // potem podzieliłem na kolejne(znalezione na Stack Overflow)
    const fullDate = [year, month, day].join("-"); //zamieniłem miejscami, żeby uzyskać YYYY-MM-DD
    const finalDateFormat = [fullDate, result[1]].join(" "); // na końcu połączyłem to wymagany format daty
    el.record.rtime = finalDateFormat;
    //ify sprawdzającę zawartość v1, v2, v3
    if (el.record.v1 === "") el.record.v1 = "--no data--";
    if (el.record.v2 === "") el.record.v2 = "--no data--";
    if (el.record.v3 === "") el.record.v3 = "--no data--";
  });
};

//tutaj prosta funkcja sortująca dane
const sorting = () => {
  dataSet.data.sort((a, b) => a.record.ecent - b.record.ecent);
};

//sposób w jaki postanowiłem wyrenderować tabelkę na ekranie
const renderTable = async () => {
  dataSet.data.sort((a, b) => a.record.ecent - b.record.ecent);
  dataSet.data.forEach((el) => {
    const { rtime, ecent, status, v1, v2, v3 } = el.record;
    //mółj ulubiony insertAdjacentHTML, który dodaje elementy na koniec diva, ponieważ są już tam divy, któe symulują tytuły każdej kolumny. Oczywscie po każdyk wciśnięci przycisku całość się przemiesza, ale to można rozwiązań troszeczkę innym zaplanowaniem elementów DOM, ale nie na tym hciałem się tutaj skupić
    table.insertAdjacentHTML(
      "beforeend",
      ` <div class="rtime">${rtime}</div>
    <div class="ecent" >${ecent}</div>
    <div class="v1" data-err="${status}">${v1}</div>
    <div class="v2" data-err="${status}">${v2}</div>
    <div class="v3" data-err="${status}">${v3}</div>
    <div class="error" data-value="${el.error}">${el.error === true ? "Awaria" : "Ok"}</div>` //tutaj jest element, który zmieniłem na potrzeby wyświetlania koloru białego zamiast czerwonego.
    );
  });
};
