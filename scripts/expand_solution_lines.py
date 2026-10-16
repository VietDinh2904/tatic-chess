"""Expand the extracted Woodpecker solutions into playable multi-ply lines.

The PDF stores the solution as prose.  This script follows the first legal SAN
line from the displayed position and stops before a repeated move number (the
usual signal that a side variation has started).  The hand-reviewed demo lines
remain authoritative for puzzles 1-10.
"""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUZZLES = ROOT / "dist" / "puzzles.json"
FILES = "abcdefgh"
SAN_RE = re.compile(
    r"(?<![A-Za-z0-9])(?:(?P<number>\d{1,3})\.(?P<black>\.\.)?\s*)?"
    r"(?P<san>O-O-O|O-O|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]*[!?]*)"
    r"(?![A-Za-z0-9])"
)


MANUAL = {
    1: [("h8", "h2", "student", "Rxh2+", "Excellent sacrifice — the king is drawn into the mating net."),
        ("h1", "h2", "coach", "Kxh2", "White is forced to accept the rook."),
        ("a8", "h8", "student", "Rh8#", "The remaining rook finishes the combination.")],
    2: [("f3", "f8", "student", "Rf8+", "The rook breaks into the eighth rank with check."),
        ("d6", "f8", "coach", "Bxf8", "Black's bishop is forced to take the rook."),
        ("d5", "d6", "student", "d6+", "The pawn keeps the king under pressure."),
        ("f8", "e6", "coach", "Be6", "Black has only one useful block."),
        ("c4", "e6", "student", "Bxe6#", "The bishop completes the mating line.")],
    3: [("e3", "f4", "student", "Bxf4", "The pinned bishop cannot protect the tactical target."),
        ("e5", "f4", "coach", "exf4", "Black accepts the structural damage."),
        ("e4", "e5", "student", "e5", "The pawn fork secures the extra piece.")],
    4: [("d6", "d2", "student", "Rd2+", "The intermezzo check leaves the queen undefended.")],
    5: [("c4", "f7", "student", "Bxf7+", "The bishop draws the king away from e8."),
        ("e8", "f7", "coach", "Kxf7", "The king is forced to capture."),
        ("f3", "e5", "student", "Nxe5+", "The knight takes the centre with check.")],
    6: [("c1", "c6", "student", "Rxc6", "The rook removes the key defender."),
        ("b7", "c6", "coach", "bxc6", "The b-pawn is forced to recapture."),
        ("d2", "a5", "student", "Ba5", "The bishop pins the queen and wins material.")],
    7: [("f4", "f3", "student", "f3", "The pawn overloads the white queen."),
        ("e2", "f3", "coach", "Qxf3", "The queen must deal with the dangerous pawn."),
        ("c8", "c4", "student", "Rxc4", "The rook wins the loose bishop.")],
    8: [("e6", "c4", "student", "Qxc4", "The queen trade prepares a fork."),
        ("e2", "c4", "coach", "Qxc4", "White accepts the exchange."),
        ("g4", "e3", "student", "Ne3+", "The knight checks and forks the queen."),
        ("f1", "e2", "coach", "Ke2", "The king steps away from check."),
        ("e3", "c4", "student", "Nxc4", "The knight collects the queen.")],
    9: [("d3", "d7", "student", "Rxd7", "The rook removes the knight blocking the a-pawn."),
        ("c6", "d7", "coach", "Kxd7", "The king is forced to recapture."),
        ("c4", "b5", "student", "Kb5", "The king escorts the winning outside pawn.")],
    10: [("e7", "f6", "student", "Qxf6+", "The queen sacrifice opens the mating diagonal."),
         ("g7", "f6", "coach", "gxf6", "Black has no better choice."),
         ("a3", "f8", "student", "Bf8#", "The bishop delivers mate.")],
}


def parse_fen(fen):
    board = {}
    for row, rank in zip(fen.split()[0].split("/"), range(8, 0, -1)):
        file_index = 0
        for char in row:
            if char.isdigit():
                file_index += int(char)
            else:
                board[f"{FILES[file_index]}{rank}"] = char
                file_index += 1
    return board


def xy(square):
    return FILES.index(square[0]), int(square[1])


def clear_path(board, source, target):
    sx, sy = xy(source); tx, ty = xy(target)
    dx = 0 if tx == sx else 1 if tx > sx else -1
    dy = 0 if ty == sy else 1 if ty > sy else -1
    x, y = sx + dx, sy + dy
    while (x, y) != (tx, ty):
        if f"{FILES[x]}{y}" in board:
            return False
        x += dx; y += dy
    return True


def attacks(board, source, target):
    piece = board[source]; sx, sy = xy(source); tx, ty = xy(target)
    dx, dy, kind = tx - sx, ty - sy, piece.lower()
    if kind == "p":
        return abs(dx) == 1 and dy == (1 if piece.isupper() else -1)
    if kind == "n": return (abs(dx), abs(dy)) in ((1, 2), (2, 1))
    if kind == "k": return max(abs(dx), abs(dy)) == 1
    if kind == "b": return abs(dx) == abs(dy) and clear_path(board, source, target)
    if kind == "r": return (dx == 0 or dy == 0) and clear_path(board, source, target)
    if kind == "q": return (dx == 0 or dy == 0 or abs(dx) == abs(dy)) and clear_path(board, source, target)
    return False


def king_safe(board, side):
    king = "K" if side == "white" else "k"
    square = next((sq for sq, piece in board.items() if piece == king), None)
    if not square:
        return True
    return not any(piece.isupper() != (side == "white") and attacks(board, source, square)
                   for source, piece in board.items())


def make_move(board, source, target, promotion=None):
    result = dict(board); moving = result.pop(source)
    if moving.lower() == "p" and source[0] != target[0] and target not in result:
        result.pop(target[0] + source[1], None)
    if moving.lower() == "k" and abs(ord(source[0]) - ord(target[0])) == 2:
        rank, king_side = source[1], target[0] == "g"
        rook_from = ("h" if king_side else "a") + rank
        rook_to = ("f" if king_side else "d") + rank
        if rook_from in result:
            result[rook_to] = result.pop(rook_from)
    result.pop(target, None)
    if promotion:
        moving = promotion.upper() if moving.isupper() else promotion.lower()
    result[target] = moving
    return result


def resolve(board, side, san):
    token = re.sub(r"[+#?!]+$", "", san)
    if token in ("O-O", "O-O-O"):
        rank = "1" if side == "white" else "8"
        return "e" + rank, ("g" if token == "O-O" else "c") + rank, None
    promotion_match = re.search(r"=([QRBN])$", token)
    promotion = promotion_match.group(1) if promotion_match else None
    token = re.sub(r"=[QRBN]$", "", token)
    match = re.match(r"^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])$", token)
    if not match:
        return None
    letter, file_hint, rank_hint, capture, target = match.groups()
    wanted = letter or "P"
    wanted = wanted if side == "white" else wanted.lower()
    candidates = []
    for source, piece in board.items():
        if piece != wanted or file_hint and source[0] != file_hint or rank_hint and source[1] != rank_hint:
            continue
        sx, sy = xy(source); tx, ty = xy(target); dx, dy = tx - sx, ty - sy
        occupant, kind = board.get(target), piece.lower()
        if occupant and occupant.isupper() == piece.isupper():
            continue
        if kind == "p":
            direction, start = (1, 2) if side == "white" else (-1, 7)
            valid = (abs(dx) == 1 and dy == direction) if capture else (
                dx == 0 and not occupant and (dy == direction or sy == start and dy == 2 * direction and clear_path(board, source, target)))
        elif capture and not occupant:
            valid = False
        elif kind == "n": valid = (abs(dx), abs(dy)) in ((1, 2), (2, 1))
        elif kind == "k": valid = max(abs(dx), abs(dy)) == 1
        elif kind == "b": valid = abs(dx) == abs(dy) and clear_path(board, source, target)
        elif kind == "r": valid = (dx == 0 or dy == 0) and clear_path(board, source, target)
        else: valid = (dx == 0 or dy == 0 or abs(dx) == abs(dy)) and clear_path(board, source, target)
        if valid and king_safe(make_move(board, source, target, promotion), side):
            candidates.append(source)
    return (candidates[0], target, promotion) if len(candidates) == 1 else None


def expand(puzzle):
    if puzzle["id"] in MANUAL:
        return [list(step) for step in MANUAL[puzzle["id"]]]
    original = puzzle.get("steps") or []
    if not original:
        return []
    board, side = parse_fen(puzzle["fen"]), puzzle["side"]
    tokens = list(SAN_RE.finditer(puzzle.get("solution", "")))
    expected_from, expected_to = original[0][:2]
    start_index = None
    for index, match in enumerate(tokens):
        explicit_side = "black" if match.group("black") else "white" if match.group("number") else side
        if explicit_side != side:
            continue
        resolved = resolve(board, side, match.group("san"))
        if resolved and resolved[:2] == (expected_from, expected_to):
            start_index = index; break
    if start_index is None:
        return original
    steps, expected_number = [], None
    for match in tokens[start_index:]:
        number = int(match.group("number")) if match.group("number") else None
        explicit_side = "black" if match.group("black") else "white" if number else side
        if number is not None:
            if expected_number is not None and (number != expected_number or explicit_side != side):
                break
            expected_number = number
        resolved = resolve(board, side, match.group("san"))
        if not resolved:
            if number is not None:
                break
            continue
        source, target, promotion = resolved
        role = "student" if side == puzzle["side"] else "coach"
        note = (f"Correct: {match.group('san')}. Continue the tactical line."
                if role == "student" else f"The opponent replies {match.group('san')}.")
        steps.append([source, target, role, match.group("san"), note])
        board = make_move(board, source, target, promotion)
        if side == "black" and expected_number is not None:
            expected_number += 1
        side = "black" if side == "white" else "white"
        if len(steps) >= 12:
            break
    return steps or original


puzzles = json.loads(PUZZLES.read_text(encoding="utf-8"))
for puzzle in puzzles:
    puzzle["steps"] = expand(puzzle)
    puzzle["interactive"] = bool(puzzle["steps"])
PUZZLES.write_text(json.dumps(puzzles, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

distribution = {}
for puzzle in puzzles:
    distribution[len(puzzle["steps"])] = distribution.get(len(puzzle["steps"]), 0) + 1
print(json.dumps({"puzzles": len(puzzles), "step_distribution": distribution}, sort_keys=True))
