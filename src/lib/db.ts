import Dexie, { type EntityTable } from 'dexie';

interface ProbeReading {
    id?: number;
    probeId: string;
    timestamp: Date;
    temperature: number;
    setTemperature: number;
}

const db = new Dexie("bahoa-db") as Dexie & {
    probeReadings: EntityTable<ProbeReading, "id">;
};

db.version(22).stores({
    probeReadings: "++id, probeId, timestamp, temperature, setTemperature"
});

export type { ProbeReading };
export { db };