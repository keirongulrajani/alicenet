// Generated by ifacemaker. DO NOT EDIT.

package bindings

import (
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
)

// IETHDKGErrorCodesCaller ...
type IETHDKGErrorCodesCaller interface {
	// ETHDKGACCUSEDDIDNOTDISTRIBUTESHARESINROUND is a free data retrieval call binding the contract method 0xfa0f33b9.
	//
	// Solidity: function ETHDKG_ACCUSED_DID_NOT_DISTRIBUTE_SHARES_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDDIDNOTDISTRIBUTESHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDDIDNOTPARTICIPATEINGPKJSUBMISSION is a free data retrieval call binding the contract method 0x0348f5cc.
	//
	// Solidity: function ETHDKG_ACCUSED_DID_NOT_PARTICIPATE_IN_GPKJ_SUBMISSION() view returns(bytes32)
	ETHDKGACCUSEDDIDNOTPARTICIPATEINGPKJSUBMISSION(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDDIDNOTSUBMITGPKJINROUND is a free data retrieval call binding the contract method 0xac4683be.
	//
	// Solidity: function ETHDKG_ACCUSED_DID_NOT_SUBMIT_GPKJ_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDDIDNOTSUBMITGPKJINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDDISTRIBUTEDGPKJ is a free data retrieval call binding the contract method 0xaf1c8f58.
	//
	// Solidity: function ETHDKG_ACCUSED_DISTRIBUTED_GPKJ() view returns(bytes32)
	ETHDKGACCUSEDDISTRIBUTEDGPKJ(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDDISTRIBUTEDSHARESINROUND is a free data retrieval call binding the contract method 0x2838edae.
	//
	// Solidity: function ETHDKG_ACCUSED_DISTRIBUTED_SHARES_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDDISTRIBUTEDSHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDHASCOMMITMENTS is a free data retrieval call binding the contract method 0x4cd291bf.
	//
	// Solidity: function ETHDKG_ACCUSED_HAS_COMMITMENTS() view returns(bytes32)
	ETHDKGACCUSEDHASCOMMITMENTS(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDNOTPARTICIPATINGINROUND is a free data retrieval call binding the contract method 0xe11879cc.
	//
	// Solidity: function ETHDKG_ACCUSED_NOT_PARTICIPATING_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDNOTPARTICIPATINGINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDNOTVALIDATOR is a free data retrieval call binding the contract method 0xf5f46e73.
	//
	// Solidity: function ETHDKG_ACCUSED_NOT_VALIDATOR() view returns(bytes32)
	ETHDKGACCUSEDNOTVALIDATOR(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDPARTICIPATINGINROUND is a free data retrieval call binding the contract method 0x55b83c56.
	//
	// Solidity: function ETHDKG_ACCUSED_PARTICIPATING_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDPARTICIPATINGINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGACCUSEDSUBMITTEDSHARESINROUND is a free data retrieval call binding the contract method 0xb23b8358.
	//
	// Solidity: function ETHDKG_ACCUSED_SUBMITTED_SHARES_IN_ROUND() view returns(bytes32)
	ETHDKGACCUSEDSUBMITTEDSHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGCOMMITMENTNOTONCURVE is a free data retrieval call binding the contract method 0xe58f04ed.
	//
	// Solidity: function ETHDKG_COMMITMENT_NOT_ON_CURVE() view returns(bytes32)
	ETHDKGCOMMITMENTNOTONCURVE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGCOMMITMENTZERO is a free data retrieval call binding the contract method 0x81687f80.
	//
	// Solidity: function ETHDKG_COMMITMENT_ZERO() view returns(bytes32)
	ETHDKGCOMMITMENTZERO(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGDISPUTERDIDNOTDISTRIBUTESHARESINROUND is a free data retrieval call binding the contract method 0xd65915e2.
	//
	// Solidity: function ETHDKG_DISPUTER_DID_NOT_DISTRIBUTE_SHARES_IN_ROUND() view returns(bytes32)
	ETHDKGDISPUTERDIDNOTDISTRIBUTESHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGDISPUTERDIDNOTSUBMITGPKJINROUND is a free data retrieval call binding the contract method 0x3b2b8245.
	//
	// Solidity: function ETHDKG_DISPUTER_DID_NOT_SUBMIT_GPKJ_IN_ROUND() view returns(bytes32)
	ETHDKGDISPUTERDIDNOTSUBMITGPKJINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGDISPUTERNOTPARTICIPATINGINROUND is a free data retrieval call binding the contract method 0x763df93d.
	//
	// Solidity: function ETHDKG_DISPUTER_NOT_PARTICIPATING_IN_ROUND() view returns(bytes32)
	ETHDKGDISPUTERNOTPARTICIPATINGINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGDISTRIBUTEDSHAREHASHZERO is a free data retrieval call binding the contract method 0xf54980c7.
	//
	// Solidity: function ETHDKG_DISTRIBUTED_SHARE_HASH_ZERO() view returns(bytes32)
	ETHDKGDISTRIBUTEDSHAREHASHZERO(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGGPKJZERO is a free data retrieval call binding the contract method 0xc4e9cbe3.
	//
	// Solidity: function ETHDKG_GPKJ_ZERO() view returns(bytes32)
	ETHDKGGPKJZERO(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDARGS is a free data retrieval call binding the contract method 0x4d76291d.
	//
	// Solidity: function ETHDKG_INVALID_ARGS() view returns(bytes32)
	ETHDKGINVALIDARGS(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDCOMMITMENTS is a free data retrieval call binding the contract method 0xf8fd7944.
	//
	// Solidity: function ETHDKG_INVALID_COMMITMENTS() view returns(bytes32)
	ETHDKGINVALIDCOMMITMENTS(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDKEYSHAREG1 is a free data retrieval call binding the contract method 0xdd35d7da.
	//
	// Solidity: function ETHDKG_INVALID_KEYSHARE_G1() view returns(bytes32)
	ETHDKGINVALIDKEYSHAREG1(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDKEYSHAREG2 is a free data retrieval call binding the contract method 0x8468c092.
	//
	// Solidity: function ETHDKG_INVALID_KEYSHARE_G2() view returns(bytes32)
	ETHDKGINVALIDKEYSHAREG2(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDKEYORPROOF is a free data retrieval call binding the contract method 0xa852713f.
	//
	// Solidity: function ETHDKG_INVALID_KEY_OR_PROOF() view returns(bytes32)
	ETHDKGINVALIDKEYORPROOF(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDNONCE is a free data retrieval call binding the contract method 0x3341bcdf.
	//
	// Solidity: function ETHDKG_INVALID_NONCE() view returns(bytes32)
	ETHDKGINVALIDNONCE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDNUMCOMMITMENTS is a free data retrieval call binding the contract method 0x0bca7264.
	//
	// Solidity: function ETHDKG_INVALID_NUM_COMMITMENTS() view returns(bytes32)
	ETHDKGINVALIDNUMCOMMITMENTS(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDNUMENCRYPTEDSHARES is a free data retrieval call binding the contract method 0xe8dcd67a.
	//
	// Solidity: function ETHDKG_INVALID_NUM_ENCRYPTED_SHARES() view returns(bytes32)
	ETHDKGINVALIDNUMENCRYPTEDSHARES(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDORDUPLICATEDPARTICIPANT is a free data retrieval call binding the contract method 0x2f5e98de.
	//
	// Solidity: function ETHDKG_INVALID_OR_DUPLICATED_PARTICIPANT() view returns(bytes32)
	ETHDKGINVALIDORDUPLICATEDPARTICIPANT(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGINVALIDSHARESORCOMMITMENTS is a free data retrieval call binding the contract method 0x6d1e4818.
	//
	// Solidity: function ETHDKG_INVALID_SHARES_OR_COMMITMENTS() view returns(bytes32)
	ETHDKGINVALIDSHARESORCOMMITMENTS(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGKEYSHAREPHASEINVALIDNONCE is a free data retrieval call binding the contract method 0xc169fbc4.
	//
	// Solidity: function ETHDKG_KEYSHARE_PHASE_INVALID_NONCE() view returns(bytes32)
	ETHDKGKEYSHAREPHASEINVALIDNONCE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGMASTERPUBLICKEYPAIRINGCHECKFAILURE is a free data retrieval call binding the contract method 0x2ef8cd6e.
	//
	// Solidity: function ETHDKG_MASTER_PUBLIC_KEY_PAIRING_CHECK_FAILURE() view returns(bytes32)
	ETHDKGMASTERPUBLICKEYPAIRINGCHECKFAILURE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGMIGRATIONINPUTDATAMISMATCH is a free data retrieval call binding the contract method 0x64a20638.
	//
	// Solidity: function ETHDKG_MIGRATION_INPUT_DATA_MISMATCH() view returns(bytes32)
	ETHDKGMIGRATIONINPUTDATAMISMATCH(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGMIGRATIONINVALIDNONCE is a free data retrieval call binding the contract method 0x06a621df.
	//
	// Solidity: function ETHDKG_MIGRATION_INVALID_NONCE() view returns(bytes32)
	ETHDKGMIGRATIONINVALIDNONCE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGMINVALIDATORSNOTMET is a free data retrieval call binding the contract method 0x7e9f3983.
	//
	// Solidity: function ETHDKG_MIN_VALIDATORS_NOT_MET() view returns(bytes32)
	ETHDKGMINVALIDATORSNOTMET(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINDISPUTEPHASE is a free data retrieval call binding the contract method 0x4c4cfd75.
	//
	// Solidity: function ETHDKG_NOT_IN_DISPUTE_PHASE() view returns(bytes32)
	ETHDKGNOTINDISPUTEPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINGPKJSUBMISSIONPHASE is a free data retrieval call binding the contract method 0x53187f6a.
	//
	// Solidity: function ETHDKG_NOT_IN_GPKJ_SUBMISSION_PHASE() view returns(bytes32)
	ETHDKGNOTINGPKJSUBMISSIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINKEYSHARESUBMISSIONPHASE is a free data retrieval call binding the contract method 0x8789ca22.
	//
	// Solidity: function ETHDKG_NOT_IN_KEYSHARE_SUBMISSION_PHASE() view returns(bytes32)
	ETHDKGNOTINKEYSHARESUBMISSIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINMASTERPUBLICKEYSUBMISSIONPHASE is a free data retrieval call binding the contract method 0x3072e363.
	//
	// Solidity: function ETHDKG_NOT_IN_MASTER_PUBLIC_KEY_SUBMISSION_PHASE() view returns(bytes32)
	ETHDKGNOTINMASTERPUBLICKEYSUBMISSIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINPOSTGPKJDISPUTEPHASE is a free data retrieval call binding the contract method 0xc4423781.
	//
	// Solidity: function ETHDKG_NOT_IN_POST_GPKJ_DISPUTE_PHASE() view returns(bytes32)
	ETHDKGNOTINPOSTGPKJDISPUTEPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINPOSTGPKJSUBMISSIONPHASE is a free data retrieval call binding the contract method 0x6d429ef2.
	//
	// Solidity: function ETHDKG_NOT_IN_POST_GPKJ_SUBMISSION_PHASE() view returns(bytes32)
	ETHDKGNOTINPOSTGPKJSUBMISSIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINPOSTKEYSHARESUBMISSIONPHASE is a free data retrieval call binding the contract method 0x60987646.
	//
	// Solidity: function ETHDKG_NOT_IN_POST_KEYSHARE_SUBMISSION_PHASE() view returns(bytes32)
	ETHDKGNOTINPOSTKEYSHARESUBMISSIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINPOSTREGISTRATIONPHASE is a free data retrieval call binding the contract method 0x7385db5d.
	//
	// Solidity: function ETHDKG_NOT_IN_POST_REGISTRATION_PHASE() view returns(bytes32)
	ETHDKGNOTINPOSTREGISTRATIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINPOSTSHAREDDISTRIBUTIONPHASE is a free data retrieval call binding the contract method 0x8e25d1e1.
	//
	// Solidity: function ETHDKG_NOT_IN_POST_SHARED_DISTRIBUTION_PHASE() view returns(bytes32)
	ETHDKGNOTINPOSTSHAREDDISTRIBUTIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINREGISTRATIONPHASE is a free data retrieval call binding the contract method 0xf4edda56.
	//
	// Solidity: function ETHDKG_NOT_IN_REGISTRATION_PHASE() view returns(bytes32)
	ETHDKGNOTINREGISTRATIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGNOTINSHAREDDISTRIBUTIONPHASE is a free data retrieval call binding the contract method 0xba50ad20.
	//
	// Solidity: function ETHDKG_NOT_IN_SHARED_DISTRIBUTION_PHASE() view returns(bytes32)
	ETHDKGNOTINSHAREDDISTRIBUTIONPHASE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGONLYVALIDATORSALLOWED is a free data retrieval call binding the contract method 0x83c069e4.
	//
	// Solidity: function ETHDKG_ONLY_VALIDATORS_ALLOWED() view returns(bytes32)
	ETHDKGONLYVALIDATORSALLOWED(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPARTICIPANTDISTRIBUTEDSHARESINROUND is a free data retrieval call binding the contract method 0xbdf1d0a8.
	//
	// Solidity: function ETHDKG_PARTICIPANT_DISTRIBUTED_SHARES_IN_ROUND() view returns(bytes32)
	ETHDKGPARTICIPANTDISTRIBUTEDSHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPARTICIPANTPARTICIPATINGINROUND is a free data retrieval call binding the contract method 0x5bbeb11b.
	//
	// Solidity: function ETHDKG_PARTICIPANT_PARTICIPATING_IN_ROUND() view returns(bytes32)
	ETHDKGPARTICIPANTPARTICIPATINGINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPARTICIPANTSUBMITTEDGPKJINROUND is a free data retrieval call binding the contract method 0xc43f133a.
	//
	// Solidity: function ETHDKG_PARTICIPANT_SUBMITTED_GPKJ_IN_ROUND() view returns(bytes32)
	ETHDKGPARTICIPANTSUBMITTEDGPKJINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPARTICIPANTSUBMITTEDKEYSHARESINROUND is a free data retrieval call binding the contract method 0x1723b084.
	//
	// Solidity: function ETHDKG_PARTICIPANT_SUBMITTED_KEYSHARES_IN_ROUND() view returns(bytes32)
	ETHDKGPARTICIPANTSUBMITTEDKEYSHARESINROUND(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPUBLICKEYNOTONCURVE is a free data retrieval call binding the contract method 0x29896fd4.
	//
	// Solidity: function ETHDKG_PUBLIC_KEY_NOT_ON_CURVE() view returns(bytes32)
	ETHDKGPUBLICKEYNOTONCURVE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGPUBLICKEYZERO is a free data retrieval call binding the contract method 0x54ad808e.
	//
	// Solidity: function ETHDKG_PUBLIC_KEY_ZERO() view returns(bytes32)
	ETHDKGPUBLICKEYZERO(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGREQUISITESINCOMPLETE is a free data retrieval call binding the contract method 0x23277f87.
	//
	// Solidity: function ETHDKG_REQUISITES_INCOMPLETE() view returns(bytes32)
	ETHDKGREQUISITESINCOMPLETE(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGSHARESANDCOMMITMENTSMISMATCH is a free data retrieval call binding the contract method 0xe0c1afd8.
	//
	// Solidity: function ETHDKG_SHARES_AND_COMMITMENTS_MISMATCH() view returns(bytes32)
	ETHDKGSHARESANDCOMMITMENTSMISMATCH(opts *bind.CallOpts) ([32]byte, error)
	// ETHDKGVARIABLECANNOTBESETWHILERUNNING is a free data retrieval call binding the contract method 0x79ec8296.
	//
	// Solidity: function ETHDKG_VARIABLE_CANNOT_BE_SET_WHILE_RUNNING() view returns(bytes32)
	ETHDKGVARIABLECANNOTBESETWHILERUNNING(opts *bind.CallOpts) ([32]byte, error)
}