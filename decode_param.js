
const ABI = require('ethereumjs-abi');

var _walletBeneficiary = '0x2E63194AFa073e2E0B829b4D3d0719EFFFcCc7A6'


var parameterTypes = ["address"];
var parameterValues = [_walletBeneficiary];
var ctorParamsEncoded = ABI.rawEncode(parameterTypes, parameterValues);

console.log("Ctors: " +ctorParamsEncoded.toString('hex'))

console.log("----------------------------------------------")


var _walletBeneficiary = '0xca35b7d915458ef540ade6068dfe2f44e8fa73'


var parameterTypes = ["address[]", "uint"];
var parameterValues = [['0xD875A2FF6f0b69BE34693C291d99d0968be73480', '0x189646F22a3949738dEb666860ec27526b235757', '0x340361Ca8bd1E5179DfDDA366455540532000286'], 2];
var ctorParamsEncoded = ABI.rawEncode(parameterTypes, parameterValues);

console.log("MultiSig: " + ctorParamsEncoded.toString('hex'))
