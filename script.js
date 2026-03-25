let startTime;
let timer;

function nextSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function startTest() {
  nextSection("test");

  startTime = Date.now();

  timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").innerText = "Time: " + seconds + "s";
  }, 1000);
}

function submitTest() {
  clearInterval(timer);

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);

  document.getElementById("finalTime").innerText =
    "Total time: " + totalTime + " seconds";

  nextSection("result");
}

function restartStudy() {
  window.location.reload();
}

function toggleOtherField(selectId, wrapperId) {
  const select = document.getElementById(selectId);
  const wrapper = document.getElementById(wrapperId);

  if (select.value === "Other") {
    wrapper.classList.remove("hidden");
  } else {
    wrapper.classList.add("hidden");
    const input = wrapper.querySelector("input");
    if (input) input.value = "";
  }
}