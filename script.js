let timerInterval;
let startTime;
let elapsedTime = 0;

const timer = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const saveAllButton = document.getElementById("saveAllButton");
const taskTable = document.getElementById("taskTable").querySelector("tbody");

// Timer functionality
startButton.addEventListener("click", () => {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = false;
});

stopButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
  startButton.disabled = false;
  stopButton.disabled = true;
});

resetButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  elapsedTime = 0;
  timer.textContent = "00:00:00";
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
});

// Save individual task
saveButton.addEventListener("click", () => {
  const taskName = document.getElementById("taskName").value.trim();
  const duration = timer.textContent;
  const observation = document.getElementById("observation").value.trim();

  if (!taskName) {
    alert("Please enter a task name.");
    return;
  }

  // Add task to the table
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${taskName}</td>
    <td>${duration}</td>
    <td>${observation}</td>
  `;
  taskTable.appendChild(row);

  // Clear inputs and reset timer
  document.getElementById("taskName").value = "";
  document.getElementById("observation").value = "";
  resetButton.click();
});

// Save all tasks to CSV via backend
saveAllButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("#taskTable tbody tr");
  const data = [];

  // Loop through all rows and extract data
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const taskName = cells[0].textContent.trim();
    const duration = cells[1].textContent.trim();
    const observation = cells[2].textContent.trim();
    data.push({ TaskName: taskName, Duration: duration, Observations: observation });
  });

  saveAllToCsv(data);
});

const saveAllToCsv = async (data) => {
  const saveUrl = "http://127.0.0.1:5000/save-all"; // Backend endpoint for saving data to CSV
  const downloadUrl = "http://127.0.0.1:5000/download-csv"; // Backend endpoint for downloading CSV

  try {
    // Save data to CSV on the server
    const saveResponse = await fetch(saveUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (saveResponse.ok) {
      document.getElementById("saveAllStatus").textContent = "Tasks saved to CSV on the server! Click to download.";

      // Provide a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.textContent = "Download CSV";
      downloadLink.download = "TimeAndMotionStudy.csv";
      document.getElementById("saveAllStatus").appendChild(downloadLink);
    } else {
      document.getElementById("saveAllStatus").textContent = "Error saving tasks to CSV!";
    }
  } catch (error) {
    document.getElementById("saveAllStatus").textContent = "Error connecting to the server!";
    console.error("Error:", error);
  }
};

// Timer update function
function updateTimer() {
  const time = Date.now() - startTime;
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  timer.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
  return num.toString().padStart(2, "0");
}
