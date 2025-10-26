export class BankData {
    name?: string;
    branch?: string;
    account?: string;
    accountType?: string;

    constructor(
        name?: string, 
        branch?: string, 
        account?: string, 
        accountType?: string
    ) {
        this.name = name;
        this.branch = branch;
        this.account = account;
        this.accountType = accountType;
    }
}