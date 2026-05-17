"""
Cricket tools used by agents via Gemini function calling.
"""

import math


def calculate_win_probability(
    innings: int,
    over: int,
    current_score: int,
    wickets: int,
    target: int,
    required_run_rate: float,
    dew_factor: int,
    pitch_conditions: str,
) -> str:
    """
    Calculate the current win probability for the batting team.

    Args:
        innings: 1 or 2.
        over: Current over number (1-20).
        current_score: Runs scored so far.
        wickets: Wickets fallen.
        target: Target score (2nd innings only, pass 0 for 1st innings).
        required_run_rate: Required run rate (2nd innings, pass 0 for 1st innings).
        dew_factor: Dew intensity 0-10 (higher = wetter ball).
        pitch_conditions: One of 'flat', 'turning', 'two-paced', 'seaming', 'dusty'.

    Returns:
        Win probability and brief context as a formatted string.
    """
    overs_remaining = max(20 - over, 0)
    wickets_remaining = 10 - wickets

    if innings == 1:
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
        if not target or target == 0:
            return "Win probability: 50% (target not provided)."
        runs_needed = target - current_score
        if runs_needed <= 0:
            return "Win probability: 99% — batting team has already won."
        if overs_remaining == 0:
            return "Win probability: 1% — innings over, batting team lost."

        required_rr_actual = runs_needed / overs_remaining if overs_remaining > 0 else 999
        rr_ratio = required_rr_actual / 8.5
        base_prob = max(5, min(95, 100 - rr_ratio * 45))
        wicket_penalty = (10 - wickets_remaining) * 4
        dew_bonus = dew_factor * 1.2
        win_prob = max(5, min(95, base_prob - wicket_penalty + dew_bonus))
        return (
            f"Batting team win probability (2nd innings): {win_prob:.0f}%. "
            f"Need {runs_needed} off {overs_remaining} overs (RRR: {required_rr_actual:.2f}). "
            f"Wickets remaining: {wickets_remaining}/10. "
            f"Dew factor: {dew_factor}/10 ({'favours batting' if dew_factor > 5 else 'manageable'})."
        )
