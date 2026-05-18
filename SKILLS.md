# Antigravity Agent Skills Matrix

This file documents the specialized sub-agent skills and execution commands that the Antigravity system is capable of performing within the Job Command Center.

## Skill: Recruiter_Recon

**Description:** 
A surgical outreach agent designed to find the humans behind the job postings and generate tailored pitches.

**Trigger Action:** 
When a job is saved to `localhost:3000/api/jobs` or opened in the War Room, the agent activates the "Direct Outreach Pipeline".

**Execution Protocol:**
1. **Search**: Uses the company name and roles ("Talent Acquisition", "Financial Crime Manager", "Head of Compliance") to generate a targeted LinkedIn search query.
2. **Filter**: Operates with a strict location filter targeting Scotland or "United Kingdom (Remote)".
3. **Store**: Captures the Recruiter's Name and LinkedIn Profile URL into the `recruiter_info` fields in `localDB.json`.
4. **Pitch Generation**: Automatically constructs a "Straightforward Pitch" utilizing the following specific anchors:
   - *The Hook*: MSc in Business Analytics at the University of Stirling; resident of Stirling, Scotland.
   - *The Proof*: 94% case resolution rate at LinkedIn; FCA-regulated environment experience at Amazon.
   - *The Tech*: SQL and Python automation for AML/KYC workflows; Oracle ERP optimization.
   - *The Ask*: Focus on Remote or Scotland-based opportunities within Risk/Compliance.

**Antigravity Execution Command:**
*"Agent, for every job in my Live Jobs Tracker with an ATS score > 80%, fetch the Lead Recruiter and a Hiring Manager in Scotland. Then, generate a tailored pitch in the War Room that connects my Amazon Fraud experience to their specific remote-role requirements."*

---

## Skill: Document_Contextualizer (System Default)
**Description:** Reads CVs and Cover Letters to identify missing ATS keywords.
**Trigger:** Executed inside `/jobs/[id]` ATS Matcher.

## Skill: STAR_Weaver (System Default)
**Description:** Maps behavioral stories to job descriptions.
**Trigger:** Executed inside the Prompt Engineer tab.
