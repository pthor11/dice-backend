pragma solidity ^0.5.8;
interface TRC20 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external;
    function transfer(address _to, uint256 _value) external;
}
contract DiceLumi {
    //Currency: 0:TRX
    //Type: 0:Under 1:Over
    //Modulo: Number compare
    //Value: Bet value
    //Save
    //Data: %10 => type ;%1000/10 => number; %10**13/1000 => blocknumber ;/10**23 => value; %10**23/10**13 => blocktime
    event Bet(address user,uint data);
    mapping(address => uint256) public bets;
    address owner;
    uint256 minBet = 1e6;
    uint256 maxBet = 1e8;
    TRC20 token;
    modifier onlyOwner() {
        require(msg.sender == owner, "Must be owner");
        _;
    }
    constructor(address _token) public {
        owner = msg.sender;
        token = TRC20(_token);
    }
    function dicecoSayHi(
        uint8 _direction,
        uint8 _modulo,
        uint256 _value
    ) public {
        require(bets[msg.sender] == 0, "Must be fresh bet");
        require(
            (_direction == 0 && _modulo > 0 && _modulo < 96) ||
                (_direction == 1 && _modulo > 3 && _modulo < 99),
            "Wrong bet!"
        );
        token.transferFrom(msg.sender, address(this), _value);
        uint dataBet = _value *
            10**23 +
            block.number *
            1000 +
            _modulo *
            10 +
            _direction;
        bets[msg.sender] = dataBet;
        emit Bet(msg.sender,dataBet);
    }
    function settle(address _user) public returns (uint256) {
        uint256 _bet = bets[_user];
        require(_bet != 0, "Must be have bet");
        uint256 blockNumber = (_bet % 10**13) / 1000;
        require(block.number < blockNumber + 255, "blockhash valid time");
        uint256 result = uint256(
            keccak256(
                abi.encodePacked(
                    _user,
                    blockhash(blockNumber),
                    (_bet % (10**23)) / 10**13
                )
            )
        ) % 100;
        uint256 number = (_bet % 1000) / 10;
        uint256 value = _bet / 10**23;
        if (_bet % 10 == 0) {
            //Under
            if (number < result) {
                token.transfer(_user, (value * 98) / number);
            }
        } else {
            //Over
            if (number > result) {
                token.transfer(_user, (value * 98) / (99 - number));
            }
        }
        bets[_user] = 0;
        return _bet;
    }
    function adminSettle(address _user, bytes32 _blockhash)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 _bet = bets[_user];
        require(_bet != 0, "Must be have bet");
        uint256 result = uint256(
            keccak256(
                abi.encodePacked(_user, _blockhash, (_bet % (10**23)) / 10**13)
            )
        ) % 100;
        uint256 number = (_bet % 1000) / 10;
        uint256 value = _bet / 10**23;
        if (_bet % 10 == 0) {
            //Under
            if (number < result) {
                token.transfer(_user, (value * 98) / number);
            }
        } else {
            //Over
            if (number > result) {
                token.transfer(_user, (value * 98) / (99 - number));
            }
        }
        bets[_user] = 0;
        return _bet;
    }
}
