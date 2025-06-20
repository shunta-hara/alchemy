// ui.js
// 画面表示・UI更新

const updateCostDisplay = () => {
    ["oven", "auto", "yield"].forEach(type => {
        const level = type === "oven" ? rarityBias : type === "auto" ? autoCollectLevel : yieldBonus - 1;
        const cost = getUpgradeCost(type, level);
        document.getElementById(`cost-${type}`).textContent =
            "コスト: " + Object.entries(cost).map(([mat, n]) => `${mat}${n}`).join(", ");
    });
};

const updateDisplay = () => {
    // 素材表示
    document.getElementById("materials").innerHTML =
        materials.map(mat => `${mat}: ${inventory[mat]}`).join("<br>");

    // アップグレードレベル表示
    document.getElementById("upgrade-oven").textContent = `錬金窯強化（Lv.${rarityBias}）`;
    document.getElementById("upgrade-auto").textContent = `自動化強化（Lv.${autoCollectLevel}）`;
    document.getElementById("upgrade-yield").textContent = `素材取得量強化（Lv.${yieldBonus - 1}）`;

    // 賢者の石表示
    document.getElementById("philosopher-stone-count").textContent =
        `賢者の石: ${inventory["賢者の石"] || 0}`;

    // --- ボタン活性/非活性制御 ---
    // アップグレード
    const ovenCost = getUpgradeCost("oven", rarityBias);
    document.getElementById("upgrade-oven").disabled = !canAfford(ovenCost);
    const autoCost = getUpgradeCost("auto", autoCollectLevel);
    document.getElementById("upgrade-auto").disabled = !canAfford(autoCost);
    const yieldCost = getUpgradeCost("yield", yieldBonus);
    document.getElementById("upgrade-yield").disabled = !canAfford(yieldCost);
    // 合成
    document.getElementById("combine-btn").disabled = (inventory["金"] < 3);
};
