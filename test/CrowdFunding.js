'use strict'
import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'

const assertRevert = require('./helpers/assertRevert')

const CrowdFunding = artifacts.require('../contracts/CrowdFunding.sol')

const BigNumber = web3.BigNumber
const Web3 = require('web3')
const Utils = require('./helpers/Utils')

const value = ether(1)
var should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

contract('CrowdFunding', function ([_, owner, walletBeneficiary, contributor1, finalWallet]) {
    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    var crowdFunding

    beforeEach(async () => {
        crowdFunding = await CrowdFunding.new(walletBeneficiary, {from: owner})
    })

    describe('construction', async () => {

        it('should be ownable', async () => {
            assert.equal(await crowdFunding.owner(), owner)
        })

        it('should be init as contractor parameter walletBeneficiary', async () => {
            assert.equal(await crowdFunding.walletBeneficiary(), walletBeneficiary)
        })

        it('should be init as false - isFinalized flag', async () => {
            assert.equal(await crowdFunding.isFinalized(), false)
        })
    })

    describe('deposit', async () => {
        it('should deposit by owner', async () => {
            let balanceBefore = await web3.eth.getBalance(crowdFunding.address)
            await crowdFunding.deposit({
                value: value,
                from: owner
            })
            let balanceAfter = await web3.eth.getBalance(crowdFunding.address)
            let totalExpected = balanceBefore.add(value)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })

        it('should not deposit by non-owner', async () => {
            try {
                await crowdFunding.deposit({
                    value: value,
                    from: contributor1
                })
                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })

        it('should not deposit if isNotFinalized ', async () => {
            await crowdFunding.finalizeDonation(owner, {from: owner})

            try {
                await crowdFunding.deposit({
                    value: value,
                    from: owner
                })
                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })
    })

    describe('donate', async () => {
        beforeEach(async () => {
            await crowdFunding.deposit({
                value: value.mul(10),
                from: owner
            })
        })

        it('should donate via \'()\' function', async () => {
            let balanceBefore = await web3.eth.getBalance(walletBeneficiary)
            await crowdFunding.sendTransaction({
                value: value,
                from: contributor1
            })

            let balanceAfter = await web3.eth.getBalance(walletBeneficiary)
            let totalExpected = balanceBefore.add(value * 2)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })

        it('should donate via \'donate\' function ()', async () => {
            let balanceBefore = await web3.eth.getBalance(walletBeneficiary)
            await crowdFunding.donate({
                value: value,
                from: contributor1
            })

            let balanceAfter = await web3.eth.getBalance(walletBeneficiary)
            let totalExpected = balanceBefore.add(value * 2)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })

        it('should not donate after \'finalizeDonation\'', async () => {
            await crowdFunding.finalizeDonation(owner, {from: owner})
            try {
                await crowdFunding.donate({
                    value: value,
                    from: contributor1
                })
                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })

        it('should donate even if balance is lower than donation', async () => {
            let balanceBefore = await web3.eth.getBalance(walletBeneficiary)
            await crowdFunding.donate({
                value: value.mul(11),
                from: contributor1
            })

            let balanceAfter = await web3.eth.getBalance(walletBeneficiary)
            let totalExpected = balanceBefore.add(value.mul(10 * 2)).add(value)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })
    })

    describe('claimBalanceByOwner', async () => {
        it('should transfer all funds by owner', async () => {
            let fundingBalance = await web3.eth.getBalance(crowdFunding.address)
            let balanceBefore = await web3.eth.getBalance(finalWallet)
            await crowdFunding.claimBalanceByOwner(finalWallet,{
                from: owner
            })

            let balanceAfter = await web3.eth.getBalance(finalWallet)
            let totalExpected = balanceBefore.add(fundingBalance)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })

        it('should not claim by non-owner', async () => {
            try {
                await crowdFunding.claimBalanceByOwner(finalWallet,{
                    from: contributor1
                })
                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })

        it('should not claim if \'isNotFinalized\'', async () => {
            await crowdFunding.finalizeDonation(owner, {from: owner})
            try {
                await crowdFunding.claimBalanceByOwner(finalWallet,{
                    from: owner
                })
                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })
    })
    describe('finalizeDonation', async () => {
        it('should claim by owner', async () => {
            await crowdFunding.finalizeDonation(owner, {from: owner})
        })

        it('should not claim by non-owner', async () => {
            try {
                await crowdFunding.finalizeDonation(owner, {from: contributor1})

                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })

        it('should not if \'isNotFinalized\'', async () => {
            await crowdFunding.finalizeDonation(owner, {from: owner})

            try {
                await crowdFunding.finalizeDonation(owner, {from: owner})

                assert(false, "didn't throw")
            } catch (error) {
                return Utils.ensureException(error)
            }
        })
        it('should transfer all funds', async () => {
            let fundingBalance = await web3.eth.getBalance(crowdFunding.address)
            let balanceBefore = await web3.eth.getBalance(finalWallet)

            await crowdFunding.finalizeDonation(owner, {from: owner})

            let balanceAfter = await web3.eth.getBalance(finalWallet)
            let totalExpected = balanceBefore.add(fundingBalance)
            balanceAfter.should.be.bignumber.equal(totalExpected)
        })
    })
})
