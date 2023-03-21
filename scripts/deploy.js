// Successfully deployed 16.2.2023

async function main() {
    const Casino = await ethers.getContractFactory("Casino");
 
    // Start deployment, returning a promise that resolves to a contract object
    const casino_casino = await Casino.deploy();   
    console.log("Contract deployed to address:", casino_casino.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });