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

  // Score is calculated and ready if you want to save it later,
  // but it is not displayed on the final page.
  const score = calculateScore();
  console.log("Participant score:", score);

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

function getAnswer(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

function calculateScore() {
  let score = 0;

  if (getAnswer("q1") === "a") score++;
  if (getAnswer("q2") === "c") score++;
  if (getAnswer("q3") === "b") score++;
  if (getAnswer("q4") === "c") score++;
  if (getAnswer("q5") === "b") score++;
  if (getAnswer("q6") === "e") score++;
  if (getAnswer("q7") === "c") score++;
  if (getAnswer("q8") === "c") score++;
  if (getAnswer("q9") === "d") score++;
  if (getAnswer("q10") === "b") score++;
  if (getAnswer("q11") === "b") score++;
  if (getAnswer("q12") === "c") score++;
  if (getAnswer("q13") === "b") score++;
  if (getAnswer("q14") === "c") score++;
  if (getAnswer("q15") === "a") score++;

  return score;
}