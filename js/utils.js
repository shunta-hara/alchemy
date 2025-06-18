// utils.js
// トースト表示、ダークモード

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    saveDarkMode();
}

function saveDarkMode() {
    localStorage.setItem("alchemyDarkMode", document.body.classList.contains("dark") ? "on" : "off");
}

function loadDarkMode() {
    if (localStorage.getItem("alchemyDarkMode") === "on") {
        document.body.classList.add("dark");
    }
}
