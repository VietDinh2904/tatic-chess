import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const puzzlePath = path.join(root, "dist", "puzzles.json");
const files = "abcdefgh";
const sanPattern = /(?<![A-Za-z0-9])(?:(?<number>\d{1,3})\.(?<black>\.\.)?\s*)?(?<san>O-O-O|O-O|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]*[!?]*)(?![A-Za-z0-9])/g;

function parseFen(fen) {
  const board = {};
  fen.split(" ")[0].split("/").forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const character of row) {
      if (/\d/.test(character)) fileIndex += Number(character);
      else board[`${files[fileIndex++]}${8 - rowIndex}`] = character;
    }
  });
  return board;
}

function coordinates(square) {
  return [files.indexOf(square[0]), Number(square[1])];
}

function clearPath(board, source, target) {
  const [sx, sy] = coordinates(source);
  const [tx, ty] = coordinates(target);
  const dx = Math.sign(tx - sx), dy = Math.sign(ty - sy);
  let x = sx + dx, y = sy + dy;
  while (x !== tx || y !== ty) {
    if (board[`${files[x]}${y}`]) return false;
    x += dx; y += dy;
  }
  return true;
}

function attacks(board, source, target) {
  const piece = board[source];
  const [sx, sy] = coordinates(source);
  const [tx, ty] = coordinates(target);
  const dx = tx - sx, dy = ty - sy, kind = piece.toLowerCase();
  if (kind === "p") return Math.abs(dx) === 1 && dy === (piece === piece.toUpperCase() ? 1 : -1);
  if (kind === "n") return [[1, 2], [2, 1]].some(([x, y]) => Math.abs(dx) === x && Math.abs(dy) === y);
  if (kind === "k") return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
  if (kind === "b") return Math.abs(dx) === Math.abs(dy) && clearPath(board, source, target);
  if (kind === "r") return (dx === 0 || dy === 0) && clearPath(board, source, target);
  return (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && clearPath(board, source, target);
}

function kingSafe(board, side) {
  const king = side === "white" ? "K" : "k";
  const kingSquare = Object.keys(board).find(square => board[square] === king);
  if (!kingSquare) return true;
  return !Object.keys(board).some(source => {
    const piece = board[source];
    return (piece === piece.toUpperCase()) !== (side === "white") && attacks(board, source, kingSquare);
  });
}

function makeMove(board, source, target, promotion = null) {
  const result = { ...board };
  let moving = result[source];
  delete result[source];
  if (moving.toLowerCase() === "p" && source[0] !== target[0] && !result[target]) delete result[target[0] + source[1]];
  if (moving.toLowerCase() === "k" && Math.abs(source.charCodeAt(0) - target.charCodeAt(0)) === 2) {
    const rank = source[1], kingSide = target[0] === "g";
    const rookFrom = `${kingSide ? "h" : "a"}${rank}`;
    const rookTo = `${kingSide ? "f" : "d"}${rank}`;
    if (result[rookFrom]) { result[rookTo] = result[rookFrom]; delete result[rookFrom]; }
  }
  delete result[target];
  if (promotion) moving = moving === moving.toUpperCase() ? promotion.toUpperCase() : promotion.toLowerCase();
  result[target] = moving;
  return result;
}

function resolve(board, side, san) {
  let token = san.replace(/[+#?!]+$/g, "");
  if (token === "O-O" || token === "O-O-O") {
    const rank = side === "white" ? "1" : "8";
    return [`e${rank}`, `${token === "O-O" ? "g" : "c"}${rank}`, null];
  }
  const promotion = token.match(/=([QRBN])$/)?.[1] || null;
  token = token.replace(/=[QRBN]$/, "");
  const match = token.match(/^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])$/);
  if (!match) return null;
  const [, letter, fileHint, rankHint, capture, target] = match;
  const wanted = side === "white" ? (letter || "P") : (letter || "P").toLowerCase();
  const candidates = [];
  for (const [source, piece] of Object.entries(board)) {
    if (piece !== wanted || (fileHint && source[0] !== fileHint) || (rankHint && source[1] !== rankHint)) continue;
    const [sx, sy] = coordinates(source), [tx, ty] = coordinates(target);
    const dx = tx - sx, dy = ty - sy, occupant = board[target], kind = piece.toLowerCase();
    if (occupant && (occupant === occupant.toUpperCase()) === (piece === piece.toUpperCase())) continue;
    let valid = false;
    if (kind === "p") {
      const direction = side === "white" ? 1 : -1;
      const startRank = side === "white" ? 2 : 7;
      valid = capture ? Math.abs(dx) === 1 && dy === direction :
        dx === 0 && !occupant && (dy === direction || (sy === startRank && dy === 2 * direction && clearPath(board, source, target)));
    } else if (capture && !occupant) valid = false;
    else if (kind === "n") valid = [[1, 2], [2, 1]].some(([x, y]) => Math.abs(dx) === x && Math.abs(dy) === y);
    else if (kind === "k") valid = Math.max(Math.abs(dx), Math.abs(dy)) === 1;
    else if (kind === "b") valid = Math.abs(dx) === Math.abs(dy) && clearPath(board, source, target);
    else if (kind === "r") valid = (dx === 0 || dy === 0) && clearPath(board, source, target);
    else valid = (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && clearPath(board, source, target);
    if (valid && kingSafe(makeMove(board, source, target, promotion), side)) candidates.push(source);
  }
  return candidates.length === 1 ? [candidates[0], target, promotion] : null;
}

function nextTurn(state) {
  return state.side === "white"
    ? { side: "black", fullmove: state.fullmove }
    : { side: "white", fullmove: state.fullmove + 1 };
}

function pathKey(path) {
  return path.map(move => `${move[0]}${move[1]}:${move[2]}`).join("|");
}

function beginsWith(path, prefix) {
  return prefix.every((move, index) => path[index] && path[index][0] === move[0] && path[index][1] === move[1]);
}

function buildLines(puzzle, original) {
  const matches = [...puzzle.solution.matchAll(sanPattern)];
  if (!original.length) return [];
  const initialBoard = parseFen(puzzle.fen);
  let startIndex = -1, startFullmove = 1;
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index], groups = match.groups;
    const explicitSide = groups.number ? (groups.black ? "black" : "white") : puzzle.side;
    if (explicitSide !== puzzle.side) continue;
    const resolved = resolve(initialBoard, puzzle.side, groups.san);
    if (resolved && resolved[0] === original[0][0] && resolved[1] === original[0][1]) {
      startIndex = index;
      startFullmove = Number(groups.number || 1);
      break;
    }
  }
  if (startIndex < 0) return [{ label: "Main line", moves: original.map(step => [step[0], step[1], step[3]]) }];

  let serial = 0;
  const rootState = { id: serial++, board: initialBoard, side: puzzle.side, fullmove: startFullmove, path: [], children: 0 };
  const byTurn = new Map([[`${startFullmove}:${puzzle.side}`, [rootState]]]);
  let currentState = rootState;
  const allStates = [rootState];

  for (const match of matches.slice(startIndex)) {
    const groups = match.groups;
    const hasNumber = Boolean(groups.number);
    const targetSide = hasNumber ? (groups.black ? "black" : "white") : null;
    const targetFullmove = hasNumber ? Number(groups.number) : null;
    const turnKey = hasNumber ? `${targetFullmove}:${targetSide}` : null;
    const indexedCandidates = hasNumber ? (byTurn.get(turnKey) || []) : [currentState];
    const currentMatchesTurn = hasNumber && currentState.fullmove === targetFullmove && currentState.side === targetSide;
    const candidates = currentMatchesTurn
      ? [currentState, ...indexedCandidates.filter(item => item !== currentState)]
      : indexedCandidates;
    let result = null;
    for (const candidate of candidates) {
      const resolved = resolve(candidate.board, candidate.side, groups.san);
      if (!resolved) continue;
      const [source, target, promotion] = resolved;
      const path = [...candidate.path, [source, target, groups.san]];
      if (path.length > 80) continue;
      candidate.children++;
      const turn = nextTurn(candidate);
      const state = { id: serial++, board: makeMove(candidate.board, source, target, promotion), side: turn.side, fullmove: turn.fullmove, path, children: 0 };
      allStates.push(state);
      const nextKey = `${state.fullmove}:${state.side}`;
      const bucket = byTurn.get(nextKey) || [];
      if (!bucket.some(item => pathKey(item.path) === pathKey(path))) bucket.push(state);
      byTurn.set(nextKey, bucket.slice(-120));
      result = state;
      break;
    }
    if (result) currentState = result;
  }

  let paths = allStates.filter(state => state.path.length && state.children === 0).map(state => state.path);
  paths.push(original.map(step => [step[0], step[1], step[3]]));
  const unique = [...new Map(paths.map(path => [pathKey(path), path])).values()];
  paths = unique.filter(path => !unique.some(other => other.length > path.length && beginsWith(other, path)));
  const mainCandidates = paths.filter(path => beginsWith(path, original));
  const main = (mainCandidates.length ? mainCandidates : [original.map(step => [step[0], step[1], step[3]])])
    .sort((a, b) => b.length - a.length)[0];
  const alternatives = paths.filter(path => pathKey(path) !== pathKey(main)).sort((a, b) => b.length - a.length);
  return [main, ...alternatives].map((moves, index) => ({ label: index ? `Variation ${index}` : "Main line", moves }));
}

const puzzles = JSON.parse(fs.readFileSync(puzzlePath, "utf8"));
const committedPuzzles = JSON.parse(execFileSync("git", ["show", "HEAD:dist/puzzles.json"], { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }));
const committedById = new Map(committedPuzzles.map(puzzle => [puzzle.id, puzzle]));
let extended = 0, totalLines = 0;
for (const puzzle of puzzles) {
  const original = committedById.get(puzzle.id)?.steps || puzzle.steps || [];
  puzzle.steps = original;
  puzzle.solution_start_move = Number(puzzle.solution.match(/\b(\d+)\.(?:\.\.)?/)?.[1] || 1);
  const lines = buildLines(puzzle, original);
  puzzle.solution_lines = lines;
  totalLines += lines.length;
  const main = lines[0]?.moves || [];
  if (main.length > puzzle.steps.length && beginsWith(main, puzzle.steps)) {
    puzzle.steps = main.map((move, index) => [
      move[0], move[1], index % 2 === 0 ? "student" : "coach", move[2],
      index % 2 === 0 ? `Correct: ${move[2]}. Continue the line.` : `The opponent replies ${move[2]}.`
    ]);
    extended++;
  }
}
fs.writeFileSync(puzzlePath, JSON.stringify(puzzles), "utf8");
console.log(JSON.stringify({ puzzles: puzzles.length, totalLines, extended }, null, 2));
