const fs = require('fs');

const data = JSON.parse(fs.readFileSync('National-Law-Portal/DanhSachCollection.json', 'utf8'));

const collections = data.data.collections.map(c => {
    return {
        name: c.collection,
        group: c.meta?.group,
        hidden: c.meta?.hidden,
        translation: c.meta?.translations?.[0]?.translation
    };
});

const fieldsCount = data.data.fields.length;

let out = `Total collections: ${collections.length}\n`;
out += `Total fields: ${fieldsCount}\n`;

const visibleCollections = collections.filter(c => !c.hidden && !c.name.startsWith('directus_'));
out += `Visible Non-System Collections: ${visibleCollections.length}\n`;

const grouped = {};
visibleCollections.forEach(c => {
    const g = c.group || 'Ungrouped';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(c.name + (c.translation ? ` (${c.translation})` : ''));
});

for (const [g, items] of Object.entries(grouped)) {
    out += `\nGroup [${g}]:\n`;
    items.forEach(i => { out += ` - ${i}\n`; });
}

fs.writeFileSync('output-utf8.txt', out, 'utf8');
