'use strict'

const Helpers = use('Helpers')
const File = use('App/Models/File')

class FilesController {

  async upload ({request, response}) {    
    const validationOptions = {
      types: ['image', 'application', 'application/pdf', 'image/vnd.adobe.photoshop'], // examples like application(doc, docx), image, text
      size: '4mb',
      extnames: ['jpg', 'png', 'jpeg', 'doc', 'docx', 'pdf', 'psd']
    }
    let contractId = request.body.upload_contract;
    let file = request.file('file', validationOptions)
    //console.log(request);

    //file.fileName = file.clientName;
    const movePath = `storage/uploads/${contractId}/`; //Edit to contract-id folder like `storage/uploads/${contract_id}/`
    /** return validator error type
     * error:
     * {
        fieldName: "profile_pic",
        clientName: "GitHub-Mark.ai",
        message: "Invalid file type postscript or application. Only image is allowed",
        type: "type"
      }
     */
    try {
      const fileName = `${new Date().getTime()}.${file.extname}`
      await file.move(movePath,{name : fileName})
      if(!file.moved()){
        return file.errors();
      }
      console.log(file.fileName);
      const newFile = new File();
      newFile.path = movePath + fileName;
      newFile.name = file.clientName;
      newFile.contract_id = contractId;
      newFile.save();
      //console.log(file);
      response.ok(file);
    } catch (error) {
      response.json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }

  }

  async remove({request, response}){
    //TO DO delete file via event-trigger
  }

  async get({request, response}){
    //TO DO get file via link
  }
}
module.exports = FilesController