class ExpenseTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.form = document.getElementById('transactionForm');
        this.typeFilter = document.querySelector('.type');
        this.balanceEl = document.getElementById('balance');
        this.transactionTable = document.getElementById('transactionTable');
        this.filterSection = document.querySelectorAll('.filter-section input[name="filter-section"]');
        this.categoryFilter = document.getElementById('filter');
        this.ctx = document.getElementById("myChart");
        this.initialTrans();
    }

    renderChart(trans){
        let dateChart = [];
        let amountChart = [];

        trans.forEach((v) => {
            dateChart.push(v.date);
            amountChart.push(v.amount);
        })   

        new Chart(this.ctx,{
            type:'line',
            data:{
                labels: dateChart,
                datasets:[{
                    label:"Balance Chart",
                    data:amountChart,
                    fill:false,
                    lineTension:0.1,
                    backgroundColor:"rgb(73,165,229)",
                    borderColor:"rgb(73,165,229)",
                    pointRadius:3
                }]
            } 
        })

    }

    initialTrans() {
        this.renderTransactions(this.transactions);
        this.updateBalance();
        this.renderChart(this.transactions);

        this.form.addEventListener('submit', () => this.addTransaction());

        this.filterSection.forEach((fil) =>
                fil.addEventListener('change', () => this.sortByFilter())
            );
        this.categoryFilter.addEventListener('change', () => this.filterByCategory());
}

    addTransaction() {
        const date = document.getElementById('date').value;
        const summary = document.getElementById('summary').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.querySelector('input[name="type"]:checked').id;

        const transaction = {
            date,
            summary,
            amount,
            category,
            type,
        };

        this.transactions.push(transaction);
        
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        this.renderTransactions(this.transactions);
        this.updateBalance();
        this.renderChart(this.transactions);            
    }

    renderTransactions(transactions) {
        this.transactionTable.innerHTML = '';
        
        transactions.forEach((transaction) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.summary}</td>
                <td id="${transaction.type === 'income' ? 'credit' : ''}">
                    ${transaction.type === 'income' ? `+ ${transaction.amount}` : ''}
                </td>
                <td id="${transaction.type === 'expense' ? 'debit' : ''}">
                    ${transaction.type === 'expense' ? `- ${transaction.amount}` : ''}
                </td>
                <td>${this.calculateBalance(transaction)}</td>
            `;

            this.transactionTable.appendChild(row);
        });
    }

    updateBalance() {
        const bal = this.transactions.reduce((acc, update) => {
            return update.type === 'income' ? acc + update.amount : acc - update.amount;
        }, 0);

        this.balanceEl.textContent = bal;
    }

    calculateBalance(calculate) {
        const index = this.transactions.indexOf(calculate);        
        return this.transactions.slice(0, index + 1).reduce((acc, item) => {
            return item.type === 'income' ? acc + item.amount : acc - item.amount;
        }, 0);
    }
    

    sortByFilter() {
        const sortedFilter = document.querySelector('.filter-section input[name="filter-section"]:checked').id;
        let filteredTransactions;

        if (sortedFilter === 'all') {
            filteredTransactions = this.transactions;
        } else if (sortedFilter === 'inc') {
            filteredTransactions = this.transactions.filter((t) => t.type === 'income');
        } else if (sortedFilter === 'exp') {
            filteredTransactions = this.transactions.filter((t) => t.type === 'expense');
        }

        this.renderTransactions(filteredTransactions);
        this.renderChart(filteredTransactions);            

    }

    filterByCategory() {
        const categoryHolder = this.categoryFilter.value;
        let flit;
        
        if(categoryHolder === 'All'){
            flit = this.transactions;
        }
        else if(categoryHolder === 'Loan'){
            flit = this.transactions.filter((c) => c.category === 'loan');
        }
        else if(categoryHolder === 'Salary'){
            flit = this.transactions.filter((c) => c.category === 'salary');
        }
        else if(categoryHolder === 'Salary'){
            flit = this.transactions.filter((c) => c.category === 'salary');
        }
        else if(categoryHolder === 'Food'){
            flit = this.transactions.filter((c) => c.category === 'food');
        }
        else if(categoryHolder === 'Transport'){
            flit = this.transactions.filter((c) => c.category === 'transport');
        }
        else if(categoryHolder === 'Miscellaneous'){
            flit = this.transactions.filter((c) => c.category === 'miscellaneous');
        }
        this.renderTransactions(flit);
        this.renderChart(flit);            

    }    

}

document.addEventListener('DOMContentLoaded', () => {
    new ExpenseTracker();
});
