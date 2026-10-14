import json
import re
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT.parent / "_OceanofPDF.com_The_Woodpecker_Method_-_Axel_Smith_and_Hans_Tikkanen (1).pdf"
OUTPUT = ROOT / "dist" / "puzzles.json"

PIECE_MAP = {
    "T": "r", "t": "r", "O": "p", "o": "p", "W": "q", "w": "q",
    "M": "n", "m": "n", "V": "b", "v": "b", "L": "k", "l": "k",
    "R": "R", "r": "R", "P": "P", "p": "P", "Q": "Q", "q": "Q",
    "N": "N", "n": "N", "B": "B", "b": "B", "K": "K", "k": "K",
}
RANK_MARKERS = [chr(code) for code in range(0xF0C7, 0xF0BF, -1)]
MOVE_RE = re.compile(
    r"\b(\d{1,3})\.(\.\.)?\s*"
    r"((?:O-O-O|O-O|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?)[+#]?)"
)


def normalize_solution(text: str) -> str:
    table = str.maketrans({"¤": "N", "¦": "R", "¥": "B", "£": "Q", "¢": "K", "†": "+"})
    normalized = " ".join(text.translate(table).replace("", "").split())
    return re.sub(r"\b([KQRBN])\s+x", r"\1x", normalized)


def parse_rank(line: str) -> str:
    cells = line[1:9]
    return "".join(PIECE_MAP.get(chr(ord(char) - 0xF000), "") if ord(char) >= 0xF000 and char not in ("\uf02b",) else "" for char in cells)


def rank_to_fen(line: str) -> str:
    cells = line[1:9]
    output, empty = [], 0
    for char in cells:
        code = chr(ord(char) - 0xF000) if ord(char) >= 0xF000 else char
        piece = PIECE_MAP.get(code)
        if piece:
            if empty:
                output.append(str(empty)); empty = 0
            output.append(piece)
        else:
            empty += 1
    if empty:
        output.append(str(empty))
    return "".join(output)


def extract_exercises(reader: PdfReader):
    exercises = []
    for page_index in range(31, 223):
        text = reader.pages[page_index].extract_text() or ""
        lines = [line.rstrip() for line in text.splitlines()]
        for index, line in enumerate(lines):
            if not line.startswith("\uf0c7"):
                continue
            # Some diagrams contain blank or accessibility-only lines between
            # ranks. Collect the next eight rank markers instead of assuming
            # they are eight consecutive extracted-text lines.
            ranks = []
            cursor = index
            for marker in RANK_MARKERS:
                while cursor < len(lines) and not lines[cursor].startswith(marker):
                    cursor += 1
                if cursor >= len(lines) or cursor - index > 24:
                    break
                ranks.append(lines[cursor])
                cursor += 1
            if len(ranks) != 8:
                continue
            title = "Untitled position"
            for previous in range(index - 1, max(-1, index - 7), -1):
                candidate = lines[previous].strip()
                if candidate and not candidate.isdigit() and not all(ord(c) >= 0xF000 for c in candidate.replace(" ", "")):
                    title = candidate
                    break
            book_page = page_index
            difficulty = "easy" if book_page < 69 else "medium" if book_page < 197 else "hard"
            exercises.append({
                "id": len(exercises) + 1,
                "title": title,
                "difficulty": difficulty,
                "fen_board": "/".join(rank_to_fen(rank) for rank in ranks),
                "source_page": book_page,
            })
    return exercises


def extract_solutions(reader: PdfReader):
    text = "\n".join(reader.pages[index].extract_text() or "" for index in range(223, 380))
    # A plain ``^N.`` pattern also catches move numbers such as ``34. Rg1``.
    # A real solution heading contains a game title (an en dash) and a year,
    # occasionally wrapped onto the following line.
    lines = text.splitlines(keepends=True)
    offsets, offset = [], 0
    for line in lines:
        offsets.append(offset)
        offset += len(line)
    headers = []
    for index, line in enumerate(lines):
        match = re.match(r"^(\d{1,4})\.\s+", line)
        if not match:
            continue
        probe = "".join(lines[index:index + 2])
        if "–" not in probe or not re.search(r"\b(?:18|19|20)\d{2}\b", probe):
            continue
        headers.append((int(match.group(1)), offsets[index] + match.end()))
    solutions = {}
    for position, (number, start) in enumerate(headers):
        if not 1 <= number <= 1128:
            continue
        end = headers[position + 1][1] - len(str(headers[position + 1][0])) - 2 if position + 1 < len(headers) else len(text)
        solutions[number] = normalize_solution(text[start:end])
    return solutions


def board_from_fen(fen_board: str):
    board = {}
    for row_index, row in enumerate(fen_board.split("/")):
        file_index = 0
        for char in row:
            if char.isdigit():
                file_index += int(char)
            else:
                board["abcdefgh"[file_index] + str(8 - row_index)] = char
                file_index += 1
    return board


def clear_path(board, source, target):
    sx, sy = ord(source[0]) - 97, int(source[1])
    tx, ty = ord(target[0]) - 97, int(target[1])
    dx = 0 if tx == sx else 1 if tx > sx else -1
    dy = 0 if ty == sy else 1 if ty > sy else -1
    x, y = sx + dx, sy + dy
    while (x, y) != (tx, ty):
        if chr(x + 97) + str(y) in board:
            return False
        x, y = x + dx, y + dy
    return True


def can_reach(board, source, target, piece, capture, side):
    sx, sy = ord(source[0]) - 97, int(source[1])
    tx, ty = ord(target[0]) - 97, int(target[1])
    dx, dy = tx - sx, ty - sy
    kind = piece.lower()
    occupant = board.get(target)
    if occupant and (occupant.isupper() == piece.isupper()):
        return False
    if capture and not occupant and kind != "p":
        return False
    if not capture and occupant:
        return False
    if kind == "p":
        direction = 1 if side == "white" else -1
        start = 2 if side == "white" else 7
        if capture:
            return abs(dx) == 1 and dy == direction
        return dx == 0 and (dy == direction or (sy == start and dy == 2 * direction and clear_path(board, source, target)))
    if kind == "n": return (abs(dx), abs(dy)) in ((1, 2), (2, 1))
    if kind == "k": return max(abs(dx), abs(dy)) == 1
    if kind == "b": return abs(dx) == abs(dy) and clear_path(board, source, target)
    if kind == "r": return (dx == 0 or dy == 0) and clear_path(board, source, target)
    if kind == "q": return (dx == 0 or dy == 0 or abs(dx) == abs(dy)) and clear_path(board, source, target)
    return False


def resolve_first_move(fen_board: str, side: str, san: str):
    board = board_from_fen(fen_board)
    token = re.sub(r"[+#!?]+$", "", san)
    if token in ("O-O", "O-O-O"):
        rank = "1" if side == "white" else "8"
        return ("e" + rank, ("g" if token == "O-O" else "c") + rank)
    token = re.sub(r"=[QRBN]$", "", token)
    match = re.match(r"^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])$", token)
    if not match:
        return None
    piece_letter, file_hint, rank_hint, capture_mark, target = match.groups()
    piece_letter = piece_letter or "P"
    expected = piece_letter if side == "white" else piece_letter.lower()
    candidates = []
    for square, piece in board.items():
        if piece != expected:
            continue
        if file_hint and square[0] != file_hint: continue
        if rank_hint and square[1] != rank_hint: continue
        if can_reach(board, square, target, piece, bool(capture_mark), side):
            candidates.append(square)
    return (candidates[0], target) if len(candidates) == 1 else None


def classify(solution: str):
    lower = solution.lower()
    if "mate" in lower: return "checkmate"
    if "stalemate" in lower or "draw" in lower or "perpetual" in lower: return "defensive resource"
    if "queen" in lower and ("win" in lower or "takes" in lower): return "win the queen"
    if "exchange" in lower: return "win the exchange"
    if "fork" in lower: return "fork"
    if "pin" in lower: return "pin"
    if "discovered" in lower: return "discovered attack"
    if "deflection" in lower: return "deflection"
    if "trapped" in lower: return "trapped piece"
    if "pawn" in lower and ("win" in lower or "extra" in lower): return "win material"
    if "winning" in lower or "+–" in solution or "–+" in solution: return "gain a decisive advantage"
    return "tactical advantage"


reader = PdfReader(str(PDF))
exercises = extract_exercises(reader)
solutions = extract_solutions(reader)
resolved = 0
for exercise in exercises:
    solution = solutions.get(exercise["id"], "Solution text unavailable.")
    # Introductory prose sometimes cites the opponent's previous move before
    # giving the answer. Pick the first notation token that is legal in the
    # displayed position.
    move = None
    side, san, squares = "white", "", None
    for candidate in MOVE_RE.finditer(solution):
        candidate_side = "black" if candidate.group(2) else "white"
        candidate_san = candidate.group(3)
        candidate_squares = resolve_first_move(exercise["fen_board"], candidate_side, candidate_san)
        if candidate_squares:
            move, side, san, squares = candidate, candidate_side, candidate_san, candidate_squares
            break
    if move is None:
        first_move = MOVE_RE.search(solution)
        side = "black" if first_move and first_move.group(2) else "white"
        san = first_move.group(3) if first_move else ""
    if squares:
        resolved += 1
    exercise.update({
        "side": side,
        "fen": f'{exercise.pop("fen_board")} {"b" if side == "black" else "w"}',
        "category": classify(solution),
        "solution": solution,
        "summary": solution,
        "steps": [[squares[0], squares[1], "student", san, solution]] if squares else [],
        "interactive": bool(squares),
    })

OUTPUT.write_text(json.dumps(exercises, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(json.dumps({"exercises": len(exercises), "solutions": len(solutions), "interactive": resolved, "output": str(OUTPUT)}))
