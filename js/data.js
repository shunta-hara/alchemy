// data.js
// インベントリ・素材・セーブ/ロード・素材取得

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

function saveGame() {
    localStorage.setItem("alchemySave", JSON.stringify({
        inventory,
        rarityBias,
        autoCollectLevel,
        yieldBonus
    }));
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
        materials.forEach(mat => { inventory[mat] = 0; });
    }
}

function addMaterial() {
    const mat = getMaterial();
    inventory[mat] += yieldBonus;
    saveGame();
}
