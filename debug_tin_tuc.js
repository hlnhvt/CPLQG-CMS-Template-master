const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('National-Law-Portal/DanhSachCollection.json', 'utf8'));

let tinTucFields = raw.data.fields
    .filter(f => f.collection === 'content_articles')
    .map(f => ({
        field: f.field, 
        interface: f.meta?.interface, 
        sort: f.meta?.sort, 
        group: f.meta?.group, 
        width: f.meta?.width
    }))
    .sort((a,b) => (a.sort||999) - (b.sort||999));

fs.writeFileSync('debug_tin_tuc.json', JSON.stringify(tinTucFields, null, 2), 'utf8');
