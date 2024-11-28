const host = "https://ranking.fabsoftware.itp.ifsp.edu.br/ranking/space";
let rankingData = null;

async function getRanking() {
  await fetch(`${host}`)
    .then(res => res.json())
    .then(res => createRankingList(res));
}

function createRankingList(rankingJson) {
  rankingData = rankingJson;
  const rankingList = document.querySelector(".rankingList");
  rankingList.innerHTML = null;
  rankingJson.sort(function(a, b) { return b.score - a.score });
  const top10Players = rankingJson.slice(0, 10);
  top10Players.forEach(player => {
    const item = createPlayerElement(player);
    rankingList.appendChild(item);
  });
}

function createPlayerElement(player) {
  const element = document.createElement('li');
  element.innerHTML = `<span>${player.name}</span>: <span class="player-score">${player.score}</span>`;
  return element;
}

getRanking();