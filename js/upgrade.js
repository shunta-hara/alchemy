// upgrade.js
// アップグレード・合成処理

function getUpgradeCost(type, level) {
    const multiplier = 1.3 ** level;
    const baseCost = baseCosts[type];
    let cost = {};
    for (const mat in baseCost) {
        cost[mat] = Math.ceil(baseCost[mat] * multiplier);
    }
    return cost;
}

function canAfford(cost) {
    return Object.entries(cost).every(([mat, n]) => inventory[mat] >= n);
}

function payCost(cost) {
    Object.entries(cost).forEach(([mat, n]) => {
        inventory[mat] -= n;
    });
}

function tryUpgrade(type, levelRef, costType, stopId, msg) {
    const cost = getUpgradeCost(costType, levelRef());
    if (canAfford(cost)) {
        payCost(cost);
        if (costType === "yield") yieldBonus++;
        else if (costType === "auto") autoCollectLevel++;
        else if (costType === "oven") rarityBias++;
        updateDisplay();
        updateCostDisplay();
        saveGame();
    } else {
        stopContinuousUpgrade(stopId);
        showToast(msg);
    }
}

function upgradeOven() {
    tryUpgrade("oven", () => rarityBias, "oven", "upgrade-oven", "素材が足りません！");
}
function upgradeAuto() {
    tryUpgrade("auto", () => autoCollectLevel, "auto", "upgrade-auto", "素材が足りません！");
}
function upgradeYield() {
    tryUpgrade("yield", () => yieldBonus - 1, "yield", "upgrade-yield", "素材が足りません！");
}

function combine() {
    if (inventory["金"] >= 3) {
        inventory["金"] -= 3;
        inventory["賢者の石"] = (inventory["賢者の石"] || 0) + 1;
        updateDisplay();
        saveGame();
        showToast("賢者の石を生成しました！");
    } else {
        stopContinuousUpgrade("combine-btn");
        showToast("金が足りません！");
    }
}
