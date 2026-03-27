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

  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
  }
}

function toggleOtherField(selectId, wrapperId) {
  const select = document.getElementById(selectId);
  const wrapper = document.getElementById(wrapperId);

  if (!select || !wrapper) return;

  if (select.value === "Other") {
    wrapper.classList.remove("hidden");
  } else {
    wrapper.classList.add("hidden");
    const input = wrapper.querySelector("input");
    if (input) input.value = "";
  }
}

function validateBackground() {
  const age = document.getElementById("age");
  const status = document.getElementById("status");
  const statusOther = document.getElementById("statusOther");
  const major = document.getElementById("major");
  const csCourses = document.getElementById("csCourses");
  const coding = document.getElementById("coding");
  const area = document.getElementById("area");
  const areaOther = document.getElementById("areaOther");

  if (!age || !status || !statusOther || !major || !csCourses || !coding || !area || !areaOther) {
    alert("A required form field is missing from the page.");
    return false;
  }

  if (!age.value.trim()) {
    alert("Please enter your age.");
    return false;
  }

  if (!status.value) {
    alert("Please select your academic status.");
    return false;
  }

  if (status.value === "Other" && !statusOther.value.trim()) {
    alert("Please specify your academic status.");
    return false;
  }

  if (!major.value.trim()) {
    alert("Please enter your major field of study.");
    return false;
  }

  if (!csCourses.value) {
    alert("Please select how many computer science courses you have taken.");
    return false;
  }

  if (!coding.value) {
    alert("Please select whether you have coding experience outside of formal coursework.");
    return false;
  }

  if (!area.value) {
    alert("Please select your strongest academic area.");
    return false;
  }

  if (area.value === "Other" && !areaOther.value.trim()) {
    alert("Please specify your strongest academic area.");
    return false;
  }

  return true;
}

function startTest() {
  if (!validateBackground()) {
    return;
  }

  nextSection("test");
  startTime = Date.now();

  const timerEl = document.getElementById("timer");
  timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    if (timerEl) {
      timerEl.innerText = "Time: " + seconds + "s";
    }
  }, 1000);
}

function restartStudy() {
  window.location.reload();
}

function getAnswer(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

function getNumericAnswer(id) {
  const el = document.getElementById(id);
  if (!el) return null;

  const raw = el.value.trim();
  if (raw === "") return null;

  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
}

function calculateScore() {
  let score = 0;

  if (getNumericAnswer("q1") === 5) score++;
  if (getNumericAnswer("q2") === 5) score++;
  if (getNumericAnswer("q3") === 47) score++;
  if (getNumericAnswer("q4") === 4) score++;
  if (getNumericAnswer("q5") === 29) score++;
  if (getNumericAnswer("q6") === 20) score++;
  if (getAnswer("q7") === "c") score++;

  return score;
}

function validateQuestions() {
  for (let i = 1; i <= 6; i++) {
    const field = document.getElementById(`q${i}`);
    if (!field || field.value.trim() === "") {
      alert(`Please enter a numeric answer for question ${i}.`);
      return false;
    }

    if (Number.isNaN(Number(field.value.trim()))) {
      alert(`Question ${i} must be a number.`);
      return false;
    }
  }

  if (!getAnswer("q7")) {
    alert("Please answer question 7.");
    return false;
  }

  return true;
}

function getFormData(totalTime, score) {
  return {
    age: document.getElementById("age").value.trim(),
    academic_status: document.getElementById("status").value,
    academic_status_other: document.getElementById("statusOther").value.trim(),
    major: document.getElementById("major").value.trim(),
    cs_courses: document.getElementById("csCourses").value,
    coding_experience: document.getElementById("coding").value,
    strongest_area: document.getElementById("area").value,
    strongest_area_other: document.getElementById("areaOther").value.trim(),

    q1: document.getElementById("q1").value.trim(),
    q2: document.getElementById("q2").value.trim(),
    q3: document.getElementById("q3").value.trim(),
    q4: document.getElementById("q4").value.trim(),
    q5: document.getElementById("q5").value.trim(),
    q6: document.getElementById("q6").value.trim(),
    q7: getAnswer("q7"),

    score: score,
    total_time_seconds: totalTime
  };
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

  const submitButton = document.getElementById("submitBtn");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
  }

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  const score = calculateScore();
  const payload = getFormData(totalTime, score);

  console.log("Submitting payload:", payload);

  try {
    const { error } = await supabaseClient
      .from("study_responses")
      .insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert("Supabase error: " + error.message);

      isSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerText = "Submit";
      }
      return;
    }

    const finalTime = document.getElementById("finalTime");
    if (finalTime) {
      finalTime.innerText = "Total time: " + totalTime + " seconds";
    }

    nextSection("result");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error: " + err.message);

    isSubmitting = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    }
  }
}