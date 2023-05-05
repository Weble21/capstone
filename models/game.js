const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
        default: false
    },
    username: {
        type: String,
        require: true
    },
    fiar_tier: {
        type: Number,
        default: 1,
        min: 1,
        max: 6,
        required: true
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