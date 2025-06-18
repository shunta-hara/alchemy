
const materials = ["銅", "鉄", "錫", "鉛", "水銀", "銀", "金"];
let inventory = {};
let rarityBias = 0;
let autoCollectLevel = 0;
let yieldBonus = 1;

// 基本コスト（初期コスト）
const baseCosts = {
    oven: { 銅: 10, 鉄: 5 },
    auto: { 錫: 10, 鉛: 5 },
    yield: { 水銀: 10, 銀: 5 },
};

materials.forEach(mat => inventory[mat] = 0);
inventory["賢者の石"] = 0;

function getMaterial() {
    const weights = materials.map((_, i) => {
        const diff = i - rarityBias;
        return 1 / (1 + Math.exp(diff)); // シグモイド関数風
    });
    const total = weights.reduce((a, b) => a + b);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        rand -= weights[i];
        if (rand < 0) return materials[i];
    }
    return materials[0];
}

// コストを表示する関数
function updateCostDisplay() {
    const ovenCost = getUpgradeCost("oven", rarityBias);
    const autoCost = getUpgradeCost("auto", autoCollectLevel);
    const yieldCost = getUpgradeCost("yield", yieldBonus - 1);

    document.getElementById("cost-oven").textContent = "コスト: " + Object.entries(ovenCost).map(([mat, n]) => `${mat}${n}`).join(", ");
    document.getElementById("cost-auto").textContent = "コスト: " + Object.entries(autoCost).map(([mat, n]) => `${mat}${n}`).join(", ");
    document.getElementById("cost-yield").textContent = "コスト: " + Object.entries(yieldCost).map(([mat, n]) => `${mat}${n}`).join(", ");
}

function updateDisplay() {
    const matDiv = document.getElementById("materials");
    matDiv.innerHTML = materials.map(mat =>
        `${mat}: ${inventory[mat]}`
    ).join("<br>");

    // アップグレードレベルの表示を更新
    document.getElementById("upgrade-oven").textContent = `錬金窯強化（Lv.${rarityBias}）`;
    document.getElementById("upgrade-auto").textContent = `自動化強化（Lv.${autoCollectLevel}）`;
    document.getElementById("upgrade-yield").textContent = `素材取得量強化（Lv.${yieldBonus}）`;

    // 賢者の石の表示（存在しない場合は0として表示）
    document.getElementById("philosopher-stone-count").textContent = `賢者の石: ${inventory["賢者の石"] || 0}`;
}

function addMaterial() {
    const mat = getMaterial();
    inventory[mat] += yieldBonus;
    updateDisplay();
    saveGame();
}

document.getElementById("alchemic-oven").addEventListener("click", addMaterial);

// アップグレードレベルごとにコスト倍率をかける関数（指数関数的に増加）
function getUpgradeCost(type, level) {
    const multiplier = 1.3 ** level;  // 例えば1.3倍ずつ増加
    const baseCost = baseCosts[type];
    let cost = {};
    for (const mat in baseCost) {
        cost[mat] = Math.ceil(baseCost[mat] * multiplier);
    }
    return cost;
}

// rarityBiasは現在のレベル
function canAfford(cost) {
    return Object.entries(cost).every(([mat, n]) => inventory[mat] >= n);
}

function payCost(cost) {
    Object.entries(cost).forEach(([mat, n]) => {
        inventory[mat] -= n;
    });
}

function upgradeOven() {
    const cost = getUpgradeCost("oven", rarityBias);
    if (canAfford(cost)) {
        payCost(cost);
        rarityBias++;
        updateDisplay();
        updateCostDisplay();
        saveGame();
    } else {
        stopContinuousUpgrade("upgrade-oven");
        alert("素材が足りません！");
    }
};

function upgradeAuto() {
    const cost = getUpgradeCost("auto", autoCollectLevel);
    if (canAfford(cost)) {
        payCost(cost);
        autoCollectLevel++;
        updateDisplay();
        updateCostDisplay();
        saveGame();
    } else {
        stopContinuousUpgrade("upgrade-auto");
        alert("素材が足りません！");
    }
};

function upgradeYield() {
    const cost = getUpgradeCost("yield", yieldBonus - 1);
    if (canAfford(cost)) {
        payCost(cost);
        yieldBonus++;
        updateDisplay();
        updateCostDisplay();
        saveGame();
    } else {
        stopContinuousUpgrade("upgrade-yield");
        alert("素材が足りません！");
    }
};

function combine() {
    if (inventory["金"] >= 3) {
        inventory["金"] -= 3;
        inventory["賢者の石"] = (inventory["賢者の石"] || 0) + 1;
        updateDisplay();
        saveGame();
        showToast("賢者の石を生成しました！");
    } else {
        stopContinuousUpgrade("combine-btn");
        alert("金が足りません！");
    }
};

// 連続アップグレード用タイマーIDを保持するオブジェクト
const upgradeIntervals = {};

// 長押し開始処理：ボタンIDとアップグレード関数を受け取る
function startContinuousUpgrade(buttonId, upgradeFunc) {
    // 最初にすぐ1回アップグレード
    upgradeFunc();

    // 500ms後から連続アップグレード開始
    upgradeIntervals[buttonId] = setTimeout(function repeat() {
        upgradeFunc();
        upgradeIntervals[buttonId] = setTimeout(repeat, 200); // 連続アップグレード間隔200ms
    }, 500);
}

// 長押し終了処理：タイマークリア
function stopContinuousUpgrade(buttonId) {
    clearTimeout(upgradeIntervals[buttonId]);
}

function saveGame() {
    localStorage.setItem("alchemySave", JSON.stringify({
        inventory,
        rarityBias,
        autoCollectLevel,
        yieldBonus
    }));
    showToast("保存しました！");
}

function loadGame() {
    const saved = localStorage.getItem("alchemySave");
    if (saved) {
        const data = JSON.parse(saved);
        inventory = { ...inventory, ...(data.inventory || {}) };
        rarityBias = data.rarityBias ?? 0;
        autoCollectLevel = data.autoCollectLevel ?? 0;
        yieldBonus = data.yieldBonus ?? 1;
    } else {
        materials.map(mat => { inventory[mat] = 0 });
    }
    updateDisplay();
    updateCostDisplay();
    loadDarkMode(); // ダークモード読み込み
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
}

// 自動素材入手
setInterval(() => {
    for (let i = 0; i < autoCollectLevel; i++) {
        addMaterial();
    }
}, 3000);

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

loadGame();

// コンソールから実行できるリセット関数
function _resetGame() {
    if (confirm("ゲームデータをリセットしますか？")) {
        localStorage.removeItem("alchemySave"); // 保存データを削除
        location.reload(); // ページをリロードして初期化
    }
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
