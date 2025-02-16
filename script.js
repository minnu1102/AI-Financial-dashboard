let transactions = [];

const budgetInput = document.getElementById("budget");
const budgetRemaining = document.getElementById("budget-remaining");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");

// Update Budget
budgetInput.addEventListener("input", updateBudget);

function updateBudget() {
    const budget = parseFloat(budgetInput.value);
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const remainingBudget = budget - totalSpent;
    budgetRemaining.textContent = `$${remainingBudget.toFixed(2)}`;
}

// Add Transaction
document.getElementById("addTransactionBtn").addEventListener("click", addTransaction);

function addTransaction() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (!description || !amount || isNaN(amount)) {
        alert("Please enter valid details.");
        return;
    }

    const transaction = { id: Date.now(), description, amount, category };
    transactions.push(transaction);
    updateUI();
}
document.getElementById("voiceBtn").addEventListener("click", startVoiceRecognition);

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        processVoiceCommand(command);
    };
    recognition.start();
}

function processVoiceCommand(command) {
    let words = command.split(" ");
    let amount = words.find(word => word.includes("$"));
    if (amount) {
        amount = parseFloat(amount.replace("$", ""));
        let description = words.slice(0, words.indexOf(amount)).join(" ");
        addTransactionFromVoice(description, amount);
    }
}

function addTransactionFromVoice(description, amount) {
    const transaction = { id: Date.now(), description, amount, category: "Other" };
    transactions.push(transaction);
    updateUI();
}
// update UI
function updateUI() {
    transactionList.innerHTML = "";
    transactions.forEach(transaction => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.description} - $${transaction.amount} 
                        <button onclick="deleteTransaction(${transaction.id})">❌</button>`;
        transactionList.appendChild(li);
    });
    updateBudget();
}

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}
