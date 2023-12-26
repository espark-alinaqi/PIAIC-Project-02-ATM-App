import inquirer from 'inquirer';

interface Account {
    username: string;
    password: string;
    balance: number;
}

const accounts: Account[] = [
    { username: 'user1', password: 'pass1', balance: 1000 },
    { username: 'user2', password: 'pass2', balance: 500 },
];

let currentUser: Account | null = null;

async function login(): Promise<Account> {
    const { username, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Enter your username:'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:'
        }
    ]);

    const user = accounts.find((account) => account.username === username && account.password === password);

    if (!user) {
        console.log('Invalid credentials. Please try again.');
        return login();
    }

    return user;
}

async function selectAccount(): Promise<void> {
    const { accountChoice } = await inquirer.prompt({
        type: 'list',
        name: 'accountChoice',
        message: 'Select your account:',
        choices: accounts.map((account) => account.username)
    });

    currentUser = accounts.find((account) => account.username === accountChoice) || null;
}

async function checkBalance(): Promise<void> {
    if (!currentUser) {
        console.log('User not logged in. Please log in first.');
        return;
    }

    console.log(`Your balance is $${currentUser.balance}`);
}

async function withdrawMoney(): Promise<void> {
    if (!currentUser) {
        console.log('User not logged in. Please log in first.');
        return;
    }

    const { amount } = await inquirer.prompt({
        type: 'number',
        name: 'amount',
        message: 'Enter the amount to withdraw:'
    });

    if (amount <= 0 || amount > currentUser.balance) {
        console.log('Invalid amount. Please enter a valid amount.');
        return;
    }

    currentUser.balance -= amount;
    console.log(`Successfully withdrew $${amount}. Remaining balance: $${currentUser.balance}`);
}

async function mainMenu(): Promise<void> {
    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Choose an option:',
        choices: ['Login', 'Check Balance', 'Withdraw Money', 'Exit']
    });

    switch (choice) {
        case 'Login':
            currentUser = await login();
            await selectAccount();
            break;
        case 'Check Balance':
            await checkBalance();
            break;
        case 'Withdraw Money':
            await withdrawMoney();
            break;
        case 'Exit':
            console.log('Thank you for using the ATM App. Goodbye!');
            process.exit(0);
            break;
    }

    // Recursively call the main menu
    await mainMenu();
}

// Start the ATM application
startApp();

export async function startApp() {
    console.log('Welcome to the ATM App!');
    await mainMenu();
}
