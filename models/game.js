const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sport: {
        type: String,
        enum: ['baseball', 'basketball', 'soccer', 'futsal'],
        required: true
    },
    area: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        enum: ['amateur', 'pro', 'elite', 'beginner'],
        required: true
    },
    application: {
        type: Boolean,
        default: false,
    }
})
productSchema.pre('save', function (next) {
    if (this.time && typeof this.time === 'string') {
        this.time = new Date(this.time);
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;