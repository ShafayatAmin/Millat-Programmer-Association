# Millat Programmer Association (MPA)

A programming club for Madrasah students in Bangladesh, teaching HTML and C from the Alim ICT syllabus.

## About

MPA (Millat Programmer Association) helps Madrasah students (Class 9 to Alim 2nd Year) learn programming through live Zoom classes, recorded YouTube videos, and PDF notes on Google Drive.

## Subjects

- **HTML** - Web page creation (Alim ICT syllabus)
- **C** - Programming fundamentals (Alim ICT syllabus)

## How It Works

1. Register on our website
2. Pay the weekly fee (50 BDT)
3. We grant your Google account access to videos and notes
4. Watch and learn anytime

## MPA HTML IDE (Mobile App)

Our mobile HTML editor app - code on your phone!
- Landing page: https://shafayatamin.github.io/htmlide
- Price: 200 BDT (lifetime access)

## Navbar HTML (IMPORTANT)

The navbar HTML must stay **identical** across all 8 pages. The required structure is:

```html
<header class="site-header">
  <nav class="navbar">
    <a href="index.html" class="nav-brand">
      <img src="assets/logo.png" alt="MPA Logo" class="nav-logo">
      <span class="nav-brand-name">Millat Programmer Association</span>
    </a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
    <ul class="nav-menu" id="navMenu">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="routine.html">Routine</a></li>
      <li><a href="classes.html">Classes</a></li>
      <li><a href="resources.html">Resources</a></li>
      <li><a href="enroll.html">Enroll</a></li>
      <li><a href="register.html">Register</a></li>
      <li><a href="paid.html">Paid Students</a></li>
    </ul>
  </nav>
</header>
```

Only the `active` class on the current page's `<a>` tag changes between pages. Do NOT modify this structure.

## Code Container Component

A reusable VS Code-style code block component. Use this HTML structure:

```html
<div class="code-container">
  <div class="code-titlebar">
    <span class="code-dot code-dot-red"></span>
    <span class="code-dot code-dot-yellow"></span>
    <span class="code-dot code-dot-green"></span>
    <span class="code-filename">filename.ext</span>
  </div>
  <div class="code-body">
    <pre><code>/* code here with syntax highlight spans */</code></pre>
  </div>
</div>
<p class="code-caption">Caption text</p>
```

Syntax highlight classes: `.code-tag`, `.code-attr`, `.code-str`, `.code-cmt`, `.code-kw`, `.code-fn`, `.code-num`.

## PDF Calibration Tool

A debug page at `tools/pdf-grid.html` for calibrating text positions on the application form PDF. Open it in a browser, download the grid overlay PDF, check crosshair positions, update `data/pdf-fields.js`, and repeat until all positions are correct.

## Paid Students Page

The `paid.html` page shows a weekly status board of members who paid. It auto-computes the week status in the visitor's browser.

### How to Update Weekly

Edit **`data/paid-students.js`** only. Nothing else needs to change.

1. Change `weekStart` to the new week's first day (format: `YYYY-MM-DD`).
2. Replace the `students` array with the new list of paid members.
3. Save. The page automatically shows the new week.

The week lasts 7 days from `weekStart`. After that, the page shows "Week has been ended" until you renew.

### Field Reference

| Key       | Type   | Description                  |
|-----------|--------|------------------------------|
| `regId`   | string | Registration ID              |
| `name`    | string | Student name (Bangla)        |
| `roll`    | number | Roll number                  |
| `klass`   | string | Class (e.g. "Alim 1st Year")|
| `dept`    | string | Department (e.g. "Science") |
| `section` | string | Section (e.g. "A")          |

**Note:** The key is `klass` (not `class`) because `class` is a reserved word in JavaScript.

## Website Structure

```
/
├── index.html          # Home page
├── about.html          # About MPA
├── routine.html        # Weekly class schedule (7 days)
├── classes.html        # Class library
├── resources.html      # Tools and resources
├── enroll.html         # Enrollment & payment info
├── register.html       # Registration form (two-step: info + payment)
├── paid.html           # Paid students weekly status board
├── css/
│   └── style.css       # Shared stylesheet
├── js/
│   ├── main.js         # Navbar, footer, animations, shared card renderer
│   ├── classes.js      # Class cards and modal
│   ├── routine.js      # Routine table rendering
│   ├── register.js     # Two-step registration, Reg ID, PDF generation
│   └── paid.js         # Paid students week logic and table rendering
├── data/
│   ├── classes.js      # Class data
│   ├── routine.js      # Routine data (7 days, Fri-Thu)
│   ├── pdf-fields.js   # PDF drawing coordinates for calibration
│   ├── registration-fields.js  # Form field options (class, dept, section, gender)
│   └── paid-students.js        # Weekly paid students list (owner updates weekly)
├── libs/
│   └── pdf-lib.min.js  # PDF generation library (MIT License)
├── tools/
│   └── pdf-grid.html   # PDF calibration debug tool (not linked in navbar)
├── assets/
│   ├── logo.png            # Site logo (owner provides)
│   ├── htmlide.png         # IDE app image (owner provides)
│   └── mpa-application-form.pdf  # Blank A4 application form (owner provides)
└── README.md
```

## Required Assets (Owner Must Provide)

- `assets/logo.png` - Site logo used in navbar and favicon
- `assets/htmlide.png` - MPA HTML IDE app screenshot/image
- `assets/mpa-application-form.pdf` - Blank A4 application form (one page) for PDF generation

## Third-Party Libraries

- **pdf-lib** v1.17.1 - PDF generation and manipulation
  - Location: `libs/pdf-lib.min.js`
  - License: MIT
  - Source: https://github.com/Hoping/pdf-lib

## Tech Stack

- Plain HTML5
- Vanilla CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts (Poppins + Hind Siliguri)
- pdf-lib (for client-side PDF generation)

No build tools, no backend.

## Contact

- WhatsApp: +8801870746153
- Email: shafayatamin0010@gmail.com
- Facebook: https://www.facebook.com/shafu0010

## License

Open Source - Free to use and modify.

(c) 2026 Millat Programmer Association
