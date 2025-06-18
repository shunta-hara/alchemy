// utils.js
// トースト表示、ダークモード

let toastTimeoutId; // トースト用タイマーID

const showToast = (msg) => {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    if (toastTimeoutId) clearTimeout(toastTimeoutId); // 既存タイマーをクリア
    toastTimeoutId = setTimeout(() => {
        toast.classList.add("hidden");
        toastTimeoutId = null;
    }, 2000);
};

const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    saveDarkMode();
};

const saveDarkMode = () => {
    localStorage.setItem("alchemyDarkMode", document.body.classList.contains("dark") ? "on" : "off");
};

const loadDarkMode = () => {
    if (localStorage.getItem("alchemyDarkMode") === "on") {
        document.body.classList.add("dark");
    }
};
