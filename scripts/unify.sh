#!/usr/bin/env bash

UNIFIED="Unified.sol";
rm -rf Unified.sol

cd contracts/

UNIFIED_PATH="../$UNIFIED"

function unify() {
	grep -v '^[pragma|import]' $1 >> "$UNIFIED_PATH"
}

echo "pragma solidity ^0.4.18;" > "$UNIFIED_PATH"

unify math/SafeMath.sol
unify ownership/Ownable.sol
unify ownership/Claimable.sol
unify CrowdFunding.sol