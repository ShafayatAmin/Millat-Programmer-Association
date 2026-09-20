/**
 * register.js — Two-step registration flow:
 *   Step 1: Form validation + Reg ID generation
 *   Step 2: Payment info + PDF generation via pdf-lib
 *
 * Reg ID algorithm: roll + last4WhatsApp + DDMMYYYY → juggle → prefix "MPA-"
 */

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("reg-form");
  if (!form) return;

  populateSelects();
  setupImagePreview();

  // Step 1: Registration form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      submitStep1();
    }
  });

  // Step 2: "Go to payment" button
  var goPayBtn = document.getElementById("go-to-payment-btn");
  if (goPayBtn) {
    goPayBtn.addEventListener("click", function () {
      showStep2();
    });
  }

  // Step 2: Payment form submit → PDF download
  var payForm = document.getElementById("payment-form");
  if (payForm) {
    payForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validatePayment()) {
        generatePDF();
      }
    });
  }
});

/* ============================================
   GLOBAL: Store step-1 data for PDF generation
   ============================================ */
var _regData = {};

/* ============================================
   POPULATE SELECT DROPDOWNS
   ============================================ */
function populateSelects() {
  if (typeof REG_FIELDS === "undefined") return;

  // Class select
  var classSelect = document.getElementById("reg-class");
  if (classSelect) {
    REG_FIELDS.classOptions.forEach(function (opt) {
      var option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      classSelect.appendChild(option);
    });
  }

  // Department select
  var deptSelect = document.getElementById("reg-dept");
  if (deptSelect) {
    REG_FIELDS.departmentOptions.forEach(function (opt) {
      var option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      deptSelect.appendChild(option);
    });
  }

  // Section select
  var secSelect = document.getElementById("reg-section");
  if (secSelect) {
    REG_FIELDS.sectionOptions.forEach(function (opt) {
      var option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      secSelect.appendChild(option);
    });
  }

  // Gender select
  var genderSelect = document.getElementById("reg-gender");
  if (genderSelect && REG_FIELDS.genderOptions) {
    REG_FIELDS.genderOptions.forEach(function (opt) {
      var option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      genderSelect.appendChild(option);
    });
  }

  // Date of Birth: Day (1–31)
  var daySelect = document.getElementById("dob-day");
  if (daySelect) {
    for (var d = 1; d <= 31; d++) {
      var option = document.createElement("option");
      option.value = d;
      option.textContent = d;
      daySelect.appendChild(option);
    }
  }

  // Date of Birth: Month (Bangla names)
  var monthSelect = document.getElementById("dob-month");
  if (monthSelect) {
    var months = [
      { value: 1, name: "জানুয়ারি" },
      { value: 2, name: "ফেব্রুয়ারি" },
      { value: 3, name: "মার্চ" },
      { value: 4, name: "এপ্রিল" },
      { value: 5, name: "মে" },
      { value: 6, name: "জুন" },
      { value: 7, name: "জুলাই" },
      { value: 8, name: "আগস্ট" },
      { value: 9, name: "সেপ্টেম্বর" },
      { value: 10, name: "অক্টোবর" },
      { value: 11, name: "নভেম্বর" },
      { value: 12, name: "ডিসেম্বর" }
    ];
    months.forEach(function (m) {
      var option = document.createElement("option");
      option.value = m.value;
      option.textContent = m.name;
      monthSelect.appendChild(option);
    });
  }

  // Date of Birth: Year (current year down to 1995)
  var yearSelect = document.getElementById("dob-year");
  if (yearSelect) {
    var currentYear = new Date().getFullYear();
    for (var y = currentYear; y >= 1995; y--) {
      var option = document.createElement("option");
      option.value = y;
      option.textContent = y;
      yearSelect.appendChild(option);
    }
  }
}

/* ============================================
   IMAGE PREVIEW
   ============================================ */
function setupImagePreview() {
  var fileInput = document.getElementById("reg-picture");
  var preview = document.getElementById("picture-preview");
  var errorEl = document.getElementById("error-picture");

  if (!fileInput || !preview) return;

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) {
      preview.innerHTML = "";
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      errorEl.textContent = "শুধুমাত্র JPG বা PNG ছবি গ্রহণ করা হবে।";
      fileInput.value = "";
      preview.innerHTML = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      errorEl.textContent = "ছবি 2 MB ছোট হতে হবে।";
      fileInput.value = "";
      preview.innerHTML = "";
      return;
    }

    errorEl.textContent = "";
    var reader = new FileReader();
    reader.onload = function (ev) {
      preview.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
    };
    reader.readAsDataURL(file);
  });
}

/* ============================================
   FIELD VALIDATION HELPERS
   ============================================ */
function setError(fieldId, message) {
  var errorEl = document.getElementById("error-" + fieldId);
  var input = document.getElementById("reg-" + fieldId) || document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (input) {
    input.classList.add("error");
    input.classList.remove("valid");
  }
}

function setValid(fieldId) {
  var errorEl = document.getElementById("error-" + fieldId);
  var input = document.getElementById("reg-" + fieldId) || document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = "";
  if (input) {
    input.classList.remove("error");
    input.classList.add("valid");
  }
}

function clearField(fieldId) {
  setError(fieldId, "");
  var input = document.getElementById("reg-" + fieldId) || document.getElementById(fieldId);
  if (input) {
    input.classList.remove("error");
    input.classList.remove("valid");
  }
}

/* ============================================
   STEP 1: FORM VALIDATION
   ============================================ */
function validateForm() {
  var firstError = null;

  function fail(fieldId, message) {
    setError(fieldId, message);
    if (!firstError) firstError = document.getElementById("reg-" + fieldId) || document.getElementById(fieldId);
  }

  // 1. Full Name
  var name = document.getElementById("reg-name");
  if (!name.value.trim()) {
    fail("name", "পুরো নাম চাই — দয়া করে আপনার নাম লিখুন।");
  } else {
    setValid("name");
  }

  // 2. Class
  var cls = document.getElementById("reg-class");
  if (!cls.value) {
    fail("class", "আপনার ক্লাস নির্বাচন করুন।");
  } else {
    setValid("class");
  }

  // 3. Department
  var dept = document.getElementById("reg-dept");
  if (!dept.value) {
    fail("dept", "আপনার বিভাগ নির্বাচন করুন।");
  } else {
    setValid("dept");
  }

  // 4. Section
  var section = document.getElementById("reg-section");
  if (!section.value) {
    fail("section", "আপনার শাখা নির্বাচন করুন।");
  } else {
    setValid("section");
  }

  // 5. Roll
  var roll = document.getElementById("reg-roll");
  if (!roll.value || parseInt(roll.value, 10) < 1) {
    fail("roll", "রোল একটি ছোট সংখ্যা হতে হবে।");
  } else {
    setValid("roll");
  }

  // 6. Gender
  var gender = document.getElementById("reg-gender");
  if (!gender.value) {
    fail("gender", "লিঙ্গ নির্বাচন করুন।");
  } else {
    setValid("gender");
  }

  // 7. Date of Birth
  var day = document.getElementById("dob-day");
  var month = document.getElementById("dob-month");
  var year = document.getElementById("dob-year");
  if (!day.value || !month.value || !year.value) {
    fail("dob", "আপনার সম্পূর্ণ জন্মতারিখ নির্বাচন করুন।");
  } else {
    setValid("dob");
  }

  // 8. Address (min 5 chars)
  var address = document.getElementById("reg-address");
  if (!address.value.trim()) {
    fail("address", "ঠিকানা লিখুন।");
  } else if (address.value.trim().length < 5) {
    fail("address", "ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে।");
  } else {
    setValid("address");
  }

  // 9. WhatsApp Number
  var whatsapp = document.getElementById("reg-whatsapp");
  var whatsappVal = whatsapp.value.trim();
  var phoneRegex = /^01[3-9]\d{8}$/;
  if (!whatsappVal) {
    fail("whatsapp", "WhatsApp নম্বর চাই — দয়া করে আপনার নম্বর লিখুন।");
  } else if (!phoneRegex.test(whatsappVal)) {
    fail("whatsapp", "01 দিয়ে শুরু করে 11 ডিজিটের নম্বর লিখুন (013-019 দিতে হবে।");
  } else {
    setValid("whatsapp");
  }

  // 10. Phone Number (personal)
  var phone = document.getElementById("reg-phone");
  var phoneVal = phone.value.trim();
  if (!phoneVal) {
    fail("phone", "ফোন নম্বর চাই।");
  } else if (!phoneRegex.test(phoneVal)) {
    fail("phone", "01 দিয়ে শুরু করে 11 ডিজিটের নম্বর লিখুন।");
  } else {
    setValid("phone");
  }

  // 11. Email
  var email = document.getElementById("reg-email");
  var emailVal = email.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    fail("email", "ইমেইল চাই — দয়া করে আপনার ইমেইল লিখুন।");
  } else if (!emailRegex.test(emailVal)) {
    fail("email", "একটি বৈধ ইমেইল লিখুন (e.g., name@domain.com)।");
  } else {
    setValid("email");
  }

  // 12. Father's Name
  var fatherName = document.getElementById("reg-father-name");
  if (!fatherName.value.trim()) {
    fail("father-name", "পিতার নাম লিখুন।");
  } else {
    setValid("father-name");
  }

  // 13. Father's Phone (6-15 digits, no +88 prefix)
  var fatherPhone = document.getElementById("reg-father-phone");
  var fpVal = fatherPhone.value.trim();
  var digitsOnly = /^\d+$/;
  if (!fpVal) {
    fail("father-phone", "পিতার মোবাইল নম্বর লিখুন।");
  } else if (!digitsOnly.test(fpVal) || fpVal.length < 6 || fpVal.length > 15) {
    fail("father-phone", "৬ থেকে ১৫ ডিজিটের সংখ্যা লিখুন।");
  } else {
    setValid("father-phone");
  }

  // 14. Mother's Name
  var motherName = document.getElementById("reg-mother-name");
  if (!motherName.value.trim()) {
    fail("mother-name", "মাতার নাম লিখুন।");
  } else {
    setValid("mother-name");
  }

  // 15. Mother's Phone (same rule)
  var motherPhone = document.getElementById("reg-mother-phone");
  var mpVal = motherPhone.value.trim();
  if (!mpVal) {
    fail("mother-phone", "মাতার মোবাইল নম্বর লিখুন।");
  } else if (!digitsOnly.test(mpVal) || mpVal.length < 6 || mpVal.length > 15) {
    fail("mother-phone", "৬ থেকে ১৫ ডিজিটের সংখ্যা লিখুন।");
  } else {
    setValid("mother-phone");
  }

  // 16. Picture (optional but validated)
  var picture = document.getElementById("reg-picture");
  if (picture.files && picture.files.length > 0) {
    var file = picture.files[0];
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      fail("picture", "শুধুমাত্র JPG বা PNG ছবি গ্রহণ করা হবে।");
    } else if (file.size > 2 * 1024 * 1024) {
      fail("picture", "ছবি 2 MB ছোট হতে হবে।");
    } else {
      setValid("picture");
    }
  } else {
    setValid("picture");
  }

  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return !firstError;
}

/* ============================================
   STEP 1: FORM SUBMISSION — Generate Reg ID
   ============================================ */
function submitStep1() {
  var name = document.getElementById("reg-name").value.trim();
  var cls = document.getElementById("reg-class").value;
  var dept = document.getElementById("reg-dept").value;
  var section = document.getElementById("reg-section").value;
  var roll = document.getElementById("reg-roll").value.trim();
  var gender = document.getElementById("reg-gender").value;
  var day = document.getElementById("dob-day").value;
  var month = document.getElementById("dob-month").value;
  var year = document.getElementById("dob-year").value;
  var address = document.getElementById("reg-address").value.trim();
  var whatsapp = document.getElementById("reg-whatsapp").value.trim();
  var phone = document.getElementById("reg-phone").value.trim();
  var email = document.getElementById("reg-email").value.trim();
  var fatherName = document.getElementById("reg-father-name").value.trim();
  var fatherPhone = document.getElementById("reg-father-phone").value.trim();
  var motherName = document.getElementById("reg-mother-name").value.trim();
  var motherPhone = document.getElementById("reg-mother-phone").value.trim();

  // Build DOB as DDMMYYYY
  var dobStr = padDigits(parseInt(day, 10), 2) + padDigits(parseInt(month, 10), 2) + year;

  // Roll without leading zeros
  var rollStr = String(parseInt(roll, 10));

  // Last 4 digits of WhatsApp
  var last4 = whatsapp.slice(-4);

  // Generate the Reg ID
  var regId = generateRegId(rollStr, last4, dobStr);

  // Gender label in Bangla for display
  var genderLabel = gender === "Male" ? "পুরুষ" : "মহিলা";

  // Build DOB display string
  var dobDisplay = day + "/" + month + "/" + year;

  // Store all data for PDF generation
  _regData = {
    regId: regId,
    name: name,
    cls: cls,
    dept: dept,
    section: section,
    roll: roll,
    gender: gender,
    genderLabel: genderLabel,
    dob: dobDisplay,
    dobDay: day,
    dobMonth: month,
    dobYear: year,
    address: address,
    whatsapp: "+880" + whatsapp.replace(/^0/, ""),
    phone: "+880" + phone.replace(/^0/, ""),
    email: email,
    fatherName: fatherName,
    fatherPhone: fatherPhone,
    motherName: motherName,
    motherPhone: motherPhone,
    pictureDataUrl: null
  };

  // Read picture if provided
  var pictureInput = document.getElementById("reg-picture");
  if (pictureInput.files && pictureInput.files.length > 0) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      _regData.pictureDataUrl = ev.target.result;
      showStep1Result(regId);
    };
    reader.readAsDataURL(pictureInput.files[0]);
  } else {
    showStep1Result(regId);
  }
}

/* ============================================
   REG ID GENERATION ALGORITHM (UNCHANGED)
   ============================================ */

function generateRegId(roll, last4, dob) {
  var combined = roll + last4 + dob;
  var jumbled = juggleString(combined);
  return "MPA-" + jumbled;
}

function juggleString(str) {
  var result = "";
  var left = 0;
  var right = str.length - 1;
  var fromStart = true;
  while (left <= right) {
    if (fromStart) {
      result += str[left];
      left++;
    } else {
      result += str[right];
      right--;
    }
    fromStart = !fromStart;
  }
  return result;
}

function padDigits(num, len) {
  var s = String(num);
  while (s.length < len) {
    s = "0" + s;
  }
  return s;
}

/* ============================================
   STEP 1 RESULT PANEL
   ============================================ */
function showStep1Result(regId) {
  var form = document.getElementById("reg-form");
  var step1Section = document.getElementById("step-1-section");
  var result = document.getElementById("step-1-result");
  if (!form || !result) return;

  // Hide form, show result
  if (step1Section) step1Section.style.display = "none";
  result.style.display = "block";

  // Update step indicator
  updateStepIndicator(1);

  // Fill in data
  document.getElementById("display-reg-id").textContent = regId;
  document.getElementById("summary-name").textContent = _regData.name;
  document.getElementById("summary-class").textContent = _regData.cls;
  document.getElementById("summary-dept").textContent = _regData.dept;
  document.getElementById("summary-section").textContent = _regData.section;
  document.getElementById("summary-roll").textContent = _regData.roll;
  document.getElementById("summary-gender").textContent = _regData.genderLabel;
  document.getElementById("summary-dob").textContent = _regData.dob;
  document.getElementById("summary-address").textContent = _regData.address;
  document.getElementById("summary-whatsapp").textContent = _regData.whatsapp;
  document.getElementById("summary-phone").textContent = _regData.phone;
  document.getElementById("summary-email").textContent = _regData.email;
  document.getElementById("summary-father-name").textContent = _regData.fatherName;
  document.getElementById("summary-father-phone").textContent = _regData.fatherPhone;
  document.getElementById("summary-mother-name").textContent = _regData.motherName;
  document.getElementById("summary-mother-phone").textContent = _regData.motherPhone;
  document.getElementById("summary-regid").textContent = regId;

  // Build WhatsApp message
  var waLink = document.getElementById("wa-payment-link");
  if (waLink) {
    var message = encodeURIComponent(
      "আসসালামু আলাইকুম, আমি MPA-তে ভর্তি হতে চাই।\n\n" +
      "Registration ID: " + regId + "\n" +
      "নাম: " + _regData.name + "\n" +
      "ক্লাস: " + _regData.cls + "\n\n" +
      "আমি শীঘ্রে পেমেন্ট স্ক্রিনশট পাঠাবো।"
    );
    waLink.href = "https://wa.me/8801870746153?text=" + message;
  }

  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================
   STEP INDICATOR UPDATE
   ============================================ */
function updateStepIndicator(currentStep) {
  var dots = document.querySelectorAll(".step-dot");
  dots.forEach(function (dot) {
    var s = parseInt(dot.getAttribute("data-step"), 10);
    dot.classList.remove("active", "done");
    if (s < currentStep) {
      dot.classList.add("done");
    } else if (s === currentStep) {
      dot.classList.add("active");
    }
  });
}

/* ============================================
   STEP 2: SHOW PAYMENT FORM
   ============================================ */
function showStep2() {
  var step1Result = document.getElementById("step-1-result");
  var step2Section = document.getElementById("step-2-section");
  if (step1Result) step1Result.style.display = "none";
  if (step2Section) step2Section.style.display = "block";

  updateStepIndicator(2);
  step2Section.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================
   STEP 2: PAYMENT FORM VALIDATION
   ============================================ */
function validatePayment() {
  var firstError = null;

  function fail(fieldId, message) {
    setError(fieldId, message);
    if (!firstError) firstError = document.getElementById("pay-" + fieldId) || document.getElementById(fieldId);
  }

  var bkash = document.getElementById("pay-bkash");
  var bkashVal = bkash.value.trim();
  var phoneRegex = /^01[3-9]\d{8}$/;
  if (!bkashVal) {
    fail("bkash", "bKash/Nagad নম্বর লিখুন।");
  } else if (!phoneRegex.test(bkashVal)) {
    fail("bkash", "১১ ডিজিটের বৈধ নম্বর লিখুন।");
  } else {
    setValid("bkash");
  }

  var amount = document.getElementById("pay-amount");
  if (!amount.value || parseInt(amount.value, 10) < 1) {
    fail("amount", "সঠিক পরিমাণ লিখুন।");
  } else {
    setValid("amount");
  }

  var trxid = document.getElementById("pay-trxid");
  if (!trxid.value.trim()) {
    fail("trxid", "TrxID লিখুন।");
  } else if (trxid.value.trim().length < 5) {
    fail("trxid", "TrxID কমপক্ষে ৫ অক্ষর হতে হবে।");
  } else {
    setValid("trxid");
  }

  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return !firstError;
}



/* ============================================
   STEP 2: PDF GENERATION
   ============================================ */
async function generatePDF() {
  var payBtn = document.getElementById("download-pdf-btn");
  payBtn.textContent = "\u09aa\u09bf\u099f\u09bf\u0993 \u099f\u09c7 \u09b9\u099a\u09cd\u099b\u09c7...";
  payBtn.disabled = true;

  var bkash = document.getElementById("pay-bkash").value.trim();
  var amount = document.getElementById("pay-amount").value.trim();
  var trxid = document.getElementById("pay-trxid").value.trim();

  try {
    if (typeof PDF_BLANK_BYTES === "undefined" || !PDF_BLANK_BYTES || PDF_BLANK_BYTES.byteLength === 0) {
      throw new Error("PDF data not loaded. Reload the page and try again.");
    }

    // load(), embedFont(), embedPng()/embedJpg() and save() ALL return
    // Promises — every call below MUST be awaited.
    var pdf = await PDFLib.PDFDocument.load(PDF_BLANK_BYTES);
    var pages = pdf.getPages();
    if (!pages || pages.length === 0) throw new Error("PDF has no pages");
    var page = pages[0];
    var font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
    var fontSize = 11;
    var color = PDFLib.rgb(0x11 / 255, 0x18 / 255, 0x27 / 255);

    // Draws one form field. Text containing Bangla (or any character
    // Helvetica cannot encode) is rendered via canvas and embedded as an
    // image; plain English/ASCII text is drawn normally.
    async function drawField(fieldName, text) {
      var f = PDF_FIELDS[fieldName];
      if (!f || text === undefined || text === null || text === "") return;
      var str = String(text);
      if (needsCanvasText(str)) {
        await drawBanglaText(pdf, page, str, f.x, f.y, f.size || fontSize);
      } else {
        page.drawText(str, {
          x: f.x, y: f.y, size: f.size || fontSize,
          font: font, color: color
        });
      }
    }

    await drawField("regId", _regData.regId);

    if (_regData.pictureDataUrl) {
      await drawPhoto(pdf, page, _regData.pictureDataUrl);
    }

    await drawField("studentName", _regData.name);
    await drawField("class", _regData.cls);
    await drawField("department", _regData.dept);
    await drawField("section", _regData.section);
    await drawField("roll", _regData.roll);
    await drawField("dob", _regData.dob);
    await drawField("gender", _regData.genderLabel);
    await drawField("address", _regData.address);
    await drawField("phone", _regData.phone);
    await drawField("email", _regData.email);

    await drawField("fatherName", _regData.fatherName);
    await drawField("fatherPhone", _regData.fatherPhone);
    await drawField("motherName", _regData.motherName);
    await drawField("motherPhone", _regData.motherPhone);

    await drawField("bkashNumber", "+880" + bkash.replace(/^0/, ""));
    await drawField("amount", amount + " BDT");
    await drawField("trxId", trxid);

    var today = new Date();
    var dateStr = padDigits(today.getDate(), 2) + "/" +
                  padDigits(today.getMonth() + 1, 2) + "/" +
                  today.getFullYear();
    await drawField("date", dateStr);

    var bytes = await pdf.save();
    var blob = new Blob([bytes], { type: "application/pdf" });
    var blobUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = blobUrl;
    a.download = "MPA-Application-" + _regData.regId + ".pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    var step2 = document.getElementById("step-2-section");
    var pdfSuccess = document.getElementById("pdf-success");
    if (step2) step2.style.display = "none";
    if (pdfSuccess) {
      pdfSuccess.style.display = "block";
      pdfSuccess.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (e) {
    console.error("PDF generation failed:", e);
    alert("PDF error: " + e.message);
    payBtn.textContent = "\u09a1\u09be\u0993\u09a8\u09b2\u09cb\u09a1 \u0995\u09b0\u09c1\u09a8";
    payBtn.disabled = false;
  }
}

/* ============================================
   PHOTO DRAWING INTO PDF
   ============================================ */
async function drawPhoto(pdf, page, dataUrl) {
  var box = PDF_FIELDS.photoBox;
  if (!box) return;

  var base64 = dataUrl.split(",")[1];
  var binaryStr = atob(base64);
  var bytes = new Uint8Array(binaryStr.length);
  for (var i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  // embedPng()/embedJpg() return Promises — must be awaited, otherwise
  // pdf.save() runs before the photo is embedded.
  var image;
  if (dataUrl.indexOf("image/png") !== -1) {
    image = await pdf.embedPng(bytes);
  } else {
    image = await pdf.embedJpg(bytes);
  }

  var scale = Math.min(box.width / image.width, box.height / image.height);
  var drawW = image.width * scale;
  var drawH = image.height * scale;
  page.drawImage(image, {
    x: box.x + (box.width - drawW) / 2,
    y: box.y + (box.height - drawH) / 2,
    width: drawW,
    height: drawH
  });
}

/* ============================================
   BANGLA TEXT RENDERING HELPERS
   pdf-lib's built-in fonts cannot encode Bangla (WinAnsi only), and
   pdf-lib cannot shape complex scripts even with an embedded Bangla
   font. So Bangla text is rendered on a <canvas> — the browser shapes
   it correctly using the site's Hind Siliguri font — then embedded
   into the PDF as a PNG image.
   ============================================ */

// True if text contains characters Helvetica cannot encode
// (all Bangla characters fall into this category).
function needsCanvasText(text) {
  return /[^\x00-\xFF]/.test(text);
}

async function drawBanglaText(pdf, page, text, x, y, size) {
  var SCALE = 3; // render at 3x resolution so text is crisp in the PDF

  // Make sure the Bangla web font is loaded before drawing on the canvas
  if (document.fonts && document.fonts.load) {
    try {
      await document.fonts.load((size * SCALE) + "px 'Hind Siliguri'", text);
    } catch (e) { /* ignore — browser falls back to a system Bangla font */ }
  }

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var fontSpec = (size * SCALE) + "px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";

  // Pass 1: measure the text
  ctx.font = fontSpec;
  var m = ctx.measureText(text);
  var ascent = Math.ceil(m.actualBoundingBoxAscent) || Math.ceil(size * SCALE * 0.9);
  var descent = Math.ceil(m.actualBoundingBoxDescent) || 0;
  var width = Math.ceil(m.width) || 1;

  // Setting canvas width/height resets the context, so re-set the font
  canvas.width = width;
  canvas.height = ascent + descent;

  // Pass 2: draw the text
  ctx = canvas.getContext("2d");
  ctx.font = fontSpec;
  ctx.fillStyle = "#111827";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, 0, ascent);

  // Convert canvas to PNG bytes
  var dataUrl = canvas.toDataURL("image/png");
  var base64 = dataUrl.split(",")[1];
  var binaryStr = atob(base64);
  var bytes = new Uint8Array(binaryStr.length);
  for (var i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  var image = await pdf.embedPng(bytes);

  // In PDF coordinates (x, y) is the text BASELINE, same as drawText().
  // Image top = baseline + ascent, bottom = baseline - descent.
  page.drawImage(image, {
    x: x,
    y: y - (descent / SCALE),
    width: image.width / SCALE,
    height: image.height / SCALE
  });
}