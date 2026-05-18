chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getJobDetails") {
    let company = "";
    let role = "";
    let location = "";
    let salary = "";

    let jd = "";

    // Basic Scraper (Optimized for LinkedIn)
    if (window.location.hostname.includes("linkedin.com")) {
      const titleEl = document.querySelector("h1");
      if (titleEl) role = titleEl.innerText.trim();

      const companyEl = document.querySelector(".job-details-jobs-unified-top-card__company-name") || document.querySelector("a.app-aware-link");
      if (companyEl) company = companyEl.innerText.trim();

      const locEl = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container") || document.querySelector(".job-details-jobs-unified-top-card__bullet");
      if (locEl) {
        const parts = locEl.innerText.split('·');
        if (parts.length > 0) location = parts[0].trim();
      }
      
      const jdEl = document.querySelector("#job-details") || document.querySelector(".jobs-description__content");
      if (jdEl) jd = jdEl.innerText.trim();
    } else {
      // Fallback for other sites
      role = document.title;
      company = window.location.hostname.replace("www.", "");
      const mainContent = document.querySelector("main") || document.querySelector("article");
      if (mainContent) jd = mainContent.innerText.trim().substring(0, 5000); // Grab up to 5k chars of main text
    }

    sendResponse({ company, role, location, salary, jd, url: window.location.href });
  }
});
