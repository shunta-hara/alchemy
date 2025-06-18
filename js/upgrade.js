// upgrade.js
// アップグレード・合成処理

const getUpgradeCost = (type, level) => {
    const multiplier = 1.3 ** level;
    const baseCost = baseCosts[type];
    let cost = {};
    for (const mat in baseCost) {
        cost[mat] = Math.ceil(baseCost[mat] * multiplier);
    }
    return cost;
};

const canAfford = (cost) => {
    return Object.entries(cost).every(([mat, n]) => inventory[mat] >= n);
};

const payCost = (cost) => {
    Object.entries(cost).forEach(([mat, n]) => {
        inventory[mat] -= n;
    });
};

const tryUpgrade = (type, levelRef, costType, stopId, msg) => {
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
};

const upgradeOven = () => {
    tryUpgrade("oven", () => rarityBias, "oven", "upgrade-oven", "素材が足りません！");
};
const upgradeAuto = () => {
    tryUpgrade("auto", () => autoCollectLevel, "auto", "upgrade-auto", "素材が足りません！");
};
const upgradeYield = () => {
    tryUpgrade("yield", () => yieldBonus - 1, "yield", "upgrade-yield", "素材が足りません！");
};

const combine = () => {
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
};

const reincarnate = () => {
    if ((inventory["賢者の石"] || 0) >= 100) {
        inventory["賢者の石"] -= 100;
        // 転生時のリセット処理
        materials.forEach(mat => inventory[mat] = 0);
        rarityBias = 0;
        autoCollectLevel = 0;
        yieldBonus = 1;
        saveGame();
        updateDisplay();
        updateCostDisplay();
        showToast("転生しました！新たな力を手に入れよう！");
        // TODO: 転生特典を追加する
    } else {
        showToast("賢者の石が足りません！（100個必要）");
    }
};
