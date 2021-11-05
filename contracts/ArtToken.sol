pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtToken is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private idCounter;
    address public owner;
    string public name;
    string public symbol;
    string private _uri;
    mapping(uint256 => string) public tokenUriMapping;
    mapping(uint256 => uint256) public paintingsCount;

    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    uint256 public constant UNIT_PRICE = 1000000;
    uint256 public constant MAX_MINT = 100;

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not owner");
        _;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
    }

    function setUri(uint256 tokenId, string memory newTokenUri) public onlyOwner {
        require(bytes(tokenUriMapping[tokenId]).length == 0, "This uri has already been set");
        tokenUriMapping[tokenId] = newTokenUri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return tokenUriMapping[tokenId];
    }

    

    function mintArtToken(uint256 pictureId) payable public
    {
        address sender = msg.sender;
        uint256 payment = msg.value;
        require(payment >= UNIT_PRICE, "Not enough eth sent");
        require(payment % UNIT_PRICE==0, "Not correct eth amount sent");
        uint256 mintAmount = payment / UNIT_PRICE;
        uint256 newPaintingCount = paintingsCount[pictureId] + mintAmount;
        require(newPaintingCount <= MAX_MINT, "This painting has reached max mint");
        paintingsCount[pictureId] = newPaintingCount;
        _mint(
            sender,
            pictureId,
            mintAmount,
            ""
        );
    }


}