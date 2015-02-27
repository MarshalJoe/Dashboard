/*
 * Real-time data generators for the example graphs in the documentation section.
 */
(function() {

    /*
     * Class for generating real-time data for the area, line, and bar plots.
     */
    var RealTimeData = function() {
        this.timestamp = ((new Date()).getTime() / 10)|0;
        this.homesSold = 0;
        this.soldSum = 0;
        this.listedSold = 0;
        this.listedSum = 0;
    };

    RealTimeData.prototype.history = function(entries) {
        if (typeof(entries) != 'number' || !entries) {
            entries = 100;
        }

        var history = [];

        history.push({ label: "Layer 1", values: [] }, { label: "Layer 2", values: [] });

        for (var i = 0; i < entries; i++) {
            for (var j = 0; j < history.length; j++) {
                history[j].values.push({time: this.timestamp, y: 10000000});
            }
            this.timestamp++;
        }

        return history;
    };

    RealTimeData.prototype.next = function(value1, value2) {
        var entry = [];
        for (var i = 0; i < 2; i++) {
            
            entry.push({ time: this.timestamp, y: value1 }, { time: this.timestamp, y: value2 });

        }
        this.timestamp++;
        return entry;
    }

    window.RealTimeData = RealTimeData;


})();
