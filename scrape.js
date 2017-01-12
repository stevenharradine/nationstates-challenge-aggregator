var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');

function scrape_page (page_start) {
	var options = {
		host: 'www.nationstates.net',
		port: 443,
		path: '/page=list_nations?censusid=254&amp;start=' + page_start
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

			links = $("a.nlink");

			links.each (function (index) {
				var link_exploded = links[index].attribs.href.split("=");
				link_exploded.shift();	// remove the key (key=value)
				var nation_name = link_exploded.join("=")

				console.log (nation_name);

				fs.appendFile('message.txt', nation_name + "\n", function (err) {

				});
			})

			if (page_start < 100) {
				setTimeout(function () {
					scrape_page (page_start + 10);
				}, 2000);
			}
		})
	});

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}

scrape_page (0);
