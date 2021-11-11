//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract CBDC is Context, AccessControlEnumerable, Ownable, ERC20 {

    struct CustomerData {
        bytes32 fundIBAN;       //Funding IBAN
        bytes32 fundAddress;    //Funding address
        bytes32 defundIBAN;     //Defunding IBAN
        address defundAddress;  //Dunding address
        uint256 limit;          //Holding limit
    }

    //Wallet data for customers
    mapping(address => CustomerData) private _customerData;

    //Addresses allowed by admin to be funders
    bytes32 public constant FUNDER_ROLE = keccak256("FUNDER_ROLE");

    //Addresses allowed by admin to be defunders
    bytes32 public constant DEFUNDER_ROLE = keccak256("DEFUNDER_ROLE");

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    //address public contractOwner;

    constructor(uint256 initialSupply) ERC20( "Simple Digital Euro", "DEU") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());

        _mint(msg.sender, initialSupply);
    }

    function decimals() public pure override returns (uint8) {
		return 0;
	}

    function mint(address to, uint256 amount) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "mint: must have minter role to mint");
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual {
        require(hasRole(BURNER_ROLE, _msgSender()), "burn: must have burner role to burn");
        _burn(_msgSender(), amount);
    }

    function burn(address from, uint256 amount) public virtual {
        require(hasRole(BURNER_ROLE, _msgSender()), "burn: must have burner role to burn");
        _burn(from, amount);
    }

}