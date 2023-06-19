const mongoose = require('mongoose')
const validator = require('validator')

function hasMoreThanTwoDecimals(number) {
    const decimalPattern = /\.(\d{3,})$/;
    const numberString = number.toString();
    return decimalPattern.test(numberString);
  }

  function hasMoreThanOneDecimals(number) {
    const decimalPattern = /\.(\d{2,})$/;
    const numberString = number.toString();
    return decimalPattern.test(numberString);
  }

const Book = mongoose.model('Book', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (hasMoreThanTwoDecimals(value)) {
                throw new Error('Price must be expressed in atmost two decimal digits')
            }
        }
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        validate(value) {
            if (hasMoreThanOneDecimals(value)) {
                throw new Error('Rating must be expressed in atmost one decimal digits')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Book