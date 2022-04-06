from django.shortcuts import render
from django.http import HttpResponse

import json
from web3 import Web3
import requests

url = "https://mainnet.infura.io/v3/fd6ba3b64bef4a4db518ab0f38f6a75a"
web3 = Web3(Web3.HTTPProvider(url))


# GET TOTAL SUPPLY
def getTotalSupply(contract):
    address = web3.toChecksumAddress(contract)
    abi = json.loads('[  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"} ]')
    contract = web3.eth.contract(address=address, abi=abi)
    response = contract.functions.totalSupply().call()
    return response

# GET TOKEN URI JSON
def getTokenURI(contract, token_id):
    address = web3.toChecksumAddress(contract)
    abi = json.loads('[  {"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"} ]')
    contract = web3.eth.contract(address=address, abi=abi)
    tokenUri = contract.functions.tokenURI(token_id).call()
    response = requests.get(tokenUri).json()
    return response

# GET JOB
def getJob(id):
    address = web3.toChecksumAddress("0x8a9ECe9d8806eB0CdE56Ac89cCB23a36E2C718cf")
    abi = json.loads('[  {"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"} ]')
    contract = web3.eth.contract(address=address, abi=abi)
    tokenUri = contract.functions.tokenURI(id).call()
    response = requests.get(tokenUri).json()
    
    attributes = response['attributes']
    for attribute in attributes:
        trait = attribute['trait_type']
        value = attribute['value']
        if trait == "Job":
            return(value)
    

# GET UNCLAIMED HOTM
def getHotmSalary(hotm_id):
    address = web3.toChecksumAddress("0x68B1b0b89E52440df04237A21751331ae9E87a23")
    abi = json.loads('[  { "inputs": [ { "internalType": "address", "name": "_contractAddress", "type": "address" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" } ], "name": "checkClaimableAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]')
    claim_address = "0x8a9ECe9d8806eB0CdE56Ac89cCB23a36E2C718cf"
    contract = web3.eth.contract(address=address, abi=abi)
    # get salary
    salary = contract.functions.checkClaimableAmount(claim_address, [hotm_id]).call()
    salary = round(salary / 10 ** 18, 2)
    return salary


def index(request):
    return HttpResponse("Hello world. You're at the api index.")

def hello_world(request):
    return render(request, 'hello_world.html', {})

def hotm(request, id):
    salary = getHotmSalary(id);
    job = getJob(id);
    return render(request, 'hotm.html', {'id': id, 'salary': salary, 'job': job})

def supply(request, contract):
    supply = getTotalSupply(contract)
    return HttpResponse(supply)
 
def uri(request, contract, id):
    uri = getTokenURI(contract, id)
    context = {}
    context['contract'] = contract
    context['id'] = id
    # context['json'] = uri
    context['attributes'] = uri['attributes']
    context['image'] = uri['image']
    context['name'] = uri['name']
    # context['description'] = uri['description']
    # supply = getTotalSupply(contract)
    # context['supply'] = supply
    
    return render(request, 'uri.html', context)