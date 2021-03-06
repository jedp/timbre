/**
 * utils/converter
 */
"use strict";

var timbre = require("../timbre");
var utils  = { $exports:{} };
// __BEGIN__

utils.mtof = (function() {
    var freq_table = (function() {
        var result = new Float32Array(128);
        for (var i = 0; i < 128; i++) {
            result[i] = 440 * Math.pow(Math.pow(2, (1/12)), i - 69);
        }
        return result;
    }());
    return function(m) {
        if (0 <= m && m < 128) {
            return freq_table[m|0];
        } else {
            return 0;
        }
    };
}());

utils.ftom = function(f) {
    return Math.round((Math.log(f / 440) * Math.LOG2E) * 12 + 69);
};

utils.mtoa = (function() {
    var tone_table = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return function(a) {
        var i = (a|0) % 12;
        var j = (a|0) / 12;
        return tone_table[i] + ((j|0)-2);
    };
}());

utils.ftoa = function(f) {
    return mtoa(ftom(f));
};

utils.atom = (function() {
    var re = /^([CDEFGAB])([-+#b]?)([0-9]?)$/;
    var map = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
    return function(a) {
        var m, result = 0;
        if ((m = a.match(re)) !== null) {
            result = map[m[1]];
            switch (m[2]) {
            case "+": case "#":
                ++result;
                break;
            case "-": case "b":
                --result;
                break;
            }
            result += 12 * ((m[3]|0)+2);
        }
        return result;
    };
}());

utils.atof = function(a) {
    return mtof(atom(a));
};

utils.bpm2msec = function(bpm, len) {
    if (typeof len === "undefined") len = 4;
    return (60 / bpm) * (4 / len) * 1000;
};

utils.msec2bpm = function(msec, len) {
    if (typeof len === "undefined") len = 4;
    return 60 / (msec / 1000) * (4 / len);
};

utils.msec2hz = function(msec) {
    return 1000 / msec;
};

utils.hz2msec = function(Hz) {
    return 1000 / Hz;
};

utils.bpm2hz = function(bpm, len) {
    if (typeof len === "undefined") len = 4;
    return 1000 / ((60 / bpm) * (4 / len) * 1000);
};

utils.hz2bpm = function(hz, len) {
    if (typeof len === "undefined") len = 4;
    return 60 / (1000 / msec / 1000) * (4 / len);
};

utils.$exports["converter"] = [
    "mtof", "ftom", "mtoa", "ftoa", "atom", "atof",
    "bpm2msec", "msec2bpm", "msec2hz", "msec2hz", "bpm2hz", "hz2bpm",
];

// __END__
describe("mtof", function() {
    it("mtof(-1) should equal 0", function() {
        utils.mtof(-1).should.equal(0);
    });
    it("mtof(69) should equal 440", function() {
        utils.mtof(69).should.equal(440);
    });
    it("mtof(69+12) should equal 440*2", function() {
        utils.mtof(69+12).should.equal(440*2);
    });
    it("mtof(69-12) should equal 440/2", function() {
        utils.mtof(69-12).should.equal(440/2);
    });
    it("mtof(128) should equal 0", function() {
        utils.mtof(128).should.equal(0);
    });
});

describe("ftom", function() {
    it("ftom(440) should equal 69", function() {
        utils.ftom(440).should.equal(69);
    });
    it("ftom(660) should equal 69+7", function() {
        utils.ftom(660).should.equal(69+7);
    });
});

describe("mtoa", function() {
    it("mtoa(69) should equal 'A3'", function() {
        utils.mtoa(69).should.equal("A3");
    });
    it("mtoa(69+7+24) should equal 'E6'", function() {
        utils.mtoa(69+7+24).should.equal("E6");
    });
    it("mtoa(69-7-12) should equal 'D2'", function() {
        utils.mtoa(69-7-12).should.equal("D2");
    });
});

describe("toam", function() {
    it("atom('A3') should equal 69", function() {
        utils.atom("A3").should.equal(69);
    });
    it("atom('C2') should equal 48", function() {
        utils.atom("C2").should.equal(48);
    });
});
