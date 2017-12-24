# Donation Crowd Funding Contract

This contract is implementing a matching donation crowd funding.

The main idea is to encourage donations by matching incoming donations and thus doubling the donations of the public.

## Overview

In order to encourage the public to donate we have deposited to the contract wallet 1 million NIS worth of ETH.


Any donation that will be received to the contract will be transferred to the donation beneficiery by the contract.
And in addition the donation will be matched by the contract and the same amount of donation will be tranfered to the beneficiery fro mthe pre loaded amount.

So that for every X ETH donated the contract will transfer another X ETH.

The max total of matched donations cannot exceed the deposited amount.
The owner can deposit more funds into the contract in order to increase his matching donations. 

If the deposited amount is exhausted, donations are still welcome and will be transferred to the beneficiary without the contract matching.

## Mainnet Addresses

The donation contract has been deployed to 0x0236DA65D76Ae844aBB81814CeBB6fe9B001d587

## Contracts

Please see the [contracts/](contracts) directory.

## Develop

* Contracts are written in [Solidity][solidity] and tested using [Truffle][truffle] and [testrpc][testrpc].

* Our smart contract is based on [Open Zeppelin][openzeppelin] smart contracts [v1.3.0][openzeppelin_v1.3.0] (latest OZ commit merged is 8e01dd14f9211239213ae7bd4c6af92dd18d4ab7 from 24.10.2017).

## Code

#### CrowdFunding Functions

**deposit**
```cs
function deposit() onlyOwner isNotFinalized external payable
```

**donate**
```cs
function donate() isNotFinalized public payable
```

**finalizeDonation**
```cs
function finalizeDonation(address beneficiary) onlyOwner isNotFinalized public
```

#### CrowdFunding Events
    
**DonateAdded**
```cs
event DonateAdded(address indexed _from, address indexed _to,uint256 _amount);
```


**DonationMatched**
```cs
event DonationMatched(address indexed _from, address indexed _to,uint256 _amount);
```


**Finalized**
```cs
event Finalized();
```


**ClaimBalance**
```cs
event ClaimBalance(address indexed _grantee, uint256 _amount);
```

### Dependencies

```bash
# Install Truffle and testrpc packages globally:
$ npm install -g truffle ethereumjs-testrpc

# Install local node dependencies:
$ npm install
```

### Test

```bash
$ ./scripts/test.sh
```

## Collaborators

* **[Yossi Gruner](https://github.com/yossigruner)**
* **[Gilad Or](https://github.com/gilador)**


## License

Apache License v2.0


[sirinlabs]: https://www.sirinlabs.com
[ethereum]: https://www.ethereum.org/

[solidity]: https://solidity.readthedocs.io/en/develop/
[truffle]: http://truffleframework.com/
[testrpc]: https://github.com/ethereumjs/testrpc
[bancor]: https://github.com/bancorprotocol/contracts
[openzeppelin]: https://openzeppelin.org
[openzeppelin_v1.3.0]: https://github.com/OpenZeppelin/zeppelin-solidity/releases/tag/v1.3.0