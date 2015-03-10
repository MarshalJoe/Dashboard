module.exports = {
    pullDaily: function (io) {

        // Include RETS credentials
        var retsKeys = require('./retsConfig.js')

        // Create RETS client and connect
        var client = require('rets-client').getClient(retsKeys.loginURL, retsKeys.user, retsKeys.pass);

        // On successful RETS connection...
        client.once('connection.success', function() {

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

            // Format DMQL query for listings sold or posted today
            var soldQuery = "(StatusChangeTimestamp=" + retsDate + "+),(Status=S)";    
            var listedQuery = "(OriginalEntryTimestamp=" + retsDate + "+)";

            client.once('metadata.table.success', function(table) {

                fields = table.Fields;

                // Homes sold today
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
                    var soldHomeData = {};
                    soldHomeData.soldSum = sum;
                    soldHomeData.homesSold = dailyHomesSold;
                    soldHomeData.date = retsDate;

                    // broadcast it as a websocket 'update' event
                    io.emit('soldUpdate', soldHomeData);
                });

                // Homes listed today
                client.query("Property", "RESI", listedQuery, function(error, data) {
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
                    var listHomeData = {};
                    listHomeData.listedSum = sum;
                    listHomeData.listedSold = dailyHomesSold;

                    // broadcast it as a websocket 'update' event
                    io.emit('listedUpdate', listHomeData);
                });

            });

          
        }); // end of RETS connection 
    
    }, // end of function
    pullWeekly: function (io) {
        // Include RETS credentials
        var retsKeys = require('./retsConfig.js')

        // Create RETS client and connect
        var client = require('rets-client').getClient(retsKeys.loginURL, retsKeys.user, retsKeys.pass);



        client.once('connection.success', function() {
            // Grab current date...
            var rawDate = new Date;

            // ... go back a week...
            var weekAgo = rawDate.setDate(rawDate.getDate() - 7)
            var newDate = new Date(weekAgo);

            // ... and parse into a RETS-friendly format...
            var rawMonth = newDate.getMonth() + 1
            var rawDay = newDate.getDate();
            var year = newDate.getFullYear();
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

            // Format DMQL query for listings sold or posted in the past week
            var listedQuery = "(OriginalEntryTimestamp=" + retsDate + "+)";
            var soldQuery = "(StatusChangeTimestamp=" + retsDate + "+),(Status=S)";

             // Get residential property fields 
            client.getTable("Property", "RESI");
            var fields;

            client.once('metadata.table.success', function(table) {

                fields = table.Fields;

                //pass resource, class, and DQML query 
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
                    var soldWeeklyHomeData = {};
                    soldWeeklyHomeData.soldWeeklySum = sum;
                    soldWeeklyHomeData.homesWeeklySold = dailyHomesSold;
                    
                    io.emit('soldUpdateWeekly', soldWeeklyHomeData);
                }); // end of query

                //pass resource, class, and DQML query 
                client.query("Property", "RESI", listedQuery, function(error, data) {
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
                    var listWeeklyHomeData = {};
                    listWeeklyHomeData.listedWeeklySum = sum;
                    listWeeklyHomeData.listedWeeklySold = dailyHomesSold;
                    
                    io.emit('listedUpdateWeekly', listWeeklyHomeData);
                }); // end of query



            });

        }); // end of rets connction

    } //end of function


} //end of export