import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DateTime' })
export class DateTimePipe implements PipeTransform {

    transform(obj: Date): string {
        return null;
    }
}
