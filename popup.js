/* jshint esversion: 6 */
/* globals chrome */

const API_SERVER = "https://licensing.kriptorog.org/";

// MY ENCIPHER FUNCTION
function encipher(str){
    function encode(decoded){var encoded=btoa(decoded);return encoded;}
    function reverseString(str) {return str.split("").reverse().join("");}
    var cezar = function (str, how_much) {
      if (how_much < 0) {return cezar(str, how_much + 26);}
      var result = "";
      for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (c.match(/[a-z]/i)) {
          var yoda = str.charCodeAt(i);
          if (yoda >= 65 && yoda <= 90) {c = String.fromCharCode(((yoda - 65 + how_much) % 26) + 65);}
          else if (yoda >= 97 && yoda <= 122) {c = String.fromCharCode(((yoda - 97 + how_much) % 26) + 97);}
        } result += c; }
      return result;
    };
    let one = encode(str);
    let two = reverseString(one);
    let three = cezar(two, 21);
    return three;
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
    } return activation_code;
}

// CHECK SERIAL API
function checkSerial(serial){
    let enc_serial = encipher(serial);
    let endpoint = API_SERVER + "checkserial.php?monty=" + enc_serial;

    fetch(endpoint)
    .then((response) => {return response.text();})
    .then((data) => {
        if (data=="ready"){
            document.getElementById("message").textContent = "serial ready, licensing...";
            document.getElementById("keyStatus").textContent = "ready";
            activateLicense(serial);
        } else if (data=="activated"){
            document.getElementById("message").textContent = "serial activated, checking license...";
            document.getElementById("keyStatus").textContent = "activated";
            checkLicense(serial);
        } else if (data=="expired"){
            document.getElementById("message").textContent = "license expired :(";
            document.getElementById("message").style.color = "indianred";
            document.getElementById("keyStatus").textContent = "expired";
            document.getElementById("inputForm").style.display = "table";
            document.getElementById("activationStatus").textContent="expired";
            saveError("errOOr");
        } else if (!data){
            document.getElementById("message").textContent = "wrong serial number";
            document.getElementById("message").style.color = "indianred";
            document.getElementById("keyStatus").textContent = "wrong";
            document.getElementById("inputForm").style.display = "table";
            document.getElementById("submittedSerial").textContent="wrong";
            document.getElementById("activationStatus").textContent="not licensed";
            saveError("errOOr");
        } else {
            document.getElementById("message").textContent = "that's weird";
            document.getElementById("message").style.color = "indianred";
            document.getElementById("keyStatus").textContent = "weird";
            document.getElementById("inputForm").style.display = "table";
            saveError("errOOr");
        }
    })
    .catch((error) => {
        document.getElementById("message").textContent = "problem connecting to api server";
        document.getElementById("inputForm").style.display = "table";
    });
}

// ACTIVATE LICENSE API
function activateLicense(serial){
    chrome.storage.sync.get(["hotm-license"], function(result) {
        let activation_code = result["hotm-license"];
        let license_key;
        if (activation_code==null){license_key = generateActivationCode(14);} else {license_key = activation_code;}
        let enc_serial = encipher(serial); let enc_license = encipher(license_key);
        saveLicenseKey(license_key);saveSerial(serial);
        chrome.storage.sync.set({"hotm-error": "err00r"}, function() {});
        let endpoint = API_SERVER + "activate.php?monty=" + enc_serial + "&python=" + enc_license;

        fetch(endpoint).then((response) => {return response.text();}).then((data) => {
            document.getElementById("message").textContent = "checking license...";
            checkLicense(serial);
        }).catch((error) => {
            document.getElementById("message").textContent = "problem connecting to api server";
            document.getElementById("activationStatus").textContent = "problem";
        });
    });
}

// CHECK LICENSE API
function checkLicense(serial){
    chrome.storage.sync.get(["hotm-license"], function(result) {
        let activation_code = result["hotm-license"];
        if (activation_code==null){
            document.getElementById("message").textContent = "activated by another user :(";
            document.getElementById("message").style.color = "indianred";
            document.getElementById("activationStatus").textContent = "no license";
            document.getElementById("inputForm").style.display = "table";
            document.getElementById("allGood").style.display = "none";
            document.getElementById("notGood").style.display = "block";
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
                    document.getElementById("message").style.color = "seagreen";
                    document.getElementById("allGood").style.display = "block";
                    document.getElementById("notGood").style.display = "none";
                    chrome.storage.sync.set({"hotm-error": "err00r"}, function() {});
               } else if (data==""){
                    document.getElementById("activationStatus").textContent = "not licensed";
                    document.getElementById("inputForm").style.display = "table";
                    document.getElementById("message").textContent = "* activated on another instance";
                    document.getElementById("message").style.color = "indianred";
                    document.getElementById("allGood").style.display = "none";
                    document.getElementById("notGood").style.display = "block";
                    chrome.storage.sync.set({"hotm-error": "errOOr"}, function() {});
               }
            }).catch((error) => {
                document.getElementById("message").textContent = "problem connecting to api server";
                document.getElementById("activationStatus").textContent = "error";
                document.getElementById("inputForm").style.display = "table";
                document.getElementById("allGood").style.display = "none";
                document.getElementById("notGood").style.display = "block";
            });
        }
    });
}

// NEW SERIAL SUBMIT EVENT LISTENER
submitSerialButton.addEventListener("click", () => {
  let registrationKey = encodeURI(document.getElementById("regkey").value);
  document.getElementById("submittedSerial").textContent = registrationKey;
  saveSerial(registrationKey);
  checkSerial(registrationKey);
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
});

// LOGO CLICK LISTENER
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('logo');
    link.addEventListener('click', function() {
        let inputForm_display = document.getElementById("inputForm").style.display;
        if (inputForm_display == "none") {
            document.getElementById("inputForm").style.display = "table";
        } else {
            document.getElementById("inputForm").style.display = "none";
        }
        document.getElementById("regkey").placeholder = "input another serial*";
    });
});
