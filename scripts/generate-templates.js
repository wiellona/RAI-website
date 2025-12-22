const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Template 1: AI Publications - Header with institution info
const publicationsHeader = [
  ["AI PUBLICATIONS SUBMISSION FORM"],
  [""],
  ["University/Institution Name:", ""],
  ["Contact Person:", ""],
  ["Email:", ""],
  ["Submission Date:", ""],
  [""],
  ["PUBLICATIONS DATA (Last 3 Years: 2022-2025)"],
];

const publicationsData = [
  {
    No: 1,
    Title:
      "Example: Applications of artificial intelligence for disease diagnosis",
    DOI: "https://doi.org/10.xxxx/xxxxx",
    "Publication Year": 2024,
    "Publication Date": "2024-01-15",
    "Cited By Count": 25,
    Authors: "John Doe; Jane Smith; Robert Johnson",
  },
  {
    No: 2,
    Title: "",
    DOI: "",
    "Publication Year": "",
    "Publication Date": "",
    "Cited By Count": "",
    Authors: "",
  },
  {
    No: 3,
    Title: "",
    DOI: "",
    "Publication Year": "",
    "Publication Date": "",
    "Cited By Count": "",
    Authors: "",
  },
  {
    No: 4,
    Title: "",
    DOI: "",
    "Publication Year": "",
    "Publication Date": "",
    "Cited By Count": "",
    Authors: "",
  },
  {
    No: 5,
    Title: "",
    DOI: "",
    "Publication Year": "",
    "Publication Date": "",
    "Cited By Count": "",
    Authors: "",
  },
];

// Template 2: AI Open-Source Assets - Header with institution info
const assetsHeader = [
  ["AI OPEN-SOURCE ASSETS SUBMISSION FORM"],
  [""],
  ["University/Institution Name:", ""],
  ["Contact Person:", ""],
  ["Email:", ""],
  ["Submission Date:", ""],
  [""],
  ["ASSETS DATA (Models, Datasets, Repositories)"],
];

const assetsData = [
  {
    No: 1,
    Name: "Example: Image Classification Model",
    Link: "https://github.com/username/repository",
    Authors: "John Doe; Jane Smith",
  },
  {
    No: 2,
    Name: "",
    Link: "",
    Authors: "",
  },
  {
    No: 3,
    Name: "",
    Link: "",
    Authors: "",
  },
  {
    No: 4,
    Name: "",
    Link: "",
    Authors: "",
  },
  {
    No: 5,
    Name: "",
    Link: "",
    Authors: "",
  },
];

// Instructions for Publications
const publicationsInstructions = [
  ["AI PUBLICATIONS TEMPLATE - INSTRUCTIONS"],
  [""],
  [
    "Please fill in your AI publications from the last 3 years (2022-2025) in the DATA sheet.",
  ],
  [""],
  ["Column Descriptions:"],
  ["No", "Sequential number (auto-numbered)"],
  ["Title", "Full title of the publication"],
  ["DOI", "Digital Object Identifier (e.g., https://doi.org/10.xxxx/xxxxx)"],
  ["Publication Year", "Year of publication (e.g., 2024)"],
  ["Publication Date", "Full publication date (format: YYYY-MM-DD)"],
  ["Cited By Count", "Number of citations received"],
  ["Authors", "List of all authors separated by semicolons (;)"],
  [""],
  ["Important Notes:"],
  ["• Include only publications related to Artificial Intelligence"],
  ["• Publications must be from 2022 onwards"],
  ["• Use semicolon (;) to separate multiple authors"],
  ["• Ensure DOI links are complete and valid"],
  ["• Delete the example row before submitting"],
  [""],
  ["Need help? Contact: info@rai-ranking.org"],
];

// Instructions for Assets
const assetsInstructions = [
  ["AI OPEN-SOURCE ASSETS TEMPLATE - INSTRUCTIONS"],
  [""],
  [
    "Please fill in your AI open-source assets (models, datasets, repositories) in the DATA sheet.",
  ],
  [""],
  ["Column Descriptions:"],
  ["No", "Sequential number (auto-numbered)"],
  ["Name", "Name or title of the AI asset (model, dataset, or repository)"],
  ["Link", "Direct URL to the asset (GitHub, Hugging Face, etc.)"],
  ["Authors", "List of contributors/authors separated by semicolons (;)"],
  [""],
  ["Important Notes:"],
  ["• Include models, datasets, and AI-related repositories"],
  ["• Assets must be publicly accessible and open-source"],
  ["• Use semicolon (;) to separate multiple authors"],
  ["• Ensure links are complete and accessible"],
  ["• Delete the example row before submitting"],
  [""],
  ["Examples of valid assets:"],
  ["• Machine Learning Models (TensorFlow, PyTorch, etc.)"],
  ["• Datasets for AI training/testing"],
  ["• AI libraries and frameworks"],
  ["• Research code repositories"],
  [""],
  ["Need help? Contact: info@rai-ranking.org"],
];

// Create Publications Workbook
const publicationsWB = XLSX.utils.book_new();

// Add Instructions sheet
const instructionsWS1 = XLSX.utils.aoa_to_sheet(publicationsInstructions);
instructionsWS1["!cols"] = [{ wch: 20 }, { wch: 80 }];
XLSX.utils.book_append_sheet(publicationsWB, instructionsWS1, "INSTRUCTIONS");

// Add Data sheet with header information and data
const dataWS1 = XLSX.utils.aoa_to_sheet(publicationsHeader);
XLSX.utils.sheet_add_json(dataWS1, publicationsData, {
  origin: -1,
  skipHeader: false,
});
dataWS1["!cols"] = [
  { wch: 5 }, // No
  { wch: 50 }, // Title
  { wch: 35 }, // DOI
  { wch: 15 }, // Publication Year
  { wch: 18 }, // Publication Date
  { wch: 15 }, // Cited By Count
  { wch: 40 }, // Authors
];
// Merge cells for header section
dataWS1["!merges"] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title row
  { s: { r: 2, c: 1 }, e: { r: 2, c: 6 } }, // University name input
  { s: { r: 3, c: 1 }, e: { r: 3, c: 6 } }, // Contact person input
  { s: { r: 4, c: 1 }, e: { r: 4, c: 6 } }, // Email input
  { s: { r: 5, c: 1 }, e: { r: 5, c: 6 } }, // Date input
  { s: { r: 7, c: 0 }, e: { r: 7, c: 6 } }, // Data section title
];
XLSX.utils.book_append_sheet(publicationsWB, dataWS1, "DATA");

// Save Publications Template (Excel)
XLSX.writeFile(
  publicationsWB,
  path.join(__dirname, "../public/templates/ai-publications-template.xlsx")
);

// Save Publications Template (CSV)
const csvPublications = XLSX.utils.sheet_to_csv(dataWS1);
fs.writeFileSync(
  path.join(__dirname, "../public/templates/ai-publications-template.csv"),
  csvPublications
);

// Create Assets Workbook
const assetsWB = XLSX.utils.book_new();

// Add Instructions sheet
const instructionsWS2 = XLSX.utils.aoa_to_sheet(assetsInstructions);
instructionsWS2["!cols"] = [{ wch: 20 }, { wch: 80 }];
XLSX.utils.book_append_sheet(assetsWB, instructionsWS2, "INSTRUCTIONS");

// Add Data sheet with header information and data
const dataWS2 = XLSX.utils.aoa_to_sheet(assetsHeader);
XLSX.utils.sheet_add_json(dataWS2, assetsData, {
  origin: -1,
  skipHeader: false,
});
dataWS2["!cols"] = [
  { wch: 5 }, // No
  { wch: 50 }, // Name
  { wch: 50 }, // Link
  { wch: 40 }, // Authors
];
// Merge cells for header section
dataWS2["!merges"] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
  { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } }, // University name input
  { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } }, // Contact person input
  { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } }, // Email input
  { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } }, // Date input
  { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } }, // Data section title
];
XLSX.utils.book_append_sheet(assetsWB, dataWS2, "DATA");

// Save Assets Template (Excel)
XLSX.writeFile(
  assetsWB,
  path.join(__dirname, "../public/templates/ai-assets-template.xlsx")
);

// Save Assets Template (CSV)
const csvAssets = XLSX.utils.sheet_to_csv(dataWS2);
fs.writeFileSync(
  path.join(__dirname, "../public/templates/ai-assets-template.csv"),
  csvAssets
);

console.log("✓ Templates generated successfully!");
console.log("  Excel Templates:");
console.log("    - ai-publications-template.xlsx");
console.log("    - ai-assets-template.xlsx");
console.log("  CSV Templates:");
console.log("    - ai-publications-template.csv");
console.log("    - ai-assets-template.csv");
