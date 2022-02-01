import { Pipe, PipeTransform } from '@angular/core';
import { FileRecord, SupportingDoc } from '../interfaces/api.model';

@Pipe({ name: 'PreviewDocName' })
export class PreviewDocNamePipe implements PipeTransform {

    transform(obj: Array<SupportingDoc>, fileType: string): Array<SupportingDoc> {
        return obj?.filter((item) => item.fileType === fileType) ;
    }
}

@Pipe({ name: 'UploadDocName' })
export class UploadDocNamePipe implements PipeTransform {

    transform(obj: Array<FileRecord>, fileType: string): Array<FileRecord> {
        return obj?.map((item, index) => ({...item, index: index})).filter((item) => item.fileType === fileType) ;
    }
}
