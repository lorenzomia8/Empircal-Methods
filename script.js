const SUPABASE_URL = "https://nmelndeqbpnmprwtgaof.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zFYa6uxQsVIdFNyerIDe4Q_sNOh4tlx";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let startTime;
let timer;
let isSubmitting = false;

function nextSection(id) {
  document.querySelectorAll(".section").forEach((section) => {
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

function getFormData(totalTime, score) {
  return {
    age: document.getElementById("age")?.value.trim() || "",
    academic_status: document.getElementById("status")?.value || "",
    academic_status_other: document.getElementById("statusOther")?.value.trim() || "",
    major: document.getElementById("major")?.value.trim() || "",
    cs_courses: document.getElementById("csCourses")?.value || "",
    coding_experience: document.getElementById("coding")?.value || "",
    strongest_area: document.getElementById("area")?.value || "",
    strongest_area_other: document.getElementById("areaOther")?.value.trim() || "",

    q1: getAnswer("q1"),
    q2: getAnswer("q2"),
    q3: getAnswer("q3"),
    q4: getAnswer("q4"),
    q5: getAnswer("q5"),
    q6: getAnswer("q6"),
    q7: getAnswer("q7"),
    q8: getAnswer("q8"),
    q9: getAnswer("q9"),
    q10: getAnswer("q10"),
    q11: getAnswer("q11"),
    q12: getAnswer("q12"),
    q13: getAnswer("q13"),
    q14: getAnswer("q14"),
    q15: getAnswer("q15"),

    score: score,
    total_time_seconds: totalTime
  };
}

function validateQuestions() {
  for (let i = 1; i <= 15; i++) {
    if (!getAnswer(`q${i}`)) {
      alert(`Please answer question ${i}.`);
      return false;
    }
  }
  return true;
}

async function submitTest() {
  if (isSubmitting) return;

  if (!startTime) {
    alert("Please start the test first.");
    return;
  }

  if (!validateQuestions()) {
    return;
  }

  isSubmitting = true;
  clearInterval(timer);

  const submitButton = document.querySelector("#test button");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
  }

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  const score = calculateScore();
  const payload = getFormData(totalTime, score);

  try {
    const { error } = await supabaseClient
      .from("study_responses")
      .insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert("There was a problem saving the response.");
      isSubmitting = false;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerText = "Submit";
      }
      return;
    }

    document.getElementById("finalTime").innerText =
      `Total time: ${totalTime} seconds`;

    nextSection("result");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("There was a problem saving the response.");
    isSubmitting = false;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    }
  }
}