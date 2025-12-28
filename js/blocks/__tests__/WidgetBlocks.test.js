/**
 * MusicBlocks v3.6.2
 *
 * @author Anubhab
 *
 * @copyright 2025 Anubhab
 *
 * @license
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const widgetModule = jest.requireActual("../WidgetBlocks");
const setupWidgetBlocks =
    typeof widgetModule === "function" ? widgetModule : widgetModule.setupWidgetBlocks;

global._ = s => s;
global.last = a => a[a.length - 1];
global._THIS_IS_MUSIC_BLOCKS_ = true;

let createdBlocks;

class DummyFlowBlock {
    constructor(name) {
        this.name = name;
        createdBlocks[name] = this;
    }
    setPalette() {
        return this;
    }
    setHelpString() {
        return this;
    }
    formBlock() {
        return this;
    }
    makeMacro() {
        return this;
    }
    beginnerBlock() {
        return this;
    }
    setup() {
        return this;
    }
    flow() {}
}

class DummyValueBlock extends DummyFlowBlock {}
class DummyStackClampBlock extends DummyFlowBlock {}
class DummyFlowClampBlock extends DummyFlowBlock {}

global.FlowBlock = DummyFlowBlock;
global.ValueBlock = DummyValueBlock;
global.StackClampBlock = DummyStackClampBlock;
global.FlowClampBlock = DummyFlowClampBlock;

global.MeterWidget = jest.fn();
global.Tempo = jest.fn();
global.Oscilloscope = jest.fn();
global.PitchDrumMatrix = jest.fn();
global.PhraseMaker = jest.fn();
global.StatusMatrix = jest.fn();
global.RhythmRuler = jest.fn();
global.TemperamentWidget = jest.fn();
global.TimbreWidget = jest.fn();
global.ModeWidget = jest.fn();
global.PitchSlider = jest.fn();
global.MusicKeyboard = jest.fn();
global.PitchStaircase = jest.fn();
global.SampleWidget = jest.fn();
global.Arpeggio = jest.fn();
global.LegoWidget = jest.fn();
global.AIDebuggerWidget = jest.fn();

global.DEFAULTVOICE = "piano";
global.DEFAULTMODE = "major";
global.DEFAULTFILTERTYPE = "lowpass";
global.FILTERTYPES = {};
global.NOINPUTERRORMSG = "No input";

global.instrumentsEffects = { 0: {} };
global.instrumentsFilters = { 0: {} };

global.Mouse = {
    getMouseFromTurtle: jest.fn(() => null)
};

describe("setupWidgetBlocks", () => {
    let activity;
    let logo;

    beforeEach(() => {
        createdBlocks = {};

        activity = {
            errorMsg: jest.fn(),
            beginnerMode: false,
            turtles: {
                turtleList: [],
                ithTurtle: jest.fn(() => ({ singer: {} })),
                getTurtle: jest.fn(() => ({ name: "turtle" })),
                getTurtleCount: jest.fn(() => 1)
            },
            blocks: { blockList: {} }
        };

        logo = {
            inTempo: false,
            inPitchSlider: false,
            inTimbre: false,
            inMatrix: false,
            inMusicKeyboard: false,
            inStatusMatrix: false,

            setDispatchBlock: jest.fn(),
            setTurtleListener: jest.fn(),
            clearNoteParams: jest.fn(),

            tempo: { BPMBlocks: [], BPMs: [] },

            meterWidget: {
                init: jest.fn()
            },

            statusMatrix: {
                init: jest.fn()
            },

            timbre: {
                instrumentName: undefined
            },

            modeWidget: {
                init: jest.fn()
            },

            rhythmRuler: {
                init: jest.fn(),
                Drums: [],
                Rulers: []
            },

            pitchSlider: {
                frequencies: [],
                init: jest.fn()
            },

            legoWidget: {
                init: jest.fn()
            },

            Oscilloscope: {
                init: jest.fn()
            },

            SampleWidget: {
                init: jest.fn()
            },

            reflection: {
                init: jest.fn()
            },

            statusFields: []
        };

        global._THIS_IS_MUSIC_BLOCKS_ = true;
    });

    it("exports setupWidgetBlocks", () => {
        expect(typeof setupWidgetBlocks).toBe("function");
    });

    it("registers widget blocks", () => {
        setupWidgetBlocks(activity);
        expect(Object.keys(createdBlocks).length).toBeGreaterThan(0);
    });

    it("works in non-music-blocks mode", () => {
        global._THIS_IS_MUSIC_BLOCKS_ = false;
        expect(() => setupWidgetBlocks(activity)).not.toThrow();
    });

    it("works in beginner mode", () => {
        activity.beginnerMode = true;
        expect(() => setupWidgetBlocks(activity)).not.toThrow();
    });

    it("executes non-UI flows safely", () => {
        setupWidgetBlocks(activity);

        const uiPattern = /widget|tempo|meter|timbre|matrix|keyboard|pitch|sampler|oscilloscope|mode|temperament|lego|reflection|rhythm|ruler|pitchslider/i;

        Object.values(createdBlocks).forEach(block => {
            if (typeof block.flow === "function" && !uiPattern.test(block.name)) {
                expect(() => block.flow([], logo, 0, 0)).not.toThrow();
            }
        });
    });
});
