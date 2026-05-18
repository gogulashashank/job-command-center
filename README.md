# 📊 Job Command Center: Market Intelligence Data Platform

An end-to-end data pipeline, central repository, and analytics dashboard built on **PostgreSQL** to automate job market intelligence, specifically tailored for analyzing hiring patterns in the **Banking and Financial Crime** sectors.

## 🚀 The Data Challenge
The modern job search presents a classic data fragmentation problem: highly unstructured data is scattered across multiple siloed platforms (LinkedIn, specialized banking portals, recruiter emails). Tracking this manually leads to dirty data, duplicate records, and missed analytical insights regarding hiring trends.

## 🛠️ The Solution
I architected this platform to serve as a personal **Data Warehouse and automated ETL pipeline**. It ingests unstructured web data, cleanses it, models it relationally, and serves it to a reporting dashboard.

## ⚙️ Data Engineering Architecture & Tech Stack

- **Core Database:** PostgreSQL (via [Supabase](https://supabase.com/)) 
- **Data Ingestion/Extraction:** Custom Chrome Extension & Cheerio (DOM Scraping)
- **API & Compute:** Next.js 16 (Serverless API Routes)
- **Analytics & Visualization:** React 19 / Custom CSS Dashboards

## 🧠 Key Data Engineering Highlights

### 1. Automated Data Ingestion (ETL)
Built a custom Chrome Extension that acts as an edge ingestion layer. It extracts unstructured job specifications and recruiter data directly from the browser DOM, transforms it into structured JSON payloads, and loads it securely into the backend via REST APIs.

### 2. Relational Data Modeling
Designed a highly normalized PostgreSQL schema to efficiently manage complex relationships. The data model seamlessly connects `Companies`, `Recruiters`, `Job Postings`, and `Application Statuses` while maintaining strict referential integrity.

### 3. Data Cleansing & Deduplication
Implemented intelligent application deduplication logic at the API layer. The system merges overlapping job postings from different broker platforms to maintain a single source of truth and ensure clean reporting data.

### 4. Real-Time Analytics & Reporting
Developed a business intelligence dashboard that queries the PostgreSQL database to visualize pipeline conversion rates, track recruiter interaction frequency, and map out emerging hiring patterns within the UK Financial/Banking space.

## 💻 Getting Started

First, run the development server to spin up the analytics dashboard:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the data visualizations.

---
*Built to showcase end-to-end data engineering, database architecture, and pipeline automation.*
