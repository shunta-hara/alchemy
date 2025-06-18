// events.js
// イベントリスナー・初期化・連続アップグレード

// 連続アップグレード用タイマーIDを保持するオブジェクト
const upgradeIntervals = {};

function startContinuousUpgrade(buttonId, upgradeFunc) {
    upgradeFunc();
    upgradeIntervals[buttonId] = setTimeout(function repeat() {
        upgradeFunc();
        upgradeIntervals[buttonId] = setTimeout(repeat, 200);
    }, 500);
}

function stopContinuousUpgrade(buttonId) {
    clearTimeout(upgradeIntervals[buttonId]);
}

document.getElementById("alchemic-oven").addEventListener("click", function () {
    addMaterial();
    updateDisplay();
});

const ovenBtn = document.getElementById("upgrade-oven");
ovenBtn.addEventListener("mousedown", () => startContinuousUpgrade("upgrade-oven", upgradeOven));
ovenBtn.addEventListener("mouseup", () => stopContinuousUpgrade("upgrade-oven"));
ovenBtn.addEventListener("mouseleave", () => stopContinuousUpgrade("upgrade-oven"));

const autoBtn = document.getElementById("upgrade-auto");
autoBtn.addEventListener("mousedown", () => startContinuousUpgrade("upgrade-auto", upgradeAuto));
autoBtn.addEventListener("mouseup", () => stopContinuousUpgrade("upgrade-auto"));
autoBtn.addEventListener("mouseleave", () => stopContinuousUpgrade("upgrade-auto"));

const yieldBtn = document.getElementById("upgrade-yield");
yieldBtn.addEventListener("mousedown", () => startContinuousUpgrade("upgrade-yield", upgradeYield));
yieldBtn.addEventListener("mouseup", () => stopContinuousUpgrade("upgrade-yield"));
yieldBtn.addEventListener("mouseleave", () => stopContinuousUpgrade("upgrade-yield"));

const combineBtn = document.getElementById("combine-btn");
combineBtn.addEventListener("mousedown", () => startContinuousUpgrade("combine-btn", combine));
combineBtn.addEventListener("mouseup", () => stopContinuousUpgrade("combine-btn"));
combineBtn.addEventListener("mouseleave", () => stopContinuousUpgrade("combine-btn"));

// 自動素材入手
setInterval(() => {
    for (let i = 0; i < autoCollectLevel; i++) {
        addMaterial();
        updateDisplay();
    }
}, 3000);

function _resetGame() {
    if (confirm("ゲームデータをリセットしますか？")) {
        localStorage.removeItem("alchemySave");
        location.reload();
    }
}

// 初期化
window.addEventListener("DOMContentLoaded", function () {
    loadGame();
    updateDisplay();
    updateCostDisplay();
    loadDarkMode();
});
