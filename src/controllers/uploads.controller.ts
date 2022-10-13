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


let option = {
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
  saveFile(
    @UploadedFile("file", { options: option }) file: any,
    @BodyParam('info') info?: string,
  ) {
    console.log(file, info)
    return { data: { file, info } }
  }

}

