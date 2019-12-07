var ERC721MintableComplete = artifacts.require('RealEstateERC721Token');


contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, {from: account_one});
            await this.contract.mint(account_two, 2, {from: account_one});
            await this.contract.mint(account_two, 3, {from: account_one});
            await this.contract.mint(account_two, 4, {from: account_one});
            await this.contract.mint(account_two, 5, {from: account_one});
        })

        it('should return total supply', async function () { 
            let supply = await this.contract.totalSupply.call({from: account_one});
            assert.equal(supply, 5, "Total minted coins should be five");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(balance, 5, "Balance of account two");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let uri = await this.contract.tokenURI.call(1, {from: account_one});
            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Must return TokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
             
            await this.contract.safeTransferFrom(account_two, account_one, 1, {from: account_two});
            let newOwner = await this.contract.ownerOf.call(1, {from: account_one});
            assert.equal(account_one, newOwner, "New token owner should be account one");
        
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail minting when address is not contract owner', async function () { 
            let result = false;
            try {
                await this.contract.mint(account_two, 1, { from: account_two });
            } catch (e) {
                result = true;
            }
            assert.equal(result, true, "A non-owner successfully minted coins");
        })

        it('should return contract owner', async function () { 
           let contractOwner = account_one;
           // If not contract owner, the new minting will fail, so test will not pass, and will not get to the assert.equal part
           await this.contract.mint(account_two, 6, {from: contractOwner});
           assert.equal(contractOwner, account_one, "not returning contract owner")
        })

    });
})