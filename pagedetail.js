const contractAddress = '0x45FeA5CA4306403CA3337394e140783102142B51';

const abi  = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "usersContractAddress",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_platformWalletAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "paperId",
				"type": "uint256"
			}
		],
		"name": "calculateTotalFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authorName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "ipfsHashElement",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "referencesTo",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "keywords",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "createPaper",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPaperCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "papers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "authorName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "publicationDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ipfsHashElement",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "paperId",
				"type": "uint256"
			}
		],
		"name": "purchasePaper",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];


const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);

async function displayPaperDetails(paperId) {
  const paperDetailsContainer = document.getElementById('paper-details-container');

  const paper = await contract.methods.papers(paperId).call();

  const title = document.createElement('h2');
  title.textContent = `${paper.title}`;

  title.classList.add("text-2xl")
  title.classList.add("m-4")
  
  

  const authorName = document.createElement('h4');
  authorName.textContent = `By : ${paper.authorName}`;
 // authorName.classList.add('text-gray-200');
  authorName.classList.add('text-base'); 
  authorName.classList.add('m-4')


  const ipfsHashElement = document.createElement('p');
  ipfsHashElement.textContent = ` ${paper.ipfsHash}`;
 // ipfsHashElement.classList.add('text-gray-200');
  ipfsHashElement.classList.add("m-4")

  paperDetailsContainer.appendChild(title);
  paperDetailsContainer.appendChild(authorName);
  paperDetailsContainer.appendChild(ipfsHashElement);
}

async function purchasePaper(paperId, fee) {
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts[0];

  // Convert the entered fee from Ether to Wei
  const weiValue = web3.utils.toWei(fee.toString(), 'ether');

  // Call the purchasePaper() function from your smart contract
  await contract.methods.purchasePaper(paperId)
    .send({ from: fromAddress, value: weiValue })
    .then(() => {
      alert('Donation transferred sucessfully');
    })
    .catch((error) => {
      console.error(error);
      alert('Error processing transaction');
    });
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const paperId = urlParams.get('paperId');
  
  if (paperId) {
    await displayPaperDetails(paperId);
  } else {
    alert('No paper ID provided');
  }

  document.getElementById('purchase-button').addEventListener('click', async () => {
    const feeInput = document.getElementById('fee-input');
    const fee = parseFloat(feeInput.value);

    if (!isNaN(fee) && fee >= 0) {
      await purchasePaper(paperId, fee);
    } else {
      alert('Please enter a valid amount');
    }
  });
}

init();