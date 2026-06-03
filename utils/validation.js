
let emptyFieldValidation = (res, ...fields) => {

    if (fields.includes('') || fields.includes(undefined)) {

        res.send({
            message: "Please fill all the fields"
        })

        return true
    }

    return false
}

module.exports = { emptyFieldValidation }