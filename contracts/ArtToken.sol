pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtToken is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private idCounter;
    address public owner;

    mapping(uint256 => string) public tokenUriMapping;
    mapping(uint256 => uint256) public paintingsCount;

    uint256 public totalPaintings = 0;


    uint256 public constant UNIT_PRICE = 1000000;
    uint256 public constant MAX_MINT = 100;

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not owner");
        _;
    }

    constructor(uint256 _totalPaintings, string[] memory uris) ERC1155("") {
        require(_totalPaintings== uris.length, "uris length and the total paintings do not match");
        totalPaintings = _totalPaintings;
        owner = msg.sender;
        for (uint256 i = 0; i < _totalPaintings; ++i) {
            setUri(i, uris[i]);
        }
    }

    function setUri(uint256 tokenId, string memory newTokenUri) private {
        tokenUriMapping[tokenId] = newTokenUri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return tokenUriMapping[tokenId];
    }

    function getUris() public view returns (string[] memory){
        string[] memory uris = new string[](totalPaintings);
        for(uint256 i=0; i<totalPaintings; ++i){
            uris[i] = uri(i);
        }
        return uris;
    }

    

    function mintArtToken(uint256 pictureId) payable public
    {
        address sender = msg.sender;
        uint256 payment = msg.value;
        require(payment >= UNIT_PRICE, "Not enough eth sent");
        require(pictureId < totalPaintings, "Painting ID is out of range");
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

    function getMyBalances() public view returns( uint256[] memory) {
        address sender = msg.sender;
        uint256[] memory balances = new uint256[](totalPaintings);
        for(uint256 i=0; i<totalPaintings; ++i){
            balances[i] = balanceOf(sender, i);
        }
        return balances;
    }



}