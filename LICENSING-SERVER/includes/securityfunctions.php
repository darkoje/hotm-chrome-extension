<?php

// ERROR REPORTING
//production
error_reporting(0);
ini_set('display_errors', 0);

//development
//error_reporting(E_ALL);



/*
We'll need to call only two functions: Encipher($x) and Decipher($x).
*/

class CaesarCipher {
  public $shift;
  const alphabet = array(
    "lowercase" => array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"),
    "uppercase" => array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z")
  );
  public function __construct($shift = 0) {
    $this->shift = $shift % 26;
  }
  public function encrypt($input) {
    $result = str_split($input);
    for ($i = 0; $i < count($result); $i++) {
      for ($j = 0; $j < 26; $j++) {
        if ($result[$i] === CaesarCipher::alphabet["lowercase"][$j]) {
          $result[$i] = CaesarCipher::alphabet["lowercase"][($j + $this->shift) % 26];
          $j = 26;
        } elseif ($result[$i] === CaesarCipher::alphabet["uppercase"][$j]) {
          $result[$i] = CaesarCipher::alphabet["uppercase"][($j + $this->shift) % 26];
          $j = 26;
        }
      }
    }
    $result = implode($result);
    return $result;
  }
  public function decrypt($input) {
    $result = str_split($input);
    for ($i = 0; $i < count($result); $i++) {
      for ($j = 0; $j < 26; $j++) {
        if ($result[$i] === CaesarCipher::alphabet["lowercase"][$j]) {
          $result[$i] = CaesarCipher::alphabet["lowercase"][($j + 26 - $this->shift) % 26];
          $j = 26;
        } elseif ($result[$i] === CaesarCipher::alphabet["uppercase"][$j]) {
          $result[$i] = CaesarCipher::alphabet["uppercase"][($j + 26 - $this->shift) % 26];
          $j = 26;
        }
      }
    }
    $result = implode($result);
    return $result;
  }
}

function encode($x){
	$y = base64_encode($x);
	return $y;
}

function decode($x){
	$y = base64_decode($x);
	return $y;
}

function encrypt1($x){
	$y = strrev($x);
	return $y;
}

function decrypt1($x){
	$y = strrev($x);
	return $y;
}

function Encipher($x){
	$encoded = encode($x);
	$enkript1 = encrypt1($encoded);
	$cipher = new CaesarCipher(21);
	$enkript2 = $cipher->encrypt($enkript1);
	return $enkript2;
}

function Decipher($x){
	$deciph2 = new CaesarCipher(21);
	$decrypt2 = $deciph2->decrypt($x);
	$deciph1 = decrypt1($decrypt2);
	$decoded = decode($deciph1);
	return $decoded;
}
/*
EXAMPLE USAGE:
$variable = "q29y-z3q9-lxwq-k5pe-810f";
$finalenciph = Encipher($variable);
echo "<br> Fully encyphered: " .$finalenciph;
echo "<br>Fully deciphered: " . Decipher($finalenciph);
*/

