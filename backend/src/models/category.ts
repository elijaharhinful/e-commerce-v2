let mongoose = require('mongoose');

// Category Schema
let CategorySchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }

});

export default mongoose.model('CategoryModel', CategorySchema);

