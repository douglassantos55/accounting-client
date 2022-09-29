import { normalize, schema } from "normalizr";
import { Accessor, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, Customer, Entry, Product, Sale, SaleItem, Transaction } from "../types";
import accounts, { AccountEntity } from "./accounts";
import customers, { CustomerEntity } from "./customers";
import entries, { EntryEntity } from "./entries";
import products from "./products";
import sale_items, { SaleItemEntity } from "./sale_items";
import transactions from "./transactions";

type Getters = {
    all: Accessor<Sale[]>;
    get: (id: number) => Sale;
}

export type SaleModule = Module<Sale> & Getters;

type Entities = {
    entries: Record<number, Entry>;
    transactions: Record<number, Transaction>;
    sales: Record<number, Sale>;
    sale_items: Record<number, SaleItem>;
    accounts: Record<number, Account>;
    products: Record<number, Product>;
    customers: Record<number, Customer>;
}

export const SaleEntity = new schema.Entity('sales', {
    Items: [SaleItemEntity],
    Entries: [EntryEntity],
    Customer: CustomerEntity,
    PaymentAccount: AccountEntity,
    ReceivableAccount: AccountEntity,
}, { idAttribute: 'ID' });

function create(): SaleModule {
    const store = makeStore<Sale>();


    const getters = createRoot(function() {
        function get(id: number): Sale {
            return withRelations(store.state.byId[id]);
        }

        function all() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        }

        function withRelations(sale: Sale): Sale {
            return {
                ...sale,
                PaymentAccount: accounts.get(sale.PaymentAccountID),
                ReceivableAccount: accounts.get(sale.ReceivableAccountID),
                Customer: customers.state.byId[sale.CustomerID],
                Items: (sale.Items as number[]).map(function(id: number) {
                    return sale_items.get(id);
                }),
            };
        }

        return { all, get };
    });


    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/sales/${id}`);
            const { entities } = normalize<Sale, Entities>(response, SaleEntity);

            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
            customers.setEntities(entities.customers);
            transactions.setEntities(entities.transactions);
            entries.setEntities(entities.entries);
            sale_items.setEntities(entities.sale_items);

            store.setEntities(entities.sales);
        }

        return getters.get(id);
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/sales');
            const { result, entities } = normalize<Sale, Entities>(response, [SaleEntity]);

            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
            customers.setEntities(entities.customers);
            transactions.setEntities(entities.transactions);
            entries.setEntities(entities.entries);
            sale_items.setEntities(entities.sale_items);

            store.setAll(result, entities.sales);
        }
    }

    async function save(data: Record<string, any>) {
        let sale: Sale;
        if (data.ID) {
            sale = await axios.put(`/sales/${data.ID}`, _normalize(data));
        } else {
            sale = await axios.post('/sales', _normalize(data));
        }

        const { entities } = normalize<Sale, Entities>(sale, SaleEntity);
        products.setEntities(entities.products);
        sale_items.setEntities(entities.sale_items);
        transactions.setEntities(entities.transactions);
        entries.setEntities(entities.entries);

        store.save(sale.ID, entities.sales[sale.ID]);
    }

    function _normalize(data: Record<string, any>) {
        return {
            Paid: !!data.Paid,
            CustomerID: parseInt(data.CustomerID),
            PaymentAccountID: parseInt(data.PaymentAccountID),
            ReceivableAccountID: parseInt(data.ReceivableAccountID),
            Items: data.Items.map(function(item: Record<string, any>) {
                return {
                    Qty: parseInt(item.Qty),
                    Price: parseFloat(item.Price),
                    ProductID: parseInt(item.ProductID),
                };
            }),
        };
    }

    async function deleteSale(id: number) {
        await axios.delete(`/sales/${id}`);
        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        state: store.state,
        delete: deleteSale,
        setEntities: store.setEntities,
        ...getters,
    };
}

export default create();
