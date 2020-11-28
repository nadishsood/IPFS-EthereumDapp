pragma solidity 0.5.0;

//contract acts as storage, takes hash and stores on blockchain, 
//reads from blockchain and shows on screen.
contract Image{
  string imageHash;
  
  ///write function
  function set(string memory _imageHash) public {
    imageHash = _imageHash;
  }

  //read function
  function get() public view returns (string memory) {
    return imageHash;
  }
}

