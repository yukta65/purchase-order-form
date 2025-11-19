🧾 Purchase Order Form – React Project

A fully dynamic, responsive, and validation-driven Purchase Order Management Form built using React.js, Bootstrap 5, and custom theme styling.
This project fulfills all assessment requirements including:

✔ Dynamic REQ Sections
✔ Job Title ↔ Talent Mapping
✔ Individual vs Group PO Validation
✔ Full Form Validation
✔ Read-Only View Mode
✔ Edit Again + New Form
✔ PDF Download Support
✔ Bootstrap UI + Custom Modern Theme
✔ No Freezing (infinite loop fixed)
✔ Professional responsive layout

🎨 Project Preview

Below is a preview of the actual Purchase Order Form UI:

🚀 Features
🧩 Dynamic Form Logic

Client selection loads associated REQ Jobs

Selecting Job Title loads Talents

Individual PO → only 1 talent allowed

Group PO → minimum 2 talents required

🛠 Talent Handling

Inline validation on assigned rate

Dynamic fields based on selection

Clean table view in read-only mode

📑 Form Modes

Edit Mode: full form access

View Mode: read-only formatted summary

Edit Again: return to editing

New Form: create completely new entry

🎨 UI & Styling

Bootstrap 5 integration

Custom professional theme

Responsive layout

Styled REQ sections & talent rows

Hover effects & structured spacing

📦 Tech Stack
Technology--Purpose
React.js-- Main UI framework
Bootstrap 5-- Styling + Responsive layout
Custom CSS (theme.css) --Modern themed UI
JSON (Mock Data) Client → REQ → Talent mapping

📁 Project Structure

project-folder/
│
├── public/
│ ├── form-preview.png  
│ └── index.html
│
├── src/
│ ├── components/
│ │ ├── PurchaseOrderForm.jsx
│ │ ├── ReqSection.jsx
│ │ ├── TalentRow.jsx
│ │
│ ├── data/
│ │ └── clients.json
│ │
│ ├── theme.css  
│ ├── index.js
│ └── App.js
│
├── package.json
└── README.md

🛠 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yukta65/purchase-order-form.git
cd purchase-order-form

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm start

Your app will run at:
👉 http://localhost:3000

🎯 How It Works:

✔ Choose Client
Loads available job titles for that client.

✔ Select Job Title
Loads talents mapped to that REQ.

✔ Select Talents
Enables assigned rate + notes fields.

✔ Save
Switches UI to Read-Only Mode.

✔ Edit Again / New Form
Enables editing or starting new fresh form.
