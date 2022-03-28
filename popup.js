
API_SERVER = "https://licensing.kriptorog.org/";

// MY ENCIPHER FUNCTION
function encipher(str){
    function encode(decoded){var encoded=btoa(decoded);return encoded;}
    function reverseString(str) {return str.split("").reverse().join("");}
    var cezar = function (str, how_much) {
      if (how_much < 0) {return caesarShift(str, how_much + 26);}
      var result = "";
      for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (c.match(/[a-z]/i)) {
          var yoda = str.charCodeAt(i);
          if (yoda >= 65 && yoda <= 90) {c = String.fromCharCode(((yoda - 65 + how_much) % 26) + 65);}
          else if (yoda >= 97 && yoda <= 122) {c = String.fromCharCode(((yoda - 97 + how_much) % 26) + 97);}
        }
        result += c;
      }
      return result;
    };
    let one = encode(str);
    let two = reverseString(one);
    let three = cezar(two, 21);
    return three
}

// LOCAL STORAGE FUNCTIONS
function saveSerial(serial){chrome.storage.sync.set({"hotm-serial": serial}, function() {});}
function saveLicenseKey(license_key){chrome.storage.sync.set({"hotm-license": license_key}, function() {});}
function saveError(error){chrome.storage.sync.set({"hotm-error": error}, function() {});}

// ACTIVATION CODE GENERATOR
function generateActivationCode(length){
    let activation_code = "";
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let lettersLength = letters.length;
    for ( let i = 0; i < length; i++ ) {
      activation_code += letters.charAt(Math.floor(Math.random() * lettersLength));
    }
    return activation_code;
}

// API CHECK SERIAL
function checkSerial(serial){
    let enc_serial = encipher(serial);
    let endpoint = API_SERVER + "checkserial.php?monty=" + enc_serial;

    fetch(endpoint)
    .then((response) => {
        return response.text();
    })
    .then((data) => {
        if (data=="ready"){
            // tbd: ask user whether to activate
            document.getElementById("message").textContent = "serial ready, licensing...";
            document.getElementById("keyStatus").textContent = "ready";
            activateLicense(serial);
        } else if (data=="activated"){
            document.getElementById("message").textContent = "serial activated, checking license...";
            document.getElementById("keyStatus").textContent = "activated";
            checkLicense(serial);
        } else if (data=="expired"){
            document.getElementById("message").textContent = "license expired :(";
            document.getElementById("keyStatus").textContent = "expired";
            document.getElementById("inputForm").style.display = "table";
            document.getElementById("activationStatus").textContent="expired";
            saveError("errOOr");
        } else if (!data){
            document.getElementById("message").textContent = "are you using the correct serial?";
            document.getElementById("keyStatus").textContent = "wrong";
            document.getElementById("inputForm").style.display = "table";
            document.getElementById("activationStatus").textContent="not licensed";
            saveError("errOOr");
        } else {
            document.getElementById("message").textContent = "that's weird";
            document.getElementById("keyStatus").textContent = "weird";
            document.getElementById("inputForm").style.display = "table";
            saveError("errOOr");
        }
    })
    .catch((error) => {
        document.getElementById("message").textContent = "problem connecting to api server";
        document.getElementById("inputForm").style.display = "table";
    })

}

// API ACTIVATE LICENSE
function activateLicense(serial){

    chrome.storage.sync.get(["hotm-license"], function(result) {
        let activation_code = result["hotm-license"];
        let license_key;
        if (activation_code==null){
            license_key = generateActivationCode(14);
        } else {
            license_key = activation_code;
        }
        let enc_serial = encipher(serial);
        let enc_license = encipher(license_key);

        saveLicenseKey(license_key);
        saveSerial(serial);
        chrome.storage.sync.set({"hotm-error": "err00r"}, function() {});

        let endpoint = API_SERVER + "activate.php?monty=" + enc_serial + "&python=" + enc_license;
        fetch(endpoint).then((response) => {return response.text();}).then((data) => {
            document.getElementById("message").textContent = "checking license...";
            checkLicense(serial);
        }).catch((error) => {
            document.getElementById("message").textContent = "problem connecting to api server";
            document.getElementById("activationStatus").textContent = "problem";
        })
    });
}

// API CHECK LICENSE
function checkLicense(serial){
    chrome.storage.sync.get(["hotm-license"], function(result) {
        let activation_code = result["hotm-license"];
        if (activation_code==null){
            document.getElementById("message").textContent = "activated by another user :(";
            document.getElementById("activationStatus").textContent = "no license";
            document.getElementById("inputForm").style.display = "table";
        } else {

            let enc_serial = encipher(serial);
            let enc_activation_code = encipher(activation_code);
            let endpoint = API_SERVER + "checklicense.php?monty=" + enc_serial + "&python=" + enc_activation_code;
            fetch(endpoint).then((response) => {return response.text();}).then((data) => {
               if (data=="activated"){
                    document.getElementById("message").textContent = "License ok";
                    document.getElementById("message").style.fontWeight = "bold";
                    document.getElementById("message").style.color = "seagreen";
                    document.getElementById("inputForm").style.display = "none";
                    document.getElementById("activationStatus").textContent = data;
                    document.getElementById("atoggle").style.display = "table";
                    document.getElementById("atoggle").textContent = "*";
                    document.getElementById("atoggle").style.color = "black";
                    chrome.storage.sync.set({"hotm-error": "err00r"}, function() {});
               } else if (data==""){
                    document.getElementById("message").textContent = "used elsewhere";
                    document.getElementById("activationStatus").textContent = "not licensed";
                    document.getElementById("inputForm").style.display = "table";
                    chrome.storage.sync.set({"hotm-error": "errOOr"}, function() {});
               }
            }).catch((error) => {
                document.getElementById("message").textContent = "problem connecting to api server";
                document.getElementById("activationStatus").textContent = "error";
                document.getElementById("inputForm").style.display = "table";
            })
        }
    });
}

// BUTTON CLICK EVENT LISTENER
clickElement.addEventListener("click", async () => {

  // prevent XSS injection attacks
  function preventXSSHtml(str){return String(str).replace(/[^\w. ]/gi, function(c){return '&#'+c.charCodeAt(0)+';';});}
  function preventXSSJs(str){return String(str).replace(/[^\w. ]/gi, function(c){return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);});}
  function preventXSS(str){return preventXSSJs(preventXSSHtml(str));}
  let registrationKey = preventXSS(document.getElementById("regkey").value);

  document.getElementById("submittedSerial").textContent = registrationKey;
  saveSerial(registrationKey);
  checkSerial(registrationKey);
});

// TOGGLE CLICK LISTENER
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('atoggle');
    link.addEventListener('click', function() {
        let tuga = document.getElementById('atoggle');
        if (tuga.innerText == "*") {
          tuga.style.display = "block";
          document.getElementById("inputForm").style.display = "table";
          document.getElementById("atoggle").textContent = "* Be careful, only one serial per instace allowed!";
          document.getElementById("atoggle").style.fontWeight = "450";
          document.getElementById("atoggle").style.color = "red";
        } else {
            document.getElementById("inputForm").style.display = "none";
            document.getElementById("atoggle").textContent = "*";
            document.getElementById("atoggle").style.color = "black";
        }
        document.getElementById("regkey").placeholder = "input another serial*";
    });
});

// CHECK LOCALLY FOR SERIAL
chrome.storage.sync.get(["hotm-serial"], function(result) {
    let value = result["hotm-serial"];
    if (value==null){
        document.getElementById("keyStatus").textContent = "none";
        document.getElementById("inputForm").style.display = "table";
    } else {
        document.getElementById("submittedSerial").textContent = value;
        checkSerial(value);
    }
})


// DEV STUFF BELLOW
// tbd: prevent xss injection attacks on input box
// tbd: ask user for confirmation on serial activation
////// SOME FETCH CHAINING MAGIC
//function justForPresentation(){
//    fetch(url)
//    .then(function(response) {
//      return response.json()
//    })
//    .then(function(data) {
//      // do stuff with `data`, call second `fetch`
//      return fetch(data.anotherUrl)
//    })
//    .then(function(response) {
//      return response.json();
//    })
//    .then(function(data) {
//      // do stuff with `data`
//    })
//    .catch(function(error) {
//      console.log('Requestfailed', error)
//    });
//}
// INJECT SCRIPT IN CURRENT PAGE
// THIS FUNCTION WILL BE RUN ON THE ACTIVE TAB PAGE SUCH AS OPENSEA
//function injectToCurrentPage() {
//    // document.body.textContent = "blank";
//    console.log('Im here');
//}
//
//  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // CALL FUNCTION THAT WILL EXECUTE SCRIPT ON CURRENT TAB PAGE
//  chrome.scripting.executeScript({
//    target: { tabId: tab.id },
//    function: injectToCurrentPage,
//  });
