let players = [];
let editingIndex = null;

// ---------- Add Modal ----------
function openAddModal() {
  document.getElementById("addName").value = "";
  document.getElementById("addPoints").value = "";
  document.getElementById("addAdditional").value = "";
  document.getElementById("addModal").style.display = "flex";
  document.getElementById("addName").focus();
}
function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
}
function saveNewPlayer() {
  let name = document.getElementById("addName").value.trim();
  let points = parseInt(document.getElementById("addPoints").value) || 0;
  let additional = parseInt(document.getElementById("addAdditional").value) || 0;

  if (!name) { alert("Please enter a name"); return; }
  let total = points + additional;

  let existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.total += total;
  } else {
    players.push({ name, total });
  }
  updateLeaderboard();
  closeAddModal();
}

// ---------- Edit Modal ----------
function openEditModal(index) {
  editingIndex = index;
  document.getElementById("editName").value = players[index].name;
  document.getElementById("editPoints").value = players[index].total;
  document.getElementById("editModal").style.display = "flex";
}
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editingIndex = null;
}
function saveEditedPlayer() {
  let name = document.getElementById("editName").value.trim();
  let points = parseInt(document.getElementById("editPoints").value) || 0;

  if (!name) { alert("Please enter a name"); return; }

  if (editingIndex !== null) {
    players[editingIndex].name = name;
    players[editingIndex].total = points;
  }
  updateLeaderboard();
  closeEditModal();
}

// ---------- Leaderboard ----------
function updateLeaderboard() {
  players.sort((a, b) => b.total - a.total);
  let tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";
  players.forEach((player, index) => {
    let row = `<tr>
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.total}</td>
      <td><button class="edit-btn" onclick="openEditModal(${index})">Edit</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// ---------- CSV ----------
function downloadCSV() {
  let csv = "rank,name,points\n";
  players.forEach((player, index) => {
    csv += `${index + 1},${player.name},${player.total}\n`;
  });

  // Add UTF-8 BOM so Excel/other apps detect encoding properly
  let blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leaderboard.csv";
  link.click();
}

function loadCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.trim().split("\n").slice(1);
    players = lines.map(line => {
      const [rank, name, total] = line.split(",");
      return { name, total: parseInt(total) };
    });
    updateLeaderboard();
  };
  reader.readAsText(file, "UTF-8");
}

// ---------- Keyboard Shortcuts ----------
document.addEventListener("keydown", function(event) {
  if (document.getElementById("addModal").style.display === "flex") {
    if (event.key === "Escape") closeAddModal();
    if (event.key === "Enter") { event.preventDefault(); saveNewPlayer(); }
  }
  if (document.getElementById("editModal").style.display === "flex") {
    if (event.key === "Escape") closeEditModal();
    if (event.key === "Enter") { event.preventDefault(); saveEditedPlayer(); }
  }
});
