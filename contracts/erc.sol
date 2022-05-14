pragma solidity 0.8.6;

// erc20 standards
abstract contract ERC20Token {
    function name() virtual public view returns (string memory);
    function symbol() virtual public view returns (string memory);
    function decimals() virtual public view returns (uint8);
    // total no of tokens in circulation
    function totalSupply() virtual public view returns (uint256);
    // token balance of owner
    function balanceOf(address _owner) virtual public view returns (uint256 balance);
    
    function transfer(address _to, uint256 _value) virtual public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) virtual public returns (bool success);

    // approve transfer from spender
    function approve(address _spender, uint256 _value) virtual public returns (bool success);
    // how much money you can take out of owners acc.
    function allowance(address _owner, address _spender) virtual public view returns (uint256 remaining);
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

