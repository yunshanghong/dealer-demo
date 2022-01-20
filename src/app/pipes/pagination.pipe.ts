import { Pipe, PipeTransform } from '@angular/core';
import { Pagination } from '../interfaces/pagination.model';

@Pipe({ name: 'First4' })
export class First4Pipe implements PipeTransform {

    transform(obj: Array<number>): Array<Pagination> {
        const result = obj.map((item, index) => (index < 4 ) ? { originIndex: index} : null).filter((item: Pagination) => item);
        console.log(result);

        return result; 
    }
}

@Pipe({ name: 'Last3' })
export class Last3Pipe implements PipeTransform {

    transform(obj: Array<number>): Array<Pagination> {

        const result = obj.map((item, index) => (index > 3 && index > obj.length-4) ? { originIndex: index } : null).filter((item: Pagination) => item);

        console.log(result);
        return result;
    }
}
