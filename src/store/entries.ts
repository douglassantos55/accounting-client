import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Entry, Transaction } from "../types";
import transactions, { TransactionEntity } from "./transactions";

type Getters = {
    all: Accessor<Entry[]>;
    get: (id: number) => Entry;
}

export type EntriesModule = Module<Entry> & Getters;

type Entities = {
    entries: Record<number, Entry>;
    transactions: Record<number, Transaction>;
}

const EntryEntity = new schema.Entity('entries', {
    Transactions: [TransactionEntity],
}, { idAttribute: 'ID' });

function create(): EntriesModule {
    const store = makeStore<Entry>();

    const getters = createRoot(function() {
        function withRelations(entry: Entry) {
            return {
                ...entry,
                Transactions: (entry.Transactions as number[]).map(function(id: number) {
                    return transactions.get(id);
                }),
            };
        }

        function get(id: number) {
            return withRelations(store.state.byId[id]);
        }

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        });

        return { all, get };
    });

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/entries/${id}`);
            const { entities } = normalize<Entry, Entities>(response, EntryEntity);

            transactions.setEntities(entities.transactions);
            store.setEntities(entities.entries);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/entries');
            const { result, entities } = normalize<Entry, Entities>(response, [EntryEntity]);

            console.log(entities);

            transactions.setEntities(entities.transactions);
            store.setAll(result, entities.entries);
        }
    }

    async function save(data: Record<string, string>) {
        let entry: Entry;
        if (data.ID) {
            entry = await axios.put(`/entries/${data.ID}`);
        } else {
            entry = await axios.post('/entries');
        }
        store.save(entry.ID, entry);
    }

    async function deleteEntry(id: number) {
        await axios.delete(`/entries/${id}`);
        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        state: store.state,
        delete: deleteEntry,
        setEntities: store.setEntities,
        ...getters,
    };
}

export default create();
