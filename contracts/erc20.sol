pragma solidity 0.8.6;
import "./erc.sol";
import "./owned.sol";


contract Token is ERC20Token, Owned {

    string public _symbol;
    string public _name;
    uint8 public _decimal;
    uint public _totalSupply;
    // address that is allowed to mint new currency(central authority to distribute or remove tokens)
    address public _minter;

    mapping(address => uint) balances;

    constructor () {
        _symbol = "Tk";
        _name = "Token";
        _decimal = 0;
        _totalSupply = 100;
        _minter = msg.sender;// 

        balances[_minter] = _totalSupply;
        emit Transfer(address(0), _minter, _totalSupply);
    }

    function name() public override view returns (string memory) {
        return _name;
    }

    function symbol() public override view returns (string memory) {
        return _symbol;
    }

    function decimals() public override view returns (uint8) {
        return _decimal;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return balances[_owner];
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(balances[_from] >= _value, "Insufficient Balance");
        balances[_from] -= _value; // balances[_from] = balances[_from] - _value
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public override returns (bool success) {
        return transferFrom(msg.sender, _to, _value);
    }

    function approve(address _spender, uint256 _value) public override returns (bool success) {
        return true;
    }

    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return 0;
    }

    // expanding totalsupply, minting new coins
    function mint(uint amount) public returns (bool) {
        require(msg.sender == _minter);
        balances[_minter] += amount;
        _totalSupply += amount;
       //  emit Transfer(address(0), _minter, amount);
        return true;
    }

    // removing or destroy new currency
    function confiscate(address target, uint amount) public returns (bool) {
        require(msg.sender == _minter);

        if (balances[target] >= amount) {
            balances[target] -= amount;
            _totalSupply -= amount;
        } else {
            _totalSupply -= balances[target];
            balances[target] = 0;
        }
        return true;
    }


}
