// #!/usr/bin/env node
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
const ID = 12345;
const PIN = 4321;
let totalAmount = 1000;
const sleep = () => new Promise((r) => setTimeout(r, 1000));
async function Login() {
    const Input = async (option) => {
        const input = await inquirer.prompt([{
                name: `Enter Your ${option}`,
                type: 'password',
            }]);
        return Number(input[`Enter Your ${option}`]);
    };
    let attemptCount = 3;
    while (attemptCount > 0) {
        const USER_ID = await Input('ID');
        const USER_PIN = await Input('PIN');
        const spinner = createSpinner('Authenticating').start();
        await sleep();
        if (USER_ID === ID && USER_PIN === PIN) {
            spinner.success({ text: "Authentication Successful" });
            return true;
        }
        else {
            spinner.error({ text: `Authentication Failed. ${attemptCount} attempts remaining.` });
            attemptCount--;
        }
    }
    console.log('Too many unsuccessful attempts. Exiting...');
    return false;
}
async function AmountInput(action) {
    const input = await inquirer.prompt([{
            name: `Enter ${action} Amount`,
            type: 'number',
        }]);
    const value = input[`Enter ${action} Amount`];
    return value;
}
async function WithDraw() {
    const amount = await AmountInput('Withdraw');
    const spinner = createSpinner('Withdrawing').start();
    await sleep();
    if (amount > totalAmount) {
        spinner.error({ text: `Insufficient funds. Your balance is less than ${amount}` });
    }
    else if (amount <= 0) {
        spinner.error({ text: 'Invalid withdrawal amount. Please enter a positive value.' });
    }
    else {
        totalAmount -= amount;
        spinner.success({ text: `Successful Withdrawal of RS ${amount}` });
    }
}
async function Deposit() {
    const amount = await AmountInput('Deposit');
    const spinner = createSpinner('Depositing').start();
    await sleep();
    if (amount <= 0) {
        spinner.error({ text: 'Invalid deposit amount. Please enter a positive value.' });
    }
    else {
        totalAmount += amount;
        spinner.success({ text: `Successfully Deposited RS ${amount}` });
    }
}
async function AtmFunctions() {
    const input = await inquirer.prompt([{
            name: 'Select Option',
            type: 'list',
            choices: ['Withdraw Amount', 'Deposit Amount', 'Available Amount', 'Exit']
        }]);
    let value = input['Select Option'];
    switch (value) {
        case 'Withdraw Amount':
            await WithDraw();
            break;
        case 'Deposit Amount':
            await Deposit();
            break;
        case 'Available Amount':
            console.log(`Total Amount: RS ${totalAmount}`);
            break;
        case 'Exit':
            process.exit();
    }
}
// Program Entry Point
while (true) {
    const isLogin = await Login();
    if (!isLogin) {
        break;
    }
    while (true) {
        await AtmFunctions();
    }
}
