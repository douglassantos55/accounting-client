export enum AccountType {
    Asset = 1,
    Liability,
    Equity,
    Dividend,
    Expense,
    Revenue,
}

function toMap(source: object): { id: number, value: string }[] {
    const items = [];
    const keys = Object.keys(source).filter(v => !isNaN(parseInt(v)));
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof typeof source;
        items.push({ id: key, value: source[key] });
    }
    return items;
}

export const TYPES = toMap(AccountType);

export type Account = {
    ID: number;
    Name: string;
    Type: AccountType;
    Balance: number;
    ParentID: number;
    Parent: Account | null;
    Children: Account[] | null;
}

export type Customer = {
    ID: number;
    Name: string;
    Email: string;
    Cpf: string;
    Phone: string;
    Address: Address;
}

export type Address = {
    Street: string;
    Postcode: string;
    Neighborhood: string;
    State: string;
    City: string;
    Number: string;
}

export type Vendor = {
    ID: number;
    Name: string;
    Cnpj: string;
    Address: Address;
}

export type Product = {
    ID: number;
    Name: string;
    Price: number;
    Purchasable: boolean;
    RevenueAccountID: number;
    CostOfSaleAccountID: number;
    InventoryAccountID: number;
    VendorID: number;
    Vendor?: Vendor;
    InventoryAccount: Account;
    RevenueAccount: Account;
    CostOfSaleAccount: Account;
}

export type Service = {
    ID: number;
    Name: string;
    RevenueAccountID: number;
    CostOfServiceAccountID: number;
    RevenueAccount: Account;
    CostOfServiceAccount: Account;
}

export type Purchase = {
    ID: number;
    Qty: number;
    CreatedAt: string;
    PaymentDate: string;
    Price: string;
    Paid: boolean;
    ProductID: number;
    PaymentAccountID: number;
    PayableAccountID: number;
    Product: Product;
    PaymentAccount?: Account;
    PayableAccount?: Account;
    PaymentEntryID?: number;
    PayableEntryID?: number;
}

export type Entry = {
    ID: number;
    CreatedAt: string;
    Description: string;
    Transactions: Transaction[] | number[];
}

export type Transaction = {
    ID: number;
    CreatedAt: string;
    Value: number;
    Account: Account;
    AccountID: number;
}

export type Sale = {
    ID: number;
    CreatedAt: string;
    Paid: boolean;
    Customer: Customer;
    CustomerID: number;
    Entries: number[];
    Items: number[] | SaleItem[];
    PaymentAccount?: Account;
    PaymentAccountID: number;
    ReceivableAccount?: Account;
    ReceivableAccountID: number;
}

export type SaleItem = {
    ID: number;
    Qty: number;
    Price: number;
    Product: Product;
    ProductID: number;
    SaleID: number;
}
