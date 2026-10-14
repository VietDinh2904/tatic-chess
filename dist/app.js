const puzzles = [
  { id: 1, title: "Hamppe – Steinitz", place: "Vienna, 1860", side: "black", fen: "r6r/1pp3k1/1b6/p2P1p2/P1N1pn2/2P2PP1/BP5P/4RR1K b", summary: "Đòn phối hợp bắt đầu bằng hi sinh xe để kéo vua vào lưới chiếu hết.", steps: [
    ["h8","h2","student","…Rxh2+","Hi sinh xe chính xác! Vua trắng bị kéo khỏi nơi trú ẩn."],
    ["h1","h2","coach","Kxh2","Trắng buộc phải nhận xe."],
    ["a8","h8","student","…Rh8#","Xe còn lại tràn sang cột h và chiếu hết."] ] },
  { id: 2, title: "Steinitz – Wilson", place: "London, 1862", side: "white", fen: "rnb3kr/ppp4p/3b3B/3Pp2n/2BP4/3K1Rp1/PPP3q1/RN1Q4 w", summary: "Một chuỗi chiếu cưỡng bức kết thúc bằng đòn phối hợp tốt và tượng.", steps: [
    ["f3","f8","student","Rf8+","Xe xâm nhập hàng tám với nhịp chiếu."],
    ["d6","f8","coach","Bxf8","Tượng đen buộc phải đổi xe."],
    ["d5","d6","student","d6+","Tốt tiến, tiếp tục ép vua."],
    ["f8","e6","coach","Be6","Đen chỉ còn một ô chắn."],
    ["c4","e6","student","Bxe6#","Tượng kết thúc ván cờ."] ] },
  { id: 3, title: "Steinitz – Dubois", place: "London, 1862", side: "white", fen: "r2q1rk1/pppb1ppp/3b4/4p1P1/4Pn2/2N1B2P/PPPQBP2/2KR3R w", summary: "Khai thác quân bị ghim để giành trọn một quân nhẹ.", steps: [
    ["e3","f4","student","Bxf4!","Đúng! Tượng d6 đang bị ghim nên tốt e không thể thoải mái phản công."],
    ["e5","f4","coach","exf4","Đen chấp nhận đổi cấu trúc tốt."],
    ["e4","e5","student","e5","Đòn đôi đuổi tượng và khóa chặt lợi thế quân."] ] },
  { id: 4, title: "Green – Steinitz", place: "London, 1864", side: "black", fen: "2kr4/1pp4p/1p1r4/5Pp1/1P2q3/2P1R2P/P3KP2/1Q1R4 b", summary: "Chiếu xen giữa trên hàng hai làm quân hậu mất người bảo vệ.", steps: [
    ["d6","d2","student","…Rd2+","Chính xác. Nước chiếu buộc trắng đáp trả và hậu b1 mất chỗ dựa."] ] },
  { id: 5, title: "Steinitz – Barry", place: "Dublin, 1865", side: "white", fen: "rn1qk2r/ppp2ppp/5n2/2b1p3/2B1P1b1/3P1N2/PPP3PP/RNBQK2R w", summary: "Mô-típ cổ điển Bxf7+ rồi Nxe5+ thu hai tốt và phá thành.", steps: [
    ["c4","f7","student","Bxf7+","Tượng hi sinh có mục đích: kéo vua ra khỏi e8."],
    ["e8","f7","coach","Kxf7","Vua đen buộc phải bắt."],
    ["f3","e5","student","Nxe5+","Mã thu tốt trung tâm với nhịp chiếu."] ] },
  { id: 6, title: "Fraser – Steinitz", place: "Dundee, 1867", side: "white", fen: "r2k3r/pp1b3p/1qn1p1p1/1B1pPn2/Q7/P4N2/1P1BNPPP/2R3K1 w", summary: "Đổi xe lấy mã để mở đường cho tượng ghim hậu đen.", steps: [
    ["c1","c6","student","Rxc6!","Xe phá hủy quân phòng thủ c6."],
    ["b7","c6","coach","bxc6","Tốt b buộc phải bắt lại."],
    ["d2","a5","student","Ba5","Tượng ghim hậu và trắng đạt ưu thế vật chất lớn."] ] },
  { id: 7, title: "Steinitz – Baker", place: "London, 1868", side: "black", fen: "2r1k2r/1b1p2q1/p4p2/4p3/PpB1Pp1p/7P/1PPRQPP1/4R1K1 b", summary: "Đẩy tốt tạo đòn quá tải: hậu trắng không thể giữ cả hai nhiệm vụ.", steps: [
    ["f4","f3","student","…f3!","Tốt áp sát, tấn công hậu và làm lộ quân c4."],
    ["e2","f3","coach","Qxf3","Hậu buộc phải xử lý tốt nguy hiểm."],
    ["c8","c4","student","…Rxc4","Xe thu tượng: đòn quá tải hoàn tất."] ] },
  { id: 8, title: "Steinitz – Minckwitz", place: "Baden-Baden, 1870", side: "black", fen: "r3k2r/p1ppbppp/1pn1q3/4P3/2BP2n1/5NB1/1PP1Q1PP/R4K1R b", summary: "Hậu đổi trên c4 để mở đòn nĩa mã quyết định.", steps: [
    ["e6","c4","student","…Qxc4!","Hậu chủ động đổi để chuẩn bị cú nĩa."],
    ["e2","c4","coach","Qxc4","Trắng nhận lời đổi hậu."],
    ["g4","e3","student","…Ne3+","Mã chiếu và nĩa vua với hậu."],
    ["f1","e2","coach","Ke2","Vua tránh chiếu."],
    ["e3","c4","student","…Nxc4","Mã thu hậu, đen thắng lớn."] ] },
  { id: 9, title: "Steinitz – Fleissig", place: "Vienna, 1873", side: "white", fen: "1b6/3n1p2/r1k1p1pp/Pr2P3/1PK2P2/3R4/3B2PP/R7 w", summary: "Đổi xe lấy mã để tạo tốt thông xa không thể cản.", steps: [
    ["d3","d7","student","Rxd7!","Xe loại bỏ mã chặn đường tốt a."],
    ["c6","d7","coach","Kxd7","Vua đen phải bắt lại."],
    ["c4","b5","student","Kb5","Vua hộ tống tốt a và giữ lợi thế thắng."] ] },
  { id: 10, title: "Steinitz – Gelbfuhs", place: "Vienna, 1873", side: "white", fen: "2b5/4Q1pp/pp3n1k/3p3q/P2P1P2/BP1B2P1/7P/6K1 w", summary: "Hi sinh hậu mở đường chéo cho tượng tạo chiếu hết mẫu mực.", steps: [
    ["e7","f6","student","Qxf6+!","Hi sinh hậu buộc tốt g rời đường chéo."],
    ["g7","f6","coach","gxf6","Đen không còn lựa chọn tốt hơn."],
    ["a3","f8","student","Bf8#","Đường chéo a3–f8 mở ra: chiếu hết."] ] }
];

const glyphs = { K:"♔",Q:"♕",R:"♖",B:"♗",N:"♘",P:"♙", k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟" };
const boardEl = document.querySelector("#board");
const listEl = document.querySelector("#puzzleList");
const coach = document.querySelector("#coachMessage");
const moveList = document.querySelector("#moveList");
const modal = document.querySelector("#modal");
let current = 0, step = 0, mistakes = 0, attempts = 0, correctAttempts = 0, selected = null;
let position = {}, lastMove = [], solved = new Set(), style = "twisted", mode = "2d", sound = true;

function parseFen(fen) {
  const out = {}, rows = fen.split(" ")[0].split("/");
  rows.forEach((row, ri) => { let file = 0; [...row].forEach(ch => {
    if (/\d/.test(ch)) file += +ch; else { out["abcdefgh"[file] + (8-ri)] = ch; file++; }
  }); });
  return out;
}

function renderList() {
  listEl.innerHTML = puzzles.map((p,i) => `<button class="puzzle-item ${i===current?"active":""} ${solved.has(i)?"solved":""}" data-index="${i}"><span class="num">${String(p.id).padStart(2,"0")}</span><b>${p.title}</b><i></i></button>`).join("");
  listEl.querySelectorAll("button").forEach(b => b.onclick = () => loadPuzzle(+b.dataset.index));
}

function renderBoard() {
  const expected = puzzles[current].steps[step];
  boardEl.dataset.style = style;
  boardEl.classList.toggle("mode-3d", mode === "3d");
  boardEl.innerHTML = "";
  for (let rank=8; rank>=1; rank--) for (let f=0; f<8; f++) {
    const sq = "abcdefgh"[f] + rank, piece = position[sq];
    const cell = document.createElement("div");
    cell.className = `square ${(f+rank)%2 ? "light":"dark"}`;
    if (selected === sq) cell.classList.add("selected");
    if (lastMove.includes(sq)) cell.classList.add("last");
    if (mistakes >= 5 && expected?.[0] === sq) cell.classList.add("hint-target");
    cell.dataset.square = sq; cell.setAttribute("role","gridcell");
    cell.addEventListener("dragover", e => e.preventDefault());
    cell.addEventListener("drop", e => { e.preventDefault(); attemptMove(e.dataTransfer.getData("text/plain"), sq); });
    cell.addEventListener("click", () => handleClick(sq));
    if (piece) {
      const el = document.createElement("span");
      el.className = `piece ${piece === piece.toUpperCase() ? "white":"black"}`;
      if (mistakes >= 3 && expected?.[0] === sq) el.classList.add("hint-source");
      el.dataset.kind = piece.toLowerCase();
      el.setAttribute("aria-label", `${piece === piece.toUpperCase() ? "quân trắng" : "quân đen"} ${piece.toLowerCase()}`);
      el.draggable = expected?.[2] === "student";
      el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", sq));
      cell.appendChild(el);
    }
    boardEl.appendChild(cell);
  }
}

function handleClick(square) {
  if (!position[square] && !selected) return;
  if (!selected) { selected = square; renderBoard(); return; }
  if (selected === square) { selected = null; renderBoard(); return; }
  if (position[square] && sameColor(position[selected], position[square])) { selected = square; renderBoard(); return; }
  attemptMove(selected, square);
}
function sameColor(a,b) { return a && b && (a===a.toUpperCase()) === (b===b.toUpperCase()); }

function movePiece(from,to) {
  position[to] = position[from]; delete position[from]; lastMove = [from,to]; selected = null; renderBoard();
}

function attemptMove(from,to) {
  const expected = puzzles[current].steps[step];
  if (!expected || expected[2] !== "student" || !from) return;
  attempts++;
  if (from === expected[0] && to === expected[1]) {
    correctAttempts++; movePiece(from,to); addMove(expected); step++;
    coach.className = "coach-message success";
    coach.innerHTML = `<span class="message-label">NƯỚC ĐI HAY</span><p>${expected[4]}</p>`;
    tone(true); updateStats();
    if (step >= puzzles[current].steps.length) return finishPuzzle();
    setTimeout(playCoachMoves, 620);
  } else {
    mistakes++; selected = null; coach.className = "coach-message error";
    coach.innerHTML = `<span class="message-label">THỬ LẠI</span><p>${mistakes < 3 ? "Nước đó chưa phải ý đồ mạnh nhất. Hãy chọn một quân khác và quan sát các nước cưỡng bức." : "Hãy nhìn lại quân đang được nhấn màu — đó là chìa khóa của thế cờ."}</p>`;
    if (mistakes === 3) showToast("Gợi ý cấp 1: quân cần đi đã đổi màu");
    if (mistakes === 5) showToast("Gợi ý cấp 2: ô đích đã được thắp sáng");
    tone(false); updateStats(); renderBoard();
  }
}

function playCoachMoves() {
  let expected = puzzles[current].steps[step];
  if (!expected || expected[2] !== "coach") { renderBoard(); return; }
  movePiece(expected[0], expected[1]); addMove(expected); step++;
  coach.className = "coach-message";
  coach.innerHTML = `<span class="message-label">ĐỐI THỦ ĐÁP LẠI</span><p>${expected[4]} Bây giờ đến lượt bạn tìm nước tiếp theo.</p>`;
  if (step >= puzzles[current].steps.length) finishPuzzle(); else setTimeout(playCoachMoves, 620);
}

function addMove(s) {
  moveList.querySelector(".empty-move")?.remove();
  const li = document.createElement("li");
  const n = moveList.children.length + 1;
  li.innerHTML = `<span>${String(n).padStart(2,"0")}</span><b>${s[3]}</b><em>${s[2] === "coach" ? "đối thủ" : "bạn"}</em>`;
  moveList.appendChild(li); moveList.scrollTop = moveList.scrollHeight;
}

function finishPuzzle() {
  solved.add(current); renderList(); updateStats();
  document.querySelector("#nextBtn").disabled = false;
  document.querySelector("#successText").textContent = puzzles[current].summary;
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
}

function loadPuzzle(index) {
  current = index; step = 0; mistakes = 0; selected = null; lastMove = [];
  position = parseFen(puzzles[current].fen);
  const p = puzzles[current];
  document.querySelector("#lessonNumber").textContent = `BÀI ${String(p.id).padStart(2,"0")} / 10`;
  document.querySelector("#lessonTitle").textContent = p.title;
  document.querySelector("#lessonPlace").textContent = p.place;
  const badge = document.querySelector("#turnBadge");
  badge.className = `turn-badge ${p.side}`; badge.querySelector("span").textContent = `${p.side === "white" ? "TRẮNG":"ĐEN"} ĐI TRƯỚC`;
  coach.className = "coach-message";
  coach.innerHTML = `<span class="message-label">NHIỆM VỤ</span><p>${p.side === "white" ? "Trắng":"Đen"} đi trước. Hãy tìm nước đi mạnh nhất trong thế cờ này.</p>`;
  moveList.innerHTML = `<li class="empty-move">Chưa có nước đi nào</li>`;
  document.querySelector("#nextBtn").disabled = !solved.has(current);
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
  renderList(); updateStats(); renderBoard();
}

function updateStats() {
  document.querySelector("#mistakeCount").textContent = `${mistakes} lỗi`;
  document.querySelector("#solvedCount").textContent = solved.size;
  document.querySelector("#streakCount").textContent = solved.size;
  document.querySelector("#accuracy").textContent = attempts ? `${Math.round(correctAttempts/attempts*100)}%` : "100%";
  document.querySelectorAll(".meter i").forEach((el,i) => el.classList.toggle("on", i < Math.min(mistakes,5)));
  document.querySelector("#hintLabel").textContent = mistakes >= 5 ? "Ô đích" : mistakes >= 3 ? "Quân cờ" : "Tự lực";
}

function nextPuzzle() { loadPuzzle((current + 1) % puzzles.length); }
function showToast(text) { const t=document.querySelector("#toast"); t.textContent=text; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2400); }
function tone(ok) {
  if (!sound || !window.AudioContext) return;
  const ctx = new AudioContext(), osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.frequency.value = ok ? 620 : 180; gain.gain.setValueAtTime(.035,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.14);
  osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.14);
}

document.querySelector("#resetBtn").onclick = () => loadPuzzle(current);
document.querySelector("#nextBtn").onclick = nextPuzzle;
document.querySelector("#modalNext").onclick = nextPuzzle;
document.querySelector("#soundBtn").onclick = e => { sound = !sound; e.currentTarget.classList.toggle("off",!sound); };
document.querySelectorAll(".style-card").forEach(card => card.onclick = () => {
  style = card.dataset.style; document.querySelectorAll(".style-card").forEach(c=>c.classList.toggle("active",c===card)); renderBoard();
});
document.querySelectorAll(".dimension-toggle button").forEach(btn => btn.onclick = () => {
  mode = btn.dataset.mode; document.querySelectorAll(".dimension-toggle button").forEach(b=>b.classList.toggle("active",b===btn));
  document.querySelector("#styleGrid").classList.toggle("mode-3d",mode==="3d"); renderBoard();
});

loadPuzzle(0);
