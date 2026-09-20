# Millat Programmer Association (MPA)

> বাংলাদেশের মাদ্রাসা শিক্ষার্থীদের জন্য প্রোগ্রামিং ক্লাব — আলিম ICT সিলেবাস থেকে HTML ও C শেখানো হয়।

---

## সম্পর্কে

**MPA** (Millat Programmer Association) মাদ্রাসা শিক্ষার্থীদের (ক্লাস ৯ থেকে আলিম ২য় বর্ষ) প্রোগ্রামিং শেখাতে সাহায্য করে — লাইভ Zoom ক্লাস, রেকর্ডেড YouTube ভিডিও এবং Google Drive-এ রাখা PDF নোটের মাধ্যমে।

## বিষয়সমূহ

| বিষয় | বিবরণ |
|:------|:------|
| **HTML** | ওয়েব পেজ তৈরি (আলিম ICT সিলেবাস) |
| **C** | প্রোগ্রামিং-এর মূল ভিত্তি (আলিম ICT সিলেবাস) |

## কীভাবে কাজ করে

1. ওয়েবসাইটে রেজিস্ট্রেশন করুন
2. সাপ্তাহিক ফি (৫০ টাকা) পরিশোধ করুন
3. আমরা আপনার Google অ্যাকাউন্টকে ভিডিও ও নোটের অ্যাক্সেস দিই
4. যেকোনো সময় দেখে শিখুন

---

## MPA HTML IDE (মোবাইল অ্যাপ)

> মোবাইলে চলা HTML এডিটর অ্যাপ — ফোনেই কোড লিখুন!

- **ল্যান্ডিং পেজ:** [https://shafayatamin.github.io/htmlide](https://shafayatamin.github.io/htmlide)
- **মূল্য:** ২০০ টাকা (লাইফটাইম অ্যাক্সেস)

---

## Owner's Guide

> সাইটের সব ডেটা পরিবর্তন হয় একটি টুল দিয়ে: **`tools/admin.html`**।

### Admin Panel চালানো

1. VS Code-এর Live Server চালু করুন
2. ব্রাউজারে খুলুন:

```text
http://127.0.0.1:5500/tools/admin.html
```

3. দুইটি ট্যাব: `📚 ক্লাস স্টোর` ও `💰 পেইড স্টুডেন্ট`

> ⚠️ **`admin.html` অবশ্যই `tools/` ফোল্ডারেই থাকতে হবে** — root-এ রাখলে ডেটা লোড হয় না।

> ⚠️ **টুলের ফাইল ডাবল-ক্লিক করে খুলবেন না** — সবসময় Live Server/localhost দিয়ে।

### সাপ্তাহিক পেইড স্টুডেন্ট আপডেট (সপ্তাহে ২ মিনিট)

`admin.html` → `💰 পেইড স্টুডেন্ট` ট্যাব:

1. **নতুন সপ্তাহ শুরু** চাপুন — `weekStart` চলতি শুক্রবার হবে, তালিকা খালি হবে
2. এই সপ্তাহে যারা ফি দিয়েছে তাদের `+` নতুন স্টুডেন্ট দিয়ে যোগ করুন
3. কোড কপি করুন → `data/paid-students.js` খুলে `Ctrl+A` → `Ctrl+V` → সেভ
4. `paid.html` রিফ্রেশ করুন — ব্যাস!

### ক্লাস যোগ / এডিট / মুছা

`admin.html` → `📚 ক্লাস স্টোর` ট্যাব:

- **`+` নতুন ক্লাস** → ফর্ম পূরণ করুন। সাধারণ YouTube লিংক পেস্ট করলেই embed লিংক ও থাম্বনেইল নিজে থেকে তৈরি হয়
- **`✎`** দিয়ে এডিট, **`✕`** দিয়ে মুছুন, **`▲▼`** দিয়ে সাজান
- কোড কপি করুন → `data/classes.js`-এ পেস্ট → সেভ

### সোনার নিয়ম

> 🛑 না মানলে ডেটা মুছে যেতে পারে!

- `data/` ফোল্ডারের ফাইল কখনো হাতে এডিট করবেন না — সবকিছু admin টুল দিয়ে
- জেনারেট করা কোড পেস্ট করার আগে দেখুন টুলের টেবিলে আপনার বর্তমান ডেটা দেখা যাচ্ছে কিনা। **লাল error বার বা খালি টেবিল = পেস্ট করবেন না**
- `js/` = ইঞ্জিন (কোড), `data/` = ডেটা। `var CLASSES` লাইনটি পুরো প্রজেক্টে শুধুমাত্র `data/classes.js`-এ থাকতে পারে
- নতুন ডেটা ফাইল বসানোর আগে পুরনোটার একটা কপি (ব্যাকআপ) রাখুন
- AI এজেন্টকে (Open Code) কোনো টুল-ফাইল লিখতে দিলে নির্দেশ দিন: _"এই কোড হুবহু পেস্ট করো, নিজে থেকে কিছুই বদলাবে না"_ — এজেন্ট নিজে থেকে রিরাইট করলে বাগ ঢোকে

---
## Navbar HTML (গুরুত্বপূর্ণ)

Navbar-এর HTML সব ৮টি পেজে হুবহু একই থাকতে হবে। বর্তমান কাঠামো:

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
      <li><a href="index.html">হোম</a></li>
      <li><a href="about.html">আমাদের সম্পর্কে</a></li>
      <li><a href="routine.html">রুটিন</a></li>
      <li><a href="classes.html" class="active">ক্লাস স্টোর</a></li>
      <li><a href="resources.html">রিসোর্স</a></li>
      <li><a href="enroll.html">ভর্তি</a></li>
      <li><a href="register.html">রেজিস্ট্রেশন</a></li>
      <li><a href="paid.html">পেইড স্টুডেন্ট</a></li>
    </ul>
  </nav>
</header>
```

পেজ থেকে পেজে শুধু `active` ক্লাসটি বদলায় (বর্তমান পেজের লিংকে থাকে)। এই কাঠামো বদলানো যাবে না।

---

## Code Container Component

পুনঃব্যবহারযোগ্য VS Code-স্টাইল কোড ব্লক। HTML কাঠামো:

```html
<div class="code-container">
  <div class="code-titlebar">
    <span class="code-dot code-dot-red"></span>
    <span class="code-dot code-dot-yellow"></span>
    <span class="code-dot code-dot-green"></span>
    <span class="code-filename">filename.ext</span>
  </div>
  <div class="code-body">
    <pre><code>/* এখানে কোড, সিনট্যাক্স হাইলাইট স্প্যান সহ */</code></pre>
  </div>
</div>
<p class="code-caption">ক্যাপশন টেক্সট</p>
```

সিনট্যাক্স হাইলাইট ক্লাস: `.code-tag`, `.code-attr`, `.code-str`, `.code-cmt`, `.code-kw`, `.code-fn`, `.code-num`।

---
## রেজিস্ট্রেশন ও PDF সিস্টেম

`register.html`-এ দুই-ধাপ রেজিস্ট্রেশন: (১) তথ্য + Reg ID তৈরি, (২) পেমেন্ট তথ্য + আবেদনপত্র PDF ডাউনলোড।

| বৈশিষ্ট্য | বিবরণ |
|:----------|:-------|
| **Reg ID অ্যালগরিদম** | `roll` + WhatsApp শেষ ৪ ডিজিট + `DDMMYYYY` → juggle (একটি শুরু থেকে, পরেরটি শেষ থেকে) → `MPA-` প্রিফিক্স |
| **PDF তৈরি** | pdf-lib দিয়ে ফাঁকা ফর্মের উপর ডেটা লেখা হয় (বাইটস `PDF_BLANK_BYTES` নামে লোড থাকে) |
| **বাংলা টেক্সট** | PDF-এর বিল্ট-ইন ফন্ট বাংলা এনকোড করতে পারে না → canvas-এ Hind Siliguri ফন্টে রেন্ডর → PNG → PDF-এ বসানো (`drawBanglaText` ফাংশন) |
| **ছবি আপলোড** | স্টুডেন্টের ছবি PDF-এ `photoBox`-এ বসে |
| **ফোন নম্বর** | PDF-এ `+880` ফরম্যাটে (শুরুর ০ বাদ দিয়ে) |
| **পজিশন** | `data/pdf-fields.js` থেকে আসে — নিচের ক্যালিব্রেশন টুল দেখুন |

### PDF ক্যালিব্রেশন টুল

> `tools/pdf-calibrate.html` — রেজিস্ট্রেশন PDF-এ কোথায় কী লেখা হবে তা ভিজ্যুয়ালি ঠিক করার টুল।

1. ফাঁকা আবেদনফর্মের একটা কপি `tools/form.pdf` নামে রাখুন
2. Live Server দিয়ে টুলটি খুলুন — আসল ফর্মটি দেখাবে
3. **Auto-suggest from labels** চাপুন — লেবেলগুলোর পাশে মার্কার চলে আসবে
4. টেবিলে ফিল্ড সিলেক্ট করে ফর্মে ক্লিক করুন (ক্লিক পয়েন্ট = লেখার baseline)। Arrow key দিয়ে ফাইন-টিউন (Shift = ৫pt)
5. `photoBox` সিলেক্ট করে ফর্মে ড্র্যাগ করে ছবির জায়গা আঁকুন
6. **Preview PDF** চেপে ডাউনলোড হওয়া ফাইলটি দেখুন — সব মান লাল রঙে ঠিক যেখানে বসবে সেখানে দেখাবে
7. **Copy code** → `data/pdf-fields.js`-এ পেস্ট → সেভ

> PDF-এর y-অক্ষ নিচ থেকে উপরে গণনা হয় — টুলটি সব হিসাব নিজেই করে।

> _(পুরনো `tools/pdf-grid.html` অবচিত — মুছে ফেলা যায়।)_

---

## ক্লাস ডেটা ফিল্ড রেফারেন্স

`data/classes.js`-এর প্রতিটি এন্ট্রি (admin টুল ছাড়া এডিট করবেন না):

| Key | Type | বর্ণনা |
|:----|:-----|:-------|
| `id` | `string` | ইউনিক আইডি (টুল অটো বানায়: `html-5`, `c-3`) |
| `subject` | `string` | `"html"` বা `"c"` |
| `number` | `number` | ক্লাস নম্বর |
| `title` | `string` | ক্লাসের নাম (বাংলা) |
| `date` | `string` | `YYYY-MM-DD` |
| `duration` | `string` | ভিডিওর দৈর্ঘ্য |
| `description` | `string` | বিবরণ |
| `topics` | `string[]` | যা যা শেখানো হয়েছে |
| `youtubeUrl` | `string` | সাধারণ YouTube লিংক |
| `embedUrl` | `string` | টুল অটো বানায় — ফ্রি ক্লাসে ভিডিও সাইটেই প্লে হয়, খালি হলে "প্রাইভেট" |
| `pdfUrl` | `string` | Google Drive নোটের লিংক |
| `isFree` | `boolean` | ফ্রি প্রিভিউ কি না |

---

## পেইড স্টুডেন্ট পেজ

`paid.html` সাপ্তাহিক স্ট্যাটাস বোর্ড — হিসাব ভিজিটরের ব্রাউজারেই হয়:

| শর্ত | যা দেখায় |
|:-----|:----------|
| আজ `weekStart` থেকে ৭ দিনের ভেতরে | টেবিল দেখায় |
| `weekStart`-এর আগে | "শুরু হয়নি" কার্ড |
| ৭ দিন পার হলে | "সপ্তাহ শেষ" কার্ড — নামগুলো ইচ্ছাকৃতভাবে লুকানো থাকে (সাপ্তাহিক বোর্ড, পুরোনো লিস্ট নয়) |

**ডেটা ফরম্যাট** (`data/paid-students.js` — শুধু admin টুল দিয়ে বদলান):

```javascript
var PAID_WEEK = {
  weekStart: "YYYY-MM-DD",
  students: [
    { regId, name, roll, klass, dept, section },
    // ...
  ]
};
```

| Key | Type | বর্ণনা |
|:----|:-----|:-------|
| `regId` | `string` | Registration ID |
| `name` | `string` | শিক্ষার্থীর নাম (বাংলা) |
| `roll` | `number` | রোল নম্বর |
| `klass` | `string` | শ্রেণি (যেমন `"Alim 1st Year"`) |
| `dept` | `string` | বিভাগ (যেমন `"Science"`) |
| `section` | `string` | শাখা (যেমন `"A"`) |

> নোট: কী-এর নাম `klass` রাখা হয়েছে কারণ `class` JavaScript-এ reserved word।

> ডেটা ফাইল ভাঙা/না লোড হলে `paid.js` সাদা পেজ না দেখিয়ে দৃশ্যমান error কার্ড দেখায়।

---
## ওয়েবসাইট স্ট্রাকচার

```text
/
├── index.html              # হোম পেজ
├── about.html              # আমাদের সম্পর্কে
├── routine.html            # সাপ্তাহিক রুটিন (৭ দিন, শুক্র–বৃহস্পতি)
├── classes.html            # ক্লাস লাইব্রেরি
├── resources.html          # টুল ও রিসোর্স
├── enroll.html             # ভর্তি ও পেমেন্ট তথ্য
├── register.html           # দুই-ধাপ রেজিস্ট্রেশন + PDF
├── paid.html               # পেইড স্টুডেন্ট সাপ্তাহিক বোর্ড
├── css/
│   └── style.css           # শেয়ারড স্টাইলশিট
├── js/                     # ইঞ্জিন ফোল্ডার
│   ├── main.js             # Navbar, footer, অ্যানিমেশন, শেয়ারড কার্ড রেন্ডারার
│   ├── classes.js          # কার্ড গ্রিড, ফিল্টার, মোডাল
│   ├── routine.js          # রুটিন টেবিল
│   ├── register.js         # রেজিস্ট্রেশন, Reg ID, PDF জেনারেশন
│   └── paid.js             # সপ্তাহ লজিক
├── data/                   # ডেটা ফোল্ডার — শুধু admin টুল দিয়ে বদলান!
│   ├── classes.js          # ক্লাস লিস্ট
│   ├── routine.js          # রুটিন ডেটা
│   ├── pdf-fields.js       # PDF কোঅর্ডিনেট
│   ├── registration-fields.js  # ফর্মের ড্রপডাউন অপশন
│   └── paid-students.js    # সাপ্তাহিক পেইড লিস্ট
├── libs/
│   └── pdf-lib.min.js      # PDF লাইব্রেরি (MIT License)
├── tools/                  # মালিকের টুল — navbar-এ লিংক নেই
│   ├── admin.html          # অ্যাডমিন প্যানেল (ক্লাস + পেইড স্টুডেন্ট ম্যানেজার)
│   ├── pdf-calibrate.html  # PDF কোঅর্ডিনেট ক্যালিব্রেটর
│   ├── form.pdf            # ক্যালিব্রেটরের জন্য ফাঁকা ফর্মের কপি
│   └── pdf-grid.html       # (অবচিত — মুছে ফেলা যায়)
├── assets/
│   ├── logo.png            # সাইট লোগো
│   ├── htmlide.png         # IDE অ্যাপের ছবি
│   └── mpa-application-form.pdf  # ফাঁকা A4 আবেদনফর্ম
└── README.md
```

---
## প্রয়োজনীয় অ্যাসেট (মালিক সরবরাহ করবেন)

| ফাইল | ব্যবহার |
|:-----|:--------|
| `assets/logo.png` | navbar ও favicon-এ ব্যবহৃত লোগো |
| `assets/htmlide.png` | MPA HTML IDE অ্যাপের স্ক্রিনশট |
| `assets/mpa-application-form.pdf` | এক পেজের ফাঁকা A4 আবেদনফর্ম (এর একটা কপি `tools/form.pdf` নামেও রাখুন) |

---

## থার্ড-পার্টি লাইব্রেরি

| লাইব্রেরি | সংস্করণ | ব্যবহার | লাইসেন্স |
|:----------|:---------|:--------|:---------|
| [pdf-lib](https://pdf-lib.js.org/) | v1.17.1 | PDF তৈরি ও এডিট | MIT |
| [pdf.js](https://mozilla.github.io/pdf.js/) | v3.11.174 | শুধু ক্যালিব্রেটর টুলে (cdnjs CDN) | Apache-2.0 |
| [Google Fonts](https://fonts.google.com/) | — | Poppins + Hind Siliguri | — |

---

## টেক স্ট্যাক

| স্তর | প্রযুক্তি |
|:-----|:---------|
| **Markup** | Plain HTML5 |
| **Styling** | Vanilla CSS3 |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Fonts** | Google Fonts — Poppins + Hind Siliguri |
| **PDF** | pdf-lib (ক্লায়েন্ট-সাইড PDF জেনারেশন) |

> কোনো build tool নেই, কোনো backend নেই — সবকিছু ব্রাউজারেই চলে।

---

## যোগাযোগ

| মাধ্যম | তথ্য |
|:-------|:-----|
| **WhatsApp** | [+8801870746153](https://wa.me/8801870746153) |
| **Email** | [shafayatamin0010@gmail.com](mailto:shafayatamin0010@gmail.com) |
| **Facebook** | [shafu0010](https://www.facebook.com/shafu0010) |

---

## লাইসেন্স

Open Source — ব্যবহার ও পরিবর্তনে স্বাধীন।

**(c) 2026 Millat Programmer Association**
