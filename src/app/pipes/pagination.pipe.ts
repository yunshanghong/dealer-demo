import { Pipe, PipeTransform } from '@angular/core';
import { Pagination } from '../interfaces/common.model';

@Pipe({ name: 'First' })
export class FirstPipe implements PipeTransform {

    transform(obj: Array<number>, inputIndex: number): Array<Pagination> {
        const result = obj?.map((item, index) => (index < inputIndex ) ? { originIndex: index } : null)?.filter((item: Pagination) => item);
        return result;
    }
}

@Pipe({ name: 'Last' })
export class LastPipe implements PipeTransform {

    transform(obj: Array<number>, inputIndex: number): Array<Pagination> {

        const result = obj.map((item, index) => (index > inputIndex && index > obj.length - inputIndex - 1) ? { originIndex: index } : null).filter((item: Pagination) => item);

        console.log(result);
        return result;
    }
}
