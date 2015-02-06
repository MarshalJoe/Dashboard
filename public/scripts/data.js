/*
 * Real-time data generators for the example graphs in the documentation section.
 */
(function() {

    /*
     * Class for generating real-time data for the area, line, and bar plots.
     */
    var RealTimeData = function(layers) {
        this.layers = layers;
        this.timestamp = ((new Date()).getTime() / 1000)|0;
    };

    RealTimeData.prototype.rand = function() {
        return parseInt(Math.random() * 100) + 50;
    };

    RealTimeData.prototype.history = function(entries) {
        if (typeof(entries) != 'number' || !entries) {
            entries = 100;
        }

        var history = [];
        for (var k = 0; k < this.layers; k++) {
            history.push({ values: [] });
        }

        for (var i = 0; i < entries; i++) {
            for (var j = 0; j < this.layers; j++) {
                history[j].values.push({time: this.timestamp, y: 100});
            }
            this.timestamp++;
        }

        return history;
    };

    RealTimeData.prototype.next = function(value) {
        var entry = [];
        for (var i = 0; i < this.layers; i++) {
            entry.push({ time: this.timestamp, y: value });
        }
        this.timestamp++;
        return entry;
    }

    window.RealTimeData = RealTimeData;


})();
