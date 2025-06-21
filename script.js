var turnsElapsed = 0;
var turnsOnCurrentPhase = 0;
var battlePhase = 1;

/** Representation of Jevil's statistics. */
var jevil = {
    hp: 3500,
    at: 10,
    tiredness: 0,
};

function advanceTurn() {
    turnsElapsed += 1;
    turnsOnCurrentPhase += 1;

    document.getElementById("turn-num").textContent = turnsElapsed;

    const previousPhase = battlePhase;
    recomputeBattlePhase();
    if (previousPhase !== battlePhase) {
        turnsOnCurrentPhase = 1;
    }
    document.getElementById("phase-num").textContent = battlePhase;

    updateSpareConditions();
}

function recomputeBattlePhase() {
    // Don't exit from Phase 5
    if (battlePhase === 5) { return }

    if (battlePhase === 4 && turnsOnCurrentPhase === 5) {
        battlePhase = 5;
    } else if (jevil.tiredness >= 6) {
        battlePhase = 4;
    } else if (jevil.tiredness >= 4) {
        battlePhase = 3;
    } else if (jevil.tiredness >= 2) {
        battlePhase = 2;
    } else {
        battlePhase = 1;
    }
}

function updateSpareConditions() {
    document.getElementById("tiredness").textContent = jevil.tiredness;
    document.getElementById("elapsed-turns").textContent = turnsElapsed;
    const requiredTurns = 30 - Math.floor(jevil.tiredness);
    document.getElementById("turns-required").textContent = requiredTurns;

    const isTooTired = jevil.tiredness >= 9;
    const spentTooLong = turnsElapsed >= requiredTurns && battlePhase === 5;
    if (isTooTired || spentTooLong) {
        setSparable();
    }
}

function setSparable() {
    const el = document.getElementById("can-spare-text")
    el.textContent = "CAN";
    el.className = "sparable";
}

function onLoad() {
    document.getElementById("pirouette").addEventListener("click", () => {
        jevil.tiredness += 0.5;
        advanceTurn();
    });
    document.getElementById("hypnosis").addEventListener("click", () => {
        jevil.tiredness += 1;
        advanceTurn();
    });
    document.getElementById("turn-none").addEventListener("click", () => {
        advanceTurn();
    });

    advanceTurn();
}

window.addEventListener("load", onLoad);
