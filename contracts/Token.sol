pragma solidity ^0.4.2;
contract Token{
    //Name of our token
    string public name="Token";
    //Symbol of our token
    string public symbol="TK";
    //standard for our token
    string public standard="Token v1 1.0";
    //total tokens in supply
    uint256 public totalSuppy;
    //mapping from address to balance of tokens for each address, 
    //transfer event for users to know 
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    //approve event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    //basically tells where each token lives
    mapping(address=>uint256) public balanceOf;
    //allowance mapping
    mapping(address=>mapping(address=>uint256)) public allowance;
    function Token(uint256 _initialSupply) public{
        //initally all tokens belong to the account that deployed the contract
        balanceOf[msg.sender]=_initialSupply;
        totalSuppy=_initialSupply;
    }
    //transfer function to aid transfer of tokens from one address to other
    //exception if account doesn't have enough tokens
    //returns a boolean
    //transfer event
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender]>=_value);
        //transfer the balance
        balanceOf[msg.sender]-=_value;
        balanceOf[_to]+=_value;
        Transfer(msg.sender,_to,_value);
        return true;
        
    }
    //delegated transfer(allowing other party to transfer tokens on our behalf)
    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success){
       //require _from has enough balance
       require(balanceOf[_from]>=_value);
       //require we have enough allowance
       require(allowance[_from][msg.sender]>=_value);
        //change the balance
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;
        //update the allowance
        allowance[_from][msg.sender]-=_value;
        //transfer event
        Transfer(_from,_to,_value);
        //return a boolean
        return true;
    }
   
    //approve allows third party to sell/transfer specific amount of tokens on our behalf
    function approve(address _spender, uint256 _value) public returns (bool success){
        //allowance
        allowance[msg.sender][_spender]=_value;
        //approve event
        Approval(msg.sender,_spender,_value);
        return true;
    }
    //allowance stores the amount that the third party is still allowed to transfer on our behalf


}
