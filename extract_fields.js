const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('National-Law-Portal/DanhSachCollection.json', 'utf8'));

// We want to extract a mapping: { [collectionName]: [ { field, type, interface, options, ... } ] }
const fieldsSchema = {};
const relationsSchema = {};

raw.data.relations.forEach(r => {
    if(!relationsSchema[r.collection]) relationsSchema[r.collection] = {};
    relationsSchema[r.collection][r.field] = {
        related_collection: r.related_collection,
        related_field: r.related_field || null // it might be a many-to-one
    };
});

raw.data.fields.forEach(f => {
    if(!fieldsSchema[f.collection]) fieldsSchema[f.collection] = [];
    
    // We try to grab useful rendering info
    let type = f.type;
    let ui_interface = f.meta?.interface || 'input';
    let options = f.meta?.options || null;
    let label = f.meta?.translations?.[0]?.translation || f.field;
    let note = f.meta?.note || '';
    let required = f.meta?.required || false;
    let readonly = f.meta?.readonly || false;
    let hidden = f.meta?.hidden || false;
    let system = f.meta?.system || false;
    let group = f.meta?.group || null;
    let width = f.meta?.width || 'full';
    
    // checks relation mapping
    let relation = relationsSchema[f.collection]?.[f.field] || null;

    fieldsSchema[f.collection].push({
        field: f.field,
        type: type,
        interface: ui_interface,
        options: options,
        label: label,
        note: note,
        required: required,
        readonly: readonly,
        hidden: hidden,
        system: system,
        group: group,
        width: width,
        sort: f.meta?.sort || 999,
        relation: relation
    });
});

Object.keys(fieldsSchema).forEach(k => {
    fieldsSchema[k].sort((a, b) => {
        // System fields usually go last, or rely on sort
        if(a.system && !b.system) return 1;
        if(!a.system && b.system) return -1;
        return a.sort - b.sort;
    });
});

const tsCode = `// Generated automatically from Directus schema\nexport const COLLECTION_FIELDS: Record<string, any[]> = ${JSON.stringify(fieldsSchema, null, 2)};\n`;

fs.writeFileSync('src/lib/collection-fields.ts', tsCode, 'utf8');

const stats = fs.statSync('src/lib/collection-fields.ts');
console.log(`Optimized fields TS size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total fields mapped: ${raw.data.fields.length}`);
