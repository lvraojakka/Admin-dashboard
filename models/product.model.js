const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Description: {
        type: String,
        trim: true
    },
    VariationName: {
        type: String,
        trim: true
    },
    VariationId: {
        type: String,
        trim: true
    },
    // CreatedAt: {
    //     type: Number,
    //     default: Date.now()
    // },
    // UpdatedAt: {
    //     type: Number,
    //     default: Date.now()
    // },
}, {
    timestamps: true,
    versionKey:false
});

module.exports = model('Product', productSchema);