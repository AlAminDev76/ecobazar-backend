let emptyFieldValidation = (... fields)=>{
   if (fields.includes('') || fields.includes(undefined)){
      return res.send({message: "please fill all the field"})
   }
  }

module.exports = {emptyFieldValidation}