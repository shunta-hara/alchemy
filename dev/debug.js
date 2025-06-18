// debug.js
// デバッグ用関数（本番デプロイ時は読み込まないこと）

export const _resetGame = () => {
    if (confirm("ゲームデータをリセットしますか？")) {
        localStorage.removeItem("alchemySave");
        location.reload();
    }
};
