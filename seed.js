const stories = [
  {
    "title": "Identifying a complex layering scheme",
    "competency": "Analytics & Problem Solving",
    "situation": "While working as a Junior Analyst at a retail bank, I noticed a sudden spike in low-value, high-frequency transactions across several linked accounts based in London.",
    "task": "My task was to determine if this was a false positive or an actual money laundering attempt, specifically looking for 'layering' behaviors.",
    "action": "I used SQL to extract transaction logs for the past 90 days and mapped the flow of funds. I cross-referenced the account holders against the UK Sanctions List and identified that funds were being rapidly funneled into a shell company account.",
    "result": "I escalated the findings to the MLRO with a comprehensive Suspicious Activity Report (SAR) draft. The accounts were frozen, preventing £45,000 in illicit funds from being integrated, and the case was handed over to the NCA."
  },
  {
    "title": "Managing pushback from a high-net-worth client",
    "competency": "Conflict Resolution",
    "situation": "During a routine CDD refresh at a wealth management firm in Edinburgh, a high-net-worth client refused to provide updated Source of Wealth (SoW) documentation, citing privacy concerns.",
    "task": "I needed to obtain the required documentation to remain compliant with FCA regulations while preserving the bank's relationship with the client.",
    "action": "I arranged a brief call with the client and their relationship manager. I calmly explained that the updated SoW was a standard regulatory requirement under the MLR 2017 to protect their assets. I offered a secure, encrypted portal for them to upload the documents.",
    "result": "The client understood the regulatory necessity and provided the documents within 24 hours. The relationship manager praised my diplomatic approach, and the file was marked compliant well before the audit deadline."
  },
  {
    "title": "Leading a KYC Remediation Backlog",
    "competency": "Leadership",
    "situation": "Following an internal audit at our Glasgow operations center, we were left with a backlog of 400 legacy KYC profiles that lacked proper Ultimate Beneficial Owner (UBO) verification.",
    "task": "We were given a strict 4-week deadline to remediate the backlog before the FCA regulatory review.",
    "action": "I volunteered to coordinate a sub-team of 4 analysts. I created a shared tracker to assign cases based on complexity. I also drafted a standardized email template for reaching out to corporate clients for missing registry documents (e.g., Companies House extracts).",
    "result": "Our sub-team cleared 100% of our assigned cases 3 days ahead of the deadline, and the standardized template was adopted by the wider department for future remediations."
  }
];

async function seed() {
  for (const story of stories) {
    try {
      const res = await fetch('http://localhost:3000/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
      });
      if (!res.ok) console.error("Failed to seed story:", await res.text());
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
  console.log("Seeding complete!");
}

seed();
