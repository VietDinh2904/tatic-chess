let puzzles = []; /* Legacy ten-puzzle demo retained below as source notes.
  { id: 1, title: "Hamppe – Steinitz", place: "Vienna, 1860", side: "black", fen: "r6r/1pp3k1/1b6/p2P1p2/P1N1pn2/2P2PP1/BP5P/4RR1K b", summary: "The combination begins with a rook sacrifice that draws the king into a mating net.", steps: [
    ["h8","h2","student","…Rxh2+","Excellent sacrifice! The white king is pulled out of safety."],
    ["h1","h2","coach","Kxh2","White is forced to accept the rook."],
    ["a8","h8","student","…Rh8#","The remaining rook sweeps onto the h-file for checkmate."] ] },
  { id: 2, title: "Steinitz – Wilson", place: "London, 1862", side: "white", fen: "rnb3kr/ppp4p/3b3B/3Pp2n/2BP4/3K1Rp1/PPP3q1/RN1Q4 w", summary: "A forcing sequence of checks ends with a coordinated pawn-and-bishop mate.", steps: [
    ["f3","f8","student","Rf8+","The rook breaks into the eighth rank with check."],
    ["d6","f8","coach","Bxf8","Black's bishop is forced to take the rook."],
    ["d5","d6","student","d6+","The pawn advances and keeps the king under pressure."],
    ["f8","e6","coach","Be6","Black has only one useful block."],
    ["c4","e6","student","Bxe6#","The bishop finishes the game."] ] },
  { id: 3, title: "Steinitz – Dubois", place: "London, 1862", side: "white", fen: "r2q1rk1/pppb1ppp/3b4/4p1P1/4Pn2/2N1B2P/PPPQBP2/2KR3R w", summary: "Exploit the pin to win a full minor piece.", steps: [
    ["e3","f4","student","Bxf4!","Correct! The bishop on d6 is pinned, so the e-pawn cannot respond freely."],
    ["e5","f4","coach","exf4","Black accepts the structural damage."],
    ["e4","e5","student","e5","The pawn fork drives the bishop away and secures the extra piece."] ] },
  { id: 4, title: "Green – Steinitz", place: "London, 1864", side: "black", fen: "2kr4/1pp4p/1p1r4/5Pp1/1P2q3/2P1R2P/P3KP2/1Q1R4 b", summary: "An intermezzo check on the second rank leaves the queen undefended.", steps: [
    ["d6","d2","student","…Rd2+","Exactly. The check forces White to respond, and the queen on b1 loses its defender."] ] },
  { id: 5, title: "Steinitz – Barry", place: "Dublin, 1865", side: "white", fen: "rn1qk2r/ppp2ppp/5n2/2b1p3/2B1P1b1/3P1N2/PPP3PP/RNBQK2R w", summary: "The classic Bxf7+ and Nxe5+ motif wins two pawns and shatters the king's shelter.", steps: [
    ["c4","f7","student","Bxf7+","A purposeful bishop sacrifice draws the king away from e8."],
    ["e8","f7","coach","Kxf7","The black king is forced to capture."],
    ["f3","e5","student","Nxe5+","The knight takes the central pawn with check."] ] },
  { id: 6, title: "Fraser – Steinitz", place: "Dundee, 1867", side: "white", fen: "r2k3r/pp1b3p/1qn1p1p1/1B1pPn2/Q7/P4N2/1P1BNPPP/2R3K1 w", summary: "Exchange a rook for the knight to open a decisive pin on the black queen.", steps: [
    ["c1","c6","student","Rxc6!","The rook removes the key defender on c6."],
    ["b7","c6","coach","bxc6","The b-pawn is forced to recapture."],
    ["d2","a5","student","Ba5","The bishop pins the queen, leaving White with a large material advantage."] ] },
  { id: 7, title: "Steinitz – Baker", place: "London, 1868", side: "black", fen: "2r1k2r/1b1p2q1/p4p2/4p3/PpB1Pp1p/7P/1PPRQPP1/4R1K1 b", summary: "A pawn push creates an overload: the white queen cannot handle both duties.", steps: [
    ["f4","f3","student","…f3!","The pawn advances, attacks the queen, and exposes the bishop on c4."],
    ["e2","f3","coach","Qxf3","The queen must deal with the dangerous pawn."],
    ["c8","c4","student","…Rxc4","The rook wins the bishop and completes the overload tactic."] ] },
  { id: 8, title: "Steinitz – Minckwitz", place: "Baden-Baden, 1870", side: "black", fen: "r3k2r/p1ppbppp/1pn1q3/4P3/2BP2n1/5NB1/1PP1Q1PP/R4K1R b", summary: "Trade queens on c4 to unlock a decisive knight fork.", steps: [
    ["e6","c4","student","…Qxc4!","The queen initiates the exchange and prepares the fork."],
    ["e2","c4","coach","Qxc4","White accepts the queen trade."],
    ["g4","e3","student","…Ne3+","The knight checks the king and forks the queen."],
    ["f1","e2","coach","Ke2","The king steps out of check."],
    ["e3","c4","student","…Nxc4","The knight takes the queen, giving Black a winning advantage."] ] },
  { id: 9, title: "Steinitz – Fleissig", place: "Vienna, 1873", side: "white", fen: "1b6/3n1p2/r1k1p1pp/Pr2P3/1PK2P2/3R4/3B2PP/R7 w", summary: "Trade the rook for the knight to create an unstoppable outside passed pawn.", steps: [
    ["d3","d7","student","Rxd7!","The rook removes the knight blocking the a-pawn."],
    ["c6","d7","coach","Kxd7","The black king is forced to recapture."],
    ["c4","b5","student","Kb5","The king escorts the a-pawn and preserves the winning advantage."] ] },
  { id: 10, title: "Steinitz – Gelbfuhs", place: "Vienna, 1873", side: "white", fen: "2b5/4Q1pp/pp3n1k/3p3q/P2P1P2/BP1B2P1/7P/6K1 w", summary: "A queen sacrifice opens the diagonal for a textbook bishop mate.", steps: [
    ["e7","f6","student","Qxf6+!","The queen sacrifice forces the g-pawn away from the diagonal."],
    ["g7","f6","coach","gxf6","Black has no better choice."],
    ["a3","f8","student","Bf8#","The a3–f8 diagonal opens, and the bishop delivers checkmate."] ] }
]; */

const glyphs = { K:"♔",Q:"♕",R:"♖",B:"♗",N:"♘",P:"♙", k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟" };
const boardEl = document.querySelector("#board");
const listEl = document.querySelector("#puzzleList");
const coach = document.querySelector("#coachMessage");
const moveList = document.querySelector("#moveList");
const modal = document.querySelector("#modal");
let current = 0, step = 0, mistakes = 0, attempts = 0, correctAttempts = 0, selected = null;
let position = {}, lastMove = [], solved = new Set(), style = "twisted", sound = true;
let activeDifficulty = "all", activeCategory = "all";
let reviewLineIndex = 0, reviewPly = -1, reviewTimer = null;

function parseFen(fen) {
  const out = {}, rows = fen.split(" ")[0].split("/");
  rows.forEach((row, ri) => { let file = 0; [...row].forEach(ch => {
    if (/\d/.test(ch)) file += +ch; else { out["abcdefgh"[file] + (8-ri)] = ch; file++; }
  }); });
  return out;
}

function renderList() {
  const visible = puzzles.map((p,index) => ({p,index})).filter(({p}) =>
    (activeDifficulty === "all" || p.difficulty === activeDifficulty) &&
    (activeCategory === "all" || p.category === activeCategory));
  listEl.innerHTML = visible.map(({p,index}) => `<button class="puzzle-item ${index===current?"active":""} ${solved.has(index)?"solved":""}" data-index="${index}"><span class="num">${String(p.id).padStart(4,"0")}</span><b>${p.title}</b><i></i></button>`).join("") || `<p class="empty-filter">No puzzles match these filters.</p>`;
  listEl.querySelectorAll("button").forEach(b => b.onclick = () => loadPuzzle(+b.dataset.index));
  document.querySelector("#visibleCount").textContent = visible.length.toLocaleString("en-US");
}

function renderBoard() {
  const expected = puzzles[current].steps[step];
  boardEl.dataset.style = style;
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
      const el = document.createElement("img");
      el.className = `piece ${piece === piece.toUpperCase() ? "white":"black"}`;
      if (mistakes >= 3 && expected?.[0] === sq) el.classList.add("hint-source");
      el.dataset.kind = piece.toLowerCase();
      const pieceColor = piece === piece.toUpperCase() ? "white" : "black";
      el.src = `assets/pieces/sliced/${style}/2d/${pieceColor}/${piece.toLowerCase()}.png`;
      el.alt = `${pieceColor} ${piece.toLowerCase()}`;
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

function movePiece(from,to,notation="") {
  const moving = position[from];
  if (!moving) return;
  const isWhite = moving === moving.toUpperCase();
  const kind = moving.toLowerCase();
  if (kind === "p" && from[0] !== to[0] && !position[to]) {
    delete position[to[0] + from[1]];
  }
  if (kind === "k" && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
    const rank = from[1], kingSide = to[0] === "g";
    const rookFrom = `${kingSide ? "h" : "a"}${rank}`;
    const rookTo = `${kingSide ? "f" : "d"}${rank}`;
    position[rookTo] = position[rookFrom]; delete position[rookFrom];
  }
  const promotion = notation.match(/=([QRBN])/i)?.[1];
  position[to] = promotion ? (isWhite ? promotion.toUpperCase() : promotion.toLowerCase()) : moving;
  delete position[from]; lastMove = [from,to]; selected = null;
}

function studentMovesRemaining() {
  return puzzles[current].steps.slice(step).filter(item => item[2] === "student").length;
}

function attemptMove(from,to) {
  const expected = puzzles[current].steps[step];
  if (!expected || expected[2] !== "student" || !from) return;
  attempts++;
  if (from === expected[0] && to === expected[1]) {
    correctAttempts++; movePiece(from,to,expected[3]); addMove(expected); step++;
    coach.className = "coach-message success";
    coach.innerHTML = `<span class="message-label">STRONG MOVE</span><p>${expected[4]}${step < puzzles[current].steps.length ? " The line is not finished yet." : ""}</p>`;
    tone(true); updateStats();
    renderBoard();
    if (step >= puzzles[current].steps.length) return finishPuzzle();
    setTimeout(playCoachMoves, 620);
  } else {
    mistakes++; selected = null; coach.className = "coach-message error";
    coach.innerHTML = `<span class="message-label">TRY AGAIN</span><p>${mistakes < 3 ? "That is not the strongest idea. Try another piece and look for forcing moves." : "Look at the highlighted piece — it is the key to this position."}</p>`;
    if (mistakes === 3) showToast("Hint level 1: the correct piece is highlighted");
    if (mistakes === 5) showToast("Hint level 2: the destination square is highlighted");
    tone(false); updateStats(); renderBoard();
  }
}

function playCoachMoves() {
  let expected = puzzles[current].steps[step];
  if (!expected || expected[2] !== "coach") { renderBoard(); return; }
  movePiece(expected[0], expected[1],expected[3]); addMove(expected); step++;
  coach.className = "coach-message";
  const remaining = studentMovesRemaining();
  coach.innerHTML = `<span class="message-label">OPPONENT REPLIES</span><p>${expected[4]}${remaining ? ` Now find your next move — ${remaining} move${remaining === 1 ? "" : "s"} left in the line.` : ""}</p>`;
  renderBoard();
  if (step >= puzzles[current].steps.length) finishPuzzle(); else setTimeout(playCoachMoves, 620);
}

function addMove(s) {
  moveList.querySelector(".empty-move")?.remove();
  const li = document.createElement("li");
  const n = moveList.children.length + 1;
  li.innerHTML = `<span>${String(n).padStart(2,"0")}</span><b>${s[3]}</b><em>${s[2] === "coach" ? "opponent" : "you"}</em>`;
  moveList.appendChild(li); moveList.scrollTop = moveList.scrollHeight;
}

function finishPuzzle() {
  solved.add(current); renderList(); updateStats();
  document.querySelector("#nextBtn").disabled = false;
  const objective = puzzles[current].category.replace(/\b\w/g, letter => letter.toUpperCase());
  document.querySelector("#successText").textContent = `Well done. You completed this ${objective} exercise. Review the full main line and every available variation directly on the board.`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
}

function stopReviewPlayback() {
  if (reviewTimer) clearTimeout(reviewTimer);
  reviewTimer = null;
  document.querySelector("#reviewPlay").textContent = "▶ Play line";
}

function moveLabel(index, notation) {
  const p = puzzles[current];
  const moveNumber = (p.solution_start_move || 1) + (p.side === "white" ? Math.floor(index / 2) : Math.floor((index + 1) / 2));
  const side = index % 2 === 0 ? p.side : (p.side === "white" ? "black" : "white");
  return `${moveNumber}${side === "black" ? "..." : "."}${notation}`;
}

function reviewCommentFor(line, index) {
  if (index < 0) return "Start from the original position, then move forward one step at a time.";
  const p = puzzles[current], move = line.moves[index], notation = move[2];
  const mainStep = reviewLineIndex === 0 ? p.steps[index] : null;
  if (mainStep?.[0] === move[0] && mainStep?.[1] === move[1] && mainStep[4]) return mainStep[4];
  const actor = (index % 2 === 0 ? p.side : (p.side === "white" ? "black" : "white")) === "white" ? "White" : "Black";
  if (/#|mate/i.test(notation)) return `${actor} plays ${notation} and finishes the line with checkmate.`;
  if (/\+/.test(notation)) return `${actor} plays ${notation}, a forcing check that limits the opponent's replies.`;
  if (/x/.test(notation)) return `${actor} plays ${notation}. This capture changes the material or opens a tactical line.`;
  if (/O-O/.test(notation)) return `${actor} castles, improving king safety and activating the rook.`;
  if (/=/.test(notation)) return `${actor} plays ${notation} and promotes the pawn.`;
  return `${actor} plays ${notation}, continuing ${line.label.toLowerCase()} from the new position.`;
}

function replayLineTo(ply) {
  stopReviewPlayback();
  const line = puzzles[current].solution_lines?.[reviewLineIndex];
  if (!line) return;
  position = parseFen(puzzles[current].fen); lastMove = []; selected = null;
  reviewPly = Math.max(-1, Math.min(ply, line.moves.length - 1));
  for (let index = 0; index <= reviewPly; index++) movePiece(line.moves[index][0], line.moves[index][1], line.moves[index][2]);
  renderBoard(); renderSolutionExplorer();
}

function renderSolutionExplorer() {
  const p = puzzles[current], lines = p.solution_lines?.length ? p.solution_lines : [{ label: "Main line", moves: p.steps.map(item => [item[0], item[1], item[3]]) }];
  reviewLineIndex = Math.min(reviewLineIndex, lines.length - 1);
  const line = lines[reviewLineIndex];
  document.querySelector("#solutionLineCount").textContent = `${lines.length} ${lines.length === 1 ? "line" : "lines"}`;
  document.querySelector("#solutionLineTabs").innerHTML = lines.map((item, index) => `<button class="${index === reviewLineIndex ? "active" : ""}" data-line="${index}">${item.label}</button>`).join("");
  document.querySelector("#solutionLineTabs").querySelectorAll("button").forEach(button => button.onclick = () => {
    stopReviewPlayback(); reviewLineIndex = Number(button.dataset.line); reviewPly = -1; replayLineTo(-1);
  });
  document.querySelector("#reviewLineTitle").textContent = line.label;
  document.querySelector("#reviewProgress").textContent = reviewPly < 0 ? "Start position" : `${reviewPly + 1} / ${line.moves.length}`;
  document.querySelector("#reviewComment").textContent = reviewCommentFor(line, reviewPly);
  document.querySelector("#solutionMoves").innerHTML = line.moves.map((move, index) => `<button class="${index === reviewPly ? "active" : ""} ${index <= reviewPly ? "played" : ""}" data-ply="${index}">${moveLabel(index, move[2])}</button>`).join("");
  document.querySelector("#solutionMoves").querySelectorAll("button").forEach(button => button.onclick = () => replayLineTo(Number(button.dataset.ply)));
  document.querySelector("#reviewPrev").disabled = reviewPly < 0;
  document.querySelector("#reviewNext").disabled = reviewPly >= line.moves.length - 1;
}

function openReview() {
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
  reviewLineIndex = 0; reviewPly = -1;
  document.querySelector("#solutionReview").hidden = false;
  replayLineTo(-1);
  document.querySelector("#solutionReview").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function playReviewLine() {
  const line = puzzles[current].solution_lines?.[reviewLineIndex];
  if (!line) return;
  if (reviewTimer) { stopReviewPlayback(); return; }
  if (reviewPly >= line.moves.length - 1) replayLineTo(-1);
  document.querySelector("#reviewPlay").textContent = "Ⅱ Pause";
  const advance = () => {
    if (reviewPly >= line.moves.length - 1) return stopReviewPlayback();
    position = reviewPly < 0 ? parseFen(puzzles[current].fen) : position;
    reviewPly++;
    const move = line.moves[reviewPly]; movePiece(move[0], move[1], move[2]);
    renderBoard(); renderSolutionExplorer();
    document.querySelector("#reviewPlay").textContent = "Ⅱ Pause";
    reviewTimer = setTimeout(advance, 800);
  };
  advance();
}

function loadPuzzle(index) {
  stopReviewPlayback();
  current = index; step = 0; mistakes = 0; selected = null; lastMove = [];
  position = parseFen(puzzles[current].fen);
  const p = puzzles[current];
  document.querySelector("#lessonNumber").textContent = `PUZZLE ${String(p.id).padStart(4,"0")} / ${puzzles.length.toLocaleString("en-US")}`;
  document.querySelector("#lessonTitle").textContent = p.title;
  document.querySelector("#lessonPlace").textContent = `${p.difficulty.toUpperCase()} · ${p.category.toUpperCase()} · BOOK PAGE ${p.source_page}`;
  const badge = document.querySelector("#turnBadge");
  badge.className = `turn-badge ${p.side}`; badge.querySelector("span").textContent = `${p.side === "white" ? "WHITE":"BLACK"} TO MOVE`;
  coach.className = "coach-message";
  const studentMoveCount = p.steps.filter(item => item[2] === "student").length;
  coach.innerHTML = `<span class="message-label">YOUR TASK</span><p>${p.side === "white" ? "White":"Black"} to move. Play the complete solution line: ${studentMoveCount} move${studentMoveCount === 1 ? "" : "s"} for you.</p>`;
  moveList.innerHTML = `<li class="empty-move">No moves yet</li>`;
  document.querySelector("#solutionReview").hidden = true;
  reviewLineIndex = 0; reviewPly = -1;
  document.querySelector("#nextBtn").disabled = !solved.has(current);
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
  renderList(); updateStats(); renderBoard();
}

function updateStats() {
  document.querySelector("#mistakeCount").textContent = `${mistakes} ${mistakes === 1 ? "mistake" : "mistakes"}`;
  document.querySelector("#solvedCount").textContent = solved.size;
  document.querySelector("#streakCount").textContent = solved.size;
  document.querySelector("#accuracy").textContent = attempts ? `${Math.round(correctAttempts/attempts*100)}%` : "100%";
  document.querySelectorAll(".meter i").forEach((el,i) => el.classList.toggle("on", i < Math.min(mistakes,5)));
  document.querySelector("#hintLabel").textContent = mistakes >= 5 ? "Target square" : mistakes >= 3 ? "Correct piece" : "Independent";
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
document.querySelector("#modalReview").onclick = openReview;
document.querySelector("#reviewPrev").onclick = () => replayLineTo(reviewPly - 1);
document.querySelector("#reviewNext").onclick = () => replayLineTo(reviewPly + 1);
document.querySelector("#reviewPlay").onclick = playReviewLine;
document.querySelector("#soundBtn").onclick = e => { sound = !sound; e.currentTarget.classList.toggle("off",!sound); };
document.querySelectorAll(".style-card").forEach(card => card.onclick = () => {
  style = card.dataset.style; document.querySelectorAll(".style-card").forEach(c=>c.classList.toggle("active",c===card)); renderBoard();
});

document.querySelectorAll("[data-difficulty]").forEach(button => button.onclick = () => {
  activeDifficulty = button.dataset.difficulty;
  document.querySelectorAll("[data-difficulty]").forEach(item => item.classList.toggle("active", item === button));
  renderList();
});
document.querySelector("#categoryFilter").onchange = event => { activeCategory = event.target.value; renderList(); };

async function init() {
  try {
    const response = await fetch("puzzles.json");
    if (!response.ok) throw new Error(`Puzzle library failed to load (${response.status})`);
    puzzles = await response.json();
    const categories = [...new Set(puzzles.map(p => p.category))].sort();
    document.querySelector("#categoryFilter").innerHTML = `<option value="all">All objectives</option>${categories.map(category => `<option value="${category}">${category.replace(/\b\w/g, letter => letter.toUpperCase())}</option>`).join("")}`;
    loadPuzzle(0);
  } catch (error) {
    coach.className = "coach-message error";
    coach.innerHTML = `<span class="message-label">LIBRARY ERROR</span><p>${error.message}</p>`;
  }
}

init();
