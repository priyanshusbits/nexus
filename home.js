




// Replace the contract address with your deployed contract address
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

async function init() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  const paperCount = await contract.methods.getPaperCount().call();
  await displayPapers(paperCount);
}

function truncateText(text, maxLength, byWords) {
    if (byWords) {
        const words = text.split(' ');
        if (words.length > maxLength) {
            return words.slice(0, maxLength).join(' ') + '...';
        }
    } else {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
    }
    return text;
}

function createPaperCard(paper) {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';

    const card = document.createElement('div');
    card.className = 'card w-96 bg-base-100 shadow-xl';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = 'paper1.png';
    figure.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = truncateText(paper.title, 6, true); // Truncate title to 4 words

    const table = document.createElement('table');
    table.className = 'table';
    const tbody = document.createElement('tbody');

    const authorNameRow = document.createElement('tr');
    const authorNameData = document.createElement('td');
    authorNameData.textContent = paper.authorName;
    authorNameRow.appendChild(authorNameData);

    const publicationDateRow = document.createElement('tr');
    const publicationDateData = document.createElement('td');
    const publicationDateBadge = document.createElement('div');
    publicationDateBadge.className = 'badge badge-warning gap-2';
    publicationDateBadge.textContent = new Date(paper.publicationDate * 1000).toLocaleDateString();
    publicationDateData.appendChild(publicationDateBadge);
    publicationDateRow.appendChild(publicationDateData);

    const ipfsHashRow = document.createElement('tr');
    const ipfsHashData = document.createElement('td');
    ipfsHashData.textContent = truncateText(paper.ipfsHash, 39, false); // Truncate ipfsHash to 50 characters
    ipfsHashRow.appendChild(ipfsHashData);

    tbody.appendChild(authorNameRow);
    tbody.appendChild(publicationDateRow);
    tbody.appendChild(ipfsHashRow);
    table.appendChild(tbody);

    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions justify-end';
    const detailsButton = document.createElement('button');
    detailsButton.className = 'btn btn-primary';
    detailsButton.textContent = 'READ';
    detailsButton.addEventListener('click', () => {
        window.location.href = `pagedetail.html?paperId=${paper.id}`;
    });
    cardActions.appendChild(detailsButton);

    cardBody.appendChild(title);
    cardBody.appendChild(table);
    cardBody.appendChild(cardActions);
    
    card.appendChild(figure);
    card.appendChild(cardBody);
    carouselItem.appendChild(card);

    return carouselItem;
}


 
async function displayPapers(paperCount) {
  const papersContainer = document.getElementById('papers-container');
  const carousel = papersContainer.querySelector('.carousel');
  carousel.innerHTML = ''; // Clear the carousel to remove dummy data

  for (let i = 1; i <= paperCount; i++) {
    const paper = await contract.methods.papers(i).call();
    const paperCard = createPaperCard(paper);
    carousel.appendChild(paperCard);
  }
}


init();
