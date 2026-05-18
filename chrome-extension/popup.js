document.addEventListener("DOMContentLoaded", () => {
  const companyInput = document.getElementById("company");
  const roleInput = document.getElementById("role");
  const locInput = document.getElementById("location");
  const salInput = document.getElementById("salary");
  const saveBtn = document.getElementById("saveBtn");
  const statusDiv = document.getElementById("status");

  let sourceUrl = "";
  let scrapedJd = "";

  // Ask content.js for job details from the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getJobDetails" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        console.log("Could not communicate with content script.");
        sourceUrl = tabs[0].url;
        return;
      }
      if (response.company) companyInput.value = response.company;
      if (response.role) roleInput.value = response.role;
      if (response.location) locInput.value = response.location;
      if (response.salary) salInput.value = response.salary;
      if (response.jd) scrapedJd = response.jd;
      sourceUrl = response.url || tabs[0].url;
    });
  });

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";
    statusDiv.innerText = "";

    const jobData = {
      company: companyInput.value,
      role: roleInput.value,
      location: locInput.value,
      salary: salInput.value,
      source_url: sourceUrl,
      jd: scrapedJd,
      source: sourceUrl.includes("linkedin") ? "LinkedIn" : "Web",
      status: "discovered",
      match_score: Math.floor(Math.random() * 20) + 70 // Mock score between 70-90 for now
    };

    try {
      const res = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      if (!res.ok) throw new Error("API responded with " + res.status);
      
      statusDiv.style.color = "#4ade80"; // green
      statusDiv.innerText = "Saved successfully!";
      setTimeout(() => window.close(), 1500);
    } catch (err) {
      statusDiv.style.color = "#f87171"; // red
      statusDiv.innerText = "Error: Is your local app running on port 3000?";
      saveBtn.disabled = false;
      saveBtn.innerText = "Save to Command Center";
    }
  });
});
