const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        required: true
    },
    Grade: {
        type: String,
        required: true
    },
    Organisation: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    }
},
);

const teamSchema = new Schema({
    TeamName: {
        type: String,
        required: true
    },
    Theme: {
        type: String,
        required: true
    },
    WorkCount: {
        type: Number,
        required: true
    },
    TeamMembers: [memberSchema]
},
{
    timestamps: true
});

let Teams = mongoose.model('teams', teamSchema);

module.exports = Teams;