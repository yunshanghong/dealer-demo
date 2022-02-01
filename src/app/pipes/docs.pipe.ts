import { Pipe, PipeTransform } from '@angular/core';
import { SupportingDoc } from '../interfaces/api.model';

@Pipe({ name: 'DocName' })
export class DocNamePipe implements PipeTransform {

    transform(obj: Array<SupportingDoc>, fileType: string): Array<SupportingDoc> {
        return obj?.filter((item) => item.fileType === fileType) ;
    }
}
