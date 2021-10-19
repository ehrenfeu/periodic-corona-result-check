var qs = require('qs');
const axios = require('axios');
var crypto = require('crypto');
const cheerio = require('cheerio');
const config = require('./CONFIG.js');

// form data
const homeUrl = 'https://' + config.location + '.corona-ergebnis.de/';
const statusUrl = homeUrl + 'Home/Results';

const labId = config.labId;
const orderNumber = config.orderNumber;
const birthdate = config.birthdate;
const zipCode = config.zipCode;

// hash input data
function getInputHash() {
	let data = labId + orderNumber + birthdate + zipCode;
	// console.log("raw hash data: [" + data + "]");
	let hash = crypto.createHash('sha512');
	let result = hash.update(data).digest('hex');
	// console.log("---\ninput hash: " + result + "\n---\n");
	return result;
}

// get CSRF verification token
async function getVerificationToken() {
	let req = await axios.get(homeUrl, { withCredentials: true });
	const document = cheerio.load(req.data);
	let cookies = [];
	req.headers['set-cookie'].forEach(setcookie => {
		cookies.push(setcookie.substring(0, setcookie.indexOf(';')));
	});
	// let token = document("input")[5].attribs.value;
	let token = "";
	document("input").each(function () {
		// console.log(document(this).attr("name"));
		if (document(this).attr("name") == "__RequestVerificationToken") {
			token = document(this).attr("value");
		}
	})

	// console.log("found token: " + token + "\n");

	return {
		token: token,
		cookies: cookies
	};
}

async function checkStatus() {
	let input = getInputHash();
	let csrfToken = await getVerificationToken();

	// make post request
	var data = qs.stringify({
		'labId': labId,
		'Hash': input,
		'__RequestVerificationToken': csrfToken.token
	});
	var config = {
		method: 'post',
		url: statusUrl,
		headers: {
			'cookie': csrfToken.cookies.join('; '),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: data
	};

	let result = await axios(config);

	// parse result
	let html = result.data;
	let resultText = cheerio('div[class=well]', html).text();
	let resultAvailable = resultText.search("(ER03)") == -1;
	console.log('Covid test result available: ' + resultAvailable.toString().toUpperCase())

	if (resultAvailable) {
		console.log(resultText);
	}
	return { Available: resultAvailable, Text: resultText };
}

exports.check = checkStatus;
