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
    updatePirouette();
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
    const tiredIndicator = document.getElementById("tiredness-indicator");
    tiredIndicator.textContent = `${jevil.tiredness}/9`;
    const isTooTired = jevil.tiredness >= 9;
    if (isTooTired) {
        tiredIndicator.className = "highlightpositive";
    }

    const turnIndicator = document.getElementById("turn-elapsed-indicator");
    const requiredTurns = 30 - Math.floor(jevil.tiredness);
    turnIndicator.textContent = `${turnsElapsed}/${requiredTurns}`;
    const spentTooLong = turnsElapsed >= requiredTurns && battlePhase === 5;
    if (spentTooLong) {
        turnIndicator.className = "highlightpositive";
    }

    if (isTooTired || spentTooLong) {
        setSparable();
    }
}

function setSparable() {
    const el = document.getElementById("can-spare-text")
    el.textContent = "CAN";
    el.className = "highlightpositive";
}

function updatePirouette() {
    const effectTable = [
        [false, "36-50 HP heal to all party members"],
        [false, "No combat effect (random SFX)"],
        [false, "Lowers Jevil's Defense by 4"],
        [true, "60% less invincibility for the turn"],
        [false, "Lowers Jevil's Attack by 30% for the turn"],
        [false, "No combat effect (bird flies)"],
        [false, "25-55 HP heal to a random party member"],
        [true, "Party's HP bars are shuffled"],
        [true, "Increases Jevil's Attack by 25% for the turn"],
    ];
    const [isNegative, effectDescription] = effectTable[turnsElapsed % 9];
    const el = document.getElementById("piro-effect");
    el.textContent = effectDescription;
    if (isNegative) {
        el.className = "highlightnegative";
    } else {
        el.className = "highlightpositive";
    }
}

//---------------------//
// ON-LOAD INITIALIZER //
//---------------------//

function onLoad() {
    document.getElementById("pirouette").addEventListener("click", () => {});
    document.getElementById("hypnosis").addEventListener("click", () => {});
    document.getElementById("turn-none").addEventListener("click", () => {});

    advanceTurn();
}

window.addEventListener("load", onLoad);
