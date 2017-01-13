var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');

function scrape_page (page_start) {
	var options = {
		host: 'www.nationstates.net',
		port: 443,
		path: '/page=challenge/ladder=1/start='+ page_start
	};

	var req = https.request(options, function(res) {
		var body = ""
//		console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			$ = cheerio.load(body);

			rows = $("tr");

			rows.each (function (index) {
				var row = cheerio.load (rows[index])("td");
				if (index != 0) {
					var nation = ""
					var level = ""
					var points = ""
					var specialty = ""
					var wins = -1
					var losses = -1
					var winrate = -1

					row.each (function (index) {
						var data = cheerio.load (row[index])("td").html()

						switch (index) {
							case 1: nation = data
									break
							case 2: level = data
									break
							case 3: points = data
									break
							case 4: specialty = data
									break
							case 5: wins = data
									break
							case 6: losses = data
									break
							case 7: winrate = data
									break
						}
					});

					var line_item = "\"" + nation + "\",\"" + level + "\",\"" + points + "\",\"" + specialty + "\",\"" + wins + "\",\"" + losses + "\",\"" + winrate + "\""
					console.log ((page_start + index) + " " + nation);
					fs.appendFile('nations.csv', line_item + "\n", function (err) {

					});
				}
			})

			if (page_start < 164240) {
				setTimeout(function () {
					scrape_page (page_start + 20);
				}, 1000);
			}
		})
	});

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}

scrape_page (0);
