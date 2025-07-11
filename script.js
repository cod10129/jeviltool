var turnsElapsed = 0;
var turnsOnCurrentPhase = 0;
var battlePhase = 1;

var pirouetteCycleCounter = 0;

/** Representation of Jevil's statistics. */
var jevil = {
    hp: 3500,
    at: 10,
    tiredness: 0,
};

function advanceTurn() {
    turnsElapsed += 1;
    turnsOnCurrentPhase += 1;

    updateTurnsOnPhase();
    updateVisibleState();
}

function updateVisibleState() {
    document.getElementById("turn-num").textContent = turnsElapsed;
    recomputeBattlePhase();
    document.getElementById("phase-num").textContent = battlePhase;
    updateSpareConditions();
    updatePirouette();
}

function recomputeBattlePhase() {
    // Don't exit from Phase 5
    if (battlePhase === 5) { return }
    // Only change phases if the current one is complete
    if (turnsOnCurrentPhase < 5) { return }

    if (battlePhase === 4) {
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

function updateTurnsOnPhase() {
    const previousPhase = battlePhase;
    recomputeBattlePhase();
    if (previousPhase !== battlePhase) {
        turnsOnCurrentPhase = 1;
    }
}

function updateSpareConditions() {
    const tiredIndicator = document.getElementById("tiredness-indicator");
    tiredIndicator.textContent = `${jevil.tiredness}/9`;
    const isTooTired = jevil.tiredness >= 9;
    if (isTooTired) {
        tiredIndicator.className = "highlightpositive";
    } else {
        tiredIndicator.className = "";
    }

    const turnIndicator = document.getElementById("turn-elapsed-indicator");
    const requiredTurns = 30 - Math.floor(jevil.tiredness);
    turnIndicator.textContent = `${turnsElapsed}/${requiredTurns}`;
    const spentTooLong = turnsElapsed >= requiredTurns && battlePhase === 5;
    if (spentTooLong) {
        turnIndicator.className = "highlightpositive";
    } else {
        turnIndicator.className = "";
    }

    if (isTooTired || spentTooLong) {
        setSparable();
    } else {
        setUnsparable();
    }
}

function setSparable() {
    const el = document.getElementById("can-spare-text");
    el.textContent = "CAN";
    el.className = "highlightpositive";
}

function setUnsparable() {
    const el = document.getElementById("can-spare-text");
    el.textContent = "cannot";
    el.className = "";
}

function pirouetteCycleStep() {
    pirouetteCycleCounter += 1;
    if (pirouetteCycleCounter > 8) {
        pirouetteCycleCounter = 0;
    }
}

function updatePirouette() {
    const effectTable = [false, false, true, false, false, false, true, true, false];
    const container = document.getElementById("pirouette-table");
    const selectedEntry = container.children[pirouetteCycleCounter];
    const highlightClass = effectTable[pirouetteCycleCounter]
        ? "highlightnegative" : "highlightpositive";
    selectedEntry.className = `selected ${highlightClass}`;
}

var prevTurnAttack = "None (first turn)";

/**
 * Gets the textual description of the attack Jevil would use on
 * the given phase and turn of that phase.
 */
function getAttackText(phase, turn) {
    const attackTable = [
        ["Five-Spade", "Spiral I", "Heart Bombs", "Devilsknife I"],
        ["Carousel I", "Three-Club Bombs", "Diamonds Rising", "Spiral II"],
        ["BS Carousel (II)", "Spade Bombs", "Club Bursts", "Devilsknife II"],
        ["Single Diamonds", "CHAOS BOMB", "Fakeout Attack", "FINAL CHAOS"],
    ];
    if (phase < 5) {
        const phaseAttacks = attackTable[phase - 1];
        if (turn < 5) {
            return phaseAttacks[turn - 1];
        } else {
            return `Random Phase ${phase} attack (one of ${phaseAttacks[0]},
                ${phaseAttacks[1]}, ${phaseAttacks[2]}, or ${phaseAttacks[3]})`;
        }
    } else {
        return "Randomly chosen from ALL attacks";
    }
}

function actionClickImpl(name, tired) {
    loadPreviewState();

    document.getElementById("prev-attack-desc").hidden = true;
    document.getElementById("next-attack-desc").hidden = false;

    jevil.tiredness += tired;
    updateTurnsOnPhase();
    const atkText = getAttackText(battlePhase, turnsOnCurrentPhase);
    document.getElementById("next-attack").textContent = atkText;

    document.getElementById("preview-header").hidden = false;
    document.getElementById("preview-action").textContent = name;

    document.getElementById("action-submit").disabled = false;
    document.getElementById("stop-preview").disabled = false;
    advanceTurn();
}

//----------------//
// PREVIEW SYSTEM //
//----------------//

var previewState = null;

function savePreviewState() {
    previewState = {
        turns: turnsElapsed,
        curPhaseTurns: turnsOnCurrentPhase,
        phase: battlePhase,
        tiredness: jevil.tiredness,
    };
}

function loadPreviewState() {
    turnsElapsed = previewState.turns;
    turnsOnCurrentPhase = previewState.curPhaseTurns;
    battlePhase = previewState.phase;
    jevil.tiredness = previewState.tiredness;
}

function hidePreviewIndicators() {
    // Disable all the selectors
    document.getElementById("pirouette").checked = false;
    document.getElementById("hypnosis").checked = false;
    document.getElementById("turn-none").checked = false;
    document.getElementById("action-submit").disabled = true;
    document.getElementById("stop-preview").disabled = true;

    document.getElementById("preview-header").hidden = true;

    document.getElementById("prev-attack").textContent = prevTurnAttack;
    document.getElementById("prev-attack-desc").hidden = false;
    document.getElementById("next-attack-desc").hidden = true;
}

//---------------------//
// ON-LOAD INITIALIZER //
//---------------------//

function onLoad() {
    document.getElementById("pirouette").addEventListener("click", () => {
        actionClickImpl("Pirouette", 0.5);
    });
    document.getElementById("hypnosis").addEventListener("click", () => {
        actionClickImpl("Hypnosis", 1);
    });
    document.getElementById("turn-none").addEventListener("click", () => {
        actionClickImpl("No ACT", 0);
    });
    document.getElementById("stop-preview").addEventListener("click", () => {
        hidePreviewIndicators();
        loadPreviewState();
        updateVisibleState();
    });
    document.getElementById("action-submit").addEventListener("click", () => {
        prevTurnAttack = document.getElementById("next-attack").textContent;
        hidePreviewIndicators();
        // Current state is the new preview state
        savePreviewState();

        const entries = document.getElementById("pirouette-table");
        for (const el of entries.children) {
            el.className = "";
        }
        pirouetteCycleStep();
        updateVisibleState();
    });

    advanceTurn();
    savePreviewState();
}

window.addEventListener("load", onLoad);
