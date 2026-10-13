const ageForm = document.getElementById("age-form");
const birthdateInput = document.getElementById("birthdate");
const resetButton = document.getElementById("reset-button");
const errorMessage = document.getElementById("error-message");
const resultPanel = document.getElementById("result");

const yearsResult = document.getElementById("years-result");
const monthsResult = document.getElementById("months-result");
const daysResult = document.getElementById("days-result");

function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

birthdateInput.max = formatDateForInput(getToday());

function parseBirthdate(value) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function daysBetween(startDate, endDate) {
    const start = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    const end = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    return Math.round((end - start) / 86400000);
}

function addMonthsClamped(date, monthOffset) {
    const totalMonths = date.getFullYear() * 12 + date.getMonth() + monthOffset;
    const targetYear = Math.floor(totalMonths / 12);
    const targetMonth = ((totalMonths % 12) + 12) % 12;
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    const targetDay = Math.min(date.getDate(), lastDay);

    return new Date(targetYear, targetMonth, targetDay);
}

function calculateAge(birthdate, today) {
    let years = today.getFullYear() - birthdate.getFullYear();
    let anniversaryDay = Math.min(
        birthdate.getDate(),
        new Date(today.getFullYear(), birthdate.getMonth() + 1, 0).getDate()
    );
    let birthdayThisYear = new Date(
        today.getFullYear(),
        birthdate.getMonth(),
        anniversaryDay
    );

    if (today < birthdayThisYear) {
        years--;
    }

    const anchorDay = Math.min(
        birthdate.getDate(),
        new Date(birthdate.getFullYear() + years, birthdate.getMonth() + 1, 0).getDate()
    );
    const lastBirthday = new Date(
        birthdate.getFullYear() + years,
        birthdate.getMonth(),
        anchorDay
    );

    let months =
        (today.getFullYear() - lastBirthday.getFullYear()) * 12 +
        today.getMonth() - lastBirthday.getMonth();

    if (today.getDate() < lastBirthday.getDate()) {
        months--;
    }

    const monthAnchor = addMonthsClamped(lastBirthday, months);
    const days = daysBetween(monthAnchor, today);

    return { years, months, days };
}

function clearError() {
    errorMessage.textContent = "";
    birthdateInput.removeAttribute("aria-invalid");
}

ageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    if (birthdateInput.value === "") {
        errorMessage.textContent = "Please select your date of birth.";
        birthdateInput.setAttribute("aria-invalid", "true");
        resultPanel.hidden = true;
        birthdateInput.focus();
        return;
    }

    const birthdate = parseBirthdate(birthdateInput.value);
    const today = getToday();

    if (birthdate === null || birthdate > today) {
        errorMessage.textContent = "Please select a valid date of birth.";
        birthdateInput.setAttribute("aria-invalid", "true");
        resultPanel.hidden = true;
        birthdateInput.focus();
        return;
    }

    const age = calculateAge(birthdate, today);
    yearsResult.textContent = age.years;
    monthsResult.textContent = age.months;
    daysResult.textContent = age.days;
    resultPanel.hidden = false;
});

resetButton.addEventListener("click", function () {
    ageForm.reset();
    clearError();
    resultPanel.hidden = true;
    birthdateInput.focus();
});

birthdateInput.addEventListener("input", clearError);
