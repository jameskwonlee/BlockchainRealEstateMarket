
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');



contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    
    let verifierInput = {
       
        "proof": {
            "a": ["0x0db506c059b3c6a87f5610f0432763757263e50e35f068dd8f23f1b220c3e566", "0x290520e164a62d2d10f628b939a5a60c026eab70ed7ff28049f6d6f90b47092f"],
                "b": [["0x0f78d46a6eb2966156aafda06f854549f21b0eca1c6a98e1fbef1df70e47a3f3", "0x2c74ecdcf57a253a68f94a4205facaa2ef62cb8dc2a4acbcba154245fa996d45"], ["0x12e439b23360877b059d76edde1fae074afe2ca71a655abeea67e8ef51bb0388", "0x066a99275a0c39e9fdca022dce019ccc11b1cffb2401ae49080bd3cb21c3674f"]],
                    "c": ["0x14892b89a15dcb08d969aec99c805cda8857031ee1d174d22cecbd76e3a53a25", "0x272abed7d05e427d94a0da5275fceef3e91c165539eb860b1eb54dabd3e0f8af"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    
    }

    describe('test solution square verifier', function () {
        beforeEach(async function () {
            this.verifier = await Verifier.new(SolnSquareVerifier);
            this.contract = await SolnSquareVerifier.new(this.verifier.address, { from: account_one });
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier

        it('should add new solution to contract', async function () {
            let tokenId = 1;

            let addSolution = await this.contract.addSolution(
                verifierInput.proof.a,
                verifierInput.proof.b,
                verifierInput.proof.c,
                verifierInput.inputs,
                account_two,
                tokenId,
                { from: account_one }
            );

            let isSubmitted = await this.contract.solutionIsSubmitted(
                verifierInput.proof.a,
                verifierInput.proof.b,
                verifierInput.proof.c,
                verifierInput.inputs,
                { from: account_one }
            );

            assert.equal(isSubmitted, true, "Solution should've been submitted");
        
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint an ERC721 token to contract', async function () {
            let tokenId = 1;
            await this.contract.mintNewNFT(
                verifierInput.proof.a,
                verifierInput.proof.b,
                verifierInput.proof.c,
                verifierInput.inputs,
                account_two,
                tokenId,
                { from: account_one }
            );

            let owner = await this.contract.ownerOf(tokenId, { from: account_one });
            assert.equal(account_two, owner, "Token owner should be account two once minted");
       

        // Trying same solution twice
        tokenId = 2;
        let reverted = false;
        try {
            await this.contract.mintNewNFT(
                verifierInput.proof.a,
                verifierInput.proof.b,
                verifierInput.proof.c,
                verifierInput.inputs,
                account_two,
                tokenId,
                { from: account_one }
            );
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "The same solution has been used twice");
        })
    });
})