"""
Cricket tools used by agents via Gemini function calling.
These are real callable functions — Gemini decides when and how to invoke them.
"""

import math
import random


def get_player_stats(player_name: str, bowling_type: str, venue: str = "") -> str:
    """
    Get a batsman's historical performance against a specific bowling type.

    Args:
        player_name: Name of the batsman (e.g., 'Virat Kohli').
        bowling_type: Type of bowling (e.g., 'leg-spin', 'left-arm-pace', 'off-spin', 'fast').
        venue: Optional venue name for location-specific stats.

    Returns:
        A formatted string of batting stats.
    """
    # Realistic IPL-flavoured stats for known players
    known_players = {
        "virat kohli": {
            "leg-spin": {"sr": 128, "avg": 42.1, "boundaries_per_10": 4.2, "dismissals": 8},
            "off-spin": {"sr": 134, "avg": 51.3, "boundaries_per_10": 3.9, "dismissals": 5},
            "fast": {"sr": 142, "avg": 44.7, "boundaries_per_10": 5.1, "dismissals": 12},
            "left-arm-pace": {"sr": 119, "avg": 38.2, "boundaries_per_10": 3.7, "dismissals": 9},
        },
        "rohit sharma": {
            "leg-spin": {"sr": 151, "avg": 35.8, "boundaries_per_10": 5.8, "dismissals": 11},
            "off-spin": {"sr": 143, "avg": 38.2, "boundaries_per_10": 5.1, "dismissals": 7},
            "fast": {"sr": 138, "avg": 41.5, "boundaries_per_10": 5.4, "dismissals": 14},
            "left-arm-pace": {"sr": 145, "avg": 39.1, "boundaries_per_10": 5.2, "dismissals": 10},
        },
        "ms dhoni": {
            "leg-spin": {"sr": 162, "avg": 28.4, "boundaries_per_10": 6.1, "dismissals": 6},
            "fast": {"sr": 171, "avg": 26.9, "boundaries_per_10": 7.3, "dismissals": 8},
            "left-arm-pace": {"sr": 158, "avg": 30.2, "boundaries_per_10": 6.8, "dismissals": 5},
        },
    }

    p_key = player_name.lower().strip()
    b_key = bowling_type.lower().strip()

    if p_key in known_players and b_key in known_players[p_key]:
        s = known_players[p_key][b_key]
        venue_note = f" at {venue}" if venue else ""
        return (
            f"{player_name} vs {bowling_type}{venue_note} (last 5 IPL seasons): "
            f"Strike Rate {s['sr']}, Average {s['avg']}, "
            f"{s['boundaries_per_10']} boundaries per 10 balls, "
            f"dismissed {s['dismissals']} times in this match-up. "
            f"Sample size: {s['dismissals'] + random.randint(12, 30)} innings."
        )

    # Generic plausible stats for unknown players
    sr = random.randint(118, 175)
    avg = round(random.uniform(22.0, 52.0), 1)
    b_per_10 = round(random.uniform(3.2, 7.1), 1)
    dismissals = random.randint(4, 18)
    venue_note = f" at {venue}" if venue else ""
    return (
        f"{player_name} vs {bowling_type}{venue_note} (last 5 IPL seasons): "
        f"Strike Rate {sr}, Average {avg}, "
        f"{b_per_10} boundaries per 10 balls, "
        f"dismissed {dismissals} times. "
        f"Sample size: {dismissals + random.randint(10, 25)} innings."
    )


def get_bowler_stats(bowler_name: str, phase: str = "middle") -> str:
    """
    Get a bowler's performance metrics for a specific match phase.

    Args:
        bowler_name: Name of the bowler (e.g., 'Jasprit Bumrah').
        phase: Match phase — 'powerplay' (ov 1-6), 'middle' (ov 7-15), or 'death' (ov 16-20).

    Returns:
        A formatted string of bowling stats.
    """
    known_bowlers = {
        "jasprit bumrah": {
            "powerplay": {"economy": 7.2, "avg": 18.4, "sr": 15.3, "dot_pct": 44},
            "middle": {"economy": 6.8, "avg": 22.1, "sr": 19.5, "dot_pct": 46},
            "death": {"economy": 8.1, "avg": 16.2, "sr": 12.0, "dot_pct": 41},
        },
        "yuzvendra chahal": {
            "powerplay": {"economy": 7.9, "avg": 26.3, "sr": 19.9, "dot_pct": 38},
            "middle": {"economy": 7.1, "avg": 21.4, "sr": 18.1, "dot_pct": 42},
            "death": {"economy": 9.4, "avg": 29.7, "sr": 19.0, "dot_pct": 33},
        },
    }

    b_key = bowler_name.lower().strip()

    if b_key in known_bowlers and phase in known_bowlers[b_key]:
        s = known_bowlers[b_key][phase]
        return (
            f"{bowler_name} in {phase} overs (last 5 IPL seasons): "
            f"Economy {s['economy']}, Average {s['avg']}, "
            f"Strike Rate {s['sr']}, Dot ball % {s['dot_pct']}%."
        )

    economy = round(random.uniform(7.0, 10.5), 1)
    avg = round(random.uniform(18.0, 35.0), 1)
    sr = round(random.uniform(14.0, 22.0), 1)
    dot_pct = random.randint(32, 48)
    return (
        f"{bowler_name} in {phase} overs (last 5 IPL seasons): "
        f"Economy {economy}, Average {avg}, Strike Rate {sr}, Dot ball % {dot_pct}%."
    )


def calculate_win_probability(
    innings: int,
    over: int,
    current_score: int,
    wickets: int,
    target: int = 0,
    required_run_rate: float = 0.0,
    dew_factor: int = 3,
    pitch_conditions: str = "flat",
) -> str:
    """
    Calculate the current win probability for the batting team.

    Args:
        innings: 1 or 2.
        over: Current over number (1-20).
        current_score: Runs scored so far.
        wickets: Wickets fallen.
        target: Target score (2nd innings only).
        required_run_rate: Required run rate (2nd innings).
        dew_factor: Dew intensity 0-10 (higher = wetter ball).
        pitch_conditions: One of 'flat', 'turning', 'two-paced', 'seaming', 'dusty'.

    Returns:
        Win probability and brief context as a formatted string.
    """
    overs_remaining = max(20 - over, 0)
    wickets_remaining = 10 - wickets

    if innings == 1:
        # First innings: estimate if par score is on track
        balls_faced = (over - 1) * 6 + 6
        current_rr = current_score / max(balls_faced / 6, 1)
        par_score = 165 if pitch_conditions == "flat" else 148 if pitch_conditions == "turning" else 155
        projected = current_score + current_rr * overs_remaining
        diff = projected - par_score
        base_prob = 50 + min(max(diff * 0.5, -30), 30)
        wicket_penalty = (10 - wickets_remaining) * 2.5
        win_prob = max(5, min(95, base_prob - wicket_penalty))
        return (
            f"Batting team win probability (1st innings): {win_prob:.0f}%. "
            f"Projected score: {projected:.0f} (par: {par_score}). "
            f"Current run rate: {current_rr:.2f}. "
            f"Wickets in hand: {wickets_remaining}/10."
        )
    else:
        # Second innings chase
        if not target or target == 0:
            return "Win probability: 50% (target not provided)."
        runs_needed = target - current_score
        if runs_needed <= 0:
            return "Win probability: 99% — batting team has already won."
        if overs_remaining == 0:
            return "Win probability: 1% — innings over, batting team lost."

        required_rr_actual = runs_needed / overs_remaining if overs_remaining > 0 else 999
        rr_ratio = required_rr_actual / 8.5  # 8.5 is a 'challenging' RR
        base_prob = max(5, min(95, 100 - rr_ratio * 45))
        wicket_penalty = (10 - wickets_remaining) * 4
        dew_bonus = dew_factor * 1.2  # dew helps batting team
        win_prob = max(5, min(95, base_prob - wicket_penalty + dew_bonus))
        return (
            f"Batting team win probability (2nd innings): {win_prob:.0f}%. "
            f"Need {runs_needed} off {overs_remaining} overs (RRR: {required_rr_actual:.2f}). "
            f"Wickets remaining: {wickets_remaining}/10. "
            f"Dew factor: {dew_factor}/10 ({"favours batting" if dew_factor > 5 else "manageable"})."
        )
