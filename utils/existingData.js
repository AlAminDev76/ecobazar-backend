const User = require("../models/userModel");

let existingData = async (res, findData) => {

    let existingUser = await User.findOne(findData);

    if (existingUser) {
        return existingUser;
    } else {
        return false;
    }

};

module.exports = existingData;