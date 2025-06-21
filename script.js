var turnsElapsed = 0;
var battlePhase = 1;

/** Representation of Jevil's statistics. */
var jevil = {
    hp: 3500,
    at: 10,
    tiredness: 0,
};

function advanceTurn() {
    turnsElapsed += 1;

    document.getElementById("turn-num").textContent = turnsElapsed;
    document.getElementById("phase-num").textContent = battlePhase;
}

function onLoad() {
    advanceTurn();
}

window.addEventListener("load", onLoad);
