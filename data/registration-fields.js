/**
 * REGISTRATION FIELDS DATA FILE
 * ==============================
 * Owner can add or change options here without touching any other file.
 * For example, to add a new section "E", just add "E" to sectionOptions.
 * To add a new department, add a string to departmentOptions.
 *
 * genderOptions values are English ("Male"/"Female") because they are
 * written into the PDF. Bangla labels ("পুরুষ"/"মহিলা") are in the UI only.
 */

var REG_FIELDS = {
  classOptions: ["Class 9", "Class 10", "Alim 1st Year", "Alim 2nd Year"],
  departmentOptions: ["General", "Science", "Commerce"],
  sectionOptions: ["A", "B", "C", "D"],
  genderOptions: [
    { value: "Male",   label: "পুরুষ" },
    { value: "Female", label: "মহিলা" }
  ]
};
