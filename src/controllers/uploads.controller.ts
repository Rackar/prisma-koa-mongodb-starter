import {
  BadRequestError,
  Post,
  JsonController,
  Controller,
  BodyParam,
  Get,
  QueryParam,
  Body,
  UploadedFile,
  UploadedFiles
} from 'routing-controllers'
// import { UsersService } from '../services'
import prisma from '../helpers/client'
import { Service } from 'typedi'
// const multer = require('@koa/multer');
import multer from 'multer';

interface IFileResult {
  "fieldname": string
  "originalname": string
  "encoding": string
  "mimetype": string
  "destination": string
  "filename": string
  "path": string
  "size": number
}

const options = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, "uploads/");
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    }
  }),
  // fileFilter: (req: any, file: any, cb: any) => {
  // },
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * 3
  }
}


@JsonController()
@Service()
export class UploadsController {
  constructor() { }

  // 进行配置
  @Post("/upload")
  async saveFile(
    @UploadedFile("file", { options }) file: IFileResult,
    @BodyParam('name') name?: string,
    @BodyParam('description') description?: string,
    @BodyParam('authorId') authorId?: string,
  ) {
    console.log(file)
    const { fieldname,
      originalname,
      mimetype,
      filename,
      path } = file
    await prisma.fileBeenUploaded.create({
      data: {
        fieldname,
        originalname,
        mimetype,
        filename,
        path, name, description, authorId
      }
    })
    return { data: { file } }
  }

}

