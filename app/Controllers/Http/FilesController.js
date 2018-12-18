'use strict'

const Helpers = use('Helpers')
const Files = use('App/Model/Files')

class UserController {

  * upload (request, response) {    

    const file = request.file('files', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    Files.contract_id = request.param('contract_id') 
    Files.name = file.clientName()
    Files.path = Helpers.storagePath() + '/files' 

    //const fileName = `${new Date().getTime()}.${name}.${file.extension()}` 
    yield file.move(Files.path, Files.name)

    if (!file.moved()) {
      response.badRequest(file.errors())
      return
    }
    
    yield contract.save()
    response.ok('file successfully')
  }
}
module.exports = FilesController