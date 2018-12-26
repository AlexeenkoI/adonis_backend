'use strict'

const Helpers = use('Helpers')
const File = use('App/Models/File')
const fs = use('fs')
const removeFile = Helpers.promisify(fs.unlink)

class FilesController {

  constructor(){
    this.uploadPath = "storage/uploads";
  }

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
    //console.log(movePath);
    try {
      const fileName = `${new Date().getTime()}.${file.extname}`
      await file.move(movePath,{name : fileName})
      if(!file.moved()){
        return file.errors();
      }
      //console.log(file.fileName);
      const newFile = new File();
      newFile.path = movePath + fileName;
      newFile.name = file.clientName;
      newFile.contract_id = contractId;
      await newFile.save();
      file.tmpPath = movePath + fileName;
      file.contract_id = contractId;
      //console.log(file);
      response.ok(file);
    } catch (error) {
      response.json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }

  }

  async remove({request, params, response}){
    //TO DO delete file via event-trigger
    //console.log('remove controller');
    //console.log(params.contractId);
    //console.log(request.body);
    const filePath = request.body.filePath;
    console.log(filePath);
    console.log(params.contractId);
    try {
      const file = await File.query()
        .where('path', filePath)
        .andWhere('contract_id',params.contractId)
        .firstOrFail();

      await removeFile(filePath);
      await file.delete();    

      response.json({
        success : true,
        message : `Файл ${file.name} успешно удален`
      })
    } catch (error) {
      response.json({
        success : false,
        message : `Ошибка ${error.message}`
      })
    }
  }

  async get({request, params, response}){
    //TO DO get file via link
    try {
      const fileList = await File.query()
      .where('contract_id', params.contractId)
      .fetch()
      const result = fileList.rows.map( file => {
        const uName = file.path.split('/')[3]
        return {
          uid : file.id,
          name : file.name,
          status : "done",
          url : `/api/files/download/${file.contract_id}/${uName}`,
          storagePath : file.path,
          linkProps : "image"
        }
      })
      return response.json({
        success : true,
        data : result
      })
    } catch (error) {
      return response.json({
        success : false,
        message : `Ошибка ${error.message}`
      })
    }

  }

  async downloadFile({params, response}){
    const folderId = params.contractid;
    const fileName = params.filename;
    console.log('downloading...');
    console.log(folderId);
    console.log(fileName);
    console.log('root : ');
    console.log( this.uploadPath);
    response.attachment(
      `${this.uploadPath}/${folderId}/${fileName}`
    )
  }
}
module.exports = FilesController