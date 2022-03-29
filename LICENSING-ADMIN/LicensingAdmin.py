import base64
import os
import random
import requests
from prettytable import from_html
from colorama import Fore, Style, init
import time
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

init()
title = "HOTM Extension Licensing Admin"
print()
print(Fore.LIGHTBLUE_EX + Style.BRIGHT + title + Style.RESET_ALL)

server_address = "https://licensing.kriptorog.org/"

L2I = dict(zip("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", range(52)))
I2L = dict(zip(range(52), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"))
key = 21


# KEY CLASS
class Key:

    def __init__(self, key=''):
        if key == '':
            self.key = self.generate()
        else:
            self.key = key.lower()

    def verify(self):
        score = 0
        check_digit = self.key[0]
        check_digit_count = 0
        chunks = self.key.split('-')
        for chunk in chunks:
            if len(chunk) != 4:
                return False
            for char in chunk:
                if char == check_digit:
                    check_digit_count += 1
                score += ord(char)
        if score == 1772 and check_digit_count == 3:
            return True
        return False

    def generate(self):
        key = ''
        chunk = ''
        # check_digit_count = 0
        alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890'
        while True:
            while len(key) < 25:
                char = random.choice(alphabet)
                key += char
                chunk += char
                if len(chunk) == 4:
                    key += '-'
                    chunk = ''
            key = key[:-1]
            if Key(key).verify():
                return key
            else:
                key = ''

    def __str__(self):
        valid = 'Invalid'
        if self.verify():
            valid = 'Valid'
        return self.key.upper() + ':' + valid


def encipher(x):
    xa = base64.b64encode(bytes(x, 'utf-8')).decode('utf8')
    xb = (xa[::-1])
    xc = ""
    for c in xb:
        if c.isalpha():
            if c.isupper():
                xc += I2L[(L2I[c] + key) % 52].upper()
            elif c.islower():
                xc += I2L[(L2I[c] + key) % 52].lower()
        else:
            xc += c
    return xc


def decipher(x):
    xa = ""
    for c in x:
        if c.isalpha():
            if c.isupper():
                xa += I2L[(L2I[c] - key) % 52].upper()
            elif c.islower():
                xa += I2L[(L2I[c] - key) % 52].lower()
        else:
            xa += c
    xb = (xa[::-1])
    xc = base64.b64decode(bytes(xb, 'utf-8')).decode('utf8')
    return xc


def view_all():
    endpoint = server_address + "_viewall.php?secret=" + secret
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            pts = "null"
        else:
            pts = from_html(response)

        print(Fore.LIGHTBLUE_EX + Style.BRIGHT)
        print(pts, end="")
        print(Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")


def add_new(monty):
    endpoint = server_address + "_addtodatabase.php?monty=" + monty
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            response = "null"
        print(Fore.LIGHTBLUE_EX + Style.BRIGHT + response + Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")


def delete():
    endpoint = server_address + "_deletefromdatabase.php?monty=" + enciphered_monty
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            response = "null"
        print(Fore.LIGHTBLUE_EX + Style.BRIGHT + response + Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")


def extend():
    endpoint = server_address + "_extendlicense.php?monty=" + enciphered_monty
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            response = "null"
        print(Fore.LIGHTBLUE_EX + Style.BRIGHT + response + Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")


def note():
    # ADD NOTE
    endpoint = server_address + "_note.php?monty=" + enciphered_monty + "&note=" + notek
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
    except:
        print("there was a problem connecting to server! try again.")


def maintenance():
    # MAINTENANCE
    endpoint = server_address + "_maintenance.php?secret=" + secret
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            response = "null"
        print(Fore.LIGHTBLUE_EX + Style.BRIGHT + response + Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")


def keygen():
    limit = input("How many new serials do you want to generate? ")

    number = 0
    keys = []
    generated = Key('aaaa-bbbb-cccc-dddd-1111')

    while number < int(limit):
        serial = Key.generate(generated)
        print(Fore.LIGHTGREEN_EX + serial + Style.RESET_ALL)
        number += 1
        keys.append(serial)

    answer = input("Do you wish to add generated serials to database? (y/n): ")
    if answer == "y":
        for serial in keys:
            # del enciphered_monty
            enciphered_monty = encipher(serial)
            add_new(enciphered_monty)
    while answer == "n":
            print("ok, no problem.")
            return None


def count():
    # MAINTENANCE
    endpoint = server_address + "_count.php?secret=" + secret
    try:
        response = requests.get(endpoint, timeout=12, verify=False).text
        if not response:
            response = "null"
        print("Total number of serials registered in the database: ", end="")
        print(Fore.LIGHTBLUE_EX + Style.BRIGHT + response + Style.RESET_ALL)
    except:
        print("there was a problem connecting to server! try again.")

# MOUNTED SECRET CANNON
secret = "montypythonrocks"

montypython = True
while montypython:

    # START MENU
    print("""
    1. View All Licenses
    2. Add New Serial
    3. Delete Serial 
    4. Refresh Serial (status ready)
    5. Set license expiry date 30 days from today
    6. Keygen - generate, verify, register and export new serials
    7. Maintenance - set all licenses with enddate < today as expired
    8. Add Note - add note to serial
    0. Exit - disconnect from licensing server
            """)

    montypython = input("What would you like to do? ")

    if montypython=="1":
        os.system('cls')  # GREAT CLS METHOD
        view_all()
        count()

    elif montypython=="2":
        enciphered_monty = encipher(input("Paste serial number to add: "))
        add_new(enciphered_monty)

    elif montypython=="3":
        enciphered_monty = encipher(input("Paste serial number to delete: "))
        delete()
    elif montypython=="4":
        enciphered_monty = encipher(input("Paste serial number to release: "))
        delete()
        add_new(enciphered_monty)

    elif montypython=="5":
        enciphered_monty = encipher(input("Paste serial number to extend: "))
        extend()

    elif montypython=="6":
        keygen()

    elif montypython=="7":
        maintenance()

    elif montypython=="8":
        enciphered_monty = encipher(input("Paste a serial to add note to: "))
        notek = encipher(input("Write a note to add: "))
        note()

    elif montypython=="0":
        montypython=False

    else:
        print(Fore.LIGHTRED_EX + Style.BRIGHT)
        print("Ooops, unrecognized input! Possible choices:")
        print(Style.RESET_ALL)


print(Fore.LIGHTBLUE_EX + "goodbye" + Style.RESET_ALL)
time.sleep(5)
