'use strict'

const Helpers = use('Helpers')
const File = use('App/Models/File')

class FilesController {

  async upload ({request, response}) {    
    const validationOptions = {
      types: ['image'], // examples like application(doc, docx), image, text
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }

    const file = request.file('file', validationOptions)


    file.fileName = file.clientName;
    const movePath = `storage/uploads/1/`; //Edit to contract-id folder like storage/uploads/${contract_id}/
    /** return validator error type
     * error:
     * {
        fieldName: "profile_pic",
        clientName: "GitHub-Mark.ai",
        message: "Invalid file type postscript or application. Only image is allowed",
        type: "type"
      }
     */
    await file.move(movePath);
    if(!file.move()){
      return file.errors();
    }
    const newFile = new File();
    //newFile.path = '';
    //newFile.name = '';
    //newFile.contract_id = '';
    //newFile.save();

    response.ok(file);
  }
}
module.exports = FilesController