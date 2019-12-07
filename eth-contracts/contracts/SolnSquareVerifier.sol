pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is Verifier, RealEstateERC721Token {

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions {
        uint256 tokenId;
        address owner;
        bool exists;
    }

    // TODO define an array of the above struct
    Solutions[] mintedTokens;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solutions) private solutions;
    mapping (uint256 => Solutions) tokenIdToSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 indexed tokenId, address indexed owner);

     function getSolutionKey
                                (
                                    uint[2] memory a,
                                    uint[2][2] memory b,
                                    uint[2] memory c,
                                    uint[2] memory input
                                )
                        internal
                        pure
                        returns(bytes32)
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution
                                (
                                    uint[2] memory a,
                                    uint[2][2] memory b,
                                    uint[2] memory c,
                                    uint[2] memory input,
                                    address to,
                                    uint256 tokenId
                                )
                        public
    {
        mintedTokens.push(Solutions({
            exists: true,
            tokenId: tokenId,
            owner: to
        }));

        // EMG - Register Solution
        bytes32 solutionKey = getSolutionKey(a, b, c, input);
        solutions[solutionKey] = Solutions({
            exists: true,
            tokenId: tokenId,
            owner: to
        });

        emit SolutionAdded(tokenId, to);
    }
    // TODO Create a function to mint new NFT only after the solution has been verified
    function mintNewNFT
                                (
                                    uint[2] memory a,
                                    uint[2][2] memory b,
                                    uint[2] memory c,
                                    uint[2] memory input,
                                    address to,
                                    uint256 tokenId
                                )
                                public
                                returns (bool)
    {
        // Mint new NFT only after  solution is verified
        bool verificationResult = Verifier.verifyTx(a, b, c, input);
        require(verificationResult, "The solution has not been successfully verified");

        // Make sure  solution is unique 
        bytes32 solutionKey = getSolutionKey(a, b, c, input);
        require(!solutions[solutionKey].exists, "The solution has already been used");

        //  Handle metadata
        bool minted = super.mint(to, tokenId);
        require(minted, "Mint has not been successfully completed");

        addSolution(a, b, c,input, to, tokenId);

        return true;
    }

    function solutionIsSubmitted
                            (
                                uint[2] memory a,
                                uint[2][2] memory b,
                                uint[2] memory c,
                                uint[2] memory input
                            )
                            public
                            view
                            returns(bool)
    {
        bytes32 solutionKey = getSolutionKey(a,b, c, input);
        return (solutions[solutionKey].exists);
    }


}




// https://www.youtube.com/watch?v=0pY1Sd7aDjM&feature=youtu.be - used this video guide for the Zokrates implementation







