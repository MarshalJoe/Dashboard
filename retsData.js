module.exports = {
    pullAndSendData: function (io) {

        // Include RETS credentials
        var retsKeys = require('./retsConfig.js')

        // Create RETS client and connect
        var client = require('rets-client').getClient(retsKeys.loginURL, retsKeys.user, retsKeys.pass);

        // On successful RETS connection...
        client.once('connection.success', function() {
            console.log("Pulling data from RETS server...");

            // Grab current date...
            var rawDate = new Date;

            // ... and parse into a RETS-friendly format...
            var rawMonth = rawDate.getMonth() + 1
            var rawDay = rawDate.getDate();
            var year = rawDate.getFullYear();
            var month;
            var day;

            if (rawMonth < 10) {
                month = '0' + rawMonth;
            } else {
                month = rawMonth;
            }

            if (rawDay < 10) {
                day = '0' + rawDay;
            } else {
                day = rawDay;
            }

            var retsDate = year + '-' + month + '-' + day;

            // Get residential property fields 
            client.getTable("Property", "RESI");
            var fields;

            // Format DMQL query for listings sold today
            var soldQuery = "(StatusChangeTimestamp=" + retsDate + "+),(Status=S)";    

            // Format DMQL query for listings posted today
            var listedQuery = "(OriginalEntryTimestamp=" + retsDate + "+)";

            client.once('metadata.table.success', function(table) {

                fields = table.Fields;

                // Pass resource, class, and DQML query, get all residential homes sold today
                client.query("Property", "RESI", soldQuery, function(error, data) {
                    var dailyHomesTotal = [];

                    if (error) {
                        console.log(error);
                        return;
                    }

                    // Iterate through search results, print out the list prices and add 'em up. 
                    for(var dataItem = 0; dataItem < data.length; dataItem++) {
                        var homePrice = parseInt(data[dataItem]["CurrentPrice"], 10);
                        dailyHomesTotal.push(homePrice);
                    }

                    // Calculate desired Metrics
                    var sum = dailyHomesTotal.reduce(function(a, b) { return a + b });
                    var dailyHomesSold = data.length;

                    // attach them to a data object
                    var data = {}
                    data.sum = sum;
                    data.homesSold = dailyHomesSold;
                    data.date = retsDate;

                    // broadcast it as a websocket 'update' event
                    io.emit('update', data);
                });

            });

        // end of RETS connection   
        });
    // end of function
    }

//end of export
}